export function privateCmsPreviewPlan(env={}){
 const perspective=env.SANITY_PERSPECTIVE||'published';
 if(!['published','drafts'].includes(perspective))throw new Error('Private CMS preview perspective must be published or drafts.');
 if(env.SITE_ENV==='production'||env.ENABLE_PRODUCTION_INDEXING==='true')throw new Error('Private CMS preview cannot use production or indexing settings.');
 const output='.cache/cms-preview/'+perspective;
 return {perspective,output,environment:{SITE_ENV:'preview',ENABLE_PRODUCTION_INDEXING:'false',ISOLATED_PRODUCTION_AUDIT:'false',SANITY_PERSPECTIVE:perspective,ASTRO_OUT_DIR:output,BUILD_STAGING_STUDIO:'false',PUBLIC_ANALYTICS_ENABLED:'false'}};
}
