import {load} from 'cheerio';
import {toHTML} from '@portabletext/to-html';
import sanitizeHtml from 'sanitize-html';
import {renderMigratedImage} from './migrated-image.mjs';
import {businessProfile,assertAddressIntegrity} from './address-integrity.mjs';
import {assertBuyingPolicy,businessDescription,gemstonePolicy} from './buying-policy.mjs';
import {currentPath,rewritePublicLinks} from './route-migrations.mjs';
import {responsiveCmsImage} from './cms-responsive-image.mjs';
const origin='https://cash4goldanddiamond.com';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const safeHtml=s=>sanitizeHtml(s,{allowedTags:sanitizeHtml.defaults.allowedTags.concat(['img','figure','figcaption','details','summary','section','aside','nav']),allowedAttributes:{'*':['class','id','aria-label','aria-hidden','aria-labelledby'],img:['src','srcset','sizes','alt','width','height','loading','decoding','fetchpriority'],a:['href','target','rel'],td:['colspan','rowspan'],th:['colspan','rowspan','scope'],time:['datetime']},allowedSchemes:['https','http','mailto','tel']});
export function cmsImageUrl(value,context={}){const ref=value?.asset?._ref||value?.asset?._id,match=/^image-([\w-]+)-(\d+)x(\d+)-(\w+)$/.exec(ref||'');if(!match||!context.projectId||!context.dataset)return '';return `https://cdn.sanity.io/images/${encodeURIComponent(context.projectId)}/${encodeURIComponent(context.dataset)}/${match[1]}-${match[2]}x${match[3]}.${match[4]}?w=1400&auto=format`;}
export function renderCmsBody(body,context={}){return safeHtml(toHTML(body||[],{components:{marks:{internalLink:({value,children})=>{if(!value.target?.path)throw new Error('Unresolved CMS internal link');return '<a href="'+esc(currentPath(value.target.path)+(value.fragment?'#'+encodeURIComponent(value.fragment):''))+'">'+children+'</a>';}},block:({value,children})=>{const tag=/^h[2-6]$/.test(value.style)?value.style:value.style==='blockquote'?'blockquote':'p';return `<${tag}${value.sourceId?` id="${esc(value.sourceId)}"`:''}${value.className?` class="${esc(value.className)}"`:''}>${children}</${tag}>`;},types:{migratedImage:({value})=>renderMigratedImage(value),sourceTable:({value})=>`<div class="table-scroll"><table>${(value.rows||[]).map(row=>`<tr>${(row.cells||[]).map(cell=>`<${row.isHeader?'th scope="col"':'td'}>${esc(cell)}</${row.isHeader?'th':'td'}>`).join('')}</tr>`).join('')}</table></div>`,image:({value})=>{const responsive=responsiveCmsImage(value,context),url=responsive?.src;return url?`<figure class="cms-editorial-image"><img src="${esc(url)}" alt="${esc(value.alt)}" ${responsive?`width="${responsive.width}" height="${responsive.height}" srcset="${esc(responsive.srcset)}" sizes="${responsive.sizes}"`:''} loading="lazy" decoding="async">${value.caption?`<figcaption>${esc(value.caption)}</figcaption>`:''}</figure>`:'';}}}}));}
function synchronizeFaqAnswers($,faqs,path){
 const questions=new Set();
 return faqs.map(faq=>{
  if(!faq||typeof faq.question!=='string'||!faq.question.trim()||typeof faq.answer!=='string'||!faq.answer.trim())throw new Error('Incomplete or unresolved CMS FAQ on '+path);
  const question=faq.question.trim(),answer=faq.answer.trim();
  if(questions.has(question))throw new Error('Duplicate CMS FAQ question on '+path);
  questions.add(question);
  const heading=$('h2,h3,h4,h5,h6').filter((i,e)=>$(e).text().trim()===question);
  if(heading.length!==1||heading.next('p').length!==1)throw new Error('CMS FAQ must match one visible question and answer on '+path+': '+question);
  heading.next('p').text(answer);
  return {'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}};
 });
}
function articleBody(doc,old,context){
 const $=load(renderCmsBody(doc.body,context),{},false);$('.article-takeaway,.article-toc,.article-resources,.article-related,.article-next-step').remove();
 if(doc.answer)$.root().prepend(`<p class="article-takeaway">${esc(doc.answer)}</p>`);
 const seen=new Set();$('h2,h3,h4,h5,h6').each((i,e)=>{const base=$(e).attr('id')||$(e).text().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'section';let id=base,n=1;while(seen.has(id))id=base+'-'+(++n);seen.add(id);$(e).attr('id',id);});
 const aliases=(doc.legacyAnchors||[]).filter(id=>id&&!seen.has(id));if(aliases.length)$.root().prepend([...new Set(aliases)].map(id=>`<span id="${esc(id)}" class="legacy-anchor" aria-hidden="true"></span>`).join(''));
 $('figure').first().addClass('article-hero');$('figure').slice(1).addClass('article-inline-image');
 const headings=$('h2').toArray();if(headings.length>=4){const toc=`<nav class="article-toc" aria-label="In this guide"><p>In this guide</p><ul>${headings.map(e=>`<li><a href="#${esc($(e).attr('id'))}">${esc($(e).text())}</a></li>`).join('')}</ul></nav>`;const hero=$('figure').first();if(hero.length)hero.after(toc);else $('.article-takeaway').after(toc);}
 const sources=doc.sources||[],related=doc.related||[];
 if(sources.length)$.root().append(`<section class="article-resources"><h2>Sources and further reading</h2><ul>${sources.map(s=>`<li><a href="${esc(s.url)}">${esc(s.title)}</a></li>`).join('')}</ul></section>`);
 if(related.some(r=>r.path))$.root().append(`<section class="article-related"><h2>Related guides</h2><ul>${related.filter(r=>r.path).map(r=>`<li><a href="${esc(currentPath(r.path))}">${esc(r.title)}</a></li>`).join('')}</ul></section>`);
 const service=currentPath(doc.service?.page?.path||doc.service?.path||old?.editorial?.service||'/contact-us/');
 $.root().append(`<aside class="article-next-step"><h2>Discuss your items in Downtown Los Angeles</h2><p>${service==='/sell-gemstones-for-cash-in-los-angeles/'?esc(gemstonePolicy)+' ':''}Bring the complete items and existing records. Contact us to discuss a purchase evaluation.</p><p><a href="${esc(service)}">View the buying service</a> · ${esc(businessProfile.address)}</p><a class="elementor-button" href="/contact-us/">Arrange an Evaluation ↗</a></aside>`);
 return safeHtml($.html());
}
export function projectCmsPage(doc,old,context={}){
 if(!/^\/(?!\/)(?:[^?#]*\/)?$/.test(doc.path)||doc.path.includes('..')||currentPath(doc.path)!==doc.path)throw new Error('Invalid or retired CMS page path: '+doc.path);
 if(doc.contentMode==='richText'&&!doc.body?.length)throw new Error('Published page has no content: '+doc.path);
 const isArticle=doc.kind==='article',html=doc.contentMode==='richText'?(isArticle?articleBody(doc,old,context):renderCmsBody(doc.body,context)):old?.html;
 if(!html)throw new Error('No imported content for '+doc.path);
 const canonical=new URL(doc.seo?.canonical||origin+doc.path);if(canonical.origin!==origin||canonical.search||canonical.hash||currentPath(canonical.pathname)!==canonical.pathname)throw new Error('Invalid CMS canonical on '+doc.path);
 const $=load(html,{},false);$('h1').first().text(doc.title);const currentFaqs=doc.contentMode==='richText'?synchronizeFaqAnswers($,doc.faqs||[],doc.path):null;const images=$('img').map((i,e)=>({...e.attribs})).get(),title=doc.seo?.title||doc.title,description=doc.seo?.description||'',socialImage=cmsImageUrl(doc.seo?.socialImage,context)||(doc.contentMode==='richText'&&images[0]?.src?new URL(images[0].src,origin).href:doc.seo?.sourceSocialImage)||(images[0]?.src?new URL(images[0].src,origin).href:'');
 const meta=(old?.meta||[]).filter(m=>!/^og:|^twitter:|^article:/.test(m.name));
 for(const [name,content]of Object.entries({'og:title':doc.seo?.socialTitle||title,'og:description':doc.seo?.socialDescription||description,'og:image':socialImage,'og:image:alt':doc.seo?.socialImage?.alt||images[0]?.alt||'','twitter:title':doc.seo?.socialTitle||title,'twitter:description':doc.seo?.socialDescription||description,'twitter:image':socialImage,'twitter:card':'summary_large_image','article:published_time':doc.publishedAt,'article:modified_time':doc.modifiedAt||old?.modifiedAt}))if(content)meta.push({name,content});
 const related=(doc.related||[]).map(r=>r.path).filter(Boolean).map(currentPath),service=currentPath(doc.service?.page?.path||doc.service?.path||old?.editorial?.service||'/contact-us/');
 const p={...old,cmsRevision:doc._rev,breadcrumbLabel:doc.seo?.breadcrumbLabel||doc.title,path:doc.path,title,heading:doc.title,description,canonical:canonical.href,robots:[doc.seo?.noindex?'noindex':'index',doc.seo?.nofollow?'nofollow':'follow'].join(','),html:rewritePublicLinks($.html()),sections:doc.contentMode==='richText'?[]:(old?.sections||[]).map(s=>{const $section=load(s.html,{},false);$section('h1').first().text(doc.title);return {...s,html:rewritePublicLinks($section.html())};}),meta,images,sourceText:$.text().replace(/\s+/g,' ').trim(),isArticle,publishedAt:doc.publishedAt||old?.publishedAt,modifiedAt:doc.modifiedAt||old?.modifiedAt,author:doc.author?.name||old?.author||'',categories:doc.categories?.map(c=>c.title).filter(Boolean)||old?.categories||[],editorial:isArticle?{...old?.editorial,title,description,answer:doc.answer||'',focusKeyword:doc.seo?.focusKeyword||'',secondaryKeywords:doc.seo?.secondaryKeywords||[],sources:doc.sources||[],related,service,images}:undefined};
 const organization={'@type':'JewelryStore','@id':origin+'/#organization',name:businessProfile.name,url:origin,description:businessDescription,telephone:businessProfile.phone,areaServed:{'@type':'City',name:businessProfile.city},address:{'@type':'PostalAddress',streetAddress:businessProfile.streetAddress,addressLocality:businessProfile.city,addressRegion:businessProfile.region,postalCode:businessProfile.postalCode,addressCountry:businessProfile.country}};
 const breadcrumb={'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},...(isArticle?[{'@type':'ListItem',position:2,name:'Blogs',item:origin+'/blogs/'}]:[]),{'@type':'ListItem',position:isArticle?3:2,name:p.breadcrumbLabel,item:p.canonical}]};
 if(doc.seo?.schemaType&&((isArticle&&doc.seo.schemaType!=='BlogPosting')||(!isArticle&&doc.seo.schemaType==='BlogPosting')))throw Error('Schema selection conflicts with content type: '+doc.path);
 const main={'@type':isArticle?'BlogPosting':'WebPage','@id':p.canonical+(isArticle?'#article':'#webpage'),url:p.canonical,name:p.heading,headline:p.heading,description:p.description,datePublished:p.publishedAt,dateModified:p.modifiedAt,image:images.map(i=>new URL(i.src,origin).href),inLanguage:'en-US',...(isArticle?{keywords:[p.editorial.focusKeyword,...p.editorial.secondaryKeywords].filter(Boolean).join(', '),author:{'@type':'Person',name:p.author},publisher:{'@id':origin+'/#organization'},mainEntityOfPage:{'@id':p.canonical}}:{})};
 const extra=!isArticle?(old?.schema||[]).flatMap(raw=>{const d=JSON.parse(raw);return(d['@graph']||[d]).filter(n=>n['@type']==='Service'||(n['@type']==='FAQPage'&&currentFaqs===null));}):[];
 if(currentFaqs?.length)extra.push({'@type':'FAQPage','@id':p.canonical+'#faq',mainEntity:currentFaqs});
 if(!isArticle&&doc.seo?.schemaType==='Service'&&!extra.some(n=>n['@type']==='Service'))extra.push({'@type':'Service','@id':p.canonical+'#service',url:p.canonical,provider:{'@id':origin+'/#organization'}});
 for(const n of extra)if(n['@type']==='Service'){n.name=p.heading;n.description=p.description;}
 const website={'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:businessProfile.name,publisher:{'@id':origin+'/#organization'},inLanguage:'en-US'};
 main.isPartOf={'@id':website['@id']};
 p.schema=[JSON.stringify({'@context':'https://schema.org','@graph':[organization,website,main,breadcrumb,...extra]})];
 assertAddressIntegrity([p]);assertBuyingPolicy([p]);return p;
}
