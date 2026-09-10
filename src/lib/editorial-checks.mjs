export function editorialChecks(doc){
 const text=(doc.body||[]).flatMap(b=>(b.children||[]).map(c=>c.text||'')).join(' ');
 const links=(doc.body||[]).flatMap(b=>b.markDefs||[]).filter(m=>['link','internalLink'].includes(m._type));
 const images=(doc.body||[]).filter(b=>['image','migratedImage'].includes(b._type));
 const headings=(doc.body||[]).filter(b=>/^h[1-6]$/.test(b.style));
 const seo=[
  ['SEO title present',Boolean(doc.seo?.title?.trim())],
  ['SEO title length reviewed (30–65 characters)',(doc.seo?.title?.trim().length||0)>=30&&(doc.seo?.title?.trim().length||0)<=65],
  ['Description length reviewed (70–170 characters)',(doc.seo?.description?.trim().length||0)>=70&&(doc.seo?.description?.trim().length||0)<=170],
  ['Meta description present',Boolean(doc.seo?.description?.trim())],
  ['Canonical URL present',Boolean(doc.seo?.canonical)],
  ['Page title present',Boolean(doc.title?.trim())],
  ['No duplicate H1 in body',headings.filter(b=>b.style==='h1').length===0],
  ['Images have alternative text',images.every(i=>i.alt?.trim())],
  ['Social image selected',Boolean(doc.seo?.socialImage?.asset||doc.seo?.sourceSocialImage)],
  ['Internal links present',links.some(l=>l.target?._ref||l.href?.startsWith('/')||l.href?.startsWith('https://cash4goldanddiamond.com/'))],
  ['Focus keyword assigned',Boolean(doc.seo?.focusKeyword?.trim())],
  ['Article images included',doc.kind!=='article'||images.length>0],
  ['Article has an outside reference',doc.kind!=='article'||links.some(l=>/^https:\/\//.test(l.href||'')&&!/^https:\/\/(www\.)?cash4goldanddiamond\.com\//.test(l.href))],
 ];
 const aeo=[
  ['Direct answer supplied',Boolean(doc.answer?.trim())],
  ['Author selected',Boolean(doc.author?._ref)],
  ['Publication date supplied',Boolean(doc.publishedAt)],
  ['Location linked',Boolean(doc.location?._ref)],
  ['Service linked',Boolean(doc.service?._ref)],
  ['Sources supplied',Boolean(doc.sources?.length)],
  ['Related content linked',Boolean(doc.related?.length)],
  ['Questions and answers supplied',Boolean(doc.faqs?.length)],
 ];
 const result=items=>({checks:items.map(([label,passed])=>({label,passed})),score:Math.round(items.filter(i=>i[1]).length/items.length*100)});
 return {seo:result(seo),aeo:result(aeo)};
}
export function validateRedirects(items){const byPath=new Map();const errors=[];for(const r of items){if(!/^\/(?!\/)/.test(r.from)||!/^\/(?!\/)/.test(r.to)||r.from.includes('?')||r.from.includes('#'))errors.push('Redirects must use local absolute paths.');if(byPath.has(r.from))errors.push('Duplicate redirect: '+r.from);byPath.set(r.from,r.to)}for(const from of byPath.keys()){const seen=new Set([from]);let to=byPath.get(from);while(byPath.has(to)){if(seen.has(to)){errors.push('Redirect loop: '+from);break}seen.add(to);to=byPath.get(to)}}return [...new Set(errors)]}
