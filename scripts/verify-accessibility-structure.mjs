import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

// Structural checks complement, but do not replace, keyboard, screen-reader,
// visual contrast, zoom and browser testing. No synthetic performance scores.
const out=process.env.ASTRO_OUT_DIR||'dist';
const reportPath=process.argv.find(arg=>arg.startsWith('--report='))?.slice(9);
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const errors=[],review=[],rows=[];
const compact=value=>String(value||'').replace(/\s+/g,' ').trim();
for(const route of [...pages.map(page=>page.path),'/404/']){
 const file=route==='/404/'?path.join(out,'404.html'):path.join(out,route,'index.html');
 const $=load(await fs.readFile(file,'utf8'));
 const fail=(type,details={})=>errors.push({path:route,type,...details});
 const ids=new Map();
 for(const node of $('[id]')){const id=$(node).attr('id');if(ids.has(id))fail('duplicate-id',{id});else ids.set(id,node);}
 const textName=node=>{
  const el=$(node),label=compact(el.attr('aria-label'));
  if(label)return label;
  const labelledby=el.attr('aria-labelledby');
  if(labelledby)return compact(labelledby.split(/\s+/).map(id=>ids.has(id)?$(ids.get(id)).text():'').join(' '));
  const clone=el.clone();clone.find('[aria-hidden="true"],script,style').remove();
  return compact(clone.text()+' '+clone.find('img[alt]').map((i,img)=>$(img).attr('alt')).get().join(' ')+' '+(el.attr('title')||''));
 };
 if(!/^[a-z]{2,3}(?:-[a-z0-9]+)*$/i.test($('html').attr('lang')||''))fail('missing-document-language');
 if($('main').length!==1)fail('one-main-landmark-required');
 if($('main h1').length!==1)fail('one-main-heading-required');
 const viewport=$('meta[name="viewport"]').attr('content')||'';
 if(/user-scalable\s*=\s*(?:no|0)|maximum-scale\s*=\s*(?:0|1)(?:\.0)?(?:\s*[,;]|$)/i.test(viewport))fail('viewport-restricts-zoom');
 const skip=$('a.skip-link');
 if(skip.length!==1||skip.attr('href')!=='#main'||!compact(skip.text())||!ids.has('main')||$(ids.get('main')).attr('tabindex')!=='-1')fail('missing-focusable-skip-target');
 for(const node of $('[aria-labelledby],[aria-describedby],[aria-controls],[aria-owns],[aria-activedescendant]')){
  for(const attribute of ['aria-labelledby','aria-describedby','aria-controls','aria-owns','aria-activedescendant'])for(const id of ($(node).attr(attribute)||'').split(/\s+/).filter(Boolean))if(!ids.has(id))fail('missing-aria-reference',{attribute,id});
 }
 for(const node of $('[tabindex]'))if(Number($(node).attr('tabindex'))>0)fail('positive-tabindex',{tag:node.tagName});
 for(const node of $('a[href],button,summary,[role="button"],[role="link"]'))if(!textName(node))fail('unnamed-interactive-element',{tag:node.tagName,href:$(node).attr('href')});
 for(const node of $('a[href] a[href],a[href] button,button a[href],button button,summary a[href],summary button'))fail('nested-interactive-control',{tag:node.tagName});
 for(const node of $('details')){
  const el=$(node);
  if(el.children('summary').length!==1||el.children().first()[0]?.tagName!=='summary')fail('invalid-disclosure-summary');
 }
 for(const node of $('input:not([type="hidden"]),select,textarea')){
  const el=$(node),type=el.attr('type')||'',id=el.attr('id');
  const explicitLabel=id&&$('label[for]').toArray().some(label=>$(label).attr('for')===id&&compact($(label).text()));
  const implicitLabel=el.closest('label').length&&compact(el.closest('label').text());
  const name=compact(el.attr('aria-label'))||compact((el.attr('aria-labelledby')||'').split(/\s+/).map(ref=>ids.has(ref)?$(ids.get(ref)).text():'').join(' '));
  // Submit/reset inputs have native default names even without a value attribute.
  const nativeButtonName=['submit','reset'].includes(type)||(['button','image'].includes(type)&&compact(el.attr(type==='image'?'alt':'value')));
  if(!explicitLabel&&!implicitLabel&&!name&&!nativeButtonName)fail('unlabelled-form-control',{tag:node.tagName,inputType:type,id});
 }
 for(const node of $('iframe'))if(!compact($(node).attr('title')))fail('untitled-frame');
 for(const node of $('img')){
  const el=$(node);
  if(el.attr('alt')===undefined)fail('missing-image-alt');
  if(!(Number(el.attr('width'))>0&&Number(el.attr('height'))>0))fail('missing-image-dimensions',{src:el.attr('src')});
 }
 if($('audio[autoplay],video[autoplay]:not([muted])').length)fail('autoplay-audio');
 for(const node of $('video'))if(!$(node).find('track[kind="captions"],track[kind="subtitles"]').length)review.push({path:route,type:'video-caption-review'});
 for(const node of $('table')){
  if(!$(node).find('th').length)review.push({path:route,type:'table-header-review'});
  if(!$(node).children('caption').length&&!compact($(node).attr('aria-label'))&&!$(node).attr('aria-labelledby'))review.push({path:route,type:'table-name-review'});
 }
 const headings=$('main h1,main h2,main h3,main h4,main h5,main h6').toArray().map(node=>({level:Number(node.tagName.slice(1)),text:compact($(node).text()).slice(0,100)}));
 for(let i=1;i<headings.length;i++)if(headings[i].level>headings[i-1].level+1)review.push({path:route,type:'heading-level-review',previous:headings[i-1],current:headings[i]});
 rows.push({path:route,ids:ids.size,links:$('a[href]').length,buttons:$('button').length,disclosures:$('details').length,images:$('img').length,forms:$('form').length,iframes:$('iframe').length});
}
const report={checkedAt:new Date().toISOString(),scope:'Built HTML structural accessibility only. Does not establish WCAG conformance, rendered contrast, focus behavior, zoom/reflow, screen-reader behavior, Core Web Vitals or Lighthouse scores.',pages:rows.length,errors,review,rows};
if(reportPath){await fs.mkdir(path.dirname(reportPath),{recursive:true});await fs.writeFile(reportPath,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({pages:rows.length,errors,reviewItems:review.length,reviewTypes:[...new Set(review.map(item=>item.type))]},null,2));
if(errors.length)process.exitCode=1;
