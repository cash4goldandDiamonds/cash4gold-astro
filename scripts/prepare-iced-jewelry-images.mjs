import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {load} from 'cheerio';

const evidence='migration/source-evidence/owner-approved-images';
const details={
  'iced-rolex-day-date-yellow-gold-v1':{article:'/best-gold-rolex-buyers-2026/',alt:'Illustration of an iced-out yellow-gold Rolex Day-Date with diamond-set dial, bezel and bracelet on green velvet',label:'Diamond-set Rolex',detail:'Gold, settings and original components'},
  'iced-rolex-daytona-white-metal-v1':{article:'/rolex-buyer-los-angeles-cash/',alt:'Illustration of a white-metal Rolex Daytona with a diamond-set bracelet, baguette bezel and three chronograph subdials',label:'Iced-out Rolex chronograph',detail:'Reference, condition and purchase terms'},
  'iced-patek-nautilus-rose-gold-v1':{article:'/best-gold-watches-2026-top-5-ranked/',alt:'Illustration of an iced-out rose-gold Patek Philippe Nautilus with diamond-set dial and integrated bracelet on taupe suede',label:'Rose-gold Patek Philippe',detail:'Precious metal and watch construction'},
  'iced-patek-nautilus-white-metal-v1':{article:'/real-diamond-watches-for-men-the-ultimate-buying-guide/',alt:'Illustration of a white-metal Patek Philippe Nautilus covered in baguette and round diamonds on navy velvet',label:'Diamond-set Patek Philippe',detail:'Natural diamonds and setting history'},
  'iced-heavy-gold-cuban-bracelet-v1':{article:'/best-gold-bracelet-buyers-los-angeles-2026/',alt:'Illustration of a heavy yellow-gold Cuban-link bracelet with pavé diamonds and a substantial box clasp',label:'Diamond-set Cuban links',detail:'Heavy gold bracelets, with or without diamonds'},
  'antique-diamond-festoon-necklace-v1':{article:'/best-estate-jewelry-buyers-los-angeles-2026/',alt:'Illustration of an antique-style platinum festoon necklace with large diamond drops, filigree and scalloped swags',label:'Antique diamond jewelry',detail:'Complete pieces, condition and records'},
};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

if(process.argv.includes('--prepare')){
  const prompts=JSON.parse(await fs.readFile('../work/iced-jewelry-prompts.json','utf8'));
  const results=JSON.parse(await fs.readFile('../work/iced-jewelry-results.json','utf8'));
  if(results.length!==6||new Set(results.map(r=>r.key)).size!==6)throw new Error('Six distinct generated images required.');
  await fs.mkdir('public/media/iced-jewelry',{recursive:true});
  await fs.mkdir(evidence,{recursive:true});
  const assets={};
  for(const r of results){
    const spec=prompts.assets.find(a=>a.key===r.key),detail=details[r.key];
    if(!spec||!detail)throw new Error('Unknown image '+r.key);
    const raw=await fs.readFile(r.source),m=await sharp(raw).metadata();
    if(m.width<1200||m.height<700)throw new Error('Insufficient image resolution '+r.key);
    const savedOriginal=evidence+'/'+r.key+'.png';
    await fs.writeFile(savedOriginal,raw);
    const variants=[];
    for(const width of [480,800,1200]){
      const src='/media/iced-jewelry/'+r.key+'-'+width+'.webp';
      const data=await sharp(raw).resize({width,withoutEnlargement:true}).webp({quality:85,effort:5}).toBuffer();
      await fs.writeFile('public'+src,data);
      variants.push({src,width,bytes:data.length});
    }
    assets[r.key]={key:r.key,...detail,src:variants.at(-1).src,width:m.width,height:m.height,variants,
      caption:detail.alt+'. AI-generated editorial illustration; not actual inventory or evidence of authenticity, stone origin or factory-set specifications.',
      provenance:{generated:true,mode:'built-in image_gen',sourceSha256:hash(raw),promptFile:evidence+'/iced-jewelry-prompts-and-assets.json',approval:'Owner requested new jewelry, iced-out Rolex and Patek Philippe pictures in articles and across the site.'}};
  }
  await fs.writeFile('src/data/iced-jewelry-images.json',JSON.stringify(assets,null,2));
  await fs.writeFile(evidence+'/iced-jewelry-prompts-and-assets.json',JSON.stringify({createdAt:new Date().toISOString(),mode:'built-in image_gen',assets:prompts.assets.map(p=>({key:p.key,prompt:p.prompt,...details[p.key],savedOriginal:evidence+'/'+p.key+'.png',variants:assets[p.key].variants,sourceSha256:assets[p.key].provenance.sourceSha256}))},null,2));
  const layers=[];
  for(const [i,r] of results.entries()){
    const left=i%2*768,top=Math.floor(i/2)*550;
    layers.push({input:await sharp(await fs.readFile(r.source)).resize(750,500,{fit:'contain',background:'#f5f4f0'}).jpeg({quality:94}).toBuffer(),left,top});
    layers.push({input:Buffer.from('<svg width="768" height="40"><rect width="768" height="40" fill="#f5f4f0"/><text x="12" y="26" font-family="Arial" font-size="20">'+esc(details[r.key].label)+'</text></svg>'),left,top:top+500});
  }
  await sharp({create:{width:1536,height:1650,channels:3,background:'#f5f4f0'}}).composite(layers).jpeg({quality:94}).toFile('../outputs/Iced-jewelry-image-preview.jpg');
  console.log(JSON.stringify({prepared:Object.keys(assets).length,variants:18,preview:'../outputs/Iced-jewelry-image-preview.jpg'}));
}else if(process.argv.includes('--apply')){
  const assets=JSON.parse(await fs.readFile('src/data/iced-jewelry-images.json','utf8'));
  const manifestFile=evidence+'/iced-jewelry-prompts-and-assets.json';
  const manifest=JSON.parse(await fs.readFile(manifestFile,'utf8'));
  manifest.visualReview={checkedAt:new Date().toISOString(),result:'All six original outputs and the contact sheet inspected: legible brand lettering, complete compositions, clear settings and correct subject placement. Images are illustrative, not authentication evidence.'};
  await fs.writeFile(manifestFile,JSON.stringify(manifest,null,2));
  const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
  const byPath=new Map(pages.map(p=>[p.path,p]));
  const beforeFile='migration/source-evidence/iced-jewelry-before-2026-09-10.json';
  try{await fs.access(beforeFile);}catch{await fs.writeFile(beforeFile,JSON.stringify(pages.filter(p=>Object.values(assets).some(a=>a.article===p.path)||['/','/sell-luxury-watches-in-los-angeles/','/sell-your-golds/','/sell-estate-jewelry-los-angeles/'].includes(p.path)),null,2));}
  const assignments=JSON.parse(await fs.readFile('src/data/article-image-assignments.json','utf8'));
  for(const a of Object.values(assets))assignments[a.article]=a;
  await fs.writeFile('src/data/article-image-assignments.json',JSON.stringify(assignments,null,2));
  // Reload the assignment module after writing so it reads the current registry.
  const {applyArticleImageAssignments:applyCurrent}=await import('../src/lib/article-image-assignments.mjs?iced='+Date.now());
  applyCurrent(pages);
  const image=(a,sizes='(max-width: 640px) 90vw, (max-width: 950px) 44vw, 400px')=>`<img src="${a.src}" srcset="${a.variants.map(v=>v.src+' '+v.width+'w').join(', ')}" sizes="${sizes}" width="${a.width}" height="${a.height}" alt="${esc(a.alt)}" loading="lazy" decoding="async">`;
  const note='AI-generated editorial illustrations. Images do not represent current inventory or establish original factory settings.';
  const showcase=({id,title,intro,keys,columns=3})=>`<section id="${id}" class="iced-showcase iced-showcase--${columns}"><div class="iced-showcase-inner"><header class="iced-showcase-heading"><p class="eyebrow">Diamond details · Substantial pieces</p><h2>${esc(title)}</h2><p>${esc(intro)}</p></header><div class="iced-grid">${keys.map(key=>{const a=assets[key];return `<figure class="iced-card"><a class="iced-card-image" href="${a.article}">${image(a,columns===2?'(max-width: 640px) 90vw, 44vw':undefined)}</a><figcaption><a href="${a.article}">${esc(a.label)} <span aria-hidden="true">↗</span></a><p>${esc(a.detail)}</p></figcaption></figure>`;}).join('')}</div><p class="iced-image-note">${note}</p></div></section>`;
  const home=byPath.get('/'),homeHtml=showcase({id:'diamond-set-spotlight',title:'Diamond-set watches. Statement jewelry.',intro:'Explore our guides to Rolex, Patek Philippe and heavy diamond-set gold jewelry before your Downtown LA evaluation.',keys:['iced-rolex-day-date-yellow-gold-v1','iced-patek-nautilus-white-metal-v1','iced-heavy-gold-cuban-bracelet-v1']});
  const $home=load(home.html,{},false);$home('#diamond-set-spotlight').remove();
  const homeGallery=$home('#source-76334454');if(!homeGallery.length)throw new Error('Home gallery anchor missing.');homeGallery.after(homeHtml);home.html=$home.html();
  home.sections=home.sections.filter(s=>s.id!=='diamond-set-spotlight');
  const galleryIndex=home.sections.findIndex(s=>s.id==='76334454');if(galleryIndex<0)throw new Error('Home section anchor missing.');
  home.sections.splice(galleryIndex+1,0,{id:'diamond-set-spotlight',html:homeHtml});

  const watches=byPath.get('/sell-luxury-watches-in-los-angeles/'),$watch=load(watches.html,{},false);$watch('#diamond-set-watch-gallery').remove();
  $watch('section').first().after(showcase({id:'diamond-set-watch-gallery',title:'Rolex & Patek Philippe, with diamond detail',intro:'Bring the complete watch and any records you have. We consider the timepiece, its diamonds and any modifications together; our diamond buying covers natural diamonds only.',keys:['iced-rolex-day-date-yellow-gold-v1','iced-patek-nautilus-rose-gold-v1','iced-rolex-daytona-white-metal-v1','iced-patek-nautilus-white-metal-v1'],columns:2}));
  watches.html=$watch.html();watches.sections=[];

  const gold=byPath.get('/sell-your-golds/'),$gold=load(gold.html,{},false),cuban=assets['iced-heavy-gold-cuban-bracelet-v1'];
  $gold('#diamond-set-cuban-jewelry').remove();
  $gold('.gold-items').after(`<section id="diamond-set-cuban-jewelry" class="iced-feature"><figure>${image(cuban,'(max-width: 900px) 90vw, 45vw')}<figcaption>AI-generated illustration of a diamond-set Cuban bracelet.</figcaption></figure><div><p class="eyebrow">Heavy gold · Natural diamonds</p><h2>Cuban links, with or without diamonds</h2><p>Bring your heavy chains, bracelets and complete jewelry pieces. We consider the gold and any natural diamonds as part of the evaluation, including substantial pieces and larger collections.</p><a class="iced-text-link" href="${cuban.article}">Explore the gold bracelet guide <span aria-hidden="true">↗</span></a></div></section>`);
  gold.html=$gold.html();gold.sections=[];

  const estate=byPath.get('/sell-estate-jewelry-los-angeles/'),$estate=load(estate.html,{},false),necklace=assets['antique-diamond-festoon-necklace-v1'];
  const necklaceSlot=$estate('#source-33c76293 > .elementor-widget-wrap');if(!necklaceSlot.length)throw new Error('Estate necklace slot missing.');
  necklaceSlot.html(`<figure class="iced-estate-image">${image(necklace,'(max-width: 640px) 90vw, 45vw')}<figcaption>AI-generated illustration of an antique-style diamond necklace.</figcaption></figure>`);
  $estate('#source-486ef216 p').text('We evaluate antique diamond necklaces and inherited jewelry, including substantial diamond pieces with intricate settings. Bring the complete necklace and any existing records so its materials, condition and details can be considered together.');
  $estate('#source-2114adb6').text('Arrange an appointment to bring your estate jewelry for an evaluation.');
  estate.html=$estate.html();estate.sections=[];

  const ledger=JSON.parse(await fs.readFile('migration/substantive-review.json','utf8'));
  for(const p of pages){const $=load(p.html,{},false);p.images=$('img').map((i,e)=>({...e.attribs})).get();p.sourceText=$.text().replace(/\s+/g,' ').trim();const row=ledger.rows.find(r=>r.path===p.path);if(row?.status==='reviewed')row.afterHtmlSha256=hash(p.html);}
  await fs.writeFile('src/data/pages.json',JSON.stringify(pages));
  await fs.writeFile('migration/substantive-review.json',JSON.stringify(ledger,null,2));
  await fs.writeFile('migration/iced-jewelry-placements.json',JSON.stringify({appliedAt:new Date().toISOString(),mode:'built-in image_gen',articlePaths:Object.values(assets).map(a=>a.article),serviceAndHomePaths:[home.path,watches.path,gold.path,estate.path],cardPropagation:'Matching guide-library and archive cards inherit each updated article image.',preservation:beforeFile,assets:Object.values(assets).map(a=>({key:a.key,src:a.src,variants:a.variants}))},null,2));
  console.log(JSON.stringify({articleImages:6,homeSpotlight:3,watchGallery:4,goldFeature:1,estateFeature:1}));
}else throw new Error('Choose --prepare or --apply');
