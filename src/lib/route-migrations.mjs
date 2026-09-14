import migrations from '../data/route-migrations.json' with {type:'json'};
export {migrations};
export const currentPath=path=>migrations.find(m=>m.from===path)?.to||path;
export const originalPath=path=>migrations.find(m=>m.to===path)?.from||path;
export const rewritePublicLinks=value=>typeof value==='string'?migrations.reduce((text,m)=>text.replaceAll(m.from,m.to),value):value;
export function migratePageReferences(page){
 page.path=currentPath(page.path);
 page.canonical=rewritePublicLinks(page.canonical);
 page.html=rewritePublicLinks(page.html);
 page.sections=(page.sections||[]).map(section=>({...section,html:rewritePublicLinks(section.html)}));
 page.meta=(page.meta||[]).map(meta=>({...meta,content:rewritePublicLinks(meta.content)}));
 page.schema=(page.schema||[]).map(rewritePublicLinks);
 if(page.editorial)page.editorial={...page.editorial,canonical:page.canonical,related:page.editorial.related.map(currentPath),service:currentPath(page.editorial.service)};
 return page;
}
