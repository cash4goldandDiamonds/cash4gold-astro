import fs from 'node:fs/promises';
import sharp from 'sharp';
const assets=JSON.parse(await fs.readFile('migration/assets.json','utf8'));
const mapping=new Map();let before=0,after=0;
for(const asset of assets){if(!/\.(?:png|jpe?g|webp)$/i.test(asset.path))continue;const input='public'+asset.path;const data=await fs.readFile(input);const metadata=await sharp(data).metadata();if(metadata.pages>1)continue;const output=await sharp(data).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:82}).toBuffer();if(output.length>=data.length)continue;const newPath=asset.path.replace(/\.[^.]+$/,'.optimized.webp');await fs.writeFile('public'+newPath,output);mapping.set(asset.path,{path:newPath,width:Math.min(metadata.width,1600),height:Math.round(metadata.height*Math.min(metadata.width,1600)/metadata.width)});before+=data.length;after+=output.length;}
let pages=await fs.readFile('src/data/pages.json','utf8');for(const [old,item]of mapping)pages=pages.replaceAll(old,item.path);await fs.writeFile('src/data/pages.json',pages);
await fs.writeFile('migration/image-optimization.json',JSON.stringify({optimized:mapping.size,originalBytes:before,optimizedBytes:after,originalsRetained:true,images:Object.fromEntries(mapping)},null,2));console.log('Optimized',mapping.size,'images:',Math.round(before/1024/1024),'MB →',Math.round(after/1024/1024),'MB. Originals retained.');
