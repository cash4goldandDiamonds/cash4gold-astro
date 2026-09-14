import {load} from 'cheerio';
import registry from '../data/image-overrides.json' with {type:'json'};

const assetPath=(asset,width)=>asset.src||`/media/editorial/${asset.file}-${width}.webp`;
const srcset=asset=>asset.widths.map(width=>`${assetPath(asset,width)} ${width}w`).join(', ');
export function imageFamily(src){return String(src||'').split('/').at(-1).replace(/^[a-f0-9]{12}-/,'').replace(/\.optimized(?=\.)/,'').replace(/-\d+x\d+(?=\.[a-z]+$)/i,'').replace(/\.[a-z]+$/i,'');}
export function refreshImages(html,pagePath){
 if(!registry.enabled||!registry.pages.includes(pagePath))return html;
 const $=load(html,{},false);
 $('img[src]').each((i,node)=>{
  const img=$(node),key=registry.families[imageFamily(img.attr('src'))];
  if(!key)return;
  const asset=registry.assets[key],background=img.hasClass('background-photo'),hero=key==='hero';
  const sizes=background?'100vw':'(max-width: 640px) 44vw, (max-width: 950px) 44vw, 600px';
  img.attr({src:assetPath(asset,Math.min(asset.width,hero?asset.width:960)),srcset:srcset(asset),sizes,width:String(asset.width),height:String(asset.height),alt:background?'':asset.alt,decoding:'async'}).addClass('refreshed-image');
  if(background)img.addClass('refreshed-background');
  const anchor=img.parent('a');if(anchor.length&&/\.(webp|png|jpe?g)(\?.*)?$/i.test(anchor.attr('href')||''))anchor.attr('href',assetPath(asset,asset.width));
  if(hero){img.addClass('refreshed-hero');if(pagePath==='/')img.attr('loading','eager').attr('fetchpriority','high');const mobile=registry.assets.diamond;img.wrap('<picture class="refreshed-hero-picture"></picture>');img.before(`<source media="(max-width: 640px)" srcset="${srcset(mobile)}" sizes="100vw">`);}
 });
 return $.html();
}
export function applyImageOverrides(pages){if(!registry.enabled)return pages;return pages.map(page=>registry.pages.includes(page.path)?{...page,html:refreshImages(page.html,page.path),sections:page.sections.map(s=>({...s,html:refreshImages(s.html,page.path)})),images:page.images.map(img=>{const key=registry.families[imageFamily(img.src)];if(!key)return img;const asset=registry.assets[key];return {...img,src:assetPath(asset,asset.width),srcset:srcset(asset),alt:asset.alt,width:String(asset.width),height:String(asset.height)}})}:page);}
export {registry as imageRegistry};
