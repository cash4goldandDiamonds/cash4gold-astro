import {SocialStore} from './store.mjs';
import {limitedText,publishSocial,connectionHealth} from './providers.mjs';
import {CHANNELS,publicationSlot,makeSocialJob,eligibleArticle,SITE_ORIGIN} from '../../src/lib/social-publishing.mjs';
const QUERY='{"settings":*[_id=="social-automation" && !(_id in path("drafts.**"))][0],"articles":*[_type=="page" && kind=="article" && !(_id in path("drafts.**"))][0...1000]{_id,_rev,path,title,kind,seo,reviewState,contentVerified,seoVerified,reviewedBy,reviewedAt,socialSharing}}';
async function cmsSnapshot(env,fetcher){
 if(!/^[a-z0-9]+$/.test(env.SANITY_PROJECT_ID||'')||env.SANITY_DATASET!=='production'||!env.SANITY_READ_TOKEN)throw Error('production_cms_not_connected');
 const url=new URL(`https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2026-09-09/data/query/production`);url.search=new URLSearchParams({query:QUERY,perspective:'published'}).toString();
 const response=await fetcher(url,{redirect:'error',headers:{Authorization:'Bearer '+env.SANITY_READ_TOKEN},signal:AbortSignal.timeout(20_000)});
 if(!response.ok)throw Error('cms_read_failed');
 const data=JSON.parse(await limitedText(response,4_000_000)).result;
 if(!data||!Array.isArray(data.articles)||data.articles.length>=1000)throw Error('cms_snapshot_invalid_or_truncated');
 return data;
}
function meta(html,name){
 const tags=html.match(/<meta\s[^>]*>/gi)||[];
 for(const tag of tags){const attrs=Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(m=>[m[1].toLowerCase(),m[2]]));if(attrs.name===name)return attrs.content||'';}return '';
}
export async function verifyLiveArticle(job,fetcher=fetch){
 const response=await fetcher(SITE_ORIGIN+job.path,{redirect:'manual',headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(20_000)});
 if(response.status!==200||!/text\/html/i.test(response.headers.get('content-type')||''))return false;
 if(/noindex|none/i.test(response.headers.get('x-robots-tag')||''))return false;
 const html=await limitedText(response),canonical=(html.match(/<link\s[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)||[])[1];
 return canonical===SITE_ORIGIN+job.path&&!/noindex|none/i.test(meta(html,'robots'))&&meta(html,'cash4gold:content-revision')===job.revision;
}
async function verifyImage(job,fetcher){
 const response=await fetcher(job.imageUrl,{method:'HEAD',redirect:'error',signal:AbortSignal.timeout(20_000)});
 return response.status===200&&/^image\/jpeg\b/i.test(response.headers.get('content-type')||'')&&Number(response.headers.get('content-length')||Infinity)<=8_000_000;
}
export async function runSocialAutomation(env,{now=new Date(),fetcher=fetch,publisher=publishSocial}={}){
 if(env.SOCIAL_PUBLISHING_ENABLED!=='true'||env.SITE_ENV!=='production')return {state:'paused'};
 if(!env.SOCIAL_DB)throw Error('social_database_not_connected');
 const store=new SocialStore(env.SOCIAL_DB),time=now.toISOString(),runId=crypto.randomUUID();await store.startRun(runId,time);
 try{
  await store.recoverInterrupted(time);
  const snapshot=await cmsSnapshot(env,fetcher);
  if(snapshot.settings?.enabled!==true){await store.endRun(runId,time,'paused','cms_pause');return {state:'paused'};}
  const jobs=[];let invalid=0;
  for(const doc of snapshot.articles)if(eligibleArticle(doc))for(const channel of CHANNELS)if(doc.socialSharing.channels?.includes(channel))try{jobs.push(makeSocialJob(doc,channel,{projectId:env.SANITY_PROJECT_ID,dataset:env.SANITY_DATASET}));}catch{invalid++;}
  await store.sync(jobs,time);
  const connections=CHANNELS.filter(channel=>snapshot.settings.channels?.includes(channel)).map(channel=>connectionHealth(env,channel,now));
  const slot=publicationSlot(now);let posted=0,held=invalid;
  if(slot)for(const channel of CHANNELS){
   if(!snapshot.settings.channels?.includes(channel))continue;
   // Missing/expired credentials do not consume a publication slot or an article attempt.
   if(!connections.find(item=>item.channel===channel)?.ready)continue;
   for(const row of await store.candidates(channel)){
    const job=JSON.parse(row.payload);
    let available=false;
    try{available=await verifyLiveArticle(job,fetcher)&&await verifyImage(job,fetcher);}catch{}
    if(!available){await store.defer(job.id,time,'public_article_or_image_unavailable');held++;continue;}
    // Re-read the published approval immediately before claiming a slot.
    const fresh=await cmsSnapshot(env,fetcher),doc=fresh.articles.find(d=>d._id===job.documentId);
    if(fresh.settings?.enabled!==true||!fresh.settings.channels?.includes(channel)||!eligibleArticle(doc)||doc._rev!==job.revision||!doc.socialSharing.channels.includes(channel)){await store.defer(job.id,time,'approval_or_revision_changed');held++;continue;}
    const claimed=await store.claim(job.id,channel,slot,time);if(!claimed)break;
    try{
     const result=await publisher(job,env,{fetcher,saveContainer:id=>store.container(job.id,id,new Date().toISOString())});
     await store.finish(job.id,'published',new Date().toISOString(),result);posted++;
    }catch(error){
     await store.finish(job.id,error.uncertain!==false?'uncertain':'blocked',new Date().toISOString(),{errorCode:/^[a-z0-9_]+$/.test(error.code||'')?error.code:'attempt_requires_reconciliation'});
    }
    break;
   }
  }
  const state=connections.some(item=>!item.ready)?'blocked':'complete';
  await store.endRun(runId,new Date().toISOString(),state,JSON.stringify({queuedCandidates:jobs.length,posted,held,slot,connections}));
  return {state,queuedCandidates:jobs.length,posted,held,connections};
 }catch{
  await store.endRun(runId,new Date().toISOString(),'failed','automation_dependency_failed');
  throw Error('social_automation_dependency_failed');
 }
}
export default {
 async scheduled(controller,env,ctx){ctx.waitUntil(runSocialAutomation(env));},
 async fetch(request,env){
  const headers={'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow'};
  // No browser-side secret, public posting endpoint, or unauthenticated queue access.
  if(new URL(request.url).pathname!=='/status'||request.method!=='GET'||!env.SOCIAL_STATUS_TOKEN)return new Response('Not found',{status:404,headers});
  const expected=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('Bearer '+env.SOCIAL_STATUS_TOKEN));
  const received=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(request.headers.get('Authorization')||''));
  let diff=0;new Uint8Array(expected).forEach((v,i)=>{diff|=v^new Uint8Array(received)[i];});
  if(diff)return new Response('Forbidden',{status:403,headers});
  if(!env.SOCIAL_DB)return Response.json({error:'social_database_not_connected'},{status:503,headers});
  try{return Response.json({...await new SocialStore(env.SOCIAL_DB).status(),connections:CHANNELS.map(channel=>connectionHealth(env,channel))},{headers});}
  catch{return Response.json({error:'social_status_unavailable'},{status:503,headers});}
 }
};
