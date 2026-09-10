import QualityInput from './QualityInput.js';
import {socialSharingSchema,socialAutomationSchema} from './social-schema.js';
import {validateRedirects} from '../src/lib/editorial-checks.mjs';
import {isLocalPath} from '../src/lib/redirects.mjs';
const str=(name,title,extra={})=>({name,title,type:'string',...extra});
const ref=(name,title,to)=>({name,title,type:'reference',to:[{type:to}]});
const refs=(name,title,to)=>({name,title,type:'array',of:[{type:'reference',to:[{type:to}]}]});
const required=Rule=>Rule.required();
const localPath=Rule=>Rule.required().custom(v=>isLocalPath(v)?true:'Use a local URL path beginning and ending with /. Queries, traversal and external URLs are not allowed.');
const image={type:'image',options:{hotspot:true},fields:[str('alt','Alternative text',{validation:required}),str('caption','Caption')]};
export const schemaTypes=[
 {name:'seo',title:'Search and social',type:'object',fields:[str('title','SEO title',{validation:required}),{name:'description',title:'Meta description',type:'text',rows:3,validation:required},str('focusKeyword','Focus keyword'),{name:'secondaryKeywords',title:'Secondary keywords',type:'array',of:[{type:'string'}]}, {name:'canonical',title:'Canonical URL',type:'url',validation:required},{name:'noindex',title:'Exclude from search',type:'boolean',initialValue:false},{name:'nofollow',title:'Do not follow links',type:'boolean',initialValue:false},str('socialTitle','Social title'),{name:'socialDescription',title:'Social description',type:'text',rows:2},{name:'socialImage',title:'Social image',...image},{name:'sourceSocialImage',title:'Original social image URL',type:'url'}]},
 {name:'migratedImage',title:'Imported image',type:'object',fields:[{name:'sourceUrl',title:'Original image URL',type:'url',readOnly:true},str('localPath','Local preview image',{readOnly:true}),str('alt','Alternative text',{validation:required}),str('caption','Caption'),{name:'width',title:'Image width',type:'number',readOnly:true},{name:'height',title:'Image height',type:'number',readOnly:true},str('srcset','Responsive image variants',{readOnly:true}),str('sizes','Display sizes',{readOnly:true})]},
 {name:'sourceTable',title:'Table',type:'object',fields:[{name:'rows',title:'Rows',type:'array',of:[{type:'object',name:'tableRow',fields:[{name:'isHeader',title:'Header row',type:'boolean'},{name:'cells',title:'Cells',type:'array',of:[{type:'string'}]}]}]}]},
 {name:'page',title:'Pages and articles',type:'document',groups:[{name:'content',title:'Content',default:true},{name:'seo',title:'SEO'},{name:'discovery',title:'AEO / GEO'},{name:'migration',title:'Migration record'}],fields:[
  str('title','Page title',{group:'content',validation:required}),str('path','Existing URL path',{group:'content',validation:localPath,description:'Preserve this URL. Changing an existing URL requires approval and a redirect.'}),str('kind','Content type',{group:'content',options:{list:['page','service','article','archive']}}),
  str('contentMode','Preview content',{group:'content',initialValue:'imported',options:{list:[{title:'Preserved source layout',value:'imported'},{title:'Edited content below',value:'richText'}]},description:'The preserved layout stays active until you choose edited content. Review the edited preview before release.'}),
  {name:'body',title:'Content',group:'content',type:'array',of:[{type:'block',fields:[str('sourceId','Section anchor',{readOnly:true}),str('className','Preserved presentation',{readOnly:true})],styles:[{title:'Normal',value:'normal'},...[2,3,4,5,6].map(n=>({title:'Heading '+n,value:'h'+n}))],marks:{annotations:[{name:'link',type:'object',fields:[{name:'href',title:'Link URL or local path',type:'string',validation:Rule=>Rule.required().custom(v=>/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(v||'')?true:'Use a safe web, email, phone, local or section link.')} ]},{name:'internalLink',title:'Link to a page',type:'object',fields:[ref('target','Page','page'),str('fragment','Optional section anchor')]}]}},image,{type:'migratedImage'},{type:'sourceTable'}]},
  {name:'legacyAnchors',title:'Preserved section links',type:'array',of:[{type:'string'}],readOnly:true,group:'migration'},
  {name:'seo',type:'seo',group:'seo'},{name:'quality',title:'Editorial checklist',type:'string',group:'seo',components:{input:QualityInput}},
  ref('author','Author','author'),{name:'publishedAt',title:'Published date',type:'datetime'},ref('location','Location','location'),ref('service','Service','service'),refs('categories','Categories','category'),refs('related','Related pages','page'),
  {name:'answer',title:'Direct answer',type:'text',rows:3,group:'discovery'},refs('faqs','Questions and answers','faq'),{name:'sources',title:'Sources',group:'discovery',type:'array',of:[{type:'object',name:'citation',fields:[str('title','Source title'),{name:'url',title:'Source URL',type:'url'}]}]},
  {name:'sourceUrl',title:'Original URL',type:'url',group:'migration',readOnly:true},str('sourceSha256','Original content fingerprint',{group:'migration',readOnly:true}),{name:'contentVerified',title:'Content compared and approved',type:'boolean',group:'migration',initialValue:false},{name:'seoVerified',title:'SEO metadata compared and approved',type:'boolean',group:'migration',initialValue:false}
 ],preview:{select:{title:'title',subtitle:'path'}}},
 {name:'business',title:'Business information',type:'document',fields:[str('name','Business name',{validation:required}),str('phone','Phone'),str('email','Email'),str('address','Street address'),refs('locations','Locations','location'),{name:'socialProfiles',title:'Social profiles',type:'array',of:[{type:'url'}]}]},
 {name:'location',title:'Locations',type:'document',fields:[str('name','Name'),str('streetAddress','Street address'),str('city','City'),str('region','State / region'),str('postalCode','Postal code'),str('phone','Phone'),{name:'coordinates',title:'Coordinates',type:'geopoint'},{name:'hours',title:'Hours',type:'array',of:[{type:'object',name:'openingHours',fields:[str('day','Day'),str('opens','Opens'),str('closes','Closes')]}]},{name:'mapsUrl',title:'Google Maps URL',type:'url'}]},
 {name:'author',title:'Authors',type:'document',fields:[str('name','Name',{validation:required}),{name:'biography',title:'Biography',type:'text'},{name:'photo',title:'Photo',...image}]},
 {name:'category',title:'Categories',type:'document',fields:[str('title','Title',{validation:required}),str('path','Existing archive URL')]},
 {name:'service',title:'Services',type:'document',fields:[str('title','Title',{validation:required}),ref('page','Service page','page'),{name:'summary',title:'Summary',type:'text'},refs('locations','Locations','location')]},
 {name:'faq',title:'Questions and answers',type:'document',fields:[str('question','Question',{validation:required}),{name:'answer',title:'Answer',type:'text',validation:required},ref('page','Related page','page')]},
 {name:'testimonial',title:'Testimonials',type:'document',fields:[str('name','Displayed name'),{name:'quote',title:'Original quote',type:'text',validation:required},{name:'sourceUrl',title:'Source URL',type:'url'},{name:'verified',title:'Source verified for publication',type:'boolean',initialValue:false}]},
 {name:'navigation',title:'Navigation and footer',type:'document',fields:[str('title','Menu name'),{name:'items',title:'Links',type:'array',of:[{name:'navigationLink',type:'object',fields:[str('label','Label'),str('href','Link URL')]}]}]},
 {name:'redirect',title:'Redirects',type:'document',fields:[str('from','From path',{validation:localPath}),str('to','Destination path',{validation:localPath}),{name:'status',title:'Redirect status',type:'number',options:{list:[301,302]},initialValue:301}],validation:Rule=>Rule.custom(async(value,context)=>{if(!value?.from||!value?.to)return true;const client=context.getClient({apiVersion:'2026-09-09'});const all=await client.fetch('*[_type=="redirect" && !(_id in [$id,$draft])]{from,to}',{id:value._id.replace(/^drafts\./,''),draft:'drafts.'+value._id.replace(/^drafts\./,'')});return validateRedirects([...all,value])[0]||true;})},
];

// These controls record editorial decisions; account roles must enforce who can approve.
// They are deliberately not presented as a substitute for tested Sanity permissions.
const pageSchema=schemaTypes.find(type=>type.name==='page');
schemaTypes.push(socialSharingSchema,socialAutomationSchema);
pageSchema.groups.push({name:'social',title:'Social publishing'});
pageSchema.fields.push({name:'socialSharing',type:'socialSharing',group:'social',hidden:({document})=>document?.kind!=='article'});
pageSchema.fields.find(field=>field.name==='contentMode').initialValue='richText';
pageSchema.fields.find(field=>field.name==='path').validation=Rule=>Rule.required().custom(async(value,context)=>{
 if(!isLocalPath(value))return 'Use a local path beginning and ending with /.';
 const id=(context.document?._id||'').replace(/^drafts\./,'');
 const count=await context.getClient({apiVersion:'2026-09-09'}).fetch('count(*[_type=="page" && path==$path && !(_id in [$id,$draft])])',{path:value,id,draft:'drafts.'+id});
 return count===0||'Another document already uses this URL. Resolve the collision before publishing.';
});
pageSchema.fields.push(
 {name:'excerpt',title:'Summary / excerpt',type:'text',group:'content'},
 {name:'reviewState',title:'Editorial review state',type:'string',group:'migration',initialValue:'draft',options:{list:['draft','inReview','approved']},description:'Approval must be performed by an authorized human reviewer after checking facts, intent, media rights and sources.'},
 {...ref('reviewedBy','Reviewed by','author'),group:'migration'},
 {name:'reviewedAt',title:'Actual review date',type:'datetime',group:'migration'},
 {name:'modifiedAt',title:'Actual content revision date',type:'datetime',group:'content',description:'Change this when public content changes; do not refresh it solely to imply freshness.'},
 {name:'reviewNotes',title:'Review notes',type:'text',group:'migration',description:'Editorial notes only. Never enter private lead details or credentials in content documents.'},
 {name:'sourceId',title:'Legacy source ID',type:'string',readOnly:true,group:'migration'},
 {name:'tags',title:'Tags',type:'array',of:[{type:'reference',to:[{type:'category'}]}]},
 {name:'primaryIntent',title:'Primary reader intent',type:'string',group:'discovery',description:'Describe the question or selling task; review existing destinations before creating overlapping content.'}
);
pageSchema.validation=Rule=>Rule.custom(document=>document?.reviewState!=='approved'||(document.contentVerified&&document.seoVerified&&document.reviewedBy?._ref&&document.reviewedAt)?true:'Approval requires recorded content and SEO comparison, a named reviewer, and an actual review date.');
const seoSchema=schemaTypes.find(type=>type.name==='seo');
seoSchema.fields.find(field=>field.name==='canonical').validation=Rule=>Rule.required().custom(value=>{
 try{const url=new URL(value);return url.origin==='https://cash4goldanddiamond.com'&&!url.search&&!url.hash||'Use the production site origin without query strings or fragments.';}catch{return 'Enter a valid absolute canonical URL.';}
});
seoSchema.fields.push(str('breadcrumbLabel','Breadcrumb label'),str('schemaType','Page schema',{options:{list:['WebPage','Service','BlogPosting']},description:'Must match the visible page. No invented Product offers or review stars.'}),{name:'exceptionReason',title:'Justified SEO exception',type:'text',description:'Record the reason for a canonical/length/intent exception. This does not bypass release checks.'});
for(const type of schemaTypes){
 for(const field of type.fields||[]){
  if(field.type==='image'&&!field.fields.some(item=>item.name==='rights'))field.fields.push(str('title','Image title'),str('description','Image description'),str('sourceCredit','Source / credit'),str('rights','Usage rights'),{name:'illustrative',title:'Illustrative or AI-generated',type:'boolean',initialValue:false});
 }
}
schemaTypes.find(type=>type.name==='migratedImage').fields.push(str('title','Image title'),str('description','Image description'),str('sourceCredit','Source / credit'),str('rights','Usage rights'),{name:'illustrative',title:'Illustrative or AI-generated',type:'boolean'});
schemaTypes.find(type=>type.name==='page').fields.find(field=>field.name==='sources').of[0].fields.push({name:'checkedAt',title:'Source checked on',type:'date'});
