import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';

export const metrics=['first-contentful-paint','largest-contentful-paint','speed-index','total-blocking-time','cumulative-layout-shift'];
export const routes=[['home','/'],['gold','/sell-your-golds/'],['diamonds','/sell-your-diamonds-in-los-angeles/'],['watches','/sell-luxury-watches-in-los-angeles/'],['reviews','/reviews/'],['blogs','/blogs/'],['contact','/contact-us/'],['article-14k','/14k-gold-price-per-gram-los-angeles/'],['estate','/sell-estate-jewelry-los-angeles/']];
export const budgets={source:'CASH4GOLD_MASTER_BUILD_PLAN_v1.md PERF-02/PERF-03; project lab targets, not field CWV proof',performanceScore:{mobile:90,desktop:95},metrics:{'first-contentful-paint':1800,'total-blocking-time':200},resourceBytes:{javascript:80_000,css:50_000,fonts:100_000,mobileTotal:1_000_000},heroImageReviewBytes:200_000};

export function statistics(values){
 assert.ok(values.length>0&&values.every(Number.isFinite),'Samples must be present and finite.');
 const sorted=values.toSorted((a,b)=>a-b),middle=Math.floor(sorted.length/2);
 return {minimum:sorted[0],median:sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2,maximum:sorted.at(-1)};
}
export function isolatedBuildDirectory(root,configured){
 const expected=path.resolve(root,'.cache/production-audit'),selected=path.resolve(configured||expected);
 assert.equal(selected,expected,'Only this checkout\'s .cache/production-audit may be served.');
 assert.equal(fs.realpathSync(selected),expected,'Build directory may not resolve outside the isolated output.');
 return selected;
}
export function assertExpectedHead(actual,expected,ci){
 if(ci)assert.ok(expected,'CI requires the expected PR/dispatch commit.');
 if(expected){assert.match(expected,/^[0-9a-f]{40}$/i,'Expected commit must be a full SHA.');assert.equal(actual,expected,'Checkout is not the expected source commit.');}
}
export function inspectResult(lhr,{origin,route,formFactor}){
 assert.equal(lhr.configSettings.formFactor,formFactor);
 assert.ok(!lhr.runtimeError,'Lighthouse runtime error: '+lhr.runtimeError?.code);
 const final=new URL(lhr.finalDisplayedUrl||lhr.finalUrl);
 assert.equal(final.origin,origin,'Lighthouse left the loopback origin.');
 assert.equal(final.pathname,route,'Lighthouse measured an unexpected route.');
 assert.ok(Number.isFinite(lhr.categories.performance.score)&&lhr.categories.performance.score>=0&&lhr.categories.performance.score<=1,'Performance score is missing or invalid.');
 assert.ok(metrics.every(id=>Number.isFinite(lhr.audits[id]?.numericValue)&&lhr.audits[id].numericValue>=0),'A required metric is missing or invalid.');
 const requests=lhr.audits['network-requests']?.details?.items;
 assert.ok(Array.isArray(requests)&&requests.length,'Network request evidence is required.');
 const bytes={javascript:0,css:0,fonts:0,total:0,largestImage:0};
 for(const request of requests){
  if(/^(data:|blob:)/.test(request.url))continue;
  const url=new URL(request.url);assert.equal(url.origin,origin,'Page requested an external origin: '+url.origin);
  assert.ok(request.finished===true&&Number.isFinite(request.statusCode)&&request.statusCode>=200&&request.statusCode<400,'Page resource failed: '+url.pathname);
  assert.ok(Number.isFinite(request.transferSize)&&request.transferSize>=0,'Resource transfer evidence is missing.');
  bytes.total+=request.transferSize;
  if(request.resourceType==='Script')bytes.javascript+=request.transferSize;
  if(request.resourceType==='Stylesheet')bytes.css+=request.transferSize;
  if(request.resourceType==='Font')bytes.fonts+=request.transferSize;
  if(request.resourceType==='Image')bytes.largestImage=Math.max(bytes.largestImage,request.transferSize);
 }
 return bytes;
}
export function budgetFailures(aggregates){
 const failures=[];
 for(const row of aggregates){
  const add=(budget,actual,maximum)=>{if(actual>maximum)failures.push({name:row.name,formFactor:row.formFactor,budget,actual,maximum});};
  if(row.performanceScore.median<budgets.performanceScore[row.formFactor])failures.push({name:row.name,formFactor:row.formFactor,budget:'performanceScore',actual:row.performanceScore.median,minimum:budgets.performanceScore[row.formFactor]});
  for(const [metric,maximum]of Object.entries(budgets.metrics))add(metric,row.metrics[metric].median,maximum);
  for(const metric of ['javascript','css','fonts'])add(metric+'TransferBytes',row.resourceBytes[metric].median,budgets.resourceBytes[metric]);
  if(row.formFactor==='mobile')add('totalTransferBytes',row.resourceBytes.total.median,budgets.resourceBytes.mobileTotal);
 }
 return failures;
}
