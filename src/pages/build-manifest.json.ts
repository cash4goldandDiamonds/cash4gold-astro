import {buildEnvironment} from '../lib/build-environment';
import {getPages,getRedirects} from '../lib/content';
import {releasePolicy,sitemapEntries} from '../lib/release-policy.mjs';
export async function GET(){const policy=releasePolicy(buildEnvironment);const contentSource=buildEnvironment.CONTENT_SOURCE==='reviewed-static'?'reviewed-static':buildEnvironment.SANITY_PROJECT_ID?'cms':buildEnvironment.ISOLATED_PRODUCTION_AUDIT==='true'?'isolated-snapshot-audit':'preview-snapshot';return Response.json({policy,contentSource,...(contentSource==='reviewed-static'?{sourceCommit:buildEnvironment.STATIC_RELEASE_COMMIT}:{}),redirects:await getRedirects(),sitemap:sitemapEntries(await getPages(),policy)});}
