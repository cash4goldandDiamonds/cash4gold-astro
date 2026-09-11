import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const digest=value=>createHash('sha256').update(value).digest('hex');
function canonical(value){
 if(Array.isArray(value))return value.map(canonical);
 if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().filter(key=>value[key]!==undefined).map(key=>[key,canonical(value[key])]));
 return value;
}
export function releaseFingerprint(bundle){return digest(JSON.stringify(canonical(bundle)));}

// Review binds to source bytes, not a mutable branch name or dates. Keep all
// rendering code, preserved content, images and build configuration in scope.
export function renderingSourceFingerprint(root=process.cwd(),fixturePaths){
 const roots=['src','public','studio','scripts','workers','package.json','pnpm-lock.yaml','astro.config.mjs','sanity.config.js','sanity.cli.js','wrangler.preview.jsonc'];
 const hash=createHash('sha256');
 function visit(relative){
  if(path.isAbsolute(relative)||relative.split(/[\\/]/).includes('..'))throw new Error('Invalid release source path.');
  const target=path.join(root,relative),stat=fs.lstatSync(target);
  if(stat.isSymbolicLink())throw new Error('Release source must not contain symbolic links.');
  if(!stat.isFile())throw new Error('Unexpected release source entry.');
  hash.update(relative+'\0');hash.update(digest(fs.readFileSync(target))+'\0');
 }
 const tracked=fixturePaths??execFileSync('git',['ls-files','-z','--',...roots],{cwd:root,encoding:'utf8',maxBuffer:5*1024*1024}).split('\0').filter(Boolean);
 if(!tracked.length)throw new Error('Cannot bind release to tracked rendering source.');
 for(const relative of [...tracked].sort())visit(relative);
 return hash.digest('hex');
}
export function createReleaseCandidate(bundle){
 return {version:1,projectId:bundle.projectId,dataset:bundle.dataset,sourceFingerprint:bundle.sourceFingerprint,fingerprint:releaseFingerprint(bundle),approved:false,reviewedBy:'',reviewedAt:''};
}
export function writeReleaseCandidate(bundle){
 fs.mkdirSync('.cache',{recursive:true});fs.writeFileSync('.cache/cms-release-candidate.json',JSON.stringify(createReleaseCandidate(bundle),null,2)+'\n');
}
export function assertReleaseReview(bundle,raw,now=Date.now()){
 let review;try{review=typeof raw==='string'?JSON.parse(raw):raw;}catch{throw new Error('Invalid CMS release review record.');}
 const expected=createReleaseCandidate(bundle),when=Date.parse(review?.reviewedAt||'');
 if(!review||review.approved!==true||review.version!==1||review.projectId!==expected.projectId||review.dataset!==expected.dataset||review.sourceFingerprint!==expected.sourceFingerprint||review.fingerprint!==expected.fingerprint||typeof review.reviewedBy!=='string'||review.reviewedBy.trim().length<3||/^(?:test|qa|unknown|pending|placeholder)$/i.test(review.reviewedBy.trim())||!Number.isFinite(when)||when>now)
  throw new Error('Production CMS release requires a current human-approved fingerprint of source, projected pages, settings and redirects. Review the candidate; old approval flags cannot authorize changed content.');
 return true;
}
