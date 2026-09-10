import fs from 'node:fs/promises';
import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const articles=pages.filter(p=>p.isArticle);
const mode=process.argv[2]||'list';
if(mode==='list')console.log(JSON.stringify(articles.map((p,index)=>({index,path:p.path,title:p.title,group:p.editorial.group,words:load(p.html).text().trim().split(/\s+/).length})),null,2));
else for(const index of process.argv.slice(2).map(Number)){
 const p=articles[index];const $=load(p.html);$('h1,h2,h3,h4,p,li,th,td,figcaption').after('\n');
 console.log(JSON.stringify({index,path:p.path,title:p.title,description:p.description,editorial:p.editorial,publishedAt:p.publishedAt,modifiedAt:p.modifiedAt,body:$.root().text().replace(/[ \t]+/g,' ').replace(/\n\s*\n/g,'\n').trim()},null,2));
}
