import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8')),ledger=JSON.parse(await fs.readFile('migration/substantive-review.json','utf8')),cache=new Map(),rows=[];
for(const p of pages.filter(p=>p.isArticle)){const $=load(p.html,{},false);for(const node of $('figure img').toArray()){const img=$(node),src=img.attr('src');if(!src?.startsWith('/'))continue;let m=cache.get(src);if(!m){m=await sharp(await fs.readFile('public'+src)).metadata();cache.set(src,m);}if(m.width<600){img.attr({width:String(m.width),height:String(m.height)}).addClass('native-size-image');rows.push({path:p.path,src,width:m.width,height:m.height,handling:'Displayed at native dimensions without enlarging the small source.'});}}
 p.html=$.html();p.images=$('img').map((i,e)=>({...e.attribs})).get();const r=ledger.rows.find(r=>r.path===p.path);if(r?.status==='reviewed')r.afterHtmlSha256=crypto.createHash('sha256').update(p.html).digest('hex');}
await fs.writeFile('src/data/pages.json',JSON.stringify(pages));await fs.writeFile('migration/substantive-review.json',JSON.stringify(ledger,null,2));await fs.writeFile('migration/native-size-article-images.json',JSON.stringify(rows,null,2));console.log(JSON.stringify({nativeSizePlacements:rows.length,sourceImages:cache.size}));
