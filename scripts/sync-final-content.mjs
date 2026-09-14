import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {load} from 'cheerio';
import {assertAddressIntegrity} from '../src/lib/address-integrity.mjs';
import {assertBuyingPolicy} from '../src/lib/buying-policy.mjs';

const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const ledger=JSON.parse(await fs.readFile('migration/substantive-review.json','utf8'));
const briefs={};
for(const p of pages){
  const $=load(p.html,{},false);
  p.sourceText=$.text().replace(/\s+/g,' ').trim();
  p.images=$('img').map((i,e)=>({...e.attribs})).get();
  if(!p.isArticle)continue;
  const row=ledger.rows.find(r=>r.path===p.path);
  const hash=crypto.createHash('sha256').update(p.html).digest('hex');
  if(row?.status!=='reviewed'||row.afterHtmlSha256!==hash)throw new Error('Unreconciled article: '+p.path);
  Object.assign(p.editorial,{title:p.title,description:p.description,canonical:p.canonical});
  briefs[p.path]=p.editorial;
  Object.assign(row,{title:p.title,description:p.description,focusKeyword:p.editorial.focusKeyword,sources:p.editorial.sources,canonical:p.canonical});
}
assertAddressIntegrity(pages);
assertBuyingPolicy(pages);
await fs.writeFile('src/data/pages.json',JSON.stringify(pages));
await fs.writeFile('src/data/article-optimization.json',JSON.stringify(briefs,null,2));
await fs.writeFile('migration/substantive-review.json',JSON.stringify(ledger,null,2));
console.log(JSON.stringify({synchronizedPages:pages.length,articleBriefs:Object.keys(briefs).length,reviewHashes:'matched'}));
