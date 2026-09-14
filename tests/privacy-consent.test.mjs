import test from 'node:test';
import assert from 'node:assert/strict';
import {readConsent,createConsent,CONSENT_LIFETIME,safeConversion,analyticsSettings} from '../src/lib/privacy-consent.mjs';
test('consent fails closed for missing, stale, future, malformed or nonboolean choices',()=>{
 const now=1000000000000;
 for(const raw of [null,'bad','{}',JSON.stringify({version:1,analytics:'yes',updatedAt:now}),JSON.stringify({version:1,analytics:true,updatedAt:now+1}),JSON.stringify({version:1,analytics:true,updatedAt:now-CONSENT_LIFETIME-1})])assert.equal(readConsent(raw,now),null);
 assert.equal(readConsent(JSON.stringify(createConsent(true,now)),now).analytics,true);assert.equal(readConsent(JSON.stringify(createConsent(false,now)),now).analytics,false);
});
test('analytics needs an explicit matching environment and valid public measurement id',()=>{
 const settings={enabled:'true',id:'G-TESTONLY',environment:'preview',siteEnvironment:'preview'};assert.equal(analyticsSettings(settings).enabled,true);
 for(const change of [{enabled:'false'},{environment:'production'},{id:'<script>'},{siteEnvironment:'other'}])assert.equal(analyticsSettings({...settings,...change}).enabled,false);
});
test('the existing live WordPress destination is never enabled by a preview environment label',()=>{
 const settings={enabled:'true',id:'G-149Y3HZKHT',environment:'preview',siteEnvironment:'preview'};
 assert.equal(analyticsSettings(settings).enabled,false);
 assert.equal(analyticsSettings({...settings,environment:'production',siteEnvironment:'production'}).enabled,true);
});
test('conversion events have fixed meanings and cannot contain query parameters or customer fields',()=>{
 assert.deepEqual(safeConversion('inquiry_accepted','/contact-us/'),{name:'inquiry_accepted',parameters:{page_path:'/contact-us/'}});
 for(const name of ['booking_confirmed','form_delivered','purchase','unknown'])assert.equal(safeConversion(name,'/contact-us/'),null);
 for(const path of ['/contact-us/?email=private','//elsewhere.invalid','/contact-us/#customer'])assert.equal(safeConversion('phone_click',path),null);
});
