import {defineConfig} from 'astro/config';
import {releasePolicy} from './src/lib/release-policy.mjs';
import {assertContentEnvironment} from './src/lib/cms-release-gates.mjs';
releasePolicy(process.env);
assertContentEnvironment(process.env);
export default defineConfig({
  site:'https://cash4goldanddiamond.com',
  output:'static',
  ...(process.env.ASTRO_OUT_DIR?{outDir:process.env.ASTRO_OUT_DIR}:{}),
  trailingSlash:'always',
  devToolbar:{enabled:false},
  server:{host:'127.0.0.1',port:4321},
});
