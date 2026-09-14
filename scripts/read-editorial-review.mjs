import fs from 'node:fs/promises';
import {load} from 'cheerio';
import crypto from 'node:crypto';
import {originalPath} from '../src/lib/route-migrations.mjs';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const articles=pages.filter(p=>p.isArticle);
let baseline=articles;try{baseline=JSON.parse(await fs.readFile('migration/substantive-review-baseline.json','utf8')).filter(p=>p.isArticle);}catch{}
const ids=process.argv.slice(2).map(Number);
for(const index of ids){
 const p=articles[index],$=load(p.html);
 $('.article-toc,.article-resources,.article-related,.article-next-step,figure').remove();
 $('h1,h2,h3,h4,p,li,th,td').after('\n');
 console.log(JSON.stringify({index,path:p.path,title:p.title,description:p.description,canonical:p.canonical,beforeHtmlSha256:crypto.createHash('sha256').update(baseline.find(b=>b.path===originalPath(p.path)).html).digest('hex'),body:$.root().text().replace(/[ \t]+/g,' ').replace(/\n\s*\n/g,'\n').trim(),links:$('a[href]').map((i,e)=>({text:$(e).text(),href:$(e).attr('href')})).get()},null,2));
}
