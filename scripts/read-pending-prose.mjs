import fs from 'node:fs';
import {load} from 'cheerio';
const articles=JSON.parse(fs.readFileSync('src/data/pages.json','utf8')).filter(p=>p.isArticle);
for(const index of process.argv.slice(2).map(Number)){const p=articles[index],$=load(p.html);$('.article-toc,.article-resources,.article-related,.article-next-step,figure').remove();$('h1,h2,h3,h4,p,li,th,td').after('\n');console.log('\nARTICLE '+index+' '+p.path+'\n'+$.root().text().replace(/[ \t]+/g,' ').replace(/\n\s*\n/g,'\n').trim());}
