import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const baseline=JSON.parse(await fs.readFile('migration/substantive-review-baseline.json','utf8')).filter(p=>p.isArticle);
const batches=[['../work/watch-reviews-part-1.json','023-watch-records-and-selling.mjs'],['../work/watch-reviews-part-2.json','024-watch-checklists.mjs']];
for(const [input,output] of batches){const drafts=JSON.parse(await fs.readFile(input,'utf8'));const rows=drafts.map(({index,...r})=>({...r,path:baseline[index].path,beforeHtmlSha256:crypto.createHash('sha256').update(baseline[index].html).digest('hex'),decision:'rewrite'}));await fs.writeFile('src/data/article-reviews/'+output,'export default '+JSON.stringify(rows,null,2)+';\n');}
for(const [input,output] of [['estate-trust-review-batch.mjs','021-estate-trust-guides.mjs'],['select-gemstone-review-batch.mjs','022-select-gemstone-guides.mjs']])await fs.copyFile('../outputs/'+input,'src/data/article-reviews/'+output);
console.log(JSON.stringify({prepared:22}));
