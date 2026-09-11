import {buildEnvironment} from './build-environment';
import snapshot from '../data/pages.json';
import localRedirects from '../data/redirects.json';
import {createClient} from '@sanity/client';
import {applyImageOverrides} from './image-overrides.mjs';
import {applyAddressCorrections,assertAddressIntegrity,businessProfile} from './address-integrity.mjs';
import {projectCmsPage} from './cms-page.mjs';
import {assertBuyingPolicy} from './buying-policy.mjs';
import {releasePolicy} from './release-policy.mjs';
import {resolveRedirects} from './redirects.mjs';
import {validateNavigation} from './navigation-settings.mjs';
import {assertContentEnvironment,assertCmsPages} from './cms-release-gates.mjs';
import {normalizeSocialProfiles} from './social-profiles.mjs';
import {assertReleaseReview,writeReleaseCandidate,renderingSourceFingerprint} from './cms-release-fingerprint.mjs';
export {safeHtml} from './cms-page.mjs';

export const business=businessProfile;
export const navigation=[{label:'Home',href:'/'},{label:'About',href:'/about-us-sell-gold-and-diamonds-online/'},{label:'Start Selling',href:'/start-selling-gold-and-diamonds/'},{label:'Blogs',href:'/blogs/'},{label:'Reviews',href:'/reviews/'},{label:'FAQ',href:'/faqs/'},{label:'Contact Us',href:'/contact-us/'}];
export const services=[{label:'Sell Your Gold',href:'/sell-your-golds/'},{label:'Natural Diamonds',href:'/sell-your-diamonds-in-los-angeles/'},{label:'Large, Fine Gemstones',href:'/sell-gemstones-for-cash-in-los-angeles/'},{label:'Sell Your Watches',href:'/sell-luxury-watches-in-los-angeles/'},{label:'Estate & Antique Jewelry',href:'/sell-estate-jewelry-los-angeles/'}];
export type Page = (typeof snapshot)[number];
const escape=(s:unknown)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function configuredClient(){const projectId=import.meta.env.SANITY_PROJECT_ID,dataset=import.meta.env.SANITY_DATASET;const policy=releasePolicy(buildEnvironment);if(!projectId&&!dataset)return null;if(!projectId||!dataset)throw new Error('Configure both Sanity project and dataset.');return createClient({projectId,dataset,apiVersion:import.meta.env.SANITY_API_VERSION||'2026-09-09',useCdn:false,token:import.meta.env.SANITY_READ_TOKEN,perspective:policy.perspective});}
let settingsCache:Promise<{business:typeof business,navigation:typeof navigation,socialProfiles:ReturnType<typeof normalizeSocialProfiles>}>|undefined;
export function getSiteSettings(){return settingsCache??=(async()=>{const client=configuredClient();if(!client)return {business,navigation,socialProfiles:normalizeSocialProfiles()};const settings=await client.fetch('{"business":*[_id=="business-main"][0],"navigation":*[_id=="navigation-main"][0]}');const b=settings.business;if(b?.address&&b.address!==business.address)throw new Error('CMS business address does not match the owner-confirmed address. Review before publishing.');return {business:b?{...business,name:b.name||business.name,phone:b.phone||business.phone,tel:'tel:'+(b.phone||business.phone).replace(/[^+0-9]/g,''),email:b.email||business.email}:business,navigation:settings.navigation?.items?validateNavigation(settings.navigation.items):navigation,socialProfiles:normalizeSocialProfiles(b?.socialProfiles)};})();}
let rawRedirectCache:Promise<{from:string,to:string,status:number}[]>|undefined;
function getRawCmsRedirects(){return rawRedirectCache??=(async()=>{const client=configuredClient();const rows=client?await client.fetch('*[_type=="redirect"]{from,to,status}'):[];if(!Array.isArray(rows))throw new Error('Invalid CMS redirect response.');return rows as {from:string,to:string,status:number}[];})();}
let cached:Promise<Page[]>|undefined;
export function getPages():Promise<Page[]>{return cached??=(async()=>{
 assertContentEnvironment(buildEnvironment);
 const projectId=import.meta.env.SANITY_PROJECT_ID,dataset=import.meta.env.SANITY_DATASET;
 if(!projectId&&!dataset){const pages=applyAddressCorrections(snapshot);assertAddressIntegrity(pages);assertBuyingPolicy(pages);return applyImageOverrides(pages) as Page[];}
 if(!projectId||!dataset)throw new Error('Set both Sanity project and dataset, or leave both blank for local snapshot mode.');
 const client=configuredClient()!;
 const docs=await client.fetch('*[_type == "page"]{...,"reviewerDocument":reviewedBy->{_id,name},body[]{...,markDefs[]{...,target->{path}}},author->,related[]->{path,title},categories[]->{title},service->{title,"page":page->{path}},faqs[]->{question,answer}}');
 if(!docs.length)throw new Error('The configured Sanity dataset contains no pages. Import and verify staging content before selecting CMS mode.');
 assertCmsPages(docs,snapshot.map(page=>page.path),{production:import.meta.env.SITE_ENV==='production'});
 const result=new Map(snapshot.map(p=>[p.path,p as Page]));
 for(const doc of docs)result.set(doc.path,projectCmsPage(doc,result.get(doc.path),{projectId,dataset}) as Page);
 const pages=applyAddressCorrections([...result.values()]);assertAddressIntegrity(pages);assertBuyingPolicy(pages);
 const projected=applyImageOverrides(pages) as Page[];
 if(import.meta.env.SITE_ENV==='production'){
  const bundle={projectId,dataset,sourceFingerprint:renderingSourceFingerprint(),pages:projected,settings:await getSiteSettings(),redirects:resolveRedirects(localRedirects,await getRawCmsRedirects(),projected),features:{analyticsEnabled:import.meta.env.PUBLIC_ANALYTICS_ENABLED||'',analyticsId:import.meta.env.PUBLIC_GA4_MEASUREMENT_ID||'',analyticsEnvironment:import.meta.env.PUBLIC_ANALYTICS_ENV||'',googleVerification:import.meta.env.GOOGLE_SITE_VERIFICATION||'',bingVerification:import.meta.env.BING_SITE_VERIFICATION||'',indexing:import.meta.env.ENABLE_PRODUCTION_INDEXING||''}};
  writeReleaseCandidate(bundle);
  assertReleaseReview(bundle,buildEnvironment.CMS_RELEASE_REVIEW);
 }
 return projected;
})();}
let redirectCache:Promise<{from:string,to:string,status:number}[]>|undefined;
export function getRedirects(){return redirectCache??=(async()=>resolveRedirects(localRedirects,await getRawCmsRedirects(),await getPages()))();}
