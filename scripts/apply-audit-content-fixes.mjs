import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {load} from 'cheerio';
const file='src/data/pages.json',pages=JSON.parse(await fs.readFile(file,'utf8')),changes=[];
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const replacements=[
 ['During your appointment, our certified experts will assess your gold, diamonds, or watches. We use the latest technology and industry insights to evaluate your items thoroughly and transparently, explaining how we determine their market value.','During your appointment, our team assesses your items and explains the factors considered in a purchase evaluation.'],
 ['Our team of certified professionals ensures accurate and fair appraisals.','Our team explains the evaluation and the factors behind an offer.'],
 ['Get Paid Instantly','Agree on Payment'],
 ['If you accept our competitive offer, we finalize the deal with immediate payment. Choose your preferred payment method—cash, bank transfer, or check—for a quick and secure transaction.','If you accept an offer, confirm the payment method and timing before finalizing the sale. Payment options are cash, bank wire, or business check.'],
 ];
for(const p of pages){const before=p.html,record={path:p.path,changes:[]};
 function transform(html,log=false){const $=load(html,{},false);
  if(p.path==='/'){
   $('p,h4,h5').each((i,e)=>{const value=$(e).text().trim();const replacement=replacements.find(([from])=>value===from);if(replacement){$(e).text(replacement[1]);if(log)record.changes.push({type:'unsupported-claim',before:replacement[0],after:replacement[1]});}});
   $('h2').filter((i,e)=>/^[123]$/.test($(e).text().trim())).each((i,e)=>{$(e).replaceWith(`<span class="process-step-number" aria-hidden="true">${$(e).text()}</span>`);if(log)record.changes.push({type:'heading-semantics',reason:'Decorative step numbers are not section headings.'});});
   $('h4,h5').each((i,e)=>{e.tagName='h3';if(log)record.changes.push({type:'heading-semantics',reason:'Card headings follow their H2 section without skipping levels.'});});
  }
  $('a[href]').each((i,e)=>{const a=$(e),href=a.attr('href');if(href==='https://cash4goldanddiamond.com/author/'){a.attr('href','/author/navid-lalezari/');if(log)record.changes.push({type:'broken-link',before:href,after:a.attr('href')});}if(href==='https://cash4goldanddiamond.com/best-gold-jewelry-buyers-los-angeles-2026/'){const target=pages.find(p=>p.path==='/gold-buyer-downtown-los-angeles/');a.attr('href',target.path);if(!a.find('img').length)a.text(target.heading);if(log)record.changes.push({type:'broken-link',before:href,after:target.path,reason:'Existing source destination loops. Related working gold-buyer guide used for navigation; legacy URL disposition remains unresolved.'});}});
  return $.html();
 }
 const html=transform(p.html,true);
 if(record.changes.length){p.html=html;p.sections=(p.sections||[]).map(s=>({...s,html:transform(s.html)}));p.sourceText=load(html).text().replace(/\s+/g,' ').trim();record.beforeSha256=hash(before);record.afterSha256=hash(html);changes.push(record);}
}
await fs.writeFile(file,JSON.stringify(pages));
await fs.writeFile('migration/pre-deployment/content-fixes.json',JSON.stringify({changedAt:new Date().toISOString(),scope:'Explicit safe changes made during the predeployment audit. Original content remains in the original checkout and local pre-audit backup.',changes},null,2));
console.log(JSON.stringify(changes.map(c=>({path:c.path,changes:c.changes.length}))));
