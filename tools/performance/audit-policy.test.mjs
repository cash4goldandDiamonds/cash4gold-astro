import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {statistics,metrics,inspectResult,budgetFailures,assertExpectedHead,isolatedBuildDirectory,routes} from './audit-policy.mjs';
import {startLoopbackProxy} from './loopback-proxy.mjs';

test('medians handle odd/even samples without accepting missing scores',()=>{
 assert.deepEqual(statistics([9,1,4]),{minimum:1,median:4,maximum:9});assert.equal(statistics([1,4,8,20]).median,6);
 for(const values of [[],[null],[1,NaN],[1,Infinity]])assert.throws(()=>statistics(values));
});
test('source identity and build scope fail on mismatched commits or unrelated directories',()=>{
 const head='a'.repeat(40);assert.doesNotThrow(()=>assertExpectedHead(head,head,true));
 for(const expected of [undefined,'short','b'.repeat(40)])assert.throws(()=>assertExpectedHead(head,expected,true));
 assert.throws(()=>isolatedBuildDirectory(process.cwd(),'/unrelated/private/files'),/Only this checkout/);
 assert.equal(routes.length,9);assert.ok(routes.some(([name])=>name==='reviews'));assert.ok(routes.some(([name])=>name==='estate'));
});
const origin='http://127.0.0.1:54321',route='/reviews/';
const result=()=>({configSettings:{formFactor:'mobile'},finalDisplayedUrl:origin+route,categories:{performance:{score:0.95}},audits:{...Object.fromEntries(metrics.map(id=>[id,{numericValue:id==='cumulative-layout-shift'?0:100}])), 'network-requests':{details:{items:[{url:origin+route,finished:true,statusCode:200,transferSize:1000,resourceType:'Document'}]}}}});
test('valid scores cannot hide failed requests, external redirects, absent metrics or null scores',()=>{
 assert.equal(inspectResult(result(),{origin,route,formFactor:'mobile'}).total,1000);
 for(const mutate of [lhr=>{lhr.categories.performance.score=null;},lhr=>{lhr.finalDisplayedUrl='https://external.example.invalid/';},lhr=>{lhr.finalDisplayedUrl=origin+'/404/';},lhr=>{delete lhr.audits[metrics[0]];},lhr=>{lhr.audits['network-requests'].details.items[0].statusCode=404;},lhr=>{lhr.audits['network-requests'].details.items[0].finished=false;},lhr=>{lhr.audits['network-requests'].details.items[0].url='https://external.example.invalid/image.png';}]){
  const lhr=result();mutate(lhr);assert.throws(()=>inspectResult(lhr,{origin,route,formFactor:'mobile'}));
 }
});
test('project median metric and transfer budgets fail independently of a good aggregate score',()=>{
 const row={name:'reviews',formFactor:'mobile',performanceScore:statistics([95,95,95]),metrics:Object.fromEntries(metrics.map(id=>[id,statistics([100,100,100])])),resourceBytes:Object.fromEntries(['javascript','css','fonts','total','largestImage'].map(id=>[id,statistics([1000,1000,1000])]))};
 assert.deepEqual(budgetFailures([row]),[]);row.metrics['total-blocking-time']=statistics([250,220,280]);assert.equal(budgetFailures([row])[0].budget,'total-blocking-time');
 row.metrics['total-blocking-time']=statistics([100,100,100]);row.resourceBytes.javascript=statistics([81_000,82_000,83_000]);assert.equal(budgetFailures([row])[0].budget,'javascriptTransferBytes');
});
test('loopback proxy forwards only its exact origin and blocks POST, external hosts and CONNECT',async()=>{
 let hits=0;const target=http.createServer((_req,res)=>{hits++;res.end('local-only');});
 await new Promise(resolve=>target.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+target.address().port;
 const proxy=await startLoopbackProxy(origin);
 const request=(url,method='GET')=>new Promise((resolve,reject)=>{const req=http.request({host:'127.0.0.1',port:proxy.port,path:url,method},res=>{res.resume();res.on('end',()=>resolve(res.statusCode));});req.on('error',reject);req.on('connect',(res,socket)=>{socket.destroy();resolve(res.statusCode);});req.end();});
 try{assert.equal(await request(origin+'/reviews/'),200);assert.equal(hits,1);assert.equal(await request('http://external.example.invalid/'),403);assert.equal(await request(origin+'/api/inquiry/','POST'),403);assert.equal(await request('external.example.invalid:443','CONNECT'),403);assert.equal(hits,1);}
 finally{await proxy.close();target.closeAllConnections();await new Promise(resolve=>target.close(resolve));}
});
