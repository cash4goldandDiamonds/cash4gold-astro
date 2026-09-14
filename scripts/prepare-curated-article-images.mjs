import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const evidence='migration/source-evidence/owner-approved-images';
const external='C:/Users/judit/Documents/Codex/2026-09-09/realtime-voice-chat/outputs';
const modes=process.argv.slice(2);
const root=JSON.parse(await fs.readFile(evidence+'/diamond-batch-2-prompts-and-assets.json','utf8'));
const alts=[
 'Large pear-cut polished diamond held in jeweler tweezers over ivory suede',
 'Large step-cut polished diamond displayed upright on dark slate',
 'Graduated necklace with substantial round diamonds on navy velvet',
 'Large round brilliant diamond beside a black jeweler loupe on a gray surface',
 'Three large oval polished diamonds arranged in a green jewelry tray',
 'Substantial marquise diamond ring with tapered baguette side stones',
 'Large cushion-cut diamond solitaire in a polished white-metal ring',
 'Champagne-colored cushion diamond and clear side stones in a heavy gold ring',
 'Heavy yellow-gold Cuban bracelet with prominent diamond-set links',
 'Round diamond solitaire in a yellow-gold six-prong ring on ivory cloth',
 'Emerald-cut diamond solitaire in a platinum-style ring on pale stone'
];
let assets=root.map((s,i)=>({...s,alt:alts[i],group:'diamond',review:'Root visually inspected all eleven completed images; use as illustrations, not grading references.'}));
for(const group of ['watch-images','watch-images-batch-2','gemstone-images','estate-images']){
 const manifest=JSON.parse(await fs.readFile(external+'/'+group+'/prompts-and-assets.json','utf8'));
 await fs.copyFile(external+'/'+group+'/prompts-and-assets.json',evidence+'/'+group+'-prompts-and-assets.json');
 for(const s of manifest.assets||manifest){
  if(s.name==='patek-grand-complication-rose-gold')continue;
  const alt=s.alt||({'rolex-president-gold-champagne':'Yellow-gold Rolex Day-Date-style watch with a champagne dial and diamond bezel','rolex-president-platinum-ice-blue':'Platinum Rolex Day-Date-style watch with an ice-blue dial and President-style bracelet','cartier-santos-yellow-gold':'Yellow-gold Cartier Santos-style watch with a white Roman-numeral dial'}[s.name]);
  if(!alt)throw new Error('Missing reviewed alt: '+s.name);
  assets.push({...s,path:s.targetPath||s.target,source:s.savedPath.replace(/\\+/g,'/'),alt,group:group.startsWith('watch')?'watch':group.startsWith('estate')?'estate':'gemstone',promptFile:evidence+'/'+group+'-prompts-and-assets.json'});
 }
}
if(new Set(assets.map(a=>a.path)).size!==assets.length)throw new Error('Duplicate image assignment in curated batch');
if(modes.includes('--review-sheets')){
 const subset=assets.filter(a=>!root.some(r=>r.name===a.name));
 for(let start=0;start<subset.length;start+=9){
  const chunk=subset.slice(start,start+9),width=1800,height=Math.ceil(chunk.length/3)*435,layers=[];
  for(let i=0;i<chunk.length;i++){const s=chunk[i],left=i%3*600,top=Math.floor(i/3)*435;const thumb=await sharp(await fs.readFile(s.source)).resize(588,392,{fit:'contain',background:'#eeeeee'}).jpeg({quality:91}).toBuffer();layers.push({input:thumb,left,top});const label=Buffer.from('<svg width="600" height="36"><rect width="600" height="36" fill="white"/><text x="8" y="24" font-size="18" fill="black">'+s.name+'</text></svg>');layers.push({input:label,left,top:top+392});}
  await sharp({create:{width,height,channels:3,background:'#eeeeee'}}).composite(layers).jpeg({quality:93}).toFile('../work/curated-review-'+(1+start/9)+'.jpg');
 }
 console.log(JSON.stringify({reviewSheets:Math.ceil(subset.length/9),assets:assets.length}));
}else if(modes.includes('--apply')){
 const assignments=JSON.parse(await fs.readFile('src/data/article-image-assignments.json','utf8'));
 const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
 await fs.mkdir('public/media/owner-curated',{recursive:true});
 for(const s of assets){
  if(!pages.some(p=>p.path===s.path&&p.isArticle))throw new Error('Unknown target '+s.path);
  const raw=await fs.readFile(s.source),meta=await sharp(raw).metadata(),sha=crypto.createHash('sha256').update(raw).digest('hex');
  await fs.writeFile(evidence+'/'+s.name+'.png',raw);
  const variants=[];
  for(const width of [480,800,1200]){const src='/media/owner-curated/'+s.name+'-'+width+'.webp';const buffer=await sharp(raw).resize({width,withoutEnlargement:true}).webp({quality:84,effort:5}).toBuffer();await fs.writeFile('public'+src,buffer);variants.push({src,width:Math.min(width,meta.width),bytes:buffer.length});}
  const qualifier=s.group==='watch'?'Illustrative watch concept; not actual inventory, an exact model reference or authentication evidence.':s.group==='estate'?'Illustrative estate-style jewelry; not authenticated age, actual inventory or grading evidence.':'Illustrative jewelry image; not actual inventory or a representation of verified origin, purity or grading.';
  assignments[s.path]={key:s.name,src:variants.at(-1).src,alt:s.alt,width:meta.width,height:meta.height,variants,caption:s.alt+'. '+qualifier,provenance:{generated:true,mode:'built-in image_gen',sourceSha256:sha,promptFile:s.promptFile||evidence+'/diamond-batch-2-prompts-and-assets.json',approval:'Owner requested distinct top-quality luxury jewelry, large diamond, Rolex, Patek Philippe and Cartier images throughout the guides.'}};
 }
 await fs.writeFile('src/data/article-image-assignments.json',JSON.stringify(assignments,null,2));
 await fs.writeFile(evidence+'/curated-applied-manifest.json',JSON.stringify(assets.map(s=>({name:s.name,path:s.path,savedOriginal:evidence+'/'+s.name+'.png',alt:s.alt,variants:assignments[s.path].variants})),null,2));
 console.log(JSON.stringify({prepared:assets.length,totalAssigned:Object.keys(assignments).length}));
}else throw new Error('Choose --review-sheets or --apply');
