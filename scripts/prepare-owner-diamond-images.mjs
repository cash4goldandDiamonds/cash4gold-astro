import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const source='C:/Users/judit/Documents/Codex/2026-09-09/realtime-voice-chat/outputs/diamond-images';
const specs=[
 {path:'/large-diamond-buyer-los-angeles/',name:'large-loose-diamond-collection',alt:'Large pear, emerald-cut, round and cushion-cut polished diamonds on slate-blue paper'},
 {path:'/where-to-sell-fine-jewelry-downtown-los-angeles/',name:'emerald-diamond-eternity-band',alt:'Substantial platinum eternity band with large emerald-cut diamonds'},
 {path:'/best-18k-gold-rings-2026-ranked/',name:'round-diamond-gold-eternity-band',alt:'Heavy yellow-gold eternity band with large round brilliant diamonds'},
 {path:'/3-5-carat-oval-diamond-ring-buying-step-by-step-guide/',name:'large-oval-diamond-platinum-ring',alt:'Large oval diamond in a platinum ring with tapered baguette side stones'}
];
await fs.mkdir('public/media/owner-diamonds',{recursive:true});
await fs.mkdir('migration/source-evidence/owner-approved-images',{recursive:true});
let assignments={};try{assignments=JSON.parse(await fs.readFile('src/data/article-image-assignments.json','utf8'));}catch{}
const provenance=JSON.parse(await fs.readFile(source+'/prompts-and-assets.json','utf8'));
for(const spec of specs){
 const raw=await fs.readFile(source+'/'+spec.name+'.png'),metadata=await sharp(raw).metadata();
 await fs.writeFile('migration/source-evidence/owner-approved-images/'+spec.name+'.png',raw);
 const variants=[];
 for(const width of [480,800,1200]){const file='/media/owner-diamonds/'+spec.name+'-'+width+'.webp';const buffer=await sharp(raw).resize({width,withoutEnlargement:true}).webp({quality:84,effort:5}).toBuffer();await fs.writeFile('public'+file,buffer);variants.push({width,src:file,bytes:buffer.length});}
 assignments[spec.path]={key:spec.name,src:variants.at(-1).src,alt:spec.alt,width:metadata.width,height:metadata.height,variants,caption:spec.alt+'. Illustrative jewelry image; not actual inventory or a grading representation.',provenance:{generated:true,sourceSha256:crypto.createHash('sha256').update(raw).digest('hex'),approval:'Owner explicitly requested using all four generated photographs on the selling-guides page.'}};
}
await fs.writeFile('migration/source-evidence/owner-approved-images/prompts-and-assets.json',JSON.stringify(provenance,null,2));
await fs.writeFile('src/data/article-image-assignments.json',JSON.stringify(assignments,null,2));
console.log(JSON.stringify(specs.map(s=>({path:s.path,image:s.name,variants:assignments[s.path].variants})),null,2));
