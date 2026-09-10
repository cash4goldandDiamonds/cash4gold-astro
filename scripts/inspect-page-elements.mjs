import fs from 'node:fs/promises';
import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
for(const path of process.argv.slice(2)){const p=pages.find(p=>p.path===path);if(!p)continue;const $=load(p.html);console.log(JSON.stringify({path,heading:p.heading,title:p.title,matches:$('h1,p').filter((i,e)=>e.name==='h1'||/https?:\/\/|[\u202f\u00a0]/.test($(e).text())).map((i,e)=>$.html(e)).get()},null,2));}
