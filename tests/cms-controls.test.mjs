import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {renderCmsBody,projectCmsPage} from '../src/lib/cms-page.mjs';
import {responsiveCmsImage} from '../src/lib/cms-responsive-image.mjs';
import {validateNavigation} from '../src/lib/navigation-settings.mjs';
test('CMS images use responsive sizes and the selected crop without upscaling',()=>{const img=responsiveCmsImage({asset:{_ref:'image-abcdef-1600x1200-jpg'},crop:{left:.25,right:.25,top:0,bottom:0}},{projectId:'test',dataset:'private'});assert.equal(img.width,800);assert.match(img.src,/w=800/);assert.match(img.src,/rect=400,0,800,1200/);assert.match(img.srcset,/w=320/);assert.doesNotMatch(img.srcset,/1400w/);});
test('CMS reference links resolve to current page paths and reject missing documents',()=>{const body=[{_type:'block',_key:'b',style:'normal',markDefs:[{_type:'internalLink',_key:'link',target:{path:'/contact-us/'},fragment:'visit'}],children:[{_type:'span',_key:'span',text:'Plan a visit',marks:['link']}]}];const $=load(renderCmsBody(body));assert.equal($('a').attr('href'),'/contact-us/#visit');delete body[0].markDefs[0].target;assert.throws(()=>renderCmsBody(body),/Unresolved/);});
test('CMS nofollow is preserved independently from noindex',()=>{const old={path:'/test/',html:'<p>Test content</p>',sections:[],meta:[],schema:[]};const p=projectCmsPage({path:'/test/',title:'Test',kind:'page',contentMode:'imported',seo:{canonical:'https://cash4goldanddiamond.com/test/',nofollow:true}},old);assert.equal(p.robots,'index,nofollow');});
test('CMS navigation rejects executable and external URLs',()=>{assert.deepEqual(validateNavigation([{label:'Visit',href:'/contact-us/'}]),[{label:'Visit',href:'/contact-us/'}]);for(const href of ['javascript:alert(1)','//evil.example/','https://evil.example/','/../admin/'])assert.throws(()=>validateNavigation([{label:'Bad',href}]));});
test('CMS breadcrumb/schema controls render, and approval edits do not fabricate content freshness',()=>{
 const old={path:'/test/',html:'<p>Purchase evaluation details</p>',sections:[],meta:[],schema:[],modifiedAt:'2026-06-01T00:00:00Z'};
 const doc={_rev:'public-revision',_updatedAt:'2026-09-10T00:00:00Z',path:'/test/',title:'Gold evaluation',kind:'service',contentMode:'imported',seo:{canonical:'https://cash4goldanddiamond.com/test/',breadcrumbLabel:'Evaluation',schemaType:'Service'}};
 const page=projectCmsPage(doc,old),graph=JSON.parse(page.schema[0])['@graph'];assert.equal(page.cmsRevision,'public-revision');assert.equal(page.modifiedAt,old.modifiedAt);assert.equal(graph.find(n=>n['@type']==='BreadcrumbList').itemListElement.at(-1).name,'Evaluation');assert.equal(graph.find(n=>n['@type']==='Service').name,'Gold evaluation');
 assert.equal(projectCmsPage({...doc,modifiedAt:'2026-09-09T00:00:00Z'},old).modifiedAt,'2026-09-09T00:00:00Z');
 assert.equal(graph.find(n=>n['@type']==='WebSite')['@id'],'https://cash4goldanddiamond.com/#website');
 assert.equal(graph.find(n=>n['@type']==='WebPage').isPartOf['@id'],'https://cash4goldanddiamond.com/#website');
 assert.throws(()=>projectCmsPage({...doc,seo:{...doc.seo,schemaType:'BlogPosting'}},old),/Schema selection/);
});
