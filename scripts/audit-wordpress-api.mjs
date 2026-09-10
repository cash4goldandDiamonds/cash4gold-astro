import fs from 'node:fs/promises';
const base='migration/pre-deployment/wordpress-api';
await fs.mkdir(base,{recursive:true});
const result={checkedAt:new Date().toISOString(),method:'Public GET requests only; published posts/pages and public taxonomy/media. No authenticated records or leads requested.',endpoints:[]};
for(const type of ['posts','pages','categories','tags','media']){
 const items=[],requests=[];let complete=false,total=null;
 for(let page=1;page<=20;page++){
  const url=new URL('/wp-json/wp/v2/'+type,'https://cash4goldanddiamond.com');url.searchParams.set('per_page','100');url.searchParams.set('page',String(page));
  if(['posts','pages'].includes(type))url.searchParams.set('status','publish');
  try{
   const response=await fetch(url,{signal:AbortSignal.timeout(30000),headers:{'User-Agent':'Cash4Gold owner-authorized migration audit'}});
   requests.push({page,status:response.status,contentType:response.headers.get('content-type')});
   if(!response.ok||!response.headers.get('content-type')?.includes('json'))break;
   const rows=await response.json();if(!Array.isArray(rows))break;
   items.push(...rows);total=Number(response.headers.get('x-wp-total'));
   const totalPages=Number(response.headers.get('x-wp-totalpages'));
   if(totalPages?page>=totalPages:rows.length<100){complete=true;break;}
  }catch(error){requests.push({page,error:error.name});break;}
 }
 if(items.length)await fs.writeFile(base+'/'+type+'.json',JSON.stringify(items,null,2));
 const uniqueIds=new Set(items.map(item=>item.id)).size;
 if((total!==null&&items.length!==total)||uniqueIds!==items.length)complete=false;
 result.endpoints.push({type,complete,publicItems:items.length,uniqueIds,totalReported:total,requests});
 await fs.writeFile(base+'/report.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify(result.endpoints.at(-1)));
}
