import fs from 'node:fs/promises';
import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const custom=JSON.parse(await fs.readFile('src/data/gold-article-briefs.json','utf8'));
const rows=pages.filter(p=>p.isArticle).map(p=>({path:p.path,title:p.title,description:p.description,words:load(p.html).text().split(/\s+/).length,answer:p.editorial.answer}));
const claims=[];
for(const p of pages.filter(p=>p.isArticle)){const $=load(p.html);$('h2,h3,p,li,td').each((i,e)=>{const t=$(e).text().trim();if(/★★★★★|we[’']ve tested|GIA.certified apprais|guaranteed.*(?:price|payout)|#1|\b550 S|\b609 S|call or to|\$[\d,]+.*(?:per gram|today)|(?:tested|ranked)\s+(?:five|six|seven|the top)/i.test(t))claims.push({path:p.path,text:t.slice(0,700)});});}
await fs.writeFile('migration/editorial-content-review.json',JSON.stringify({rows,claims},null,2));
console.log(JSON.stringify({shortArticles:rows.filter(x=>x.words<550),titles:rows.filter(x=>!custom[x.path]).map(x=>x.title),claims},null,2));
