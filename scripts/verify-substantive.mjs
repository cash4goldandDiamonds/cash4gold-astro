import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {load} from 'cheerio';
import {currentPath,originalPath,migrations} from '../src/lib/route-migrations.mjs';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const additions=JSON.parse(await fs.readFile('migration/pre-deployment/additions.json','utf8').catch(e=>{if(e.code==='ENOENT')return '[]';throw e;}));
const baseline=[...JSON.parse(await fs.readFile('migration/substantive-review-baseline.json','utf8')),...additions.map(a=>a.originalPage)];
const ledger=JSON.parse(await fs.readFile('migration/substantive-review.json','utf8'));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const errors=[],rows=[];
const check=(path,name,ok)=>{if(!ok)errors.push({path,check:name});return Boolean(ok);};
const redirects=JSON.parse(await fs.readFile('src/data/redirects.json','utf8'));
check('*','Original public paths retained or owner-authorized redirects provided',JSON.stringify(pages.map(p=>p.path).sort())===JSON.stringify(baseline.map(p=>currentPath(p.path)).sort())&&migrations.every(m=>redirects[m.from]===m.to));
for(const p of pages.filter(p=>p.isArticle)){
 const old=baseline.find(b=>b.path===originalPath(p.path)),review=ledger.rows.find(r=>r.path===p.path);
 check(p.path,'Original publication date retained',p.publishedAt===old.publishedAt);
 if(review?.status!=='reviewed'){rows.push({path:p.path,status:'pending'});continue;}
 check(p.path,'Reviewed content hash matches current body',review.afterHtmlSha256===hash(p.html));
 const $=load(p.html);$('.article-toc,.article-resources,.article-related,.article-next-step').remove();
 const external=$('a[href^="https://"]').toArray().map(e=>$(e).attr('href'));
 check(p.path,'Primary source present within substantive prose',external.length>0);
 const ids=$('[id]').map((i,e)=>$(e).attr('id')).get();check(p.path,'No duplicate body IDs',ids.length===new Set(ids).size);
 const unsupported=/\b(?:we|I)(?:['’]ve)? (?:personally )?(?:tested|ranked|evaluated the top)|\bRating:\s*\d|(?:guarantee|guarantees) (?:the )?(?:best|highest) price/i;
 check(p.path,'No invented ranking or best-price guarantee',!unsupported.test($.text()));
 check(p.path,'Two distinct reviewed image placements',new Set($('img').map((i,e)=>$(e).attr('src')).get()).size>=2);
 rows.push({path:p.path,status:'reviewed',decision:review.decision,proseSourceLinks:external.length,publicationDate:p.publishedAt,modifiedDate:p.modifiedAt});
}
const report={checkedAt:new Date().toISOString(),reviewed:rows.filter(r=>r.status==='reviewed').length,pending:rows.filter(r=>r.status==='pending').length,scope:'Current source content, per-article review hashes, date and route preservation, prose citations and image placements. Separate from browser or ranking measurements.',errors,rows};
await fs.writeFile('migration/substantive-verification.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({reviewed:report.reviewed,pending:report.pending,errors}));if(errors.length)process.exitCode=1;
