import fs from 'node:fs/promises';
import sharp from 'sharp';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const articles=pages.filter(p=>p.isArticle);
const photos=JSON.parse(await fs.readFile('../outputs/photo-review-index.json','utf8'));
const assignments=JSON.parse(await fs.readFile('src/data/article-image-assignments.json','utf8'));
// These source photographs were inspected in the complete photo review sheets.
const selected=[
 [9,85,'Wide gold mesh bracelet with a substantial clasp'],
 [18,49,'Los Angeles skyline at night'],
 [26,99,'Gold chains and loose gold material arranged on a weighing scale'],
 [55,17,'Stacked gold bars against a dark blue background'],
 [57,19,'A collection of worn gold jewelry and scrap pieces'],
 [58,62,'A substantial stack of engraved yellow-gold bangles'],
 [63,18,'Gold bars displayed with United States banknotes'],
 [74,120,'Ornate heavy yellow-gold bangles with colored accents'],
 [11,67,'Hands examining a jewelry piece at a jeweler work surface'],
 [14,11,'A polished diamond ring and loose stones shown for illustration'],
 [29,9,'Loose polished diamonds with a jeweler loupe and tweezers'],
 [46,53,'Three gold rings with substantial rectangular center stones worn together'],
 [59,82,'A pair of substantial round diamond stud earrings'],
 [70,63,'A substantial diamond pendant necklace with blue gemstone details'],
 [77,122,'Several substantial diamond rings displayed on hands'],
 [83,68,'Three large faceted stones arranged on a wooden surface'],
 [86,57,'A faceted diamond viewed through a jeweler loupe'],
 [87,51,'A large round polished diamond held in jeweler tweezers'],
 [108,87,'A round diamond ring resting on green moss']
];
const kept=[2,4,7,23,41,73,75,93,107];
const reserved=[24,28,33,38,39,40,42,43,44,47,48,54,64,76,79,80,81,82];
await fs.mkdir('public/media/selected-source',{recursive:true});
for(const [index,photoIndex,alt] of selected){
 const p=articles[index],photo=photos.find(p=>p.index===photoIndex),raw=await fs.readFile('public'+photo.path),metadata=await sharp(raw).metadata(),key='source-photo-'+photoIndex;
 if(!p||!photo)throw new Error('Missing selected photograph or article');
 const variants=[];
 for(const width of [...new Set([Math.min(480,metadata.width),Math.min(800,metadata.width),Math.min(1200,metadata.width)])]){const src='/media/selected-source/'+key+'-'+width+'.webp';const buffer=await sharp(raw).resize({width}).webp({quality:85,effort:5}).toBuffer();await fs.writeFile('public'+src,buffer);variants.push({width,src,bytes:buffer.length});}
 assignments[p.path]={key,src:variants.at(-1).src,alt,width:metadata.width,height:metadata.height,variants,caption:alt+'. Representative editorial image; not a record of this business’s inventory, staff, prices or verified material grades.',provenance:{sourceUrl:photo.url,sourceSha256:photo.sha,sourceAsset:photo.path,review:'Source library photograph visually reviewed before selection; one use on the canonical guides index.'}};
}
const pending=articles.map((p,index)=>({...p,index})).filter(p=>new URL(p.canonical).pathname===p.path&&!assignments[p.path]&&!kept.includes(p.index)&&!reserved.includes(p.index)).map(p=>({index:p.index,path:p.path,title:p.title,group:p.editorial.group}));
await fs.writeFile('src/data/article-image-assignments.json',JSON.stringify(assignments,null,2));
await fs.writeFile('../work/final-image-generation-targets.json',JSON.stringify(pending,null,2));
await fs.writeFile('migration/source-evidence/owner-approved-images/source-photo-selections.json',JSON.stringify({selected:selected.map(([articleIndex,photoIndex,alt])=>({articleIndex,path:articles[articleIndex].path,photoIndex,alt})),kept:kept.map(i=>articles[i].path),reservedForCoordinator:reserved.map(i=>articles[i].path)},null,2));
console.log(JSON.stringify({selected:selected.length,remainingGeneration:pending},null,2));
