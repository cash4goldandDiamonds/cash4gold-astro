import fs from 'node:fs/promises';
import sharp from 'sharp';

const directory='migration/design-source';
const registry=JSON.parse(await fs.readFile('src/data/image-overrides.json','utf8'));
const categories=[
 {key:'estate',file:'estate-diamonds',alt:'Ornate antique platinum brooch and bracelet richly set with diamonds'},
 {key:'goldCollection',file:'cuban-scrap-gold',alt:'Heavy Cuban link gold chains, bracelets, bangles, rings, and scrap gold jewelry'},
];
const files=[];
for(const category of categories){
 const source=`${directory}/${category.file}.png`;
 const meta=await sharp(source).metadata();
 const widths=[240,480,960].filter(w=>w<=meta.width);
 for(const width of widths){
  const dest=`public/media/editorial/${category.file}-${width}.webp`;
  await sharp(source).resize({width,withoutEnlargement:true}).webp({quality:87}).toFile(dest);
  files.push({file:dest,width,bytes:(await fs.stat(dest)).size});
 }
 registry.assets[category.key]={file:category.file,width:meta.width,height:meta.height,widths,alt:category.alt};
}
await fs.writeFile('src/data/image-overrides.json',JSON.stringify(registry,null,2)+'\n');
let header=await fs.readFile('src/components/Header.astro','utf8');
header=header.replace("label:'Gold & Jewelry',detail:'Jewelry, coins & scrap gold',href:'/sell-your-golds/',image:'gold'","label:'Gold & Jewelry',detail:'Jewelry, coins & scrap gold',href:'/sell-your-golds/',image:'goldCollection'");
header=header.replace("label:'Estate Jewelry',detail:'Inherited & vintage jewelry',href:'/sell-estate-jewelry-los-angeles/',image:'necklace'","label:'Estate Jewelry',detail:'Inherited & vintage jewelry',href:'/sell-estate-jewelry-los-angeles/',image:'estate'");
header=header.replaceAll('sizes="220px"','sizes="(max-width: 1100px) 48px, 220px"');
await fs.writeFile('src/components/Header.astro',header);
await fs.copyFile(directory+'/category-image-prompts.json','migration/category-image-prompts.json');
await fs.mkdir('outputs',{recursive:true});
await fs.copyFile(directory+'/category-image-prompts.json','outputs/Category-image-prompts.json');
await fs.writeFile('migration/category-image-files.json',JSON.stringify(files,null,2));
console.log(JSON.stringify({files:files.length,desktopThumbnailBytes:files.filter(f=>f.width===480).reduce((sum,f)=>sum+f.bytes,0)},null,2));
