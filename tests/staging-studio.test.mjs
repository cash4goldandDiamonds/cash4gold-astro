import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {handleStagingStudio,stagingStudioCsp,STAGING_STUDIO_ORIGIN} from '../src/lib/staging-studio.mjs';
import worker from '../workers/inquiry/index.mjs';

const inline='window.__sanityConfig={projectId:"gisdw6qa"};';
const shell='<html><head><script>'+inline+'</script><script src="/studio/static/main.js"></script></head><body><div id="sanity"></div></body></html>';
const request=(path,options={})=>new Request(STAGING_STUDIO_ORIGIN+path,options);
function fixture(overrides={}){
 const calls=[];
 const env={SITE_ENV:'preview',STAGING_STUDIO_ENABLED:'true',ASSETS:{async fetch(input){
  const url=new URL(input.url);calls.push({path:url.pathname,method:input.method});
  if(url.pathname==='/studio/')return new Response(shell,{headers:{'Content-Type':'text/html','Content-Security-Policy':"default-src 'none'",'Cache-Control':'public, max-age=3600'}});
  if(url.pathname==='/studio/static/main.js')return new Response('console.info("editor");',{headers:{'Content-Type':'text/javascript'}});
  return new Response('Website 404',{status:404,headers:{'Content-Type':'text/html','Content-Security-Policy':"default-src 'none'"}});
 }},...overrides};
 return {env,calls};
}

test('Studio cannot be served on production, a different hostname or without explicit enablement',async()=>{
 for(const overrides of [{SITE_ENV:'production'},{STAGING_STUDIO_ENABLED:'false'},{}]){
  const {env,calls}=fixture(overrides);
  const input=Object.keys(overrides).length?request('/studio/'):new Request('https://cash4goldanddiamond.com/studio/');
  const response=await handleStagingStudio(input,env);
  assert.equal(response.status,404);assert.equal(calls.length,0);
  assert.match(response.headers.get('X-Robots-Tag'),/noindex/);
 }
});

test('Studio root normalizes its slash and retains the browser query',async()=>{
 const {env,calls}=fixture();
 const response=await handleStagingStudio(request('/studio?workspace=migration-staging'),env);
 assert.equal(response.status,308);assert.equal(response.headers.get('Location'),'/studio/?workspace=migration-staging');
 assert.equal(calls.length,0);
});

test('direct Studio document navigation receives only the scoped editor shell',async()=>{
 const {env,calls}=fixture();
 const response=await worker.fetch(request('/studio/structure/page;drafts.article-123',{headers:{Accept:'text/html'}}),env);
 assert.equal(response.status,200);assert.equal(await response.text(),shell);
 assert.deepEqual(calls.map(call=>call.path),['/studio/structure/page;drafts.article-123','/studio/']);
 assert.equal(response.headers.get('Location'),null);
 assert.equal(response.headers.get('Cache-Control'),'private, no-store');
 assert.match(response.headers.get('X-Robots-Tag'),/noindex/);
 const csp=response.headers.get('Content-Security-Policy');
 assert.match(csp,/connect-src[^;]+https:\/\/gisdw6qa\.api\.sanity\.io/);
 assert.ok(csp.includes("'sha256-"+createHash('sha256').update(inline).digest('base64')+"'"));
 assert.ok(!csp.includes("default-src 'none'"));
 assert.equal(response.headers.get('Referrer-Policy'),'no-referrer');
});

test('missing Studio scripts stay 404 and non-navigation requests do not get an SPA shell',async()=>{
 for(const [path,headers] of [['/studio/static/missing.js',{Accept:'text/html'}],['/studio/unknown',{Accept:'application/json'}]]){
  const {env,calls}=fixture();
  const response=await handleStagingStudio(request(path,{headers}),env);
  assert.equal(response.status,404);assert.equal(calls.length,1);
  assert.equal(await response.text(),'Website 404');
 }
 const {env}=fixture();const existing=await handleStagingStudio(request('/studio/static/main.js'),env);
 assert.equal(existing.status,200);assert.equal(existing.headers.get('Content-Type'),'text/javascript');
 assert.equal(await existing.text(),'console.info("editor");');
});

test('website 404 and security headers remain unchanged outside the Studio prefix',async()=>{
 const {env,calls}=fixture();
 assert.equal(await handleStagingStudio(request('/studio-not-a-route/'),env),null);
 const response=await worker.fetch(request('/not-found/',{headers:{Accept:'text/html'}}),env);
 assert.equal(response.status,404);assert.equal(await response.text(),'Website 404');
 assert.equal(response.headers.get('Content-Security-Policy'),"default-src 'none'");
 assert.deepEqual(calls.map(call=>call.path),['/not-found/']);
});

test('HEAD obtains matching editor headers without a body; mutations and encoded separators fail closed',async()=>{
 const {env,calls}=fixture();
 const head=await handleStagingStudio(request('/studio/',{method:'HEAD'}),env);
 assert.equal(head.status,200);assert.equal(head.body,null);assert.equal(calls[0].method,'GET');
 assert.ok(head.headers.get('Content-Security-Policy').includes('sha256-'));
 const post=await handleStagingStudio(request('/studio/',{method:'POST'}),env);
 assert.equal(post.status,405);assert.equal(post.headers.get('Allow'),'GET, HEAD');
 const invalid=await handleStagingStudio(request('/studio/%2fprivate'),env);
 assert.equal(invalid.status,404);assert.equal(calls.length,1);
});

test('conditional and no-content Studio responses retain their status and security without constructing a body',async()=>{
 for(const status of [204,205,304])for(const method of ['GET','HEAD']){
  const calls=[];
  const env={SITE_ENV:'preview',STAGING_STUDIO_ENABLED:'true',ASSETS:{fetch:async input=>{
   calls.push({method:input.method,etag:input.headers.get('If-None-Match')});
   return new Response(null,{status,headers:{'Content-Type':'text/html','Content-Security-Policy':"script-src 'self' https://challenges.cloudflare.com",'Content-Length':'123','Content-Encoding':'br',ETag:'"studio-fixture"','Cache-Control':'public, max-age=3600'}});
  }}};
  const response=await handleStagingStudio(request('/studio/',{method,headers:{'If-None-Match':'"studio-fixture"'}}),env);
  assert.equal(response.status,status);
  assert.equal(response.body,null);
  assert.deepEqual(calls,[{method:'GET',etag:'"studio-fixture"'}]);
  assert.equal(response.headers.get('Cache-Control'),'private, no-store');
  assert.equal(response.headers.get('X-Robots-Tag'),'noindex, nofollow, noarchive');
  assert.equal(response.headers.get('X-Content-Type-Options'),'nosniff');
  assert.equal(response.headers.get('Referrer-Policy'),'no-referrer');
  assert.equal(response.headers.get('X-Frame-Options'),'SAMEORIGIN');
  assert.equal(response.headers.get('Content-Length'),null);
  assert.equal(response.headers.get('Content-Encoding'),null);
  assert.equal(response.headers.get('ETag'),'"studio-fixture"');
  if(status===304)assert.equal(response.headers.get('Content-Security-Policy'),null,'Retain the cached Studio CSP rather than replacing it during revalidation');
  else assert.match(response.headers.get('Content-Security-Policy'),/frame-ancestors 'self'/);
 }
});

test('Studio script policy permits exact bootstrap hashes without inline or eval script allowances',async()=>{
 const csp=await stagingStudioCsp('<script>'+inline+'</script><script>'+inline+'</script><script src="/studio/main.js">ignored</script>');
 const script=csp.split('; ').find(directive=>directive.startsWith('script-src '));
 assert.equal((script.match(/sha256-/g)||[]).length,1);
 assert.ok(!script.includes("'unsafe-inline'"));assert.ok(!script.includes("'unsafe-eval'"));
 assert.ok(!script.includes(createHash('sha256').update('ignored').digest('base64')));
});
