export class SocialStore {
 constructor(db){this.db=db;}
 async sync(jobs,now){
  now=new Date(now).toISOString();
  for(const job of jobs)await this.db.prepare(`INSERT INTO social_jobs (id,document_id,channel,revision,payload,state,created_at,updated_at) VALUES (?,?,?,?,?,'queued',?,?) ON CONFLICT(id) DO UPDATE SET revision=excluded.revision,payload=excluded.payload,state='queued',error_code=NULL,updated_at=excluded.updated_at WHERE social_jobs.state='cancelled' OR (social_jobs.state='queued' AND (social_jobs.revision<>excluded.revision OR social_jobs.payload<>excluded.payload))`).bind(job.id,job.documentId,job.channel,job.revision,JSON.stringify(job),now,now).run();
  // Never resurrect published, blocked or uncertain attempts when a document is edited.
  const ids=new Set(jobs.map(job=>job.id));
  const pending=await this.db.prepare("SELECT id FROM social_jobs WHERE state='queued'").all();
  for(const row of pending.results)if(!ids.has(row.id))await this.finish(row.id,'cancelled',now,{errorCode:'approval_or_opt_in_removed'});
 }
 // Held articles rotate behind unchecked articles; an unavailable first batch must not starve the backlog.
 async candidates(channel){return (await this.db.prepare("SELECT * FROM social_jobs WHERE channel=? AND state='queued' ORDER BY updated_at,id LIMIT 8").bind(channel).all()).results;}
 async defer(id,now,errorCode){const checkedAt=new Date(Date.parse(now)+1).toISOString();await this.db.prepare("UPDATE social_jobs SET updated_at=?,error_code=? WHERE id=? AND state='queued'").bind(checkedAt,errorCode,id).run();}
 async claim(id,channel,slot,now){
  const nonce=crypto.randomUUID();
  const result=await this.db.batch([
   this.db.prepare("INSERT OR IGNORE INTO social_slots(channel,slot,job_id,claim_nonce,claimed_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM social_jobs WHERE id=? AND state='queued')").bind(channel,slot,id,nonce,now,id),
   this.db.prepare("UPDATE social_jobs SET state='publishing',updated_at=? WHERE id=? AND state='queued' AND EXISTS(SELECT 1 FROM social_slots WHERE channel=? AND slot=? AND job_id=? AND claim_nonce=?) RETURNING *").bind(now,id,channel,slot,id,nonce)
  ]);
  return result[1].results?.[0]||null;
 }
 async container(id,value,now){await this.db.prepare("UPDATE social_jobs SET container_id=?,updated_at=? WHERE id=? AND state='publishing'").bind(value,now,id).run();}
 async finish(id,state,now,{providerId=null,providerUrl=null,errorCode=null}={}){
  await this.db.prepare('UPDATE social_jobs SET state=?,updated_at=?,provider_id=COALESCE(?,provider_id),provider_url=COALESCE(?,provider_url),error_code=? WHERE id=?').bind(state,now,providerId,providerUrl,errorCode,id).run();
 }
 async recoverInterrupted(now){
  const cutoff=new Date(new Date(now).getTime()-30*60*1000).toISOString();
  await this.db.prepare("UPDATE social_jobs SET state='uncertain',error_code='interrupted_attempt_requires_reconciliation',updated_at=? WHERE state='publishing' AND updated_at<?").bind(now,cutoff).run();
 }
 async startRun(id,now){await this.db.prepare("INSERT INTO social_runs(id,started_at,state) VALUES (?,?,'running')").bind(id,now).run();}
 async endRun(id,now,state,detail){await this.db.prepare('UPDATE social_runs SET finished_at=?,state=?,detail=? WHERE id=?').bind(now,state,detail,id).run();}
 async status(){return {jobs:(await this.db.prepare('SELECT id,channel,state,created_at,updated_at,provider_id,provider_url,error_code FROM social_jobs ORDER BY updated_at DESC LIMIT 300').all()).results,runs:(await this.db.prepare('SELECT * FROM social_runs ORDER BY started_at DESC LIMIT 20').all()).results};}
}
