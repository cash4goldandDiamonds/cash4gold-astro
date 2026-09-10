import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {publicationSlot,eligibleArticle,makeSocialJob,trackedArticleUrl} from '../src/lib/social-publishing.mjs';
import {SocialStore} from '../workers/social/store.mjs';
import {publishSocial as publishSocialAtTime,connectionHealth} from '../workers/social/providers.mjs';
import worker,{runSocialAutomation,verifyLiveArticle} from '../workers/social/index.mjs';
const publishSocial=(job,config,options={})=>publishSocialAtTime(job,config,{now:new Date('2026-09-10T20:00:00Z'),...options});
const approved=()=>({_id:'article-1',_rev:'rev-1',path:'/selling-gold/',title:'Selling gold',kind:'article',reviewState:'approved',contentVerified:true,seoVerified:true,reviewedBy:{_ref:'author-1'},reviewedAt:'2026-09-10T00:00:00Z',seo:{canonical:'https://cash4goldanddiamond.com/selling-gold/'},socialSharing:{enabled:true,approved:true,mediaRightsConfirmed:true,approvedBy:{_ref:'author-1'},approvedAt:'2026-09-10T00:00:00Z',channels:['facebook','instagram'],facebookCaption:'Compare the item and the offer.',instagramCaption:'What belongs in your comparison?',localImage:'/media/social/selling-gold.jpg',imageAlt:'Heavy gold chains on a dark display'}});
const env={SITE_ENV:'production',SOCIAL_PUBLISHING_ENABLED:'true',SANITY_PROJECT_ID:'gisdw6qa',SANITY_DATASET:'production',SANITY_READ_TOKEN:'test-read',META_API_VERSION:'v26.0',FACEBOOK_PAGE_ID:'123',FACEBOOK_PAGE_TOKEN:'test-fb',INSTAGRAM_ACCOUNT_ID:'456',INSTAGRAM_ACCESS_TOKEN:'test-ig',FACEBOOK_PAGE_TOKEN_EXPIRES_AT:'2026-11-01T00:00:00Z',INSTAGRAM_TOKEN_EXPIRES_AT:'2026-11-01T00:00:00Z'};
// Real SQLite executes the queue SQL. This adapter is NOT a Cloudflare D1 runtime test.
async function database(){
 const sql=new DatabaseSync(':memory:');sql.exec(await fs.readFile('workers/social/migrations/0001_social_queue.sql','utf8'));
 const statement=(query,args=[])=>({bind:(...values)=>statement(query,values),run:async()=>({meta:sql.prepare(query).run(...args)}),all:async()=>({results:sql.prepare(query).all(...args)}),first:async()=>sql.prepare(query).get(...args)});
 return {prepare:statement,batch:async statements=>{sql.exec('BEGIN');try{const results=[];for(const s of statements)results.push(await s.all());sql.exec('COMMIT');return results;}catch(error){sql.exec('ROLLBACK');throw error;}}};
}
test('three weekly Los Angeles slots retain local hour across daylight saving',()=>{
 assert.equal(publicationSlot(new Date('2026-09-11T17:15:00Z')),'2026-09-11');
 assert.equal(publicationSlot(new Date('2026-12-11T18:15:00Z')),'2026-12-11');
 for(const date of ['2026-09-10T17:00:00Z','2026-09-12T17:00:00Z','2026-09-11T18:00:00Z'])assert.equal(publicationSlot(new Date(date)),null);
});
test('only reviewed, opted-in canonical public articles become jobs; tracked links stay on the site',()=>{
 assert.equal(eligibleArticle(approved()),true);
 for(const change of [{_id:'drafts.article-1'},{seo:{noindex:true}},{reviewState:'draft'},{seo:{canonical:'https://elsewhere.example/'}},{socialSharing:{enabled:true,approved:false}},{path:'//evil.example/'}])assert.equal(eligibleArticle({...approved(),...change}),false);
 const job=makeSocialJob(approved(),'instagram');assert.match(job.caption,/link in our profile/);assert.equal(new URL(job.link).searchParams.get('utm_medium'),'organic_social');
 assert.throws(()=>trackedArticleUrl('/selling-gold/?email=private','facebook'));assert.throws(()=>makeSocialJob(approved(),'yelp'));
 const long=approved();long.path='/'+('long-guide-'.repeat(90))+'/';long.seo.canonical='https://cash4goldanddiamond.com'+long.path;long.socialSharing.instagramCaption='A'.repeat(1600);assert.throws(()=>makeSocialJob(long,'instagram'),/final_caption_too_long/);
});
test('queue claim is atomic per network/day; revisions and restarts never repost a published item',async()=>{
 const store=new SocialStore(await database()),job=makeSocialJob(approved(),'facebook'),time='2026-09-11T17:00:00Z';
 await store.sync([job],time);assert.ok(await store.claim(job.id,'facebook','2026-09-11',time));assert.equal(await store.claim(job.id,'facebook','2026-09-11',time),null);
 await store.finish(job.id,'published',time,{providerId:'123_456'});await store.sync([{...job,revision:'rev-2'}],time);
 assert.equal((await store.status()).jobs[0].state,'published');assert.equal((await store.candidates('facebook')).length,0);
 const second={...job,id:'article-2:facebook',documentId:'article-2'};await store.sync([second],time);assert.equal(await store.claim(second.id,'facebook','2026-09-11',time),null);assert.ok(await store.claim(second.id,'facebook','2026-09-14',time));
 await store.recoverInterrupted('2026-09-11T18:00:00Z');assert.equal((await store.status()).jobs.find(r=>r.id===second.id).state,'uncertain');
});
test('removing opt-in cancels queued items, and explicit reapproval only restores unsent cancelled items',async()=>{
 const store=new SocialStore(await database()),job=makeSocialJob(approved(),'facebook'),time=new Date().toISOString();
 await store.sync([job],time);await store.sync([],time);assert.equal((await store.status()).jobs[0].state,'cancelled');await store.sync([job],time);assert.equal((await store.status()).jobs[0].state,'queued');
 await store.finish(job.id,'uncertain',time);await store.sync([job],time);assert.equal((await store.status()).jobs[0].state,'uncertain');
});
test('draft/noindex/stale/redirected site responses cannot trigger a promotion',async()=>{
 const job=makeSocialJob(approved(),'facebook');
 const html=revision=>`<meta name="robots" content="index,follow"><link rel="canonical" href="https://cash4goldanddiamond.com/selling-gold/"><meta name="cash4gold:content-revision" content="${revision}">`;
 assert.equal(await verifyLiveArticle(job,async()=>new Response(html('rev-1'),{headers:{'Content-Type':'text/html'}})),true);
 assert.equal(await verifyLiveArticle(job,async()=>new Response(html('rev-0'),{headers:{'Content-Type':'text/html'}})),false);
 assert.equal(await verifyLiveArticle(job,async()=>new Response(html('rev-1'),{headers:{'Content-Type':'text/html','X-Robots-Tag':'noindex'}})),false);
 assert.equal(await verifyLiveArticle(job,async()=>new Response('',{status:301})),false);
});
test('Facebook uses a single publish request and never automatically retries an ambiguous timeout',async()=>{
 let calls=0;const job=makeSocialJob(approved(),'facebook');
 await assert.rejects(publishSocial(job,env,{fetcher:async(url,options)=>{calls++;assert.equal(new URL(url).searchParams.has('access_token'),false);assert.equal(options.headers.Authorization,'Bearer test-fb');throw Error('network');}}),error=>error.uncertain===true);
 assert.equal(calls,1);
 const result=await publishSocial(job,env,{fetcher:async()=>Response.json({id:'123_456'})});assert.equal(result.providerId,'123_456');
});
test('Instagram stores its container before publishing and retains success when permalink lookup fails',async()=>{
 const calls=[],saved=[];const responses=[{id:'11'},{status_code:'FINISHED'},{id:'22'},null];
 const result=await publishSocial(makeSocialJob(approved(),'instagram'),env,{saveContainer:async id=>saved.push(id),fetcher:async(url,options)=>{calls.push(new URL(url).pathname);if(calls.length===3)assert.deepEqual(saved,['11']);const value=responses.shift();if(!value)throw Error('read unavailable');return Response.json(value);}});
 assert.equal(result.providerId,'22');assert.equal(result.providerUrl,null);assert.equal(calls.filter(p=>p.endsWith('/media_publish')).length,1);
});
test('scheduler paused means no network or database access; status endpoint requires its own secret',async()=>{
 assert.deepEqual(await runSocialAutomation({},{fetcher:()=>{throw Error('unexpected network');}}),{state:'paused'});
 assert.equal((await worker.fetch(new Request('https://private.example/status'),{})).status,404);
 assert.equal((await worker.fetch(new Request('https://private.example/status'),{SOCIAL_STATUS_TOKEN:'private-test'})).status,403);
 const unavailable=await worker.fetch(new Request('https://private.example/status',{headers:{Authorization:'Bearer private-test'}}),{SOCIAL_STATUS_TOKEN:'private-test'});
 assert.equal(unavailable.status,503);assert.equal(unavailable.headers.get('Cache-Control'),'private, no-store');assert.deepEqual(await unavailable.json(),{error:'social_database_not_connected'});
 const broken=await worker.fetch(new Request('https://private.example/status',{headers:{Authorization:'Bearer private-test'}}),{SOCIAL_STATUS_TOKEN:'private-test',SOCIAL_DB:{prepare(){throw Error('sensitive provider response');}}});
 assert.equal(broken.status,503);assert.equal((await broken.text()).includes('sensitive'),false);
});
test('full mocked scheduler publishes once per channel slot and reports real stored states on retry',async()=>{
 const db=await database(),article=approved(),settings={enabled:true,channels:['facebook','instagram']};let published=0;
 const fetcher=async(url,options)=>{
  if(new URL(url).hostname.endsWith('.api.sanity.io'))return Response.json({result:{settings,articles:[article]}});
  if(options?.method==='HEAD')return new Response(null,{headers:{'Content-Type':'image/jpeg','Content-Length':'1000'}});
  return new Response('<meta name="robots" content="index"><link rel="canonical" href="https://cash4goldanddiamond.com/selling-gold/"><meta name="cash4gold:content-revision" content="rev-1">',{headers:{'Content-Type':'text/html'}});
 };
 const options={now:new Date('2026-09-11T17:00:00Z'),fetcher,publisher:async()=>({providerId:String(++published)})};
 const first=await runSocialAutomation({...env,SOCIAL_DB:db},options),second=await runSocialAutomation({...env,SOCIAL_DB:db},options);
 assert.equal(first.posted,2);assert.equal(second.posted,0);assert.equal((await new SocialStore(db).status()).jobs.every(j=>j.state==='published'),true);
});

test('an unavailable first batch rotates without consuming a slot or rewriting unchanged jobs',async()=>{
 const db=await database(),store=new SocialStore(db),time='2026-09-11T17:00:00Z';
 const jobs=Array.from({length:10},(_,index)=>makeSocialJob({...approved(),_id:'article-'+String(index).padStart(2,'0')},'facebook'));
 await store.sync(jobs,time);
 for(const job of await store.candidates('facebook'))await store.defer(job.id,time,'public_article_or_image_unavailable');
 await store.sync(jobs,'2026-09-11T17:15:00Z');
 const candidates=await store.candidates('facebook');assert.deepEqual(candidates.slice(0,2).map(job=>job.id),jobs.slice(8).map(job=>job.id));
 assert.ok(await store.claim(candidates[0].id,'facebook','2026-09-11','2026-09-11T17:15:00Z'));
 assert.equal((await store.status()).jobs.find(job=>job.id===jobs[0].id).error_code,'public_article_or_image_unavailable');
});

test('missing or expired token metadata blocks requests; renewal warnings contain no token values',async()=>{
 const now=new Date('2026-09-11T17:00:00Z');
 assert.equal(connectionHealth({...env,INSTAGRAM_TOKEN_EXPIRES_AT:''},'instagram',now).reason,'token_expiry_not_verified');
 assert.equal(connectionHealth({...env,INSTAGRAM_TOKEN_EXPIRES_AT:'2026-09-11T16:00:00Z'},'instagram',now).ready,false);
 const due=connectionHealth({...env,INSTAGRAM_TOKEN_EXPIRES_AT:'2026-09-16T00:00:00Z'},'instagram',now);assert.equal(due.ready,true);assert.equal(due.renewalDue,true);assert.equal(JSON.stringify(due).includes('test-ig'),false);
 let requests=0;
 await assert.rejects(publishSocial(makeSocialJob(approved(),'facebook'),{...env,FACEBOOK_PAGE_TOKEN_EXPIRES_AT:''},{fetcher:async()=>{requests++;}}),error=>error.code==='token_expiry_not_verified');
 assert.equal(requests,0);
});

test('an article network failure does not prevent another article from publishing',async()=>{
 const db=await database(),first=approved(),second={...approved(),_id:'article-2',path:'/second-guide/',seo:{canonical:'https://cash4goldanddiamond.com/second-guide/'}};
 let posted=0;
 const fetcher=async(url,options)=>{
  const parsed=new URL(url);
  if(parsed.hostname.endsWith('.api.sanity.io'))return Response.json({result:{settings:{enabled:true,channels:['facebook']},articles:[first,second]}});
  if(parsed.pathname==='/selling-gold/')throw Error('temporary upstream timeout');
  if(options?.method==='HEAD')return new Response(null,{headers:{'Content-Type':'image/jpeg','Content-Length':'1000'}});
  return new Response('<meta name="robots" content="index"><link rel="canonical" href="https://cash4goldanddiamond.com/second-guide/"><meta name="cash4gold:content-revision" content="rev-1">',{headers:{'Content-Type':'text/html'}});
 };
 const result=await runSocialAutomation({...env,SOCIAL_DB:db},{now:new Date('2026-09-11T17:00:00Z'),fetcher,publisher:async()=>({providerId:String(++posted)})});
 assert.equal(result.posted,1);assert.equal(result.held,1);assert.equal((await new SocialStore(db).status()).jobs.find(job=>job.id==='article-1:facebook').state,'queued');
});

test('expired credentials leave article and daily slot available after reconnection',async()=>{
 const db=await database(),article=approved();let posted=0;
 const fetcher=async(url,options)=>{
  if(new URL(url).hostname.endsWith('.api.sanity.io'))return Response.json({result:{settings:{enabled:true,channels:['facebook']},articles:[article]}});
  if(options?.method==='HEAD')return new Response(null,{headers:{'Content-Type':'image/jpeg','Content-Length':'1000'}});
  return new Response('<meta name="robots" content="index"><link rel="canonical" href="https://cash4goldanddiamond.com/selling-gold/"><meta name="cash4gold:content-revision" content="rev-1">',{headers:{'Content-Type':'text/html'}});
 };
 const options={now:new Date('2026-09-11T17:00:00Z'),fetcher,publisher:async()=>({providerId:String(++posted)})};
 const blocked=await runSocialAutomation({...env,SOCIAL_DB:db,FACEBOOK_PAGE_TOKEN_EXPIRES_AT:''},options);assert.equal(blocked.state,'blocked');assert.equal(blocked.posted,0);
 const connected=await runSocialAutomation({...env,SOCIAL_DB:db},options);assert.equal(connected.posted,1);assert.equal(posted,1);
});
