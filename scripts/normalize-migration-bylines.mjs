import fs from 'node:fs/promises';
const file='src/data/pages.json',pages=JSON.parse(await fs.readFile(file,'utf8')),changes=[];
for(const page of pages){
 if(page.isArticle&&/^Post author:\s*/.test(page.author||'')){
  const before=page.author,after=before.replace(/^Post author:\s*/,'');page.author=after;
  page.schema=(page.schema||[]).map(raw=>{const data=JSON.parse(raw);for(const item of data['@graph']||[data])if(item.author?.name===before)item.author.name=after;return JSON.stringify(data);});
  changes.push({path:page.path,before,after,reason:'Remove the captured WordPress interface label from the author field; preserve the actual author name. No body or date change.'});
 }
}
if(changes.length){
 await fs.writeFile(file,JSON.stringify(pages,null,2)+'\n');
 await fs.writeFile('migration/pre-deployment/byline-normalization.json',JSON.stringify({checkedAt:new Date().toISOString(),changes,sourceEvidencePreserved:true},null,2));
}
console.log(JSON.stringify({normalized:changes.length}));
