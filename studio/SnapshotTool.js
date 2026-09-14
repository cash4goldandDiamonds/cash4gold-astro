import React,{useEffect,useRef,useState} from 'react';
import {useClient,useCurrentUser} from 'sanity';
import {assertSnapshotScope,preparePrivateSnapshot,SnapshotError,sameSnapshotSession} from './private-snapshot.mjs';
const h=React.createElement;
export default function SnapshotTool(){
 const client=useClient({apiVersion:'2026-09-09'}),user=useCurrentUser();
 const [busy,setBusy]=useState(false),[status,setStatus]=useState('No snapshot prepared.'),[download,setDownload]=useState(null);
 const request=useRef(null),currentSession=useRef(null),snapshotSession=useRef(null),links=useRef([]);
 currentSession.current={client,userId:user?.id};
 const clearLinks=()=>{for(const url of links.current)URL.revokeObjectURL(url);links.current=[];snapshotSession.current=null;};
 useEffect(()=>{
  request.current?.abort();request.current=null;clearLinks();setDownload(null);setBusy(false);setStatus('No snapshot prepared.');
  return ()=>{request.current?.abort();request.current=null;clearLinks();};
 },[client,user?.id]);
 let available=true;try{assertSnapshotScope(client,globalThis.location,Boolean(user));}catch{available=false;}
 function guardDownload(event){try{assertSnapshotScope(client,globalThis.location,sameSnapshotSession(snapshotSession.current,currentSession.current));}catch{event.preventDefault();clearLinks();setDownload(null);setStatus('Staging access changed. Prepare a new snapshot after signing in again.');}}
 async function prepare(){
  if(request.current)return;
  const controller=new AbortController(),captured={...currentSession.current};request.current=controller;clearLinks();setDownload(null);setBusy(true);setStatus('Checking staging access…');
  try{
   const result=await preparePrivateSnapshot(client,{getLocation:()=>globalThis.location,isAuthenticated:()=>sameSnapshotSession(captured,currentSession.current),signal:controller.signal,onProgress:({phase,documents})=>{if(request.current===controller)setStatus(`${phase}: ${documents} documents.`);}});
   if(request.current!==controller||controller.signal.aborted)return;
   const stamp=result.manifest.finishedAt.replace(/[:.]/g,'-');
   const dataUrl=URL.createObjectURL(new Blob([result.ndjson],{type:'application/x-ndjson'}));
   const manifestUrl=URL.createObjectURL(new Blob([JSON.stringify(result.manifest,null,2)+'\n'],{type:'application/json'}));
   links.current=[dataUrl,manifestUrl];snapshotSession.current=captured;setDownload({dataUrl,manifestUrl,stem:`sanity-migration-staging-${stamp}`});setStatus(`Checked ${result.manifest.documents} permission-visible documents. Download both files and keep them outside the repository.`);
  }catch(error){if(request.current===controller)setStatus(error instanceof SnapshotError?error.message:'The snapshot could not be prepared. No download is available.');}
  finally{if(request.current===controller){request.current=null;setBusy(false);}}
 }
 return h('section',{style:{padding:'2rem',maxWidth:'56rem',lineHeight:1.6}},
  h('h1',null,'Private CMS snapshot'),
  h('p',null,'Prepare a read-only copy of the migration-staging dataset using your existing Studio sign-in. This tool does not change, import or publish content.'),
  h('p',null,'The snapshot contains documents your current permissions allow, including visible drafts, system records and release versions. It excludes asset files and hidden documents. It is not an atomic or complete dataset backup.'),
  h('p',null,'Before and after revision checks must match the downloaded documents. Stop editing while preparing the snapshot. A detected change, incomplete read or cancellation prevents a download.'),
  !available&&h('p',{role:'status'},'Use the protected staging Studio for project gisdw6qa and private dataset migration-staging, and sign in to continue.'),
  h('button',{type:'button',disabled:busy||!available,onClick:prepare},busy?'Preparing…':'Prepare checked snapshot'),
  busy&&h('button',{type:'button',onClick:()=>request.current?.abort(),style:{marginLeft:'1rem'}},'Cancel'),
  h('p',{role:'status','aria-live':'polite'},status),
  download&&h('div',null,h('p',null,h('a',{href:download.dataUrl,download:download.stem+'.ndjson',onClick:guardDownload},'Download documents (NDJSON)')),h('p',null,h('a',{href:download.manifestUrl,download:download.stem+'.manifest.json',onClick:guardDownload},'Download verification manifest'))),
  h('p',null,'Store these private files outside Git and public hosting. The manifest records the project, dataset, read times, revision-check result and file hash; it contains no authentication credentials. Preparing a snapshot does not approve any later CMS merge.'));
}
