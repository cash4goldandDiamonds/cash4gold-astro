import {buildEnvironment} from '../lib/build-environment';
import {getPages,getRedirects} from '../lib/content';
import {releasePolicy,sitemapEntries} from '../lib/release-policy.mjs';
export async function GET(){const policy=releasePolicy(buildEnvironment);return Response.json({policy,redirects:await getRedirects(),sitemap:sitemapEntries(await getPages(),policy)});}
