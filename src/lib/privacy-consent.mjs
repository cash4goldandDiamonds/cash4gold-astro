export const CONSENT_STORAGE_KEY='cash4gold-privacy-v1';
export const CONSENT_LIFETIME=180*24*60*60*1000;
export function readConsent(raw,now=Date.now()){
 try{const value=JSON.parse(raw);if(value?.version===1&&typeof value.analytics==='boolean'&&Number.isFinite(value.updatedAt)&&value.updatedAt<=now&&now-value.updatedAt<=CONSENT_LIFETIME)return {version:1,analytics:value.analytics,updatedAt:value.updatedAt};}catch{}
 return null;
}
export function createConsent(analytics,now=Date.now()){return {version:1,analytics:analytics===true,updatedAt:now};}
export const CONVERSION_EVENTS=new Set(['phone_click','email_click','directions_click','appointment_click','inquiry_accepted']);
export function safeConversion(name,pathname){
 if(!CONVERSION_EVENTS.has(name)||typeof pathname!=='string'||!/^\/(?!\/)[^?#\s]*$/.test(pathname))return null;
 return {name,parameters:{page_path:pathname}};
}
export function analyticsSettings({enabled,id,environment,siteEnvironment}){
 return {enabled:enabled==='true'&&/^G-[A-Z0-9]{4,20}$/.test(id||'')&&environment===siteEnvironment&&['preview','production'].includes(environment),id:/^G-[A-Z0-9]{4,20}$/.test(id||'')?id:'',environment};
}
