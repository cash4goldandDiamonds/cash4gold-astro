import fs from 'node:fs/promises';
import {load} from 'cheerio';
const post=JSON.parse(await fs.readFile('migration/pre-deployment/wordpress-api/posts.json','utf8')).find(post=>post.id===3728);
const $=load(post.content.rendered),images=$('img').toArray();
const directory='migration/pre-deployment/recovered-jewelry-buyers';await fs.mkdir(directory,{recursive:true});
await fs.writeFile(directory+'/original-content.html',post.content.rendered);
for(const [index,image] of images.entries()){
 const url=new URL(image.attribs.src);
 if(!['images.unsplash.com','images.pexels.com'].includes(url.hostname))throw new Error('Unexpected source media host');
 const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw new Error('Source media request failed: '+response.status);
 const buffer=Buffer.from(await response.arrayBuffer());if(buffer.length>20000000)throw new Error('Source media exceeds the audit limit.');
 await fs.writeFile(directory+'/source-'+index+'.jpg',buffer);
}
console.log(JSON.stringify({sourcePost:post.id,sourceImages:images.length,originalContentPreserved:true}));
