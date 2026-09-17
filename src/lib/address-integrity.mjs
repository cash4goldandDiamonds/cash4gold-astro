import profile from '../data/business-profile.json' with {type:'json'};
import {siteOrigin} from './release-policy.mjs';

const corrections=[
 {path:'/best-gemstone-ring-buyers-los-angeles/',pattern:/\b550\s+S\.?\s+Hill\s+St(?:reet)?\.?[,]?\s+Suite\s+564\b/gi},
 {path:'/loose-diamond-appraisal-downtown-los-angeles/',pattern:/\b609\s+S\.?\s+Hill\s+St(?:reet)?\b/gi},
];
export function correctAddressText(text,path){
 for(const correction of corrections)if(path===correction.path)text=text.replace(correction.pattern,profile.streetAddress);
 return text;
}
const mapUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(profile.name+' '+profile.address);
function visit(value,path){
 if(typeof value==='string')return correctAddressText(value,path);
 if(Array.isArray(value))return value.map(v=>visit(v,path));
 if(!value||typeof value!=='object')return value;
 const result=Object.fromEntries(Object.entries(value).map(([key,v])=>[key,visit(v,path)]));
 if(/^https:\/\/cash4goldanddiamond\.com\/#(?:place|organization)$/.test(result['@id']||'')&&result.address){
  result.address={'@type':'PostalAddress',streetAddress:profile.streetAddress,addressLocality:profile.city,addressRegion:profile.region,postalCode:profile.postalCode,addressCountry:profile.country};
  if(result.geo||result.hasMap){delete result.geo;result.hasMap=mapUrl;}
  if(result['@type']==='JewelryStore'&&profile.logo){result.image=siteOrigin+profile.logo;result.logo={'@type':'ImageObject',url:siteOrigin+profile.logo};}
 }
 return result;
}
export function applyAddressCorrections(pages){return pages.map(page=>{
 const corrected=visit(page,page.path);
 corrected.schema=(page.schema||[]).map(s=>{try{return JSON.stringify(visit(JSON.parse(s),page.path));}catch{return correctAddressText(s,page.path);}});
 return corrected;
});}
export function assertAddressIntegrity(pages){
 const failures=[];
 for(const page of pages){
  if(/\b(?:550|609)\s+(?:S\.?|South)\s+Hill\b/i.test(JSON.stringify(page)))failures.push(page.path+': known incorrect business address');
  for(const match of JSON.stringify(page).matchAll(/\b(\d{2,5})\s+(?:S\.?|South)\s+Hill\s+(?:St(?:reet)?\.?)/gi))if(match[1]!=='617')failures.push(page.path+': unconfirmed Hill Street address');
  for(const raw of page.schema||[]){
   const inspect=value=>{if(!value||typeof value!=='object')return;if(/^https:\/\/cash4goldanddiamond\.com\/#(?:place|organization)$/.test(value['@id']||'')&&value.address){for(const [key,expected]of Object.entries({streetAddress:profile.streetAddress,addressLocality:profile.city,addressRegion:profile.region,postalCode:profile.postalCode})){if(value.address[key]!==expected)failures.push(page.path+': business schema '+key);}}for(const v of Object.values(value))if(typeof v==='object')inspect(v);};
   try{inspect(JSON.parse(raw));}catch{failures.push(page.path+': invalid location metadata');}
  }
 }
 if(failures.length)throw new Error('Address verification failed:\n'+failures.join('\n'));
 return true;
}
export {profile as businessProfile};
