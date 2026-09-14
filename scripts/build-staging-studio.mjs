import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const projectId='gisdw6qa';
const dataset='migration-staging';
const secretName=/token|secret|password|credential|api_?key/i;

export function stagingStudioPlan(env={},cwd=process.cwd()){
  const environment=env.SITE_ENV||'preview';
  if(!['preview','production'].includes(environment))throw new Error('Unknown site environment for Studio build.');
  const enabled=env.BUILD_STAGING_STUDIO==='true';
  if(environment==='production')return {enabled:false,reason:'production-build-excludes-studio'};
  if(!enabled)return {enabled:false,reason:'staging-studio-not-enabled'};
  if(env.ENABLE_PRODUCTION_INDEXING==='true')throw new Error('The staging Studio requires a non-indexable preview build.');
  for(const [key,value] of Object.entries(env))if(value&&key.startsWith('SANITY_STUDIO_')&&secretName.test(key))throw new Error('Do not place credentials in client-exposed SANITY_STUDIO variables.');
  const output=path.resolve(cwd,env.ASTRO_OUT_DIR||'dist');
  const relative=path.relative(path.resolve(cwd),output);
  if(!relative||relative.startsWith('..')||path.isAbsolute(relative))throw new Error('Studio output must be inside the project build directory.');
  return {enabled:true,projectId,dataset,basePath:'/studio',output,studioOutput:path.join(output,'studio')};
}

export async function buildStagingStudio(env=process.env,cwd=process.cwd()){
  const plan=stagingStudioPlan(env,cwd);
  if(!plan.enabled){
    const studioOutput=path.resolve(cwd,env.ASTRO_OUT_DIR||'dist','studio');
    if(await fs.stat(studioOutput).then(()=>true,()=>false))throw new Error('A disabled or production build still contains Studio files. Run a fresh website build.');
    return {status:'SKIPPED',reason:plan.reason};
  }
  await fs.access(path.join(plan.output,'index.html'));
  if(await fs.stat(plan.studioOutput).then(()=>true,()=>false))throw new Error('Studio output already exists. Run a fresh website build before rebuilding Studio.');
  const envFiles=(await fs.readdir(cwd)).filter(name=>/^\.env(?:\.|$)/.test(name)&&name!=='.env.example');
  if(envFiles.length)throw new Error('Build Studio in a clean checkout without local environment files.');
  const publicEnv={...env,SANITY_STUDIO_PROJECT_ID:plan.projectId,SANITY_STUDIO_DATASET:plan.dataset,SANITY_STUDIO_BASEPATH:plan.basePath,DO_NOT_TRACK:'1',SANITY_CLI_CONFIG_PATH:path.join(cwd,'.cache/sanity-cli-build/config.json'),CI:'true'};
  // The browser authenticates through Sanity. No service credential is needed
  // to compile the editor or sent in its public configuration.
  delete publicEnv.SANITY_AUTH_TOKEN;
  delete publicEnv.SANITY_READ_TOKEN;
  const pkg=JSON.parse(await fs.readFile(path.join(cwd,'node_modules/sanity/package.json'),'utf8'));
  const binary=typeof pkg.bin==='string'?pkg.bin:pkg.bin.sanity;
  const result=spawnSync(process.execPath,[path.resolve(cwd,'node_modules/sanity',binary),'build',plan.studioOutput,'--no-auto-updates','--no-source-maps','--yes'],{cwd,env:publicEnv,encoding:'utf8',maxBuffer:40*1024*1024});
  const secrets=Object.entries(env).filter(([key,value])=>secretName.test(key)&&typeof value==='string'&&value.length>=12).map(([,value])=>value);
  let log=String(result.stdout||'')+'\n'+String(result.stderr||'');
  for(const secret of secrets)log=log.replaceAll(secret,'[REDACTED]');
  await fs.mkdir(path.join(cwd,'.cache'),{recursive:true});
  await fs.writeFile(path.join(cwd,'.cache/staging-studio-build.log'),log);
  if(result.status!==0)throw new Error('Studio compilation failed; see the redacted .cache/staging-studio-build.log.');
  let files=0,bytes=0;
  async function inspect(directory){
    for(const item of await fs.readdir(directory,{withFileTypes:true})){
      const file=path.join(directory,item.name);
      if(item.isDirectory()){await inspect(file);continue;}
      const content=await fs.readFile(file);files++;bytes+=content.length;
      for(const secret of secrets)if(content.includes(Buffer.from(secret)))throw new Error('A credential value appeared in Studio output. Do not deploy it.');
      if(/\.map$/i.test(item.name))throw new Error('Unexpected source map in the staging Studio output.');
    }
  }
  const indexFile=path.join(plan.studioOutput,'index.html');
  let index=await fs.readFile(indexFile,'utf8');
  if(!index.includes('/studio/'))throw new Error('Studio output is missing its scoped /studio/ asset path.');
  index=index.replace(/<head([^>]*)>/i,'<head$1><meta name="robots" content="noindex,nofollow,noarchive">');
  await fs.writeFile(indexFile,index);
  await inspect(plan.studioOutput);
  const inlineScriptHashes=[...index.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(([,attributes,body])=>!(/\bsrc\s*=/i.test(attributes))&&body.trim()).map(([,attributes,body])=>"'sha256-"+createHash('sha256').update(body).digest('base64')+"'");
  const report={checkedAt:new Date().toISOString(),status:'PASS',projectId,dataset,basePath:plan.basePath,files,bytes,embeddedCredentialMatches:0,inlineScriptHashes,mode:'Self-hosted Studio files only; browser Sanity authentication required. Not a content import, website draft preview, schema registration or deployment.'};
  await fs.writeFile(path.join(cwd,'.cache/staging-studio-build.json'),JSON.stringify(report,null,2)+'\n');
  return report;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{console.log(JSON.stringify(await buildStagingStudio()));}
  catch(error){console.error(error.message);process.exitCode=1;}
}
