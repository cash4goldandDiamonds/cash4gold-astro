import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const evidence='migration/source-evidence/owner-approved-images';
const generated=JSON.parse(await fs.readFile(evidence+'/gold-prompts-and-assets.json','utf8'));
const assignments=JSON.parse(await fs.readFile('src/data/article-image-assignments.json','utf8'));
const specs=[
 {path:'/best-14k-gold-chain-2026-top-5-ranked/',name:'heavy-cuban-chain-box-clasp',alt:'Heavy yellow-gold Cuban links with a substantial box clasp on charcoal velvet'},
 {path:'/selling-scrap-gold-your-ultimate-guide-to-maximizing-value/',name:'scrap-gold-bracelets-and-broken-chains',alt:'A tray of worn yellow-gold bracelets, bent bangles, earrings, rings and chains'},
 {path:'/best-24k-gold-chains-2026/',name:'thick-rope-chain-gold-necklace',alt:'Thick yellow-gold rope necklace with its clasp on pale limestone'},
 {path:'/best-22k-gold-jewelry-2026-top-5-buyers-sellers-ranked/',name:'wide-gold-cuff-and-heavy-bangles',alt:'Wide polished yellow-gold cuff and two substantial gold bangles on green suede'}
];
await fs.mkdir('public/media/owner-gold',{recursive:true});
for(const spec of specs){
 const source=generated.find(p=>p.name===spec.name);if(!source?.visuallyReviewed)throw new Error('Image must be reviewed before use: '+spec.name);
 const raw=await fs.readFile(source.source),meta=await sharp(raw).metadata();
 await fs.writeFile(evidence+'/'+spec.name+'.png',raw);
 const variants=[];
 for(const width of [480,800,1200]){const src='/media/owner-gold/'+spec.name+'-'+width+'.webp';const buffer=await sharp(raw).resize({width,withoutEnlargement:true}).webp({quality:84,effort:5}).toBuffer();await fs.writeFile('public'+src,buffer);variants.push({width:Math.min(width,meta.width),src,bytes:buffer.length});}
 assignments[spec.path]={key:spec.name,src:variants.at(-1).src,alt:spec.alt,width:meta.width,height:meta.height,variants,caption:spec.alt+'. Illustrative jewelry image; appearance does not establish purity or actual inventory.',provenance:{generated:true,mode:'generate',sourceSha256:crypto.createHash('sha256').update(raw).digest('hex'),promptFile:evidence+'/gold-prompts-and-assets.json',approval:'Owner authorized distinct high-quality heavy gold, Cuban chain, scrap-gold and jewelry image replacements.'}};
}
await fs.writeFile('src/data/article-image-assignments.json',JSON.stringify(assignments,null,2));
console.log(JSON.stringify(specs.map(s=>({path:s.path,image:s.name,variants:assignments[s.path].variants})),null,2));
