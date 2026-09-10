CREATE TABLE IF NOT EXISTS social_jobs (
 id TEXT PRIMARY KEY, document_id TEXT NOT NULL, channel TEXT NOT NULL CHECK(channel IN ('facebook','instagram')),
 revision TEXT NOT NULL, payload TEXT NOT NULL,
 state TEXT NOT NULL CHECK(state IN ('queued','publishing','published','blocked','uncertain','cancelled')),
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL, provider_id TEXT, provider_url TEXT, container_id TEXT, error_code TEXT
);
CREATE INDEX IF NOT EXISTS social_due ON social_jobs(channel,state,created_at,id);
CREATE TABLE IF NOT EXISTS social_slots (
 channel TEXT NOT NULL, slot TEXT NOT NULL, job_id TEXT NOT NULL, claim_nonce TEXT NOT NULL, claimed_at TEXT NOT NULL,
 PRIMARY KEY(channel,slot)
);
CREATE TABLE IF NOT EXISTS social_runs (
 id TEXT PRIMARY KEY, started_at TEXT NOT NULL, finished_at TEXT, state TEXT NOT NULL, detail TEXT
);
