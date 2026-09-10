import capturedProfiles from '../data/social-profiles.json' with {type:'json'};
export {capturedProfiles};
const networks=new Map([['instagram.com','Instagram'],['facebook.com','Facebook'],['yelp.com','Yelp'],['youtube.com','YouTube'],['tiktok.com','TikTok'],['linkedin.com','LinkedIn'],['pinterest.com','Pinterest'],['x.com','X'],['twitter.com','X']]);
export function normalizeSocialProfiles(values=capturedProfiles){
 if(!Array.isArray(values))throw new Error('Business social profiles must be a list.');
 const seen=new Set();
 return values.map(value=>{
  const url=new URL(typeof value==='string'?value:value.href),host=url.hostname.replace(/^www\./,'');
  if(url.protocol!=='https:'||url.username||url.password||url.port||!networks.has(host)||url.pathname==='/')throw new Error('Use an HTTPS social profile URL, not a network homepage or sign-in link.');
  if(/^\/(?:login|signin|share|sharer)(?:\.|\/|$)/i.test(url.pathname))throw new Error('Social link must point to the business profile.');
  return {label:networks.get(host),href:url.href};
 }).filter(profile=>{if(seen.has(profile.href))return false;seen.add(profile.href);return true;});
}
export function schemaWithSocialProfiles(raw,profiles){
 const data=JSON.parse(raw),graph=data['@graph']||[data];
 for(const entity of graph)if(entity['@id']==='https://cash4goldanddiamond.com/#organization')entity.sameAs=profiles.map(profile=>profile.href);
 return JSON.stringify(data).replace(/</g,'\\u003c');
}
