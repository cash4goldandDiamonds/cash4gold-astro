import {STAGING_STUDIO_ORIGIN,isStagingStudioPath} from '../src/lib/staging-studio.mjs';

export const SNAPSHOT_PROJECT='gisdw6qa';
export const SNAPSHOT_DATASET='migration-staging';
const API_VERSION='2026-09-09',PAGE_SIZE=250,MAX_DOCUMENTS=10000,MAX_BYTES=50*1024*1024;
const messages={SCOPE:'Open this tool in the protected staging Studio for the existing private dataset.',AUTH:'Sign in to Studio before preparing a snapshot.',READ:'The snapshot could not be read. No download was prepared; check your access and try again.',PRIVATE:'The dataset must be confirmed private before exporting.',INVALID:'The read returned incomplete or inconsistent document evidence. No download was prepared.',DRIFT:'Documents or permissions changed during the read. No download was prepared; stop editing and try again.',LIMIT:'This dataset exceeds the bounded browser export. No download was prepared.',ABORT:'Snapshot preparation was cancelled or timed out. No download was prepared.'};
export class SnapshotError extends Error{constructor(code){super(messages[code]||messages.READ);this.name='SnapshotError';this.code=code;}}
export const sameSnapshotSession=(captured,current)=>typeof captured?.userId==='string'&&captured.userId.length>0&&captured.userId===current?.userId&&captured.client===current?.client;
function fail(code){throw new SnapshotError(code);}
export function assertSnapshotScope(client,location,authenticated){
 if(!authenticated)fail('AUTH');
 const config=client.config();
 if(config.projectId!==SNAPSHOT_PROJECT||config.dataset!==SNAPSHOT_DATASET||
   (config.apiHost&&config.apiHost!=='https://api.sanity.io')||
   location?.origin!==STAGING_STUDIO_ORIGIN||!isStagingStudioPath(location?.pathname||''))fail('SCOPE');
}
const sha=async text=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text))),byte=>byte.toString(16).padStart(2,'0')).join('');
const inventory=rows=>rows.map(({_id,_rev})=>({_id,_rev}));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

// Only existing Studio authentication is used. Never obtain, serialize or log
// a client token. These are fixed read operations, not a general query console.
export async function preparePrivateSnapshot(client,{getLocation,isAuthenticated,signal,onProgress=()=>{}}){
 assertSnapshotScope(client,getLocation(),isAuthenticated());
 const raw=client.withConfig({apiVersion:API_VERSION,perspective:'raw',useCdn:false,stega:false,useProjectHostname:true,timeout:15000});
 const controller=new AbortController();
 const abort=()=>controller.abort();
 if(signal?.aborted)abort();
 signal?.addEventListener('abort',abort,{once:true});
 const timeout=setTimeout(abort,120000);
 const startedAt=new Date().toISOString();
 function guard(){
  if(controller.signal.aborted)fail('ABORT');
  assertSnapshotScope(client,getLocation(),isAuthenticated());
  assertSnapshotScope(raw,getLocation(),isAuthenticated());
  const config=raw.config();
  if(config.useCdn!==false||config.perspective!=='raw'||config.apiVersion!==API_VERSION||config.useProjectHostname!==true)fail('SCOPE');
 }
 async function read(query,parameters={}){
  guard();
  try{const result=await raw.fetch(query,parameters,{signal:controller.signal,timeout:15000,perspective:'raw',filterResponse:true});guard();return result;}
  catch(error){if(error instanceof SnapshotError)throw error;if(controller.signal.aborted)fail('ABORT');fail('READ');}
 }
 async function confirmPrivate(){
  guard();let datasets;
  try{datasets=await raw.request({url:'/datasets',method:'GET',signal:controller.signal,timeout:15000});}catch{if(controller.signal.aborted)fail('ABORT');fail('READ');}
  guard();if(!Array.isArray(datasets)||datasets.filter(row=>row.name===SNAPSHOT_DATASET&&row.aclMode==='private').length!==1)fail('PRIVATE');
 }
 async function scan(phase,full=false){
  const expected=await read('count(*)');
  if(!Number.isSafeInteger(expected)||expected<1)fail('INVALID');
  if(expected>MAX_DOCUMENTS)fail('LIMIT');
  const rows=[];let after='',bytes=0;
  for(let page=0;page<=MAX_DOCUMENTS/PAGE_SIZE;page++){
   // No ID/type exclusions: drafts, system and release documents remain visible
   // to the extent that this signed-in user's permissions expose them.
   const batch=await read(`*[_id > $after] | order(_id asc) [0...${PAGE_SIZE}]${full?'':'{_id,_rev}'}`,{after});
   if(!Array.isArray(batch)||batch.length>PAGE_SIZE)fail('INVALID');
   if(!batch.length){
    if(rows.length!==expected||await read('count(*)')!==expected)fail('DRIFT');
    return rows;
   }
   for(const row of batch){
    if(typeof row?._id!=='string'||!row._id||row._id<=after||typeof row._rev!=='string'||!row._rev||(full&&(typeof row._type!=='string'||!row._type)))fail('INVALID');
    after=row._id;rows.push(row);
    if(rows.length>MAX_DOCUMENTS)fail('LIMIT');
    bytes+=new TextEncoder().encode(JSON.stringify(row)+'\n').byteLength;
    if(bytes>MAX_BYTES)fail('LIMIT');
   }
   onProgress({phase,documents:rows.length});
  }
  fail('LIMIT');
 }
 try{
  await confirmPrivate();
  const before=inventory(await scan('Checking initial revisions'));
  const documents=await scan('Reading documents',true);
  if(!same(before,inventory(documents)))fail('DRIFT');
  const after=inventory(await scan('Checking final revisions'));
  if(!same(before,after))fail('DRIFT');
  await confirmPrivate();guard();
  const ndjson=documents.map(doc=>JSON.stringify(doc)).join('\n')+'\n';
  const manifest={formatVersion:1,projectId:SNAPSHOT_PROJECT,dataset:SNAPSHOT_DATASET,aclMode:'private',apiVersion:API_VERSION,perspective:'raw',useCdn:false,startedAt,finishedAt:new Date().toISOString(),documents:documents.length,ndjsonSha256:await sha(ndjson),revisionInventorySha256:await sha(JSON.stringify(before)),beforeExportAfterRevisionsMatch:true,scope:'Permission-visible, non-atomic query snapshot. Matching revision inventories detect observed drift, not every possible concurrent change. Hidden documents and asset binary files are not included. This is not a complete dataset backup.',remoteWrites:0};
  guard();return {ndjson,manifest};
 }finally{clearTimeout(timeout);signal?.removeEventListener('abort',abort);}
}
