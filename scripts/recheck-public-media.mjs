import fs from 'node:fs/promises';
const rows=[],requests=[],errors=[],checkedAt=new Date().toISOString();
async function page(n){
 const url=new URL('https://cash4goldanddiamond.com/wp-json/wp/v2/media');url.search=new URLSearchParams({per_page:'100',page:String(n),orderby:'id',order:'asc'}).toString();
 const response=await fetch(url,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(20_000)});
 const data=await response.json();requests.push({page:n,status:response.status,total:Number(response.headers.get('x-wp-total')),pages:Number(response.headers.get('x-wp-totalpages')),items:Array.isArray(data)?data.length:0});
 if(!response.ok||!Array.isArray(data))throw Error('Public media page failed: '+n);
 return {data,total:Number(response.headers.get('x-wp-total')),pages:Number(response.headers.get('x-wp-totalpages'))};
}
try{const first=await page(1);rows.push(...first.data);for(let n=2;n<=first.pages;n++)rows.push(...(await page(n)).data);}catch(error){errors.push(error.message);}
const unique=[...new Map(rows.map(item=>[item.id,item])).values()],old=JSON.parse(await fs.readFile('migration/pre-deployment/wordpress-api/media.json','utf8')),oldIds=new Set(old.map(item=>item.id));
const report={checkedAt,method:'Public GET-only media pagination ordered by stable ID ascending; no account or source mutation',requests,errors,fetched:rows.length,unique:unique.length,reported:requests[0]?.total,complete:errors.length===0&&requests.every(r=>r.total===requests[0].total)&&unique.length===requests[0]?.total,newlyDiscovered:unique.filter(item=>!oldIds.has(item.id)).map(item=>({id:item.id,source_url:item.source_url})),missingFromRecheck:old.filter(item=>!unique.some(current=>current.id===item.id)).map(item=>item.id)};
await fs.mkdir('migration/pre-deployment/media-recheck',{recursive:true});await fs.writeFile('migration/pre-deployment/media-recheck/media.json',JSON.stringify(unique,null,2));await fs.writeFile('migration/pre-deployment/media-recheck/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
