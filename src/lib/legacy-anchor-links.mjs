import {load} from 'cheerio';

const origin='https://cash4goldanddiamond.com';
const ownedHosts=new Set(['cash4goldanddiamond.com','www.cash4goldanddiamond.com']);
const escapeAttribute=(value,quote)=>value.replace(/[&<>"'`=\s]/g,char=>{
 if(char==='&')return '&amp;';
 if(char==='<')return '&lt;';
 if(char==='>')return '&gt;';
 return char===quote||!quote?`&#${char.charCodeAt(0)};`:char;
});

// Receives validated getRedirects() rules. Resolve chains without changing rules or source data.
export function createLegacyAnchorNormalizer(redirects,pagePath='/'){
 const rules=new Map(redirects.map(({from,to,status=301})=>[from,{to,status}])),destinations=new Map();
 for(const from of rules.keys()){
  const seen=new Set();let current=from,to=null;
  while(rules.has(current)){
   if(seen.has(current))throw new Error('Redirect loop while rendering anchor: '+from);
   seen.add(current);
   const rule=rules.get(current);
   // Temporary destinations must retain their intended redirect behavior.
   if(rule.status!==301){to=null;break;}
   to=rule.to;current=to;
  }
  if(to)destinations.set(from,to);
 }
 const base=new URL(pagePath,origin);
 return function normalizeLegacyAnchors(html){
  if(!destinations.size||typeof html!=='string'||!html)return html;
  const $=load(html,{sourceCodeLocationInfo:true},false),edits=new Map();
  $('a[href]').each((_,node)=>{
   const href=$(node).attr('href');
   if(!href||/^[?#]/.test(href)||/[\\\x00-\x20]/.test(href))return;
   let url;try{url=new URL(href,base);}catch{return;}
   if(!['http:','https:'].includes(url.protocol)||!ownedHosts.has(url.hostname)||url.username||url.password||url.port)return;
   const key=url.pathname.endsWith('/')?url.pathname:url.pathname+'/',target=destinations.get(key);
   if(!target)return;
   const absolute=/^(?:https?:)?\/\//i.test(href);
   const next=(absolute?origin:'')+target+url.search+url.hash;
   const location=node.sourceCodeLocation?.attrs?.href;
   if(!location)return;
   const attribute=html.slice(location.startOffset,location.endOffset);
   const prefix=attribute.match(/^[^\s=]+\s*=\s*(["']?)/);
   if(!prefix)return;
   const quote=prefix[1];
   if(quote&&!attribute.endsWith(quote))return;
   edits.set(location.startOffset,{end:location.endOffset,value:prefix[0]+escapeAttribute(next,quote)+quote});
  });
  // Source offsets preserve every byte outside matched href attributes, including text/entities.
  for(const [start,{end,value}] of [...edits].sort((a,b)=>b[0]-a[0]))html=html.slice(0,start)+value+html.slice(end);
  return html;
 };
}
