import {defineConfig} from 'astro/config';
import {releasePolicy} from './src/lib/release-policy.mjs';
import {assertContentEnvironment} from './src/lib/cms-release-gates.mjs';
import {assertStaticReleaseSource} from './src/lib/static-release-source.mjs';
releasePolicy(process.env);
assertContentEnvironment(process.env);
const staticRelease = assertStaticReleaseSource(process.env);
if (staticRelease) console.log('[reviewed-static-release] ' + JSON.stringify(staticRelease));
export default defineConfig({
  site:'https://cash4goldanddiamond.com',
  output:'static',
  ...(process.env.ASTRO_OUT_DIR?{outDir:process.env.ASTRO_OUT_DIR}:{}),
  trailingSlash:'always',
  // Keep navigation scripts in same-origin files allowed by the hosting CSP.
  vite:{cacheDir:'.cache/vite',build:{assetsInlineLimit:0}},
  devToolbar:{enabled:false},
  server:{host:'127.0.0.1',port:4321},
});
