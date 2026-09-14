import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {load} from 'cheerio';
import {assertAddressIntegrity,businessProfile as business} from '../src/lib/address-integrity.mjs';

const origin='https://cash4goldanddiamond.com';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const byPath=new Map(pages.map(p=>[p.path,p]));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>s.replace(/\s+/g,' ').trim();
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const source={
 metal:{title:'FTC: understanding precious-metal jewelry markings',url:'https://consumer.ftc.gov/articles/buying-platinum-gold-and-silver-jewelry'},
 purity:{title:'World Gold Council: gold purity, karat and fineness',url:'https://www.gold.org/about-gold/about-gold-jewellery'},
 price:{title:'World Gold Council: dated gold-price reference data',url:'https://www.gold.org/goldhub/data/gold-prices'},
 mass:{title:'NIST: mass units and troy-ounce conversion',url:'https://www.nist.gov/pml/owm/si-units-mass'},
 diamond:{title:'GIA: diamond quality factors',url:'https://www.gia.edu/diamond-quality-factor'}
};
const specs=[
 {path:'/gold-buyer-downtown-los-angeles/',file:'downtown-gold-buyer.html',action:'rewrite',reason:'Unsupported 60–90% payout expectations, universal free-appraisal claims, unverified reputation claims, and blanket claims against online buyers obscured the useful offer-comparison intent.',description:'Compare gold buyers in Downtown Los Angeles by tested purity, net weight, itemized offers, and payment terms. Prepare scrap, Cuban chains, jewelry, and coins.',answer:'Compare gold buyers using the same items, tested purity, weight units, final purchase amount, and payment terms. Ask how diamonds and collectible pieces are considered.',keywords:['compare gold buying offers','Downtown LA Jewelry District','large gold collections'],sources:[source.metal,source.purity],related:['/gold-valuation-how-gold-is-valued/','/best-gold-bracelet-buyers-los-angeles-2026/','/gold-coins-buyer-near-me-downtown/'],imageAfter:'Ask for the weight, purity, and offer basis'},
 {path:'/best-gold-bracelet-buyers-los-angeles-2026/',file:'gold-bracelets.html',action:'rewrite',reason:'Removed unsupported competitor ratings, invented comparative research, misleading FTC fraud attribution, cash-as-solvency claims, and incorrect blanket advice that antique bracelet condition hardly matters.',description:'Sell Cuban bracelets, diamond-set gold, bangles, and broken jewelry in Downtown LA. Learn how weight, purity, stones, and condition affect a purchase offer.',answer:'A gold-bracelet offer depends on tested purity, net metal weight, construction, condition, and any diamonds. Bring Cuban links, bangles, and broken pieces for evaluation.',keywords:['sell Cuban bracelet Los Angeles','diamond-set gold bracelets','broken gold bracelets','heavy gold jewelry'],sources:[source.metal,source.diamond],related:['/best-14k-gold-chain-2026-top-5-ranked/','/selling-scrap-gold-your-ultimate-guide-to-maximizing-value/','/gold-valuation-how-gold-is-valued/'],imageAfter:'Broken, vintage, and signed bracelets need different attention',heavyHero:true},
 {path:'/14k-gold-price-per-gram-los-angeles/',file:'14k-price-per-gram.html',action:'rewrite',reason:'Removed a run of repetitive exact-keyword sentences and repeated conclusions; retained the useful valuation intent with a precise net-alloy-weight formula, nominal 14K versus 585 distinction, unit conversion, and worked examples.',description:'Estimate 14K gold value per gram using purity, net metal weight, and a dated gold-price reference. Compare jewelry offers in Downtown Los Angeles.',answer:'Estimate 14K gold content using net alloy weight × 14/24, then multiply by the pure-gold price per gram. The result is a metal-content estimate, not a purchase offer.',keywords:['14K gold melt value','585 gold purity','14K gold weight calculation','sell 14K gold Los Angeles'],sources:[source.purity,source.mass,source.price],related:['/gold-valuation-how-gold-is-valued/','/best-14k-gold-chain-2026-top-5-ranked/','/white-gold-guide/'],imageAfter:'A worked example without a stale dollar price'},
 {path:'/gold-valuation-how-gold-is-valued/',action:'improve',reason:'Retained the substantive explanation of purity, hallmarks, testing, condition, and offers. Clarified net alloy weight in calculations and replaced the additive gold-plus-stone-plus-resale expression to avoid double counting.',description:'Learn how gold buyers assess purity, net metal weight, stones, and jewelry resale potential. Understand the calculation before comparing purchase offers.',answer:'Gold valuation starts with tested purity, net metal weight, and a dated price reference. Stones, condition, and resale potential can also affect an offer.',keywords:['net gold weight','karat and fineness','gold testing','jewelry resale value'],sources:[source.purity,source.price,source.mass],related:['/14k-gold-price-per-gram-los-angeles/','/selling-scrap-gold-your-ultimate-guide-to-maximizing-value/']}
];
const reportPath='migration/substantive-editorial-review.json';
let previous={reviews:[]};try{previous=JSON.parse(await fs.readFile(reportPath,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
for(const spec of specs){const old=previous.reviews.find(r=>r.path===spec.path);if(old&&sha(byPath.get(spec.path).html)!==old.afterSha256)throw Error('Preserve newer article edits before reapplying review: '+spec.path);}
try{await fs.writeFile('migration/editorial-before-home-resume.json',JSON.stringify(specs.map(s=>byPath.get(s.path)),null,2),{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;}
const reviewedAt=new Date().toISOString(),reviews=[];
const figure=(image,hero)=>`<figure class="${hero?'article-hero':'article-inline-image'}"><img src="${esc(image.variants.at(-1).src)}" srcset="${esc(image.variants.map(v=>v.src+' '+v.width+'w').join(', '))}" sizes="(max-width: 900px) 92vw, 850px" width="${image.width}" height="${image.height}" alt="${esc(image.alt)}" loading="${hero?'eager':'lazy'}" decoding="async"${hero?' fetchpriority="high"':''}><figcaption>${esc(image.alt)}.</figcaption></figure>`;
function refreshMeta(p){const image=p.editorial.images[0];const values={'og:title':p.title,'og:description':p.description,'og:image':origin+image.variants.at(-1).src,'og:image:alt':image.alt,'twitter:title':p.title,'twitter:description':p.description,'twitter:image':origin+image.variants.at(-1).src,'twitter:card':'summary_large_image'};p.meta=p.meta.filter(m=>!Object.hasOwn(values,m.name));p.meta.push(...Object.entries(values).map(([name,content])=>({name,content})));p.schema=p.schema.map(raw=>{const json=JSON.parse(raw);for(const node of json['@graph']||[json]){if(node['@type']==='BlogPosting')Object.assign(node,{headline:p.heading,name:p.heading,description:p.description,image:values['og:image'],dateModified:p.modifiedAt,keywords:[p.editorial.focusKeyword,...p.editorial.secondaryKeywords].join(', ')});}return JSON.stringify(json);});}
for(const spec of specs){
 const p=byPath.get(spec.path),before=p.html,previousModifiedAt=p.modifiedAt;
 if(spec.path==='/14k-gold-price-per-gram-los-angeles/')spec.imageAfter='Worked example: a 25-gram 14K bracelet';
 if(spec.heavyHero)p.editorial.images[0]=structuredClone(byPath.get('/gold-buyer-downtown-los-angeles/').editorial.images[0]);
 const $=load(spec.file?await fs.readFile('src/data/editorial-reviews/'+spec.file,'utf8'):p.html,{},false);
 $('.article-toc,.article-next-step,.article-resources,.article-related,.article-takeaway').remove();
 if(!spec.file){
  $('p').each((i,e)=>{const text=norm($(e).text());if(text==='Item weight × gold purity = approximate pure-gold weight')$(e).text('Net alloy weight × gold purity = approximate pure-gold weight');if(text==='For example, imagine a piece weighs 20 grams and tests as 18K.')$(e).text('For example, imagine the gold alloy in a piece weighs 20 grams after accounting for stones and non-gold components, and tests as 18K.');if(text==='Gold value + gemstone value + potential jewelry/resale value')$(e).text('Consider metal content, stones, and the resale value of the complete piece without counting the same value twice.');});
 }
 p.description=spec.description;p.modifiedAt=reviewedAt;p.editorial={...p.editorial,description:spec.description,answer:spec.answer,secondaryKeywords:spec.keywords,sources:spec.sources,related:spec.related};
 $.root().prepend(`<p class="article-takeaway">${esc(spec.answer)}</p>`);
 if(spec.file){$('.article-takeaway').after(figure(p.editorial.images[0],true));const heading=$('h2').filter((i,e)=>$(e).text()===spec.imageAfter).first();if(!heading.length)throw Error('Missing image placement');heading.next('p').after(figure(p.editorial.images[1],false));}
 $.root().append(`<aside class="article-next-step"><h2>Plan your evaluation in Downtown Los Angeles</h2><p>We buy scrap gold, Cuban chains and bracelets with or without diamonds, gold coins, and silver coins. Single pieces and large quantities are welcome. Payment is available by cash, bank wire, or business check.</p><p><a href="/sell-your-golds/">Gold buying in Downtown Los Angeles</a> · ${esc(business.address)}</p><a class="elementor-button" href="tel:3106631340">Call 310-663-1340 ↗</a></aside><section class="article-resources"><h2>Further reading from industry sources</h2><ul>${spec.sources.map(s=>`<li><a href="${s.url}">${esc(s.title)}</a></li>`).join('')}</ul></section><section class="article-related"><h2>Related guides</h2><ul>${spec.related.map(path=>`<li><a href="${path}">${esc(byPath.get(path).heading)}</a></li>`).join('')}</ul></section>`);
 const ids=new Set();$('[id]').each((i,e)=>{const id=$(e).attr('id');if(ids.has(id))$(e).removeAttr('id');else ids.add(id);});
 $('h2,h3,h4').each((i,e)=>{if($(e).attr('id'))return;const base=slug($(e).text());let id=base,n=1;while(ids.has(id))id=base+'-'+(++n);ids.add(id);$(e).attr('id',id);});
 const headings=$('h2').filter((i,e)=>!$(e).closest('aside,.article-resources,.article-related').length).toArray();
 $('.article-hero').first().after(`<nav class="article-toc" aria-label="In this guide"><p>In this guide</p><ul>${headings.map(e=>`<li><a href="#${$(e).attr('id')}">${esc($(e).text())}</a></li>`).join('')}</ul></nav>`);
 p.html=$.html();p.sections=[];p.images=$('img').map((i,e)=>({...e.attribs})).get();p.sourceText=norm($.text());if(p.html===before)p.modifiedAt=previousModifiedAt;refreshMeta(p);
 const old=previous.reviews.find(r=>r.path===p.path);
 reviews.push({path:p.path,decision:spec.action,reason:spec.reason,reviewedAt,bodyReadInFull:true,originalPublishedAt:p.publishedAt,beforeSha256:old?.beforeSha256||sha(before),afterSha256:sha(p.html),wordsBefore:old?.wordsBefore||norm(load(before).text()).split(/\s+/).length,wordsAfter:p.sourceText.split(/\s+/).length,images:p.images.length,sources:spec.sources.map(s=>s.url)});
}
let synced=0;
for(const p of pages.filter(p=>!p.isArticle)){
 const $=load(p.html,{},false);let changed=false;
 for(const spec of specs){const article=byPath.get(spec.path),image=article.editorial.images[0];const cards=$('.blog-card').filter((i,e)=>$(e).attr('href')===spec.path).add($('article').filter((i,e)=>$(e).find('h2 a').attr('href')===spec.path));cards.each((i,e)=>{const card=$(e);card.find('h2 a,h3').text(article.heading);card.find('p').first().text(article.description);card.find('img').attr({src:image.variants[0].src,srcset:image.variants.map(v=>`${v.src} ${v.width}w`).join(', '),sizes:'(max-width: 600px) 90vw, 400px',width:String(image.width),height:String(image.height),alt:image.alt,loading:'lazy',decoding:'async'}).removeAttr('fetchpriority');synced++;changed=true;});}
 if(changed){p.html=$.html();p.sections=[];}
}
assertAddressIntegrity(pages);
const briefs=JSON.parse(await fs.readFile('src/data/article-optimization.json','utf8'));for(const spec of specs)briefs[spec.path]=byPath.get(spec.path).editorial;
const revisions=JSON.parse(await fs.readFile('migration/editorial-revisions.json','utf8')).filter(r=>r.type!=='substantive-home-review');revisions.push(...reviews.map(r=>({path:r.path,type:'substantive-home-review',decision:r.decision,reason:r.reason,sourceArchive:'migration/editorial-before-home-resume.json'})));
await fs.writeFile('src/data/pages.json',JSON.stringify(pages));
await fs.writeFile('src/data/article-optimization.json',JSON.stringify(briefs,null,2));
await fs.writeFile('migration/editorial-revisions.json',JSON.stringify(revisions,null,2));
const combined=[...previous.reviews.filter(r=>!specs.some(s=>s.path===r.path)),...reviews];
await fs.writeFile(reportPath,JSON.stringify({reviewedAt,totalArticles:pages.filter(p=>p.isArticle).length,completeBodyReviews:combined.length,remaining:pages.filter(p=>p.isArticle&&!combined.some(r=>r.path===p.path)).map(p=>p.path),reviews:combined,scope:'Manual substantive body review. Earlier automated metadata/image checks are a separate first pass.'},null,2));
console.log(JSON.stringify({bodyReviews:reviews.length,rewritten:reviews.filter(r=>r.decision==='rewrite').length,improved:reviews.filter(r=>r.decision==='improve').length,archiveCardsSynced:synced,remainingBodyReviews:109-combined.length},null,2));
