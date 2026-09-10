import fs from 'node:fs/promises';
import sharp from 'sharp';
const rows=JSON.parse(await fs.readFile('../outputs/distinct-photo-inventory.json','utf8'));
const best=new Map();
for(const row of rows){const family=row.family.replace(/(pexels-photo-\d+)(?:-\d+)+\./,'$1.').replace(/(rolex_[^.]+1024x1024)-\d+/,'$1');if(!best.has(family)||best.get(family).width<row.width)best.set(family,row);}
const files=[...best.values()].map((row,index)=>({...row,index}));
await fs.writeFile('../outputs/photo-review-index.json',JSON.stringify(files,null,2));
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
for(let start=0;start<files.length;start+=24){const batch=files.slice(start,start+24),tiles=[];for(let i=0;i<batch.length;i++){const row=batch[i],x=(i%4)*320,y=Math.floor(i/4)*225;tiles.push({input:await sharp('public'+row.path).resize({width:312,height:185,fit:'contain',background:'#eee'}).png().toBuffer(),left:x,top:y});tiles.push({input:Buffer.from(`<svg width="312" height="38"><rect width="100%" height="100%" fill="white"/><text x="5" y="15" font-family="Arial" font-size="12">${row.index}: ${esc(row.family.slice(0,36))}</text><text x="5" y="31" font-family="Arial" font-size="11">${row.width} × ${row.height}</text></svg>`),left:x,top:y+186});}await sharp({create:{width:1280,height:Math.ceil(batch.length/4)*225,channels:3,background:'#fff'}}).composite(tiles).jpeg({quality:88}).toFile(`../work/photo-review-${Math.floor(start/24)+1}.jpg`);}
console.log(JSON.stringify({distinctCandidates:files.length,sheets:Math.ceil(files.length/24)}));
