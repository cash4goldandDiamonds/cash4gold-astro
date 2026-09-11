import {CONSENT_STORAGE_KEY,readConsent,createConsent,safeConversion} from '../lib/privacy-consent.mjs';
export function initializePrivacyControls(){
 const root=document.querySelector('[data-privacy-controls]');if(!root||root.dataset.ready)return;root.dataset.ready='true';
 const dialog=root.querySelector('[data-privacy-dialog]'),choice=root.querySelector('[data-analytics-choice]'),status=root.querySelector('[data-privacy-status]');
 const id=root.dataset.analyticsId,enabled=root.dataset.analyticsEnabled==='true'&&/^G-[A-Z0-9]{4,20}$/.test(id||'');
 // Use the build-known route, including /404/, instead of an arbitrary requested URL.
 const pagePath=safeConversion('phone_click',root.dataset.analyticsPath)?.parameters.page_path||'/404/';
 let consent;try{consent=readConsent(localStorage.getItem(CONSENT_STORAGE_KEY));}catch{consent=null;}
 let loaded=false,loading=false;
 function gtag(){window.dataLayer=window.dataLayer||[];window.dataLayer.push(arguments);}
 const update=analytics=>{gtag('consent','update',{analytics_storage:analytics?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});};
 const load=()=>{
  if(!enabled||!consent?.analytics||loaded||loading)return;loading=true;
  window['ga-disable-'+id]=false;
  // Basic consent mode: no Google script or request before affirmative consent.
  gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});update(true);gtag('js',new Date());
  let referrer='';try{referrer=document.referrer?new URL(document.referrer).origin:'';}catch{}
  gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,ignore_referrer:false,page_location:location.origin+pagePath,page_referrer:referrer});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);script.dataset.optionalAnalytics='true';
  script.onload=()=>{loading=false;loaded=true;if(consent?.analytics)gtag('event','page_view',{page_location:location.origin+pagePath,page_referrer:referrer,...(root.dataset.analyticsEnvironment==='preview'?{debug_mode:true}:{})});};
  script.onerror=()=>{loading=false;status.textContent='Analytics could not load. Contact options still work.';};document.head.append(script);
 };
 const eraseAnalyticsCookies=()=>{
  const names=document.cookie.split(';').map(v=>v.split('=')[0].trim()).filter(name=>/^_ga(?:_|$)|^_gid$|^_gat/.test(name));
  const parts=location.hostname.split('.');const domains=['',...parts.map((_,i)=>'.'+parts.slice(i).join('.'))];
  for(const name of names)for(const domain of domains)document.cookie=name+'=; Max-Age=0; Path=/; SameSite=Lax'+(domain?'; Domain='+domain:'');
 };
 const save=analytics=>{
  const prior=consent?.analytics;consent=createConsent(enabled&&analytics);try{localStorage.setItem(CONSENT_STORAGE_KEY,JSON.stringify(consent));}catch{status.textContent='Your choice applies to this page. Browser storage is unavailable.';}
  choice.checked=consent.analytics;dialog.close();
  if(!consent.analytics){window['ga-disable-'+id]=true;if(loaded||loading)update(false);eraseAnalyticsCookies();status.textContent='Optional analytics is off.';if(prior&&(loaded||loading))location.reload();}
  else{status.textContent='Optional analytics is on. You can change your choice at any time.';load();}
 };
 const open=()=>{choice.checked=Boolean(consent?.analytics);dialog.showModal();};
 root.querySelector('[data-open-privacy]').addEventListener('click',open);root.querySelector('[data-close-privacy]').addEventListener('click',()=>dialog.close());root.querySelector('[data-reject-analytics]').addEventListener('click',()=>save(false));root.querySelector('[data-save-privacy]').addEventListener('click',()=>save(choice.checked));
 const track=name=>{
  if(!enabled||!consent?.analytics||!loaded)return;const event=safeConversion(name,pagePath);if(event)gtag('event',event.name,{...event.parameters,...(root.dataset.analyticsEnvironment==='preview'?{debug_mode:true}:{})});
 };
 document.addEventListener('click',event=>{
  const anchor=event.target instanceof Element?event.target.closest('a[href]'):null;if(!anchor)return;let u;try{u=new URL(anchor.href,location.href);}catch{return;}
  if(u.protocol==='tel:')track('phone_click');else if(u.protocol==='mailto:')track('email_click');else if(u.hostname==='calendly.com')track('appointment_click');else if((u.hostname==='www.google.com'&&u.pathname.startsWith('/maps'))||u.hostname==='maps.app.goo.gl')track('directions_click');
 });
 window.addEventListener('cash4gold:inquiry-accepted',()=>track('inquiry_accepted'));
 window.addEventListener('storage',event=>{if(event.key===CONSENT_STORAGE_KEY){try{consent=readConsent(localStorage.getItem(CONSENT_STORAGE_KEY));}catch{consent=null;}if(!consent?.analytics&&(loaded||loading)){window['ga-disable-'+id]=true;eraseAnalyticsCookies();location.reload();}else load();}});
 if(enabled&&!consent)open();else load();
}
