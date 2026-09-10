import fs from 'node:fs/promises';
const base='http://127.0.0.1:4323',rows=[],errors=[];
for(const path of ['/','/blogs/','/contact-us/','/best-gold-jewelry-buyers-los-angeles-2026/','/audit-deliberately-missing-20260910/'])for(const method of ['GET','HEAD']){
 const response=await fetch(base+path,{method,redirect:'manual',signal:AbortSignal.timeout(10_000)}),expected=path.includes('deliberately-missing')?404:200;
 const html=method==='GET'?await response.text():'';const row={path,method,status:response.status,expected,html:response.headers.get('content-type'),previewNoindex:method==='GET'?/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html):null};rows.push(row);
 if(row.status!==expected||method==='GET'&&!row.previewNoindex)errors.push(row);
}
const report={checkedAt:new Date().toISOString(),scope:'Actual loopback Astro preview GET/HEAD only. Does not test Cloudflare _headers/_redirects, browser caches, public Access, forms, messages or live leads.',rows,errors};await fs.writeFile('migration/pre-deployment/preview-http-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(errors.length)process.exitCode=1;
