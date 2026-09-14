import fs from 'node:fs';
import {load} from 'cheerio';
const pages=JSON.parse(fs.readFileSync('src/data/pages.json','utf8'));
for(const path of ['/sell-gemstones-for-cash-in-los-angeles/','/start-selling-gold-and-diamonds/','/faqs/','/sell-your-diamonds-in-los-angeles/','/']){const p=pages.find(p=>p.path===path),$=load(p.html);console.log(JSON.stringify({path,title:p.title,description:p.description,heading:p.heading,sections:p.sections.map(s=>s.id),images:$('img').map((i,e)=>({...e.attribs})).get(),copy:$('h1,h2,h3,p,summary').map((i,e)=>$(e).text().replace(/\s+/g,' ').trim()).get(),schema:p.schema},null,2));}
