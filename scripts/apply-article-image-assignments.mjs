import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {applyArticleImageAssignments} from '../src/lib/article-image-assignments.mjs';
const pages=applyArticleImageAssignments(JSON.parse(await fs.readFile('src/data/pages.json','utf8')));
const ledger=JSON.parse(await fs.readFile('migration/substantive-review.json','utf8'));
for(const row of ledger.rows){if(row.status==='reviewed')row.afterHtmlSha256=crypto.createHash('sha256').update(pages.find(p=>p.path===row.path).html).digest('hex');}
const briefs=JSON.parse(await fs.readFile('src/data/article-optimization.json','utf8'));for(const p of pages.filter(p=>p.isArticle))briefs[p.path]=p.editorial;
await fs.writeFile('src/data/pages.json',JSON.stringify(pages));
await fs.writeFile('src/data/article-optimization.json',JSON.stringify(briefs,null,2));
await fs.writeFile('migration/substantive-review.json',JSON.stringify(ledger,null,2));
console.log('Applied approved image assignments to articles and selling-guide cards.');
