import fs from 'node:fs';
import {load} from 'cheerio';
const records=JSON.parse(fs.readFileSync('migration/source-evidence/crawl.json'));
console.log('Captured:',records.length);
const home=records.find(r=>r.sourcePath==='/');const $=load(home.mainHtml);
console.log('Home sections', $('body').children().map((i,e)=>({tag:e.tagName,cls:$(e).attr('class'),id:$(e).attr('data-id'),text:$(e).text().replace(/\s+/g,' ').trim().slice(0,240)})).get());
console.log('Home widgets', $('[data-widget_type]').map((i,e)=>({type:$(e).attr('data-widget_type'),text:$(e).text().replace(/\s+/g,' ').trim().slice(0,180)})).get());
console.log('Home style URLs',home.elementorStyles);
console.log('nav',home.links.filter(l=>['Home','About','Start Selling','Blogs','Reviews','FAQ','Contact Us'].includes(l.text)).slice(0,15));
