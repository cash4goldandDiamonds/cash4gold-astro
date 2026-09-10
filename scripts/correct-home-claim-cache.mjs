import fs from 'node:fs/promises';
const file='src/data/pages.json',pages=JSON.parse(await fs.readFile(file,'utf8')),page=pages.find(page=>page.path==='/');
const replacements=[
 ['our certified experts','our team'],
 ['We use the latest technology and industry insights to evaluate your items thoroughly and transparently, explaining how we determine their market value.','We explain the factors considered in your purchase evaluation and the offer for the items inspected.'],
 ['If you accept our competitive offer, we finalize the deal with immediate payment. Choose your preferred payment method—cash, bank transfer, or check—for a quick and secure transaction.','If you accept an offer, we confirm the payment method and timing for the agreed purchase. Cash, bank wire and business check are available.'],
 ['Receive an Expert Evaluation','Receive a Purchase Evaluation'],
 ['Our team of certified professionals ensures accurate and fair appraisals.','Our team explains the factors considered in your purchase evaluation.']
];
const changes=[];
for(const [before,after] of replacements){if(page.html.includes(before)){page.html=page.html.replaceAll(before,after);changes.push({path:'/',before,after,reason:'Remove an unverified business credential or evaluation guarantee from the private proposed copy'});}}
page.sourceText=page.sourceText.replaceAll('our certified experts','our team');
await fs.writeFile(file,JSON.stringify(pages));
const report='migration/pre-deployment/home-claim-corrections.json';let prior=[];try{prior=JSON.parse(await fs.readFile(report,'utf8')).changes;}catch{}
await fs.writeFile(report,JSON.stringify({checkedAt:new Date().toISOString(),approval:'Owner factual review pending before launch',changes:[...prior,...changes]},null,2));
console.log(JSON.stringify({changed:changes.length}));
