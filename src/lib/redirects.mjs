export function isLocalPath(value){
 if(typeof value!=='string'||!/^\/(?!\/)(?:[^?#\\\s]*\/)?$/.test(value))return false;
 try{const decoded=decodeURIComponent(value);return !decoded.includes('..')&&!/[?#\\\x00-\x20]/.test(decoded)&&!decoded.startsWith('//');}catch{return false;}
}
export function resolveRedirects(local,cms=[],pages=[]){
 const rules=new Map(Object.entries(local).map(([from,to])=>[from,{from,to,status:301}]));
 const seen=new Set();
 for(const r of cms){if(seen.has(r.from))throw new Error('Duplicate CMS redirect: '+r.from);seen.add(r.from);rules.set(r.from,{from:r.from,to:r.to,status:r.status??301});}
 const pagePaths=new Set(pages.map(p=>p.path));
 for(const r of rules.values()){
  if(!isLocalPath(r.from)||!isLocalPath(r.to)||![301,302].includes(r.status))throw new Error('Invalid redirect: '+JSON.stringify(r));
  if(pagePaths.has(r.from))throw new Error('Redirect conflicts with an existing page: '+r.from);
  const chain=new Set([r.from]);let to=r.to;
  while(rules.has(to)){if(chain.has(to))throw new Error('Redirect loop: '+r.from);chain.add(to);to=rules.get(to).to;}
  if(!pagePaths.has(to))throw new Error('Missing redirect destination: '+r.from+' -> '+to);
 }
 return [...rules.values()];
}
