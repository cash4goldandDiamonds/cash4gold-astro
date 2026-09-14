import {CONSENT_STORAGE_KEY,CONSENT_LIFETIME,readConsent,createConsent,safeConversion,analyticsSettings} from '../lib/privacy-consent.mjs';
export function initializePrivacyControls(){
 const root=document.querySelector('[data-privacy-controls]');if(!root||root.dataset.ready)return;root.dataset.ready='true';
 const dialog=root.querySelector('[data-privacy-dialog]'),choice=root.querySelector('[data-analytics-choice]'),status=root.querySelector('[data-privacy-status]');
 const id=root.dataset.analyticsId,environment=root.dataset.analyticsEnvironment;
 const {enabled}=analyticsSettings({enabled:root.dataset.analyticsEnabled,id,environment,siteEnvironment:environment});
 // Use the build-known route, including /404/, instead of an arbitrary requested URL.
 const pagePath=safeConversion('phone_click',root.dataset.analyticsPath)?.parameters.page_path||'/404/';
 let consent;try{consent=readConsent(localStorage.getItem(CONSENT_STORAGE_KEY));}catch{consent=null;}
 let loaded=false,loading=false,expiryTimer;
 function gtag(){window.dataLayer=window.dataLayer||[];window.dataLayer.push(arguments);}
 const update=analytics=>{gtag('consent','update',{analytics_storage:analytics?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});};
 const load=()=>{
  if(!hasConsent()||loaded||loading)return;loading=true;
  window['ga-disable-'+id]=false;
  // Basic consent mode: no Google script or request before affirmative consent.
  gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});update(true);gtag('js',new Date());
  let referrer='';try{referrer=document.referrer?new URL(document.referrer).origin:'';}catch{}
  gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,ignore_referrer:false,page_location:location.origin+pagePath,page_referrer:referrer});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);script.dataset.optionalAnalytics='true';
  script.onload=()=>{loading=false;loaded=true;if(hasConsent())gtag('event','page_view',{send_to:id,page_location:location.origin+pagePath,page_referrer:referrer,...(environment==='preview'?{debug_mode:true}:{})});};
  script.onerror=()=>{loading=false;status.textContent='Analytics could not load. Contact options still work.';};document.head.append(script);
  scheduleExpiry();
 };
 const eraseAnalyticsCookies=()=>{
  const names=document.cookie.split(';').map(v=>v.split('=')[0].trim()).filter(name=>/^_ga(?:_|$)|^_gid$|^_gat/.test(name));
  const parts=location.hostname.split('.');const domains=['',...parts.map((_,i)=>'.'+parts.slice(i).join('.'))];
  for(const name of names)for(const domain of domains)document.cookie=name+'=; Max-Age=0; Path=/; SameSite=Lax'+(domain?'; Domain='+domain:'');
 };
 const save=analytics=>{
  consent=createConsent(enabled&&analytics);let storageUnavailable=false,reloadSafe=true;
  try{localStorage.setItem(CONSENT_STORAGE_KEY,JSON.stringify(consent));}catch{
   storageUnavailable=true;
   if(!consent.analytics){
    // A quota/write failure can leave the old grant readable. Remove it before
    // reloading; if removal also fails, stay disabled on this page.
    reloadSafe=false;
    try{localStorage.removeItem(CONSENT_STORAGE_KEY);reloadSafe=localStorage.getItem(CONSENT_STORAGE_KEY)===null;}catch{}
   }
  }
  choice.checked=consent.analytics;dialog.close();
  status.textContent=consent.analytics?'Optional analytics is on. You can change your choice at any time.':'Optional analytics is off.';
  if(storageUnavailable)status.textContent+=' Your choice applies to this page. Browser storage is unavailable.';
  if(!consent.analytics)stop(reloadSafe);else{
   if(loaded||loading){window['ga-disable-'+id]=false;update(true);}
   load();scheduleExpiry();
  }
 };
 const stop=(reload=true)=>{
  window.clearTimeout(expiryTimer);choice.checked=false;
  if(id)window['ga-disable-'+id]=true;
  if(loaded||loading)update(false);
  eraseAnalyticsCookies();
  // Reload removes an already-running Google tag, including its automatic timers.
  if(reload&&(loaded||loading))location.reload();
 };
 const hasConsent=()=>{
  if(!enabled||!consent?.analytics)return false;
  if(readConsent(JSON.stringify(consent)))return true;
  consent=null;status.textContent='Your analytics choice has expired. Optional analytics is off.';stop();return false;
 };
 const scheduleExpiry=()=>{
  window.clearTimeout(expiryTimer);if(!hasConsent())return;
  // Browsers cap timer delays near 24.8 days; consent lasts 180 days.
  expiryTimer=window.setTimeout(()=>{if(hasConsent())scheduleExpiry();},Math.min(2_147_483_647,consent.updatedAt+CONSENT_LIFETIME-Date.now()+1));
 };
 const open=()=>{choice.checked=hasConsent();dialog.showModal();};
 root.querySelector('[data-open-privacy]').addEventListener('click',open);root.querySelector('[data-close-privacy]').addEventListener('click',()=>dialog.close());root.querySelector('[data-reject-analytics]').addEventListener('click',()=>save(false));root.querySelector('[data-save-privacy]').addEventListener('click',()=>save(choice.checked));
 const track=name=>{
  if(!hasConsent()||!loaded)return;const event=safeConversion(name,pagePath);if(event)gtag('event',event.name,{send_to:id,...event.parameters,...(environment==='preview'?{debug_mode:true}:{})});
 };
 document.addEventListener('click',event=>{
  const anchor=event.target instanceof Element?event.target.closest('a[href]'):null;if(!anchor)return;let u;try{u=new URL(anchor.href,location.href);}catch{return;}
  if(u.protocol==='tel:')track('phone_click');else if(u.protocol==='mailto:')track('email_click');else if(u.hostname==='calendly.com')track('appointment_click');else if((u.hostname==='www.google.com'&&u.pathname.startsWith('/maps'))||u.hostname==='maps.app.goo.gl')track('directions_click');
 });
 window.addEventListener('cash4gold:inquiry-accepted',()=>track('inquiry_accepted'));
 window.addEventListener('storage',event=>{
  // clear() emits key=null. Session-storage changes are unrelated to this choice.
  if((event.key!==CONSENT_STORAGE_KEY&&event.key!==null)||(event.storageArea&&event.storageArea!==localStorage))return;
  try{consent=readConsent(localStorage.getItem(CONSENT_STORAGE_KEY));}catch{consent=null;}
  if(!consent?.analytics){status.textContent='Optional analytics is off.';stop();}else{load();scheduleExpiry();}
 });
 // Timers may pause in sleeping/background tabs or in the back/forward cache.
 window.addEventListener('pageshow',()=>{if(hasConsent())scheduleExpiry();});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&hasConsent())scheduleExpiry();});
 if(enabled&&!consent)open();else load();
}
