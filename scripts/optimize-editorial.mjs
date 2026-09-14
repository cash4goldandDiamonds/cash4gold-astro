import fs from 'node:fs/promises';
import {load} from 'cheerio';
import sharp from 'sharp';
import {applyAddressCorrections,assertAddressIntegrity,businessProfile as business} from '../src/lib/address-integrity.mjs';
import {priorityGoldArticles} from '../src/data/priority-gold-articles.mjs';

// This legacy first-pass generator starts from the original editorial baseline.
// Do not let it silently erase later, individually reviewed article bodies.
try {
 const review=JSON.parse(await fs.readFile('migration/substantive-editorial-review.json','utf8'));
 if(review.reviews?.length)throw new Error('Substantive article edits are present. Edit the current content or its reviewed HTML sources; this baseline generator would overwrite them. See migration/substantive-editorial-review.json.');
} catch(error) { if(error.code!=='ENOENT')throw error; }

const origin='https://cash4goldanddiamond.com';
const baseline='migration/editorial-baseline.json';
try{await fs.access(baseline);}catch{await fs.copyFile('src/data/pages.json',baseline);}
const pages=applyAddressCorrections(JSON.parse(await fs.readFile(baseline,'utf8')));
const audit=JSON.parse(await fs.readFile('migration/blog-image-audit.json','utf8'));
const goldBriefs=JSON.parse(await fs.readFile('src/data/gold-article-briefs.json','utf8'));
const redirects=JSON.parse(await fs.readFile('src/data/redirects.json','utf8'));
const byPath=new Map(pages.map(p=>[p.path,p]));
const revisions=[],linkChanges=[],removedClaims=[],imageManifest={};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>s.replace(/\s+/g,' ').trim();
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const sources={
 gold:{title:'World Gold Council: gold jewelry, purity and color',url:'https://www.gold.org/about-gold/about-gold-jewellery'},
 metal:{title:'FTC: buying platinum, gold, and silver jewelry',url:'https://consumer.ftc.gov/articles/buying-platinum-gold-and-silver-jewelry'},
 price:{title:'World Gold Council: gold-price reference data',url:'https://www.gold.org/goldhub/data/gold-prices'},
 coins:{title:'U.S. Mint: gold and silver bullion coin programs',url:'https://www.usmint.gov/coins-precious-metal-coins/bullion-coin-programs/'},
 diamond:{title:'GIA: diamond quality factors',url:'https://www.gia.edu/diamond-quality-factor'},
 appraisal:{title:'GIA: understanding jewelry appraisals',url:'https://4cs.gia.edu/en-us/blog/appraisal-tips/'},
 estate:{title:'GIA: tips for purchasing estate jewelry',url:'https://4cs.gia.edu/en-us/blog/tips-for-purchasing-estate-jewelry/'},
 sapphire:{title:'GIA: sapphire quality factors',url:'https://www.gia.edu/sapphire-quality-factor'},
 emerald:{title:'GIA: emerald quality factors',url:'https://www.gia.edu/emerald-quality-factor'},
 watch:{title:'Rolex: watch care and servicing',url:'https://www.rolex.com/en-us/watch-care-and-service'},
 rolex:{title:'Rolex: its Certified Pre-Owned program',url:'https://www.rolex.com/buying-a-rolex/rolex-certified-pre-owned'}
};
const groups={
 gold:{label:'Gold, scrap & coins',service:'/sell-your-golds/',serviceLabel:'gold buying in Downtown Los Angeles',sources:['gold','metal'],related:['/gold-valuation-how-gold-is-valued/','/selling-scrap-gold-your-ultimate-guide-to-maximizing-value/'],terms:['gold purity','gold jewelry value','selling gold in Los Angeles']},
 diamond:{label:'Diamonds',service:'/sell-your-diamonds-in-los-angeles/',serviceLabel:'selling diamonds in Los Angeles',sources:['diamond','appraisal'],related:['/4-cs-of-diamonds/','/how-to-know-if-diamonds-are-worth-selling/'],terms:['diamond quality','diamond evaluation','selling diamonds in Los Angeles']},
 watch:{label:'Rolex & luxury watches',service:'/sell-luxury-watches-in-los-angeles/',serviceLabel:'selling a luxury watch in Los Angeles',sources:['watch','rolex'],related:['/how-to-sell-a-rolex-watch-in-los-angeles/','/how-to-spot-a-fake-rolex/'],terms:['Rolex condition','watch documentation','Rolex buyer Los Angeles']},
 gemstone:{label:'Gemstones',service:'/sell-gemstones-for-cash-in-los-angeles/',serviceLabel:'gemstone evaluations in Los Angeles',sources:['appraisal','sapphire'],related:['/best-gemstone-ring-buyers-los-angeles/','/best-sapphire-diamond-jewelry-buyers-los-angeles/'],terms:['gemstone quality','gemstone jewelry evaluation','gemstone buyer Los Angeles']},
 estate:{label:'Estate & fine jewelry',service:'/sell-estate-jewelry-los-angeles/',serviceLabel:'selling estate jewelry in Los Angeles',sources:['estate','appraisal'],related:['/how-to-value-estate-jewelry-pieces/','/sell-inherited-jewelry-no-obligation/'],terms:['jewelry condition','estate jewelry evaluation','jewelry buyer Los Angeles']}
};
const verifiedReferenceUrls=new Set([...Object.values(sources).map(s=>s.url),'https://www.nist.gov/pml/owm/si-units-mass','https://www.lbma.org.uk/prices-and-data/lbma-gold-price']);
function groupFor(topic){if(/watch|day-date/.test(topic))return 'watch';if(/diamond|oval/.test(topic))return 'diamond';if(/gemstone|sapphire|emerald/.test(topic))return 'gemstone';if(/estate|jewelry|tiffany|cartier/.test(topic)&&topic!=='body-jewelry')return 'estate';return 'gold';}
function cleanTitle(title){return norm(title.replace(/\s*[-|]\s*Cash\s*4\s*Gold.*$/i,'').replace(/^Your Complete\s+|^Complete Guide to\s+/i,'').replace(/\bGIA Certified\b/gi,'GIA-Graded').replace(/\bBest\s+/gi,'').replace(/\bTop\s+\d+\s+(?:Best\s+)?/gi,'').replace(/\s*(?:2026)?\s*:\s*Top\s+(?:\d+|Brands|Models|Options).*$/i,'').replace(/\s*2026\s*(?::\s*)?(?:Top|Ranked).*$/i,'').replace(/\s*:\s*(?:Top\s+)?\d+\s+(?:Ranked|Reviewed|Buyers).*$/i,'').replace(/\s*:\s*(?:Top Brands|Top Models).*$/i,'').replace(/\s*Ranked(?:\s*&\s*Compared)?/gi,'').replace(/\s*2026(?=\s*[:|]|$)/g,'').replace(/\s*:\s*$/,'').replace(/\s*\|.*$/,'').replace(/\b(?:Same-Day Cash|Get Cash Today|Get Fair Cash Today)\b/gi,'Evaluation Guide').replace(/\bTop-Rated Reviews\b/gi,'Reading Reviews').replace(/\bBefore Investing\b/gi,'Before Buying'));}
const titleOverrides={
 '/how-to-sell-a-rolex-watch-in-los-angeles/':'How to Sell a Rolex Watch in Los Angeles',
 '/where-to-sell-your-antique-gold-jewelry-for-the-best-price-expert-guide/':'Selling Antique Gold Jewelry: Evaluating More Than Metal',
 '/best-10k-gold-rings-for-women-2026/':'10K Gold Rings for Women: Materials, Fit & Value',
 '/best-18k-gold-rings-for-women-2026/':'18K Gold Rings for Women: Design, Purity & Resale',
 '/best-yellow-gold-rings-2026/':'Yellow Gold Rings: Karat, Construction & Condition',
 '/best-10k-white-gold-rings-2026/':'10K White Gold Rings: Purity, Finish & Selling Guide',
 '/white-gold-guide/':'White Gold: Alloy, Finish & Jewelry Value',
 '/rolex-day-date-gold-market-analysis-2026-pricing-demand-trends/':'Gold Rolex Day-Date: Condition, Documentation & Resale',
 '/best-14k-solid-gold-rings-2026-top-buyers-sellers-ranked/':'14K Solid Gold Rings: Construction & Selling Guide',
 '/best-14k-gold-rings-2026/':'14K Gold Rings: Purity, Design & Value',
 '/best-14k-yellow-gold-rings-2026/':'14K Yellow Gold Rings: What to Check Before Buying',
 '/best-gold-rolex-buyers-2026/':'Selling a Gold Rolex: Choosing a Buyer',
 '/best-gold-rolex-watches-2026-ranked/':'Gold Rolex Watches: Comparing Models & Condition',
 '/best-gold-watches-2026-top-5-ranked/':'Gold Watches: Materials, Condition & Resale',
 '/best-gold-watches-for-women-2026/':'Gold Watches for Women: Size, Materials & Condition',
 '/best-14k-white-gold-rings-2026-top-5-ranked/':'14K White Gold Rings: Alloy, Finish & Value',
 '/best-18k-gold-rings-2026-ranked/':'18K Gold Rings: Purity, Condition & Value',
 '/best-black-hills-gold-rings-2026/':'Black Hills Gold Rings: Design, Markings & Resale',
 '/best-14k-white-gold-engagement-rings-2026/':'14K White Gold Engagement Rings: A Buyer’s Guide',
 '/best-14k-white-gold-diamond-rings-2026/':'14K White Gold Diamond Rings: Metal & Stone Quality',
 '/best-14k-gold-diamond-rings-2026/':'14K Gold Diamond Rings: Understanding Both Values',
 '/best-14k-gold-belly-rings-2026/':'14K Gold Belly Rings: Markings & Material Questions',
 '/best-10k-gold-mens-rings-2026-ranked/':'10K Gold Men’s Rings: Weight, Construction & Value',
 '/best-10k-gold-rings-2026-top-5-ranked/':'10K Gold Rings: Purity, Durability & Value',
 '/best-promise-rings-gold-2026/':'Gold Promise Rings: Materials, Design & Resale',
 '/gia-certified-lab-grown-diamonds-buyers-ranked-2026/':'Lab-Grown Diamond Reports & Resale Questions',
 '/gia-certified-diamonds-comparison-2026/':'GIA Diamond Reports: Comparing Stones Before Selling',
 '/best-certified-diamond-appraisers-los-angeles/':'Diamond Appraisals in Los Angeles: Reports & Valuations',
 '/best-price-for-diamonds-in-la/':'Comparing Diamond Offers in Los Angeles',
 '/best-price-diamonds-la/':'Diamond Resale Prices in LA: What Affects an Offer',
 '/best-diamond-buyers-los-angeles-2026/':'Choosing a Diamond Buyer in Los Angeles',
 '/best-place-to-sell-jewelry-los-angeles/':'Where to Sell Jewelry in Los Angeles: Compare Options',
 '/best-sapphire-diamond-jewelry-buyers-los-angeles/':'Selling Sapphire & Diamond Jewelry in Los Angeles',
 '/best-gemstone-ring-buyers-los-angeles/':'Selling Gemstone Rings in Los Angeles',
 '/best-estate-jewelry-buyers-los-angeles-2026/':'Choosing an Estate Jewelry Buyer in Los Angeles',
 '/what-makes-a-jewelry-buyer-trustworthy-los-angeles/':'What Makes a Jewelry Buyer Trustworthy?',
 '/trusted-jewelry-buyer-los-angeles-reviews/':'Jewelry Buyer Reviews in Los Angeles: What to Look For',
 '/best-inherited-jewelry-valuation-los-angeles-2026/':'Inherited Jewelry Valuation in Los Angeles',
 '/best-emerald-ring-gold-2026/':'Emerald Rings in Gold: Stone Quality & Evaluation',
 '/best-gold-diamond-buyers-2026-top-5-ranked/':'Selling Gold and Diamonds Together: Evaluating an Offer',
 '/best-1-carat-diamond-buyers-2026/':'Selling a 1 Carat Diamond: Reports, Quality & Offers',
 '/top-7-real-diamond-watches-for-men-how-to-choose-the-best-diamond-watches-for-men-in-2024/':'Diamond Watches for Men: Factory vs Aftermarket Settings',
 '/free-diamond-appraisal-same-day-cash/':'Diamond Purchase Evaluations vs Insurance Appraisals',
 '/round-brilliant-diamond-comparison-guide/':'Round Brilliant Diamonds: Cut Quality & Comparison',
 '/champagne-diamond-buying-guide-comparison/':'Champagne Diamonds: Color, Reports & Buying Questions'
};

const canonicalPairs=[];
for(const p of pages.filter(p=>p.isArticle&&/-2\/$/.test(p.path))){const first=byPath.get(p.path.replace(/-2\/$/,'/'));if(!first)continue;const grams=p=>{const a=norm(load(p.html).text()).toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/);return new Set(a.map((_,i)=>a.slice(i,i+5).join(' ')));};const a=grams(p),b=grams(first);const similarity=[...a].filter(x=>b.has(x)).length/new Set([...a,...b]).size;if(similarity>.95)canonicalPairs.push({path:p.path,preferred:first.path,similarity});}
const preferred=path=>canonicalPairs.find(x=>x.path===path)?.preferred||path;
const briefs={};
for(const p of pages.filter(p=>p.isArticle)){
 const item=audit.posts.find(a=>a.path===p.path);if(!item)throw new Error('No image review: '+p.path);
 const group=groupFor(item.topic),config=groups[group],basePath=preferred(p.path);
 const custom=goldBriefs[basePath];
 const title=custom?.[0]||titleOverrides[basePath]||cleanTitle(p.heading);
 const keyword=custom?.[1]||title.split(/[:|?]/)[0].trim();
 const introduction=custom?.[2]||({
  watch:'A watch evaluation considers the exact model, condition, service history, and documentation. Original and aftermarket components can affect the offer, so bring the watch and any records you already have.',
  diamond:'Consider the diamond’s quality and report alongside its setting and condition. A grading report, an insurance appraisal, and a purchase offer answer different questions; compare the information relevant to your decision.',
  gemstone:'Ask how the gemstone, any treatments, the setting, and supporting reports affect the evaluation. Inspect the actual piece and keep a purchase offer separate from an insurance replacement value.',
  estate:'Gather the jewelry and any maker information or paperwork you already have. An evaluation should consider the materials, condition, and documentation before you agree to a sale.',
  gold:'Metal content, weight, construction, and condition all matter when evaluating gold jewelry. Any diamonds or other stones should be considered separately from a pure-gold estimate.'
 }[group]);
 const description=custom?`${title.replace(/[.?]$/,'')}. ${custom[2].split(/(?<=[.!?])\s/)[0]}`:`${title.replace(/[.?]$/,'')}. Understand ${group==='watch'?'condition, documentation and resale':group==='diamond'?'quality, reports and purchase offers':group==='gemstone'?'stone quality, reports and evaluation':'materials, condition and selling options'} with our practical guide.`;
 const refs=item.topic==='gold-coins'?['coins','price']:item.topic==='emerald'?['emerald','appraisal']:item.topic==='sapphire'?['sapphire','appraisal']:/value|worth|price|valuation/.test(p.path)&&group==='gold'?['gold','price']:config.sources;
 briefs[p.path]={title,focusKeyword:keyword,secondaryKeywords:[...new Set([...(custom?['scrap gold','Cuban chains with diamonds'].filter(t=>introduction.toLowerCase().includes(t.toLowerCase())):[]),...config.terms])],description:description.length>165?description.slice(0,162).replace(/\s+\S*$/,'')+'…':description,answer:introduction,group,topic:item.topic,service:config.service,sources:refs.map(k=>sources[k]),canonical:origin+basePath,images:item.recommendedImages,contextualImage:item.requiresExactTopicAsset};
}

await fs.mkdir('public/media/articles',{recursive:true});
const selected=new Map(audit.posts.flatMap(p=>p.recommendedImages).map(x=>[x.key,x]));
for(const key of ['diamondColorDiagram','diamondClarityDiagram','diamondRolex','ovalRing'])if(audit.assetCatalog[key])selected.set(key,{key,...audit.assetCatalog[key]});
for(const [key,asset]of selected){
 const meta=await sharp('public'+asset.src).metadata();const widths=[...new Set([Math.min(400,meta.width),Math.min(800,meta.width),Math.min(1200,meta.width)])].sort((a,b)=>a-b);
 const variants=[];for(const width of widths){const file=`/media/articles/${slug(key)}-${width}.webp`;try{await fs.access('public'+file);}catch{await sharp('public'+asset.src).rotate().resize({width,withoutEnlargement:true}).webp({quality:80}).toFile('public'+file);}variants.push({width,src:file,bytes:(await fs.stat('public'+file)).size});}
 imageManifest[key]={...asset,width:meta.width,height:meta.height,variants};
}
function figure(asset,index,contextual=false){const a=imageManifest[asset.key];const variant=a.variants.at(-1);const caption=(contextual?'Material and evaluation reference: ':'')+asset.alt+(contextual?'. This photograph illustrates general jewelry materials, not the specific design or brand discussed.':'.');return `<figure class="${index===0?'article-hero':'article-inline-image'}"${a.width<450?` style="max-width:${a.width}px"`:''}><img src="${variant.src}" srcset="${a.variants.map(v=>`${v.src} ${v.width}w`).join(', ')}" sizes="(max-width: 800px) 90vw, 800px" width="${a.width}" height="${a.height}" alt="${esc(asset.alt)}" loading="${index===0?'eager':'lazy'}"${index===0?' fetchpriority="high"':''} decoding="async"/><figcaption>${esc(caption)}</figcaption></figure>`;}
function stripSection($,node){const el=$(node),level=Number(node.name[1]);let next=el.next();while(next.length){const n=next[0];if(/^h[1-6]$/.test(n.name)&&Number(n.name[1])<=level)break;const following=next.next();next.remove();next=following;}el.remove();}
function normalizeLinks($,p,config){$('a[href]').each((i,e)=>{const a=$(e),old=a.attr('href');let u;try{u=new URL(old,origin+p.path);}catch{a.replaceWith(a.contents());return;}if(!/^https?:$/.test(u.protocol))return;for(const key of [...u.searchParams.keys()])if(/^(utm_|srsltid$|fbclid$)/.test(key))u.searchParams.delete(key);
 if(u.hostname.replace(/^www\./,'')==='cash4goldanddiamond.com'){
  let path=u.pathname;const seen=new Set();while(redirects[path]&&!seen.has(path)){seen.add(path);path=redirects[path];}path=preferred(path);
  if(!byPath.has(path)&&!path.startsWith('/media/')){const known={'/best-gold-buyers-los-angeles/':'/sell-your-golds/','/best-gold-jewelry-buyers-los-angeles-2026/':'/sell-your-golds/','/sell-gold-jewelry-los-angeles/':'/selling-gold-jewelry-los-angeles/','/3727/':config.service};path=known[path];if(!path){a.replaceWith(a.contents());linkChanges.push({path:p.path,from:old,to:null});return;}}
  const href=path+(u.search||'')+(u.hash||'');a.attr('href',href).removeAttr('target').removeAttr('rel');if(briefs[path]&&/^(?:Best |Top |Related:)/.test(a.text().trim()))a.text(briefs[path].title);if(old!==href)linkChanges.push({path:p.path,from:old,to:href});
 }else{
  if(u.hostname==='consumer.ftc.gov'&&u.pathname==='/articles/buying-platinum-gold-silver-jewelry')u.pathname='/articles/buying-platinum-gold-and-silver-jewelry';
  if(!verifiedReferenceUrls.has(u.href)&&!['www.google.com','maps.google.com','calendly.com'].includes(u.hostname)){a.replaceWith(a.contents());linkChanges.push({path:p.path,from:old,to:null,reason:'Unverified legacy outbound reference; relevant primary references supplied with the article'});return;}
  a.attr('href',u.href);if(a.attr('target'))a.attr({target:'_blank',rel:'noopener noreferrer'});
 }
 });}
function metadata(p,image){p.meta=(p.meta||[]).filter(m=>!(/^(?:og:|twitter:|article:)/.test(m.name||'')));p.meta.push({name:'og:title',content:p.title},{name:'og:description',content:p.description},{name:'og:image',content:origin+image},{name:'og:image:alt',content:p.heading},{name:'twitter:card',content:'summary_large_image'});}
const postal={'@type':'PostalAddress',streetAddress:business.streetAddress,addressLocality:business.city,addressRegion:business.region,postalCode:business.postalCode,addressCountry:business.country};
const organization={'@type':'JewelryStore','@id':origin+'/#organization',name:business.name,url:origin+'/',telephone:business.phone,address:postal,areaServed:{'@type':'Place',name:'Downtown Los Angeles'},paymentAccepted:'Cash, bank wire, business check',hasMap:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(business.address)};
function schemas(p,type='BlogPosting'){
 const image=p.meta.find(m=>m.name==='og:image')?.content;
 const primary={'@type':type,'@id':p.canonical+'#'+type.toLowerCase(),url:p.canonical,headline:p.heading,name:p.heading,description:p.description,image,mainEntityOfPage:{'@type':'WebPage','@id':p.canonical},publisher:{'@id':organization['@id']}};
 if(p.isArticle){Object.assign(primary,{author:{'@type':'Person',name:p.author,url:origin+'/about-us-sell-gold-and-diamonds-online/'},datePublished:p.publishedAt,dateModified:p.modifiedAt,articleSection:groups[p.editorial.group].label,keywords:[p.editorial.focusKeyword,...p.editorial.secondaryKeywords].join(', ')});}
 if(type==='Service'){primary.provider={'@id':organization['@id']};primary.serviceType='Gold, scrap gold, Cuban chain, gold coin and silver coin buying';primary.areaServed=organization.areaServed;delete primary.headline;}
 const crumbs=[{name:'Home',item:origin+'/'}];if(p.isArticle)crumbs.push({name:'Guides',item:origin+'/blogs/'});crumbs.push({name:p.heading,item:p.canonical});
 const graph=[organization,primary,{'@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))}];
 if(type==='Service'){const $=load(p.html);graph.push({'@type':'FAQPage',mainEntity:$('details').map((i,e)=>({'@type':'Question',name:$(e).find('summary').text(),acceptedAnswer:{'@type':'Answer',text:$(e).children('div').text()}})).get()});}
 p.schema=[JSON.stringify({'@context':'https://schema.org','@graph':graph})];
}
const tokenize=s=>new Set(s.toLowerCase().replace(/\d+|los angeles|downtown|gold|guide|best|2026/g,' ').split(/[^a-z]+/).filter(w=>w.length>3));
for(const p of pages.filter(p=>p.isArticle)){
 const b=briefs[p.path],config=groups[b.group],review=audit.posts.find(x=>x.path===p.path),$=load(priorityGoldArticles[p.path]||p.html,{},false);const old={title:p.title,description:p.description,html:p.html};
 // Remove legacy carousel/related widgets and rebuild with relevant, reachable guides.
 $('h2,h3,h4').filter((i,e)=>/you might also like|related (?:posts|articles)/i.test($(e).text())).each((i,e)=>stripSection($,e));
 $('p').filter((i,e)=>/^Related:/i.test($(e).text().trim())).remove();
 $('figure').has('img').remove();$('picture').remove();$('img').remove();$('h1').remove();
 // Remove unsupported ratings and fabricated comparative test claims from the imported copy.
 $('h2,h3,h4').each((i,e)=>{if(!e.parent)return;const text=norm($(e).text());if(/^(?:#\d+|\d+[.):]\s+.*(?:Cash 4|Blue Nile|Zales|Mejuri|Tiffany|Cartier|Van Cleef|Marco Bicego|Eastman|Landstrom|Amazon|Local Jewelry|Black Hills Gold Direct)|Best (?:for|Overall):)|comparison table|top .* (?:ranked|brands compared)|why cash.*wins|why .* (?:is your best|ranks|wins)|^the bottom line: why cash|#1 (?:Pick|Choice)/i.test(text)){removedClaims.push({path:p.path,type:'unsupported-ranking-section',text});stripSection($,e);}});
 $('table').each((i,e)=>{if(/★|Rating|Rank|Winner|Best For|Cash 4 Gold/i.test($(e).text())){removedClaims.push({path:p.path,type:'unsupported-comparison-table',text:norm($(e).text()).slice(0,180)});$(e).remove();}});
 $('p,li').each((i,e)=>{const text=norm($(e).text());if(/(?:we[’']ve|we have|we|I[’']ve|I have)\s+(?:personally\s+)?(?:tested|ranked|researched|spent time researching)|(?:our|the) (?:top pick|top recommendation|#1 pick|clear winner)|beats every|30[-–]50% below fair market/i.test(text)){removedClaims.push({path:p.path,type:'unsupported-comparative-claim',text:text.slice(0,220)});$(e).remove();}});
 $('p,li').each((i,e)=>{const text=norm($(e).text());if(/ranked #1|guaranteed.*best price|J\.P\. Morgan forecasts|\$6,000 per ounce|call or to/i.test(text)){removedClaims.push({path:p.path,type:'unsupported-claim-or-broken-copy',text});$(e).remove();}});
 $('p,li').each((i,e)=>{const text=norm($(e).text());if(/\b(?:506\s+S\.?\s+Grand|606\s+S\s+Broadway|650\s+South\s+Hill)/i.test(text)){removedClaims.push({path:p.path,type:'unverified-third-party-location',text});$(e).remove();}else if(/8483 Melrose Place/i.test(text)){$(e).text('Retail overhead and service costs can influence an offer. Compare the final purchase amount and the explanation for the specific diamond you own.');}else if(/613 S Hill St/i.test(text)){$(e).text('The Hill Street corridor is part of the Downtown Los Angeles Jewelry District. When comparing watch buyers, confirm each business’s location and arrange a visit to review the actual watch.');}});
 if(b.group==='gold'){
  $('table').each((i,e)=>{const text=norm($(e).text());if(/\$/.test(text)&&/price|payout|gram|ounce|spot/i.test(text)){removedClaims.push({path:p.path,type:'unverified-price-table',text:text.slice(0,250)});$(e).remove();}});
  $('p,li').each((i,e)=>{const text=norm($(e).text());if(/\$/.test(text)&&/per gram|per ounce|today|current|right now|as of 2026|spot price|raw gold value/i.test(text)&&!/(?:if .* were|hypothetical|only an example)/i.test(text)){removedClaims.push({path:p.path,type:'stale-price-claim',text:text.slice(0,250)});$(e).remove();}});
  if(removedClaims.some(c=>c.path===p.path&&/price/.test(c.type))){$.root().append('<section><h2>Use a current price reference, then evaluate the item</h2><p>Start with a dated reference for pure gold and check its unit of weight. A jewelry estimate also needs the item’s gold content and net metal weight. For an illustrative calculation only, 10 grams of 14K gold contains about 5.83 grams of pure gold. If pure gold were hypothetically $100 per gram, that gold content would be about $583. This is an example of metal content, not a current price or a purchase offer.</p><p>Stone weight, non-gold components, and the buyer’s evaluation can change the final amount. Ask for the basis of the actual offer and compare the same items.</p></section>');}
 }
 $('p,li').each((i,e)=>{const text=norm($(e).text());if(/Cash\s*4\s*Gold/i.test(text)&&/(?:no transfers|cash (?:immediately|in hand)|pays? (?:in )?cash|same.day (?:cash|payment)|20.year|20\+ years)/i.test(text)){$(e).html(`At Cash 4 Gold &amp; Diamonds, discuss an evaluation of your actual items and review the final purchase offer. Payment is available by cash, bank wire, or business check. <a href="/contact-us/">Contact the Downtown Los Angeles location</a> to arrange your visit.`);removedClaims.push({path:p.path,type:'owner-confirmed-payment-copy',text:text.slice(0,180)});}});
 $('h2,h3,h4,h5,h6').each((i,e)=>{const t=norm($(e).text()).replace(/^#?\d+[.):]?\s+/,'');$(e).text(t.replace(/^Final Recommendations$/i,'Before you decide').replace(/^Why Local Beats Online Every Time$/i,'Comparing a local and an online sale'));});
 $('p,div,span').filter((i,e)=>!$(e).children().length&&!norm($(e).text())).remove();
 normalizeLinks($,p,config);
 if(p.path==='/best-10k-gold-mens-rings-2026-ranked/')$.root().append('<section><h2>Check the metal before comparing ring prices</h2><p>A 10K ring combines gold with other metals. Read any karat or fineness marking inside the band, then have the actual piece evaluated if you plan to sell it. A stamp is useful information, but the condition of a marking does not replace an examination of the ring.</p><p>Men’s rings range from light hollow designs to broad, substantial bands. Two rings with a similar appearance may contain different amounts of metal. Ask about construction and net metal weight before assuming the larger-looking ring contains more gold.</p><h2>Separate the band from its stones</h2><p>If the ring contains diamonds or colored stones, bring any grading reports you already have. Ask how the stones and setting are considered in the evaluation. The overall scale weight includes the whole ring; it is not automatically the weight of its gold.</p><p>A plain band, a damaged ring, and a diamond-set ring may each need a different discussion. Broken or unwanted gold can still be brought for evaluation, while a ring with a maker’s signature or supporting paperwork may need closer inspection as a complete piece.</p><h2>Inspect construction and condition</h2><p>Look at the shank, setting, and any previous resizing or repairs. Note missing stones, cracks, or worn prongs so you can discuss them during the evaluation. Avoid aggressive cleaning or home testing that could damage the item.</p><p>If you are buying a ring, consider fit, construction, finish, and the seller’s written terms. If you are selling, focus on the purchase offer for the ring you actually own instead of the advertised retail price of a different design.</p><h2>Prepare for a Downtown Los Angeles evaluation</h2><p>Bring the ring together with any other unwanted gold jewelry. Cash 4 Gold &amp; Diamonds also buys scrap gold, Cuban chains and bracelets with or without diamonds, and gold and silver coins. A single ring or a larger collection is welcome.</p><p>Keep receipts and reports with the matching items where practical. Call 310-663-1340 to arrange a visit to 617 S. Hill Street, Los Angeles, CA 90014. For a substantial collection, discuss the amount of material and your preferred payment method ahead of the visit.</p><h2>Review the final purchase amount</h2><p>Ask what was considered in the offer, including the metal and any stones. Compare written amounts for the same group of items and clarify the terms before agreeing to sell. Payment is available by cash, bank wire, or business check.</p></section>');
 // One concise, subject-specific opening answer; the original educational body follows.
 $.root().prepend(`<p class="article-takeaway">${esc(b.answer)}</p>`);
 const images=b.images.filter(x=>imageManifest[x.key]);if(images.length<2)throw new Error('Insufficient vetted images: '+p.path);
 const primary=images[0],secondary=images.find(x=>x.src!==primary.src);if(!secondary)throw new Error('Duplicate editorial images: '+p.path);
 if(!b.contextualImage)$('.article-takeaway').after(figure(primary,0));
 const mid=$('h2').toArray().find((e,i)=>i>1&&/evaluat|value|quality|material|purity|condition|compar|buying|selling/i.test($(e).text()))||$('h2').eq(Math.floor($('h2').length/2))[0];
 const placement=mid?$(mid).next('p'):null;
 if(b.contextualImage){const first=$('h2').first().next('p');if(first.length)first.after(figure(primary,1,true));else $('.article-takeaway').after(figure(primary,1,true));}
 const block=figure(secondary,1,b.contextualImage);
 if(placement?.length)placement.after(block);else if(mid)$(mid).after(block);else $.root().append(block);
 for(const item of review.currentImages.filter(i=>/retain_small/.test(i.verdict)||/diagram/.test(i.reason))){const found=Object.entries(audit.assetCatalog).find(([key,a])=>a.src===item.localSource);if(found&&!images.some(i=>i.key===found[0]))$.root().append(figure({key:found[0],...found[1]},1));}
 const words=tokenize(b.title);const candidates=Object.entries(briefs).filter(([path,x])=>path!==p.path&&preferred(path)===path&&x.group===b.group).map(([path,x])=>({path,score:[...tokenize(x.title)].filter(t=>words.has(t)).length})).sort((a,b)=>b.score-a.score);
 b.related=[...new Set([...candidates.slice(0,2).map(x=>x.path),...config.related])].filter(path=>path!==p.path&&preferred(path)!==preferred(p.path)&&byPath.has(path)).slice(0,3);
 const localCopy=b.group==='gold'?'We buy scrap gold, Cuban chains and bracelets with or without diamonds, gold coins, and silver coins. Single pieces and large quantities are welcome. Payment is available by cash, bank wire, or business check.':`Bring your items and any reports, receipts, or service records you already have. Contact us to discuss ${config.serviceLabel} and arrange an evaluation.`;
 $.root().append(`<aside class="article-next-step"><h2>Plan your evaluation in Downtown Los Angeles</h2><p>${localCopy}</p><p><a href="${config.service}">${esc(config.serviceLabel.charAt(0).toUpperCase()+config.serviceLabel.slice(1))}</a> · ${esc(business.address)}</p><a class="elementor-button" href="tel:3106631340">Call 310-663-1340 ↗</a></aside><section class="article-resources"><h2>Further reading from industry sources</h2><ul>${b.sources.map(s=>`<li><a href="${esc(s.url)}">${esc(s.title)}</a></li>`).join('')}</ul></section><section class="article-related"><h2>Related guides</h2><ul>${b.related.map(path=>`<li><a href="${path}">${esc(briefs[path].title)}</a></li>`).join('')}</ul></section>`);
 const ids=new Set();$('[id]').each((i,e)=>{const id=$(e).attr('id');if(ids.has(id))$(e).removeAttr('id');else ids.add(id);});
 $('h2,h3,h4').each((i,e)=>{if($(e).attr('id'))return;const base=slug($(e).text())||'section';let id=base,n=1;while(ids.has(id))id=base+'-'+(++n);ids.add(id);$(e).attr('id',id);});
 const toc=$('h2').filter((i,e)=>!$(e).closest('aside,.article-resources,.article-related').length).slice(0,12).toArray();if(toc.length>=4){const html=`<nav class="article-toc" aria-label="In this guide"><p>In this guide</p><ul>${toc.map(e=>`<li><a href="#${$(e).attr('id')}">${esc($(e).text())}</a></li>`).join('')}</ul></nav>`;const hero=$('.article-hero');if(hero.length)hero.after(html);else $('.article-takeaway').after(html);}
 // Drop stale imported fragment targets instead of leaving broken jumps.
 $('a[href^="#"]').each((i,e)=>{const target=decodeURIComponent($(e).attr('href').slice(1));if(!ids.has(target))$(e).replaceWith($(e).contents());});
 p.html=$.html();p.sections=[];p.title=b.title;p.heading=b.title;p.description=b.description;p.canonical=b.canonical;p.author=(p.author||'Navid').replace(/^Post author:\s*/i,'').trim()||'Navid';p.modifiedAt='2026-09-09T19:00:00Z';p.editorial={...b,images:images.map(x=>({...x,...imageManifest[x.key]}))};p.images=$('img').map((i,e)=>({...e.attribs})).get();p.sourceText=norm($.text());p.formsPending=false;metadata(p,p.images[0].src);schemas(p);
 revisions.push({path:p.path,type:'article-optimization',previousTitle:old.title,title:p.title,sourceArchive:baseline,keywords:[b.focusKeyword,...b.secondaryKeywords],images:p.images.length,contextualImages:b.contextualImage,canonical:p.canonical,related:b.related,sources:b.sources});
}

const gold=byPath.get('/sell-your-golds/');gold.html=await fs.readFile('src/data/gold-buying.html','utf8');
const $gold=load(gold.html,{},false);$gold('.gold-item-grid>div').each((i,e)=>$gold(e).attr('id',['scrap-gold','cuban-chains','gold-coins','silver-coins'][i]));gold.html=$gold.html();gold.sections=[];gold.heading='Gold buyer in Downtown Los Angeles';gold.title='Gold Buyer Downtown Los Angeles | Scrap Gold, Chains & Coins';gold.description='Sell gold, scrap gold, Cuban chains with or without diamonds, and gold or silver coins in Downtown LA. Large quantities welcome. Cash, wire or business check.';gold.canonical=origin+gold.path;gold.editorial={focusKeyword:'gold buyer Downtown Los Angeles',secondaryKeywords:['scrap gold buyer Los Angeles','sell Cuban chain Los Angeles','gold coin buyer Downtown LA','silver coin buyer Los Angeles'],service:gold.path,answer:'We buy gold, scrap gold, Cuban chains with or without diamonds, gold coins, and silver coins in Downtown Los Angeles. Large quantities are welcome; payment is available by cash, bank wire, or business check.',sources:[sources.gold],related:groups.gold.related};metadata(gold,'/media/editorial/cuban-scrap-gold-960.webp');schemas(gold,'Service');revisions.push({path:gold.path,type:'owner-directed-gold-service-rewrite',sourceArchive:baseline});

const home=byPath.get('/');const updateHero=html=>{const $=load(html,{},false);$('#source-1e744420 h1').text('Gold, Diamond & Rolex Buyer in Downtown Los Angeles');$('#source-49fde35 p').text('Scrap gold. Heavy Cuban chains. Gold & silver coins. Large quantities welcome at 617 S. Hill Street.');$('#source-d8acb75 a').attr('href','/sell-your-golds/').find('.elementor-button-text').text('Sell Your Gold');return $.html();};home.html=updateHero(home.html);home.sections=home.sections.map(s=>({...s,html:updateHero(s.html)}));home.title='Downtown LA Gold, Diamond & Rolex Buyer | Cash 4 Gold & Diamonds';home.description='Sell gold, scrap gold, Cuban chains, diamonds, Rolex watches, and gold or silver coins at 617 S. Hill Street in Downtown Los Angeles. Large quantities welcome.';metadata(home,'/media/editorial/hero-jewelry-1672.webp');revisions.push({path:'/',type:'owner-directed-gold-priority',sourceArchive:baseline});

const library=byPath.get('/blogs/');const articles=pages.filter(p=>p.isArticle&&preferred(p.path)===p.path);library.heading='Gold, Diamond & Jewelry Selling Guides';library.title='Gold, Diamond & Rolex Selling Guides | Downtown Los Angeles';library.description='Explore guides to selling gold, Cuban chains, scrap jewelry, coins, diamonds, Rolex watches, and estate jewelry in Downtown Los Angeles.';library.html=`<div class="blog-library"><h1>${library.heading}</h1><p class="blog-library-intro">Prepare for your next jewelry evaluation. Start with gold purity and value, compare selling options, or find a guide for the piece you own.</p><p><a href="/sell-your-golds/">Explore gold buying in Downtown Los Angeles →</a></p><nav class="blog-groups" aria-label="Guide topics">${Object.entries(groups).map(([key,g])=>`<a href="#guides-${key}">${esc(g.label)}</a>`).join('')}</nav>${Object.entries(groups).map(([key,g])=>`<section class="blog-list-group" id="guides-${key}"><h2>${esc(g.label)}</h2><div class="blog-card-grid">${articles.filter(p=>p.editorial.group===key).map(p=>{const a=p.editorial.images[0],v=a.variants[0];return `<a class="blog-card" href="${p.path}"><img src="${v.src}" width="${a.width}" height="${a.height}" alt="${esc(a.alt)}" loading="lazy" decoding="async"/><div class="blog-card-copy"><h3>${esc(p.heading)}</h3><p>${esc(p.description)}</p></div></a>`;}).join('')}</div></section>`).join('')}</div>`;library.sections=[];library.canonical=origin+'/blogs/';metadata(library,'/media/editorial/cuban-scrap-gold-960.webp');library.schema=[JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:library.heading,url:library.canonical,mainEntity:{'@type':'ItemList',itemListElement:articles.map((p,i)=>({'@type':'ListItem',position:i+1,url:p.canonical,name:p.heading}))}})];revisions.push({path:library.path,type:'complete-blog-library',articles:articles.length,sourceArchive:baseline});

// Keep preserved category and author pagination in sync with the current articles.
for(const p of pages.filter(p=>!p.isArticle&&p.path!=='/blogs/')){const $=load(p.html,{},false);let count=0;$('article').each((i,e)=>{const card=$(e),href=card.find('h2 a[href]').first().attr('href'),article=byPath.get(preferred(href));if(!article?.isArticle)return;const image=article.editorial.images[0],variant=image.variants[0];card.find('h2 a').text(article.heading).attr('href',new URL(article.canonical).pathname);card.find('img').attr({src:variant.src,srcset:image.variants.map(v=>`${v.src} ${v.width}w`).join(', '),sizes:'(max-width: 600px) 90vw, 400px',width:String(image.width),height:String(image.height),alt:image.alt,loading:'lazy',decoding:'async'}).removeAttr('fetchpriority');card.find('p').first().text(article.description);card.find('a[href]').each((j,a)=>{if($(a).attr('href')===href){$(a).attr('href',new URL(article.canonical).pathname);if(!$(a).find('img').length&&!$(a).closest('h2').length)$(a).text('Read the guide →');}});count++;});if(count){p.html=$.html();p.sections=[];revisions.push({path:p.path,type:'archive-listing-sync',cards:count,sourceArchive:baseline});}}

assertAddressIntegrity(pages);
await fs.writeFile('src/data/pages.json',JSON.stringify(pages));
await fs.writeFile('src/data/article-optimization.json',JSON.stringify(briefs,null,2));
await fs.writeFile('migration/editorial-revisions.json',JSON.stringify(revisions,null,2));
await fs.writeFile('migration/editorial-image-manifest.json',JSON.stringify(imageManifest,null,2));
await fs.writeFile('migration/editorial-link-repairs.json',JSON.stringify(linkChanges,null,2));
await fs.writeFile('migration/editorial-claim-cleanup.json',JSON.stringify(removedClaims,null,2));
await fs.writeFile('migration/duplicate-article-canonicals.json',JSON.stringify(canonicalPairs,null,2));
console.log(JSON.stringify({articles:Object.keys(briefs).length,libraryArticles:articles.length,canonicalPairs:canonicalPairs.length,imageFamilies:Object.keys(imageManifest).length,linkRepairs:linkChanges.length,claimCleanup:removedClaims.length}));
