export const siteOrigin='https://cash4goldanddiamond.com';
export function releasePolicy(env={}){
 const environment=env.SITE_ENV||'preview';
 if(!['preview','production'].includes(environment))throw new Error('SITE_ENV must be preview or production.');
 const enabled=env.ENABLE_PRODUCTION_INDEXING==='true';
 if(enabled&&environment!=='production')throw new Error('Indexing may only be enabled in an explicit production build.');
 if(environment==='production'&&!enabled)throw new Error('Production build requires an explicit ENABLE_PRODUCTION_INDEXING=true.');
 const perspective=env.SANITY_PERSPECTIVE||'published';
 if(!['published','drafts'].includes(perspective))throw new Error('Unsupported Sanity perspective.');
 if(enabled&&perspective!=='published')throw new Error('Draft content cannot enter a production build.');
 return {environment,indexable:enabled,perspective};
}
export function pageRobots(page,policy){
 if(!policy.indexable||page.path==='/404/')return 'noindex,nofollow,noarchive';
 const original=String(page.robots||'index,follow');
 return [/(?:^|[,\s])noindex(?:$|[,\s])/i.test(original)?'noindex':'index',/(?:^|[,\s])nofollow(?:$|[,\s])/i.test(original)?'nofollow':'follow','max-image-preview:large'].join(',');
}
export function sitemapEntries(pages,policy){
 if(!policy.indexable)return [];
 const paths=new Set(pages.map(p=>p.path));
 return pages.filter(p=>p.path!=='/404/'&&!pageRobots(p,policy).includes('noindex')&&(p.canonical||siteOrigin+p.path)===siteOrigin+p.path).map(p=>{
  const u=new URL(p.canonical||siteOrigin+p.path);if(u.origin!==siteOrigin||u.search||u.hash||!paths.has(u.pathname))throw new Error('Invalid sitemap canonical: '+p.path);
  const modified=p.modifiedAt||p.publishedAt;
  return {loc:u.href,...(modified&&Number.isFinite(Date.parse(modified))&&Date.parse(modified)<=Date.now()?{lastmod:new Date(modified).toISOString()}: {})};
 });
}
export const xmlEscape=s=>String(s).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
export function sitemapXml(entries){return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+entries.map(e=>`<url><loc>${xmlEscape(e.loc)}</loc>${e.lastmod?`<lastmod>${xmlEscape(e.lastmod)}</lastmod>`:''}</url>`).join('')+'</urlset>\n';}
export function robotsTxt(policy){return policy.indexable?`User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n';}
export function hostHeaders(policy,features={}){return `/*\n${policy.indexable?'':'  X-Robots-Tag: noindex, nofollow, noarchive\n'}  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Cache-Control: ${policy.indexable?'public, max-age=0, must-revalidate':'private, no-store'}\n  Content-Security-Policy: default-src 'self'; script-src 'self' https://challenges.cloudflare.com${features.analytics===true?' https://www.googletagmanager.com':''}; style-src 'self' 'unsafe-inline'; img-src 'self' https://cdn.sanity.io data:${features.analytics===true?' https://www.google-analytics.com https://region1.google-analytics.com':''}; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com${features.analytics===true?' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com':''}; frame-src https://challenges.cloudflare.com; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'\n${policy.indexable?'/media/*\n  Cache-Control: public, max-age=86400, must-revalidate\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n':''}/locations.kml\n  Content-Type: application/vnd.google-earth.kml+xml; charset=utf-8\n/404.html\n  X-Robots-Tag: noindex, nofollow\n`;
}
