import fs from 'node:fs';
import {load} from 'cheerio';
const assignments=JSON.parse(fs.readFileSync(new URL('../data/article-image-assignments.json',import.meta.url),'utf8'));
export function applyArticleImageAssignments(pages){
 const byPath=new Map(pages.map(p=>[p.path,p]));
 for(const [path,asset] of Object.entries(assignments)){
  const p=byPath.get(path);if(!p)throw new Error('Image assignment has no article: '+path);
  const $=load(p.html,{},false),img=$('figure img').first();if(!img.length)throw new Error('Article has no image slot: '+path);
  img.attr({src:asset.src,srcset:asset.variants.map(v=>`${v.src} ${v.width}w`).join(', '),sizes:'(max-width: 800px) 90vw, 800px',alt:asset.alt,width:String(asset.width),height:String(asset.height),decoding:'async'});
  img.closest('figure').find('figcaption').text(asset.caption);
  p.html=$.html();p.sections=[];p.images=$('img').map((i,e)=>({...e.attribs})).get();p.sourceText=$.text().replace(/\s+/g,' ').trim();
  p.editorial.images[0]={...asset,position:'First contextual or hero image in the article.',display:'Responsive, preserve aspect ratio and visible jewelry details.'};
  for(const name of ['og:image','twitter:image']){p.meta=p.meta.filter(m=>m.name!==name);p.meta.push({name,content:'https://cash4goldanddiamond.com'+asset.src});}
  p.meta=p.meta.filter(m=>m.name!=='og:image:alt');p.meta.push({name:'og:image:alt',content:asset.alt});
  p.schema=p.schema.map(raw=>{const data=JSON.parse(raw);for(const node of data['@graph']||[data])if(node['@type']==='BlogPosting')node.image=p.images.map(image=>'https://cash4goldanddiamond.com'+image.src);return JSON.stringify(data);});
 }
 for(const p of pages){
  const $=load(p.html,{},false);let touched=false;
  $('.blog-card').each((i,e)=>{const card=$(e),target=byPath.get(card.attr('href'));if(!assignments[target?.path])return;const img=card.find('img').first();if(!img.length)return;const first=target.images[0];card.attr('id','guide-'+assignments[target.path].key);img.attr({...first,sizes:'(max-width: 600px) 90vw, (max-width: 900px) 44vw, 400px',loading:'lazy'});touched=true;});
  if(!p.isArticle)$('a[href]').not('.blog-card').each((i,e)=>{const link=$(e),target=byPath.get(link.attr('href'));if(!target?.isArticle)return;const img=link.find('img').first();if(img.length&&target.images[0]){img.attr({...target.images[0],sizes:'(max-width: 600px) 90vw, 400px',loading:'lazy'});touched=true;}});
  if(p.path==='/blogs/'){
   if(!$('#featured-diamond-guides').length)$('.blog-list-group').first().before('<section id="featured-diamond-guides" class="blog-list-group featured-diamond-guides"><p class="eyebrow">Large diamonds · Exceptional jewelry</p><h2>Diamond &amp; eternity band highlights</h2><p>Natural diamonds only, any size and shape. Explore large stones, substantial bands and fine jewelry. Images are illustrative.</p><div class="blog-card-grid"></div></section>');
   const featured=$('#featured-diamond-guides .blog-card-grid');
   for(const path of ['/large-diamond-buyer-los-angeles/','/where-to-sell-fine-jewelry-downtown-los-angeles/','/best-18k-gold-rings-2026-ranked/','/3-5-carat-oval-diamond-ring-buying-step-by-step-guide/']){const card=$('.blog-card').filter((i,e)=>$(e).attr('href')===path).first();if(card.length){card.attr('id','guide-'+assignments[path].key);featured.append(card);}}
   touched=true;
  }
  if(touched){
   p.html=$.html();
   if(p.path==='/'&&p.sections.length){
    p.sections=p.sections.map(section=>{
     const node=$('[id]').filter((i,e)=>['source-'+section.id,section.id].includes($(e).attr('id'))).first();
     return node.length?{...section,html:$.html(node)}:section;
    });
   }else p.sections=[];
  }
 }
 return pages;
}
