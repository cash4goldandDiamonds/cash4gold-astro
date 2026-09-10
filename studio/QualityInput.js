import React, {useEffect, useMemo, useState} from 'react';
import {useFormValue, useClient} from 'sanity';
import {editorialChecks} from '../src/lib/editorial-checks.mjs';
import {inspectSeoPeers} from '../src/lib/seo-site-checks.mjs';
const h=React.createElement;
export default function QualityInput(){
 const doc=useFormValue([])||{}, report=editorialChecks(doc), client=useClient({apiVersion:'2026-09-09'});
 const [catalog,setCatalog]=useState(null),[error,setError]=useState(false),[revision,setRevision]=useState(0),[readAt,setReadAt]=useState('');
 useEffect(()=>{let active=true;setError(false);client.withConfig({perspective:'drafts'}).fetch('*[_type=="page"]{_id,path,title,kind,seo{title,description,canonical,focusKeyword},related[]{_ref},body[]{markDefs[]{_type,href,target}}}').then(rows=>{if(active){setCatalog(rows);setReadAt(new Date().toISOString());}}).catch(()=>{if(active)setError(true);});return ()=>{active=false;};},[client,revision]);
 const peers=useMemo(()=>catalog?inspectSeoPeers(doc,catalog):null,[doc,catalog]);
 const list=(title,rows)=>h('section',{key:title},h('h4',null,title),rows.length?h('ul',null,...rows.map((row,i)=>h('li',{key:i},row.path||row.href||row.reference||'Unresolved reference',row.canonicalAlias?' (shared canonical; review the alias policy)':''))):h('p',null,'None found within the checked scope.'));
 return h('div',{style:{padding:'1rem',lineHeight:1.6}},
  h('p',null,'Project editorial heuristic—not a Google score or a ranking prediction. Length guidance is a review prompt; preserve legitimate exceptions.'),
  h('section',{'aria-label':'Search snippet preview',style:{border:'1px solid currentColor',padding:'1rem',borderRadius:8}},h('small',null,'Approximate snippet; search engines may display different text.'),h('p',null,doc.seo?.canonical||'https://cash4goldanddiamond.com'+(doc.path||'/')),h('h3',null,doc.seo?.title||doc.title||'Add a title'),h('p',null,doc.seo?.description||'Add a description'),h('small',null,`${(doc.seo?.title||'').length} title characters · ${(doc.seo?.description||'').length} description characters; about 160 is guidance, not a ranking rule.`)),
  ...Object.entries(report).map(([name,value])=>h('section',{key:name},h('h3',null,(name==='seo'?'SEO':'AEO / GEO')+' · '+value.score+'% of project checks'),h('ul',null,...value.checks.map(c=>h('li',{key:c.label},(c.passed?'✓':'○')+' '+c.label))))),
  h('h3',null,'Cross-page checks'),h('button',{type:'button',onClick:()=>setRevision(value=>value+1)},'Refresh CMS checks'),
  error?h('p',{role:'status'},'CMS comparison unavailable. The single-document checks above do not prove whole-site compliance.'):peers?h(React.Fragment,null,h('p',null,'Read from this dataset: '+readAt),h('p',null,peers.scope),peers.canonicalWarning&&h('p',{role:'status'},peers.canonicalWarning),list('Duplicate SEO titles',peers.duplicateTitles),list('Duplicate descriptions',peers.duplicateDescriptions),list('Overlapping primary topics',peers.overlappingTopics),list('Incoming content links',peers.inbound),list('Broken or unresolved content references',peers.brokenReferences)):h('p',{role:'status'},'Loading the CMS comparison…'),
  h('p',null,'Run the saved-build audit to check navigation, redirect destinations, fragments, schema and actual HTML. A checklist is not a publication approval.'));
}
