export const STAGING_STUDIO_ORIGIN='https://cash4gold-private-preview.cash4goldanddiamond.workers.dev';
export const isStagingStudioPath=pathname=>pathname==='/studio'||pathname.startsWith('/studio/');
const noindex='noindex, nofollow, noarchive';
const deny=(status=404,extra={})=>new Response(status===405?'Method not allowed':'Not found',{status,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'private, no-store','X-Robots-Tag':noindex,'X-Content-Type-Options':'nosniff',...extra}});

export async function stagingStudioCsp(html=''){
 const hashes=await Promise.all([...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(([,attributes,body])=>!/\bsrc\s*=/i.test(attributes)&&body.trim()).map(async([,attributes,body])=>{
  const bytes=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(body)));
  return "'sha256-"+btoa(String.fromCharCode(...bytes))+"'";
 }));
 return [
  "default-src 'self'",
  "script-src 'self' https://core.sanity-cdn.com "+[...new Set(hashes)].join(' '),
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "connect-src 'self' https://gisdw6qa.api.sanity.io https://gisdw6qa.apicdn.sanity.io https://api.sanity.io https://www.sanity.io wss://gisdw6qa.api.sanity.io",
  "frame-src 'self' https://www.sanity.io https://accounts.sanity.io",
  "worker-src 'self' blob:",
  "form-action 'self' https://api.sanity.io https://www.sanity.io https://accounts.sanity.io",
  "object-src 'none'","base-uri 'self'","frame-ancestors 'self'",
 ].map(value=>value.trim()).join('; ');
}

// Cloudflare Access protects every request before this Worker. This handler
// adds scoped routing and headers; it does not pretend to validate Access JWTs.
export async function handleStagingStudio(request,env){
 const url=new URL(request.url);
 if(!isStagingStudioPath(url.pathname))return null;
 if(env.SITE_ENV!=='preview'||env.STAGING_STUDIO_ENABLED!=='true'||url.origin!==STAGING_STUDIO_ORIGIN)return deny();
 if(!['GET','HEAD'].includes(request.method))return deny(405,{Allow:'GET, HEAD'});
 if(!env.ASSETS?.fetch||/%(?:2f|5c|00)/i.test(url.pathname))return deny();
 if(url.pathname==='/studio')return new Response(null,{status:308,headers:{Location:'/studio/'+url.search,'Cache-Control':'private, no-store','X-Robots-Tag':noindex}});
 const assetRequest=request.method==='HEAD'?new Request(request,{method:'GET'}):request;
 let response=await env.ASSETS.fetch(assetRequest);
 const navigation=request.headers.get('Sec-Fetch-Mode')==='navigate'||/text\/html/i.test(request.headers.get('Accept')||'');
 const assetLike=/\.[a-z0-9]{1,16}$/i.test(url.pathname.split(';')[0]);
 if(response.status===404&&navigation&&!assetLike){
  await response.body?.cancel();
  const shell=new URL('/studio/',url.origin);
  response=await env.ASSETS.fetch(new Request(shell,{method:'GET',headers:request.headers}));
 }
 const headers=new Headers(response.headers);
 headers.set('Cache-Control','private, no-store');
 headers.set('X-Robots-Tag',noindex);
 headers.set('X-Content-Type-Options','nosniff');
 headers.set('Referrer-Policy','no-referrer');
 headers.set('X-Frame-Options','SAMEORIGIN');
 headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');
 if(/text\/html/i.test(headers.get('Content-Type')||'')){
  const html=await response.text();
  headers.set('Content-Security-Policy',await stagingStudioCsp(html));
  headers.delete('Content-Length');
  headers.delete('Content-Encoding');
  return new Response(request.method==='HEAD'?null:html,{status:response.status,headers});
 }
 if(request.method==='HEAD')await response.body?.cancel();
 return new Response(request.method==='HEAD'?null:response.body,{status:response.status,headers});
}
