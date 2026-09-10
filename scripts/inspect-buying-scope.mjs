import fs from 'node:fs';
import {load} from 'cheerio';
const pages=JSON.parse(fs.readFileSync('src/data/pages.json','utf8'));
for(const p of pages){const $=load(p.html);$('.article-toc,.article-resources,.article-related,figure,.blog-card,article').remove();const candidates=$('p,li,h2,h3,summary').toArray().map(e=>$(e).text().replace(/\s+/g,' ').trim()).filter(t=>/gemstone|emerald|sapphire|rub(?:y|ies)/i.test(t)&&(/buy|sell|accept|cash|certif|evaluat|apprais/i.test(t)));if(candidates.length)console.log(JSON.stringify({path:p.path,title:p.title,article:p.isArticle,mentions:candidates}));}
