import fs from 'node:fs/promises';
import sharp from 'sharp';
const input='migration/design-source';
const output='public/media/editorial';
await fs.mkdir(output,{recursive:true});
const report=[];
for(const name of ['hero-jewelry','diamond-ring','gold-jewelry','gemstone','necklace','rolex-daytona']){
 const file=name==='rolex-daytona'?'public/media/fc357e8225af-61291ab29ef1e50018f86fedimg.webp':`${input}/${name}.png`,meta=await sharp(file).metadata();
 const widths=name==='hero-jewelry'?[960,1440,meta.width]:name==='rolex-daytona'?[480,meta.width]:[480,960,meta.width];
 for(const width of widths){const dest=`${output}/${name}-${width}.webp`;await sharp(file).resize({width,withoutEnlargement:true}).webp({quality:85}).toFile(dest);const stat=await fs.stat(dest);report.push({file:dest,width,bytes:stat.size});}
}
await fs.writeFile('migration/editorial-image-files.json',JSON.stringify(report,null,2));
await fs.copyFile(input+'/prompts.json','migration/editorial-image-prompts.json');
await fs.copyFile(input+'/necklace-prompt.json','migration/necklace-image-prompt.json');
await fs.writeFile('migration/rolex-image-source.json',JSON.stringify({kind:'Existing source-site photograph',subject:'Rolex Cosmograph Daytona, black dial, gold and steel bracelet',original:'public/media/fc357e8225af-61291ab29ef1e50018f86fedimg.webp',width:800,height:600,generated:false,usedOn:['home watch card','home watch gallery','navigation watch category','selected watch page replacements']},null,2));
console.log('Prepared',report.length,'responsive WebP files;',Math.round(report.reduce((n,r)=>n+r.bytes,0)/1024),'KB total.');
