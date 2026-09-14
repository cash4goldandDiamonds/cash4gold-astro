import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import {defaultSocialCaptions,trackedArticleUrl,SCHEDULE} from '../src/lib/social-publishing.mjs';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const articles=pages.filter(p=>p.isArticle&&!p.robots.includes('noindex')&&new URL(p.canonical).pathname===p.path);
await fs.mkdir('public/media/social',{recursive:true});
const rows=[];
for(const page of articles){
 const slug=page.path.slice(1,-1),source=page.editorial.images[0],src=source.src||source.localPath;
 if(!src?.startsWith('/media/'))throw Error('Review nonlocal social source: '+page.path);
 const input=path.resolve('public'+src);if(!input.startsWith(path.resolve('public')+path.sep))throw Error('Invalid image path');
 const filename='/media/social/'+slug+'.jpg';
 const buffer=await sharp(input).resize(1080,1080,{fit:'contain',background:'#1c1c1c'}).jpeg({quality:86,mozjpeg:true}).toBuffer();
 await fs.writeFile('public'+filename,buffer);
 rows.push({path:page.path,title:page.heading,sourceImage:src,image:filename,imageAlt:source.alt,sha256:crypto.createHash('sha256').update(buffer).digest('hex'),bytes:buffer.length,...defaultSocialCaptions(page),links:{facebook:trackedArticleUrl(page.path,'facebook'),instagram:trackedArticleUrl(page.path,'instagram')},state:'draft',approved:false,mediaRightsConfirmed:false});
}
await fs.writeFile('migration/pre-deployment/social-backlog.json',JSON.stringify({preparedAt:new Date().toISOString(),schedule:SCHEDULE,scope:'Local caption and image drafts only. No uploads, approvals or posts have occurred.',rows},null,2));
console.log(JSON.stringify({draftArticles:rows.length,preparedJpegs:rows.length,uniqueImages:new Set(rows.map(r=>r.sha256)).size,largestBytes:Math.max(...rows.map(r=>r.bytes)),published:0}));
