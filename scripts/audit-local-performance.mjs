import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {handleInquiry} from '../workers/inquiry/index.mjs';
import {metrics,routes,budgets,statistics,isolatedBuildDirectory,assertExpectedHead,inspectResult,budgetFailures} from '../tools/performance/audit-policy.mjs';
import {startLoopbackProxy} from '../tools/performance/loopback-proxy.mjs';

// Local lab harness only. It never deploys, reads credentials, submits inquiries,
// attaches to a user's browser, or navigates to the live/staging website.
const root=process.cwd();
const build=isolatedBuildDirectory(root,process.env.PERFORMANCE_BUILD_DIR);
const resultRoot=path.resolve('.cache/performance-results');
const output=path.join(resultRoot,'run-'+Date.now());
const validateOnly=process.env.PERFORMANCE_VALIDATE_ONLY==='true';
const repetitions=Number(process.env.PERFORMANCE_REPETITIONS||3);
assert.ok(Number.isInteger(repetitions)&&repetitions>=3&&repetitions<=5,'At least three comparable samples are required.');
assert.ok(fs.statSync(build).isDirectory(),'Build the isolated production-audit output first.');
assert.ok(!fs.existsSync(path.join(build,'studio')),'Studio must be excluded from this audit.');
const tool=fs.realpathSync(path.resolve(process.env.PERFORMANCE_TOOLS_DIR||'tools/performance/node_modules','lighthouse/core/index.js'));
const require=createRequire(tool);
const {default:lighthouse}=await import(pathToFileURL(tool));
const {default:desktopConfig}=await import(pathToFileURL(path.join(path.dirname(tool),'config/lr-desktop-config.js')));
const {saveAssets}=await import(pathToFileURL(path.join(path.dirname(tool),'lib/asset-saver.js')));
const {launch}=await import(pathToFileURL(require.resolve('chrome-launcher')));
const version=JSON.parse(fs.readFileSync(require.resolve('lighthouse/package.json'),'utf8')).version;
assert.equal(version,'13.4.1','Use the reviewed pinned Lighthouse version.');
fs.mkdirSync(output,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.avif':'image/avif','.woff2':'font/woff2','.woff':'font/woff','.ico':'image/x-icon','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const files=new Map(),hashes=[];
function visit(folder){
  for(const entry of fs.readdirSync(folder,{withFileTypes:true})){
    const file=path.join(folder,entry.name);
    assert.ok(!entry.isSymbolicLink(),'Audit output must not contain symlinks.');
    if(entry.isDirectory()){visit(file);continue;}
    const url='/'+path.relative(build,file).split(path.sep).join('/'),bytes=fs.readFileSync(file),type=mime[path.extname(file)]||'application/octet-stream';
    files.set(url,{bytes,gzip:/text\/|javascript|json|xml|svg/.test(type)?gzipSync(bytes):null,type});
    hashes.push({path:url,sha256:createHash('sha256').update(bytes).digest('hex')});
  }
}
visit(build);
for(const [,route] of routes)assert.ok(files.has(route+'index.html'),'Required route missing: '+route);
const csp=files.get('/_headers')?.bytes.toString().match(/Content-Security-Policy:\s*([^\r\n]+)/)?.[1];
assert.ok(csp,'Finalized build headers are required.');
const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
const sourceCommit=git(['rev-parse','HEAD']);assertExpectedHead(sourceCommit,process.env.PERFORMANCE_EXPECTED_HEAD,process.env.GITHUB_ACTIONS==='true');
const evidence={startedAt:new Date().toISOString(),status:'RUNNING',mode:validateOnly?'HARNESS_VALIDATION_ONLY':'LOCAL_LIGHTHOUSE_LAB',scope:'Loopback production-audit snapshot with local precomputed gzip and deny-external browser proxy; excludes hosted Cloudflare latency/caching, field CWV, authenticated CMS, enabled analytics and inquiry providers.',sourceCommit,expectedSourceCommit:process.env.PERFORMANCE_EXPECTED_HEAD||null,sourceTree:git(['rev-parse','HEAD^{tree}']),uncommittedSource:git(['status','--porcelain']).length>0,buildFingerprint:createHash('sha256').update(JSON.stringify(hashes.sort((a,b)=>a.path.localeCompare(b.path)))).digest('hex'),lighthouseVersion:version,repetitions,requiredRouteCategories:8,additionalEstateRoute:true,budgets,runs:[],browserLaunched:false};
let origin,chrome,proxy;
const server=http.createServer(async(req,res)=>{
  try{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
    const requested=new URL(req.url,origin),pathname=decodeURIComponent(requested.pathname);
    if(requested.origin!==origin||req.headers.host!==new URL(origin).host){res.writeHead(403);res.end();return;}
    if(pathname.startsWith('/api/inquiry/')){
      const response=await handleInquiry(new Request(requested.href,{method:req.method}),{SITE_ENV:'preview',INQUIRY_ENABLED:'false',INQUIRY_ALLOWED_ORIGINS:origin});
      res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
    }
    const item=files.get(pathname.endsWith('/')?pathname+'index.html':pathname);
    if(!item&&files.has(pathname+'/index.html')){res.writeHead(301,{Location:pathname+'/'});res.end();return;}
    if(!item){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');return;}
    const compressed=item.gzip&&/gzip/.test(req.headers['accept-encoding']||''),body=compressed?item.gzip:item.bytes;
    // Add a second policy: any enabled external integration must fail the lab,
    // rather than silently send data outside this isolated browser/server pair.
    const localPolicy="default-src 'self' data: blob:; connect-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src 'none'; object-src 'none'; form-action 'none'";
    res.writeHead(200,{'Content-Type':item.type,'Content-Length':body.length,'Cache-Control':pathname.startsWith('/_astro/')?'public, max-age=31536000, immutable':pathname.startsWith('/media/')?'public, max-age=86400, must-revalidate':'public, max-age=0, must-revalidate','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':[csp,localPolicy],Vary:'Accept-Encoding',...(compressed?{'Content-Encoding':'gzip'}:{})});
    res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(400);res.end('Bad request');}
});
function save(){fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(evidence,null,2)+'\n');}
try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  origin='http://127.0.0.1:'+server.address().port;evidence.origin=origin;
  for(const [,route] of routes){
    const response=await fetch(origin+route);assert.equal(response.status,200);
    const headers=response.headers.get('content-security-policy');
    assert.match(headers,/style-src 'self' 'unsafe-inline'/);assert.match(headers,/font-src 'self'/);assert.match(headers,/frame-src 'none'/);
    assert.match(await response.text(),/<h1\b/i);
  }
  evidence.checkedFonts=0;
  for(const [url,item]of files)if(item.type.startsWith('font/')){
    const response=await fetch(origin+url);assert.equal(response.status,200);assert.equal((await response.arrayBuffer()).byteLength,item.bytes.length);evidence.checkedFonts++;
  }
  const unavailable=await (await fetch(origin+'/api/inquiry/config/')).json();assert.equal(unavailable.enabled,false);
  if(validateOnly){evidence.status='HARNESS_VALIDATED_NO_METRICS';evidence.checkedRoutes=routes.length;}
  else{
    proxy=await startLoopbackProxy(origin);
    const profile=path.join(root,'.cache','performance-browser-'+Date.now());fs.mkdirSync(profile);
    chrome=await launch({...(process.env.CHROME_PATH?{chromePath:process.env.CHROME_PATH}:{}),chromeFlags:['--headless=new','--proxy-server=http://127.0.0.1:'+proxy.port,'--proxy-bypass-list=<-loopback>','--disable-quic','--force-webrtc-ip-handling-policy=disable_non_proxied_udp'],userDataDir:profile,port:0,logLevel:'silent'});
    evidence.browserLaunched=true;
    for(const formFactor of ['mobile','desktop'])for(const [name,route] of routes)for(let run=1;run<=repetitions;run++){
      const result=await lighthouse(origin+route,{port:chrome.port,output:['json','html'],logLevel:'error',onlyCategories:['performance'],disableFullPageScreenshot:true,maxWaitForLoad:45000,enableErrorReporting:false},formFactor==='desktop'?desktopConfig:undefined);
      const {lhr,report,artifacts}=result;assert.equal(lhr.configSettings.formFactor,formFactor);
      const filename=name+'-'+formFactor+'-'+run;
      fs.writeFileSync(path.join(output,filename+'.json'),report[0]);fs.writeFileSync(path.join(output,filename+'.html'),report[1]);
      if(run===Math.ceil(repetitions/2))await saveAssets(artifacts,lhr.audits,path.join(output,filename));
      const row={name,route,formFactor,run,performanceScore:lhr.categories.performance.score===null?null:lhr.categories.performance.score*100,metrics:Object.fromEntries(metrics.map(id=>[id,lhr.audits[id]?.numericValue??null])),opportunities:Object.entries(lhr.audits).filter(([,a])=>a.details?.overallSavingsMs>0||a.metricSavings&&Object.values(a.metricSavings).some(v=>v>0)).map(([id,a])=>({id,title:a.title,displayValue:a.displayValue,overallSavingsMs:a.details?.overallSavingsMs,metricSavings:a.metricSavings})),runtimeError:lhr.runtimeError||null,runWarnings:lhr.runWarnings,configSettings:lhr.configSettings,environment:lhr.environment,reportJson:filename+'.json',reportHtml:filename+'.html'};
      evidence.runs.push(row);save();console.log(JSON.stringify({name,formFactor,run,score:row.performanceScore,metrics:row.metrics,runtimeError:row.runtimeError}));
      row.resourceBytes=inspectResult(lhr,{origin,route,formFactor});save();
    }
    evidence.aggregates=['mobile','desktop'].flatMap(formFactor=>routes.map(([name,route])=>{const rows=evidence.runs.filter(row=>row.name===name&&row.formFactor===formFactor);assert.equal(rows.length,repetitions);return {name,route,formFactor,samples:rows.length,performanceScore:statistics(rows.map(row=>row.performanceScore)),metrics:Object.fromEntries(metrics.map(id=>[id,statistics(rows.map(row=>row.metrics[id]))])),resourceBytes:Object.fromEntries(Object.keys(rows[0].resourceBytes).map(id=>[id,statistics(rows.map(row=>row.resourceBytes[id]))]))};}));
    evidence.budgetFailures=budgetFailures(evidence.aggregates);
    evidence.heroImageReview=evidence.aggregates.filter(row=>row.formFactor==='mobile'&&row.resourceBytes.largestImage.maximum>budgets.heroImageReviewBytes).map(row=>({name:row.name,largestImageBytes:row.resourceBytes.largestImage.maximum,reason:'Inspect whether the oversized loaded image is the hero; no element identity inferred.'}));
    evidence.status=evidence.budgetFailures.length?'LAB_BUDGETS_NOT_MET':'LAB_MEASUREMENTS_COMPLETE_REVIEW_REQUIRED';
    if(evidence.budgetFailures.length)process.exitCode=1;
  }
}catch(error){evidence.status='BLOCKED';evidence.failure={code:error.code||error.cause?.code||null,message:error.message};process.exitCode=1;}
finally{
  const cleanupFailures=[];
  if(chrome)try{await chrome.kill();}catch(error){cleanupFailures.push({resource:'browser',message:error.message});}
  if(proxy){evidence.browserProxyDeniedOrigins=[...proxy.deniedOrigins].sort();try{await proxy.close();}catch(error){cleanupFailures.push({resource:'proxy',message:error.message});}}
  if(server.listening)try{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}catch(error){cleanupFailures.push({resource:'server',message:error.message});}
  if(cleanupFailures.length){evidence.cleanupFailures=cleanupFailures;evidence.status='BLOCKED';process.exitCode=1;}
  evidence.completedAt=new Date().toISOString();save();
  console.log(JSON.stringify({status:evidence.status,output,runs:evidence.runs.length,browserLaunched:evidence.browserLaunched,failure:evidence.failure}));
}
