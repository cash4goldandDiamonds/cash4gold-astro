import fs from 'node:fs/promises';
import sharp from 'sharp';
import crypto from 'node:crypto';
const assets=JSON.parse(await fs.readFile('migration/assets.json','utf8'));
const rows=[];
for(const asset of assets.filter(a=>a.downloaded)){
 try{const raw=await fs.readFile('public'+asset.path),meta=await sharp(raw).metadata();if(meta.width>=500&&meta.height>=300)rows.push({...asset,width:meta.width,height:meta.height,sha:crypto.createHash('sha256').update(raw).digest('hex'),family:asset.path.split('/').at(-1).replace(/^[a-f0-9]{12}-/,'').replace(/-\d+x\d+(?=\.)/,'')});}catch{}
}
await fs.writeFile('../outputs/distinct-photo-inventory.json',JSON.stringify(rows,null,2));
console.log(JSON.stringify({assets:assets.length,qualifying:rows.length,uniqueFiles:new Set(rows.map(r=>r.sha)).size,uniqueFamilies:new Set(rows.map(r=>r.family)).size,paths:rows.map(r=>({path:r.path,width:r.width,height:r.height}))},null,2));
