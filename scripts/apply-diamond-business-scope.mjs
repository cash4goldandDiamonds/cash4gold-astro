import fs from 'node:fs/promises';
import {load} from 'cheerio';
import {assertAddressIntegrity} from '../src/lib/address-integrity.mjs';
const file='src/data/pages.json';
const pages=JSON.parse(await fs.readFile(file,'utf8'));
const revisions=JSON.parse(await fs.readFile('migration/editorial-revisions.json','utf8'));
const p=pages.find(p=>p.path==='/sell-your-diamonds-in-los-angeles/');
const $=load(p.html,{},false);
$('h1').text('Natural Diamond Buyers in Los Angeles');
const intro=$('p').filter((i,e)=>$(e).text().startsWith('Looking for trusted diamond buyers')).first();
if(!intro.length)throw new Error('Missing known diamond service introduction');
intro.html('Cash 4 Gold &amp; Diamonds buys natural, cut and polished diamonds in Downtown Los Angeles—any size, any shape, loose or set in jewelry. We welcome large individual diamonds, engagement rings, eternity bands, estate pieces and collections. <strong>We buy natural diamonds only. We do not buy laboratory-grown, uncut or rough diamonds.</strong>');
intro.next('.diamond-scope-link').remove();
intro.after('<p class="diamond-scope-link">Have a substantial stone or diamond collection? See our <a href="/large-diamond-buyer-los-angeles/">large natural diamond buying guide</a> for the shapes, jewelry and documents to bring.</p>');
for(const e of $('p,li').toArray()){
 const el=$(e),text=el.text().trim();
 if(text==='We evaluate many types of diamonds and diamond jewelry, including:')el.text('We buy natural polished diamonds of any size and shape, including these loose stones and jewelry pieces:');
 if(text==='Yes. We evaluate loose diamonds as well as diamonds mounted in engagement rings and other jewelry.')el.text('Yes. We buy loose natural polished diamonds of any size and shape, as well as natural diamonds in engagement rings and other jewelry. We do not buy laboratory-grown or uncut diamonds.');
 if(text==='After the evaluation, we explain our offer so you can decide whether selling your diamond is right for you. If you accept the offer, available payment options may include cash, check, or bank transfer.')el.text('After the evaluation, we explain our offer so you can decide whether selling your diamond is right for you. Cash, bank wire and business-check payment are available for agreed purchases. Confirm the payment arrangements before accepting.');
 if(text==='GIA-graded and non-certified diamonds evaluated')el.text('Natural diamonds evaluated with or without existing grading reports');
}
p.title='Natural Diamond Buyers Los Angeles | Any Size & Shape';p.heading='Natural Diamond Buyers in Los Angeles';p.description='Sell natural diamonds in Downtown Los Angeles: any size, any shape, loose or in jewelry. Cash, wire or business check. No lab-grown or uncut diamonds.';
p.html=$.html();p.sections=[];p.sourceText=$.text().replace(/\s+/g,' ').trim();p.modifiedAt=new Date().toISOString();
for(const name of ['og:title','twitter:title','og:description','twitter:description']){p.meta=p.meta.filter(m=>m.name!==name);p.meta.push({name,content:name.endsWith('title')?p.title:p.description});}
p.schema=p.schema.map(raw=>{const data=JSON.parse(raw);for(const node of data['@graph']||[data]){if(node.url===p.canonical&&!['Organization','LocalBusiness'].includes(node['@type'])){node.name=p.heading;node.description=p.description;}if(node['@type']==='BreadcrumbList')node.itemListElement.at(-1).name=p.heading;if(node['@type']==='FAQPage'){for(const q of node.mainEntity||[])if(q.name==='Do you buy loose diamonds?')q.acceptedAnswer.text='Yes. We buy natural polished diamonds of any size and shape, loose or in jewelry. We do not buy laboratory-grown or uncut diamonds.';}}return JSON.stringify(data);});
const previous='/uncut-diamond-buyers-los-angeles/',next='/large-diamond-buyer-los-angeles/';
for(const row of revisions)if(row.path===previous){row.originalPath=previous;row.path=next;row.type='owner-authorized-topic-and-route-conversion';row.canonical='https://cash4goldanddiamond.com'+next;}
if(!revisions.some(r=>r.path===p.path))revisions.push({path:p.path,type:'owner-confirmed-diamond-buying-scope'});
assertAddressIntegrity(pages);
await fs.writeFile(file,JSON.stringify(pages));
await fs.writeFile('migration/editorial-revisions.json',JSON.stringify(revisions,null,2));
console.log('Updated natural-diamond service scope and recorded the authorized article conversion.');
