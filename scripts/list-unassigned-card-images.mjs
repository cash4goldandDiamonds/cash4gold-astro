import fs from 'node:fs/promises';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const assignments=JSON.parse(await fs.readFile('src/data/article-image-assignments.json','utf8'));
const articles=pages.filter(p=>p.isArticle);
const rows=articles.map((p,index)=>({index,path:p.path,group:p.editorial.group,title:p.title,assigned:!!assignments[p.path],canonical:new URL(p.canonical).pathname===p.path,image:p.editorial.images[0].key})).filter(p=>p.canonical&&!p.assigned);
await fs.writeFile('../work/unassigned-card-images.json',JSON.stringify(rows,null,2));
console.log(rows.map(r=>[r.index,r.group,r.path,r.image].join(' | ')).join('\n'));
