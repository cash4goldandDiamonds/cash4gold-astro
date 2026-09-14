import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {preparePrivateSnapshot,assertSnapshotScope,SnapshotError,sameSnapshotSession} from '../studio/private-snapshot.mjs';
const location={origin:'https://cash4gold-private-preview.cash4goldanddiamond.workers.dev',pathname:'/studio/private-snapshot'};
const options={getLocation:()=>location,isAuthenticated:()=>true};
const document=id=>({_id:id,_rev:'r-'+id,_type:'page',body:[{text:'Complete synthetic content '+id}]});
function fixture(documents=[document('a')],custom={}){
 const calls=[],config={projectId:'gisdw6qa',dataset:'migration-staging',apiHost:'https://api.sanity.io',...custom.config};
 let scan=-1,requests=0;
 const make=current=>({
  config:()=>current,
  withConfig:changes=>make({...current,...changes}),
  async request(request){calls.push({method:'metadata',request});assert.equal(request.method,'GET');assert.equal(request.url,'/datasets');return [{name:'migration-staging',aclMode:custom.acl||'private'}];},
  async fetch(query,parameters,request){
   calls.push({method:'query',query,parameters});requests++;
   assert.equal(current.useCdn,false);assert.equal(current.perspective,'raw');assert.equal(current.stega,false);assert.equal(request.perspective,'raw');assert.ok(request.signal instanceof AbortSignal);
   if(custom.beforeRead)await custom.beforeRead({requests,config});
   if(custom.error)throw new Error('Provider internals and synthetic-sensitive-text');
   if(query==='count(*)')return custom.count??documents.length;
   assert.match(query,/^\*\[_id > \$after\] \| order\(_id asc\) \[0\.\.\.250\](?:\{_id,_rev\})?$/);
   if(parameters.after==='')scan++;
   const data=custom.scan?custom.scan(scan,documents):documents;
   const batch=data.filter(doc=>doc._id>parameters.after).slice(0,custom.pageSize||250);
   const result=query.endsWith('{_id,_rev}')?batch.map(({_id,_rev})=>({_id,_rev})):structuredClone(batch);
   return custom.batch?custom.batch(result,{scan,after:parameters.after}):result;
  },
 });
 return {client:make(config),calls,config};
}
const rejects=async(promise,code)=>assert.rejects(promise,error=>error instanceof SnapshotError&&error.code===code&&!error.message.includes('synthetic-sensitive'));

test('checked raw snapshot preserves all visible document kinds through cursor pagination and hashes exact NDJSON',async()=>{
 const docs=[document('_.system'),{...document('_.releases.test'),_type:'system.release'},document('drafts.page'),document('versions.release.page'),...Array.from({length:501},(_,i)=>document('page-'+String(i).padStart(4,'0')))].sort((a,b)=>a._id<b._id?-1:1);
 const {client,calls}=fixture(docs,{config:{token:'synthetic-credential-never-exported'}});
 const result=await preparePrivateSnapshot(client,options);
 assert.deepEqual(result.ndjson.trim().split('\n').map(JSON.parse),docs);
 assert.equal(result.manifest.documents,505);assert.equal(result.manifest.remoteWrites,0);
 assert.equal(result.manifest.ndjsonSha256,createHash('sha256').update(result.ndjson).digest('hex'));
 assert.equal(result.manifest.beforeExportAfterRevisionsMatch,true);
 assert.match(result.manifest.scope,/Permission-visible, non-atomic/);
 assert.ok(!JSON.stringify(result).includes('synthetic-credential'));
 assert.equal(calls.filter(c=>c.method==='metadata').length,2);
 assert.ok(calls.some(c=>c.parameters?.after));
});

test('scope and authentication fail before any dataset read',async()=>{
 for(const config of [{projectId:'other'},{dataset:'production'},{apiHost:'https://untrusted.invalid'}]){
  const {client,calls}=fixture(undefined,{config});await rejects(preparePrivateSnapshot(client,options),'SCOPE');assert.equal(calls.length,0);
 }
 for(const loc of [{...location,origin:'https://cash4goldanddiamond.com'},{...location,pathname:'/studio-other'}]){
  const {client,calls}=fixture();await rejects(preparePrivateSnapshot(client,{...options,getLocation:()=>loc}),'SCOPE');assert.equal(calls.length,0);
 }
 const {client,calls}=fixture();await rejects(preparePrivateSnapshot(client,{...options,isAuthenticated:()=>false}),'AUTH');assert.equal(calls.length,0);
});

test('dataset must be confirmed private; empty or excessive permission-visible inventories fail closed',async()=>{
 await rejects(preparePrivateSnapshot(fixture(undefined,{acl:'public'}).client,options),'PRIVATE');
 await rejects(preparePrivateSnapshot(fixture([]).client,options),'INVALID');
 await rejects(preparePrivateSnapshot(fixture(undefined,{count:10001}).client,options),'LIMIT');
});

test('document revisions in export and final inventory must match initial inventory',async()=>{
 for(const changedScan of [1,2]){
  const {client}=fixture(undefined,{scan:(scan,docs)=>scan===changedScan?docs.map(doc=>({...doc,_rev:'changed'})):docs});
  await rejects(preparePrivateSnapshot(client,options),'DRIFT');
 }
});

test('addition, deletion and incomplete pages cannot create an accepted download',async()=>{
 await rejects(preparePrivateSnapshot(fixture([document('a'),document('b')],{scan:(scan,docs)=>scan===1?docs.slice(0,1):docs}).client,options),'DRIFT');
 await rejects(preparePrivateSnapshot(fixture([document('a')],{scan:(scan,docs)=>scan===1?[...docs,document('b')]:docs}).client,options),'DRIFT');
 await rejects(preparePrivateSnapshot(fixture(undefined,{batch:()=>[]}).client,options),'DRIFT');
});

test('short pages continue until an empty page; duplicate, unordered and malformed evidence is rejected',async()=>{
 const docs=[document('a'),document('b'),document('c')];
 assert.equal((await preparePrivateSnapshot(fixture(docs,{pageSize:1}).client,options)).manifest.documents,3);
 for(const batch of [rows=>rows.length?[rows[0],rows[0]]:rows,rows=>rows.length?[...rows].reverse():rows,rows=>rows.map(row=>({...row,_rev:''}))])await rejects(preparePrivateSnapshot(fixture(docs,{batch}).client,options),'INVALID');
});

test('scope and sign-in are rechecked during reads; cancellation rejects without a result',async()=>{
 const changed=fixture(undefined,{beforeRead:({requests,config})=>{if(requests===2)config.dataset='production';}});
 await rejects(preparePrivateSnapshot(changed.client,options),'SCOPE');
 let authenticated=true;const signedOut=fixture(undefined,{beforeRead:()=>{authenticated=false;}});
 await rejects(preparePrivateSnapshot(signedOut.client,{...options,isAuthenticated:()=>authenticated}),'AUTH');
 const controller=new AbortController(),cancelled=fixture(undefined,{beforeRead:()=>controller.abort()});
 await rejects(preparePrivateSnapshot(cancelled.client,{...options,signal:controller.signal}),'ABORT');
});

test('provider failures expose a fixed error message and no provider body or credentials',async()=>{
 await rejects(preparePrivateSnapshot(fixture(undefined,{error:true}).client,options),'READ');
 assert.throws(()=>assertSnapshotScope(fixture().client,location,false),/Sign in/);
});

test('a snapshot belongs to one signed-in user and client instance, including while reads are pending',async()=>{
 const current={userId:'account-a'};
 const {client}=fixture(undefined,{beforeRead:()=>{current.userId='account-b';}});
 current.client=client;const captured={...current};
 assert.equal(sameSnapshotSession(captured,current),true);
 await rejects(preparePrivateSnapshot(client,{...options,isAuthenticated:()=>sameSnapshotSession(captured,current)}),'AUTH');
 assert.equal(sameSnapshotSession(captured,current),false);
 assert.equal(sameSnapshotSession(captured,{...captured,client:{}}),false);
 assert.equal(sameSnapshotSession(captured,{client}),false);
 assert.equal(sameSnapshotSession(null,current),false);
});
