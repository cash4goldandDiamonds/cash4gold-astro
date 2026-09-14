"""Inspect a downloaded WordPress export offline; never import or publish it."""
import collections, csv, datetime, hashlib, html, json, pathlib, re, subprocess, sys
import xml.etree.ElementTree as ET

source=pathlib.Path(sys.argv[1]).resolve()
raw=source.read_bytes()
assert 0<len(raw)<100_000_000, 'Unexpected export size'
assert not re.search(br'<!\s*(?:DOCTYPE|ENTITY)\b',raw,re.I), 'DTD/entity declarations are prohibited'
root=ET.fromstring(raw)
ns={'wp':'http://wordpress.org/export/1.2/','content':'http://purl.org/rss/1.0/modules/content/'}
channel=root.find('channel');assert channel is not None
assert (channel.findtext('link') or '').rstrip('/')=='https://cash4goldanddiamond.com'
stamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
folder=pathlib.Path('exports/wordpress')/stamp.replace(':','-')
folder.mkdir(parents=True,exist_ok=False)
copy=folder/source.name
with copy.open('xb') as out:out.write(raw)
digest=hashlib.sha256(raw).hexdigest();assert hashlib.sha256(copy.read_bytes()).hexdigest()==digest
assert subprocess.run(['git','check-ignore','-q',str(copy)],check=False).returncode==0, 'Private export is not ignored by Git'

records=[]
for item in channel.findall('item'):
    text=lambda name:item.findtext(name,default='',namespaces=ns)
    meta={m.findtext('wp:meta_key',default='',namespaces=ns):m.findtext('wp:meta_value',default='',namespaces=ns) for m in item.findall('wp:postmeta',ns)}
    records.append({'id':text('wp:post_id'),'type':text('wp:post_type'),'status':text('wp:status'),'url':text('link'),'modified':text('wp:post_modified'),'title':text('title'),'meta':meta,'attachmentUrl':text('wp:attachment_url')})
published=[r for r in records if r['status']=='publish' and r['type'] in ('post','page')]
inventory=list(csv.DictReader(pathlib.Path('migration/content-inventory.csv').open(encoding='utf-8-sig',newline='')))
byid={r['sourceId']:r for r in inventory if r['sourceType'] in ('post','page') and r['sourceId'].isdigit()}
published_ids={r['id'] for r in published}
fields={'rank_math_title':'seoTitle','rank_math_description':'seoDescription','rank_math_canonical_url':'canonical'}
comparisons=[]
for record in published:
    old=byid.get(record['id'])
    if not old:continue
    for key,column in fields.items():
        value=record['meta'].get(key,'')
        if not value:state='Uses plugin default or absent override; global settings still required'
        elif re.search(r'%[a-zA-Z_]+%',value):state='Template override; needs variable resolution'
        elif html.unescape(value).strip()==html.unescape(old[column]).strip():state='Matches preserved metadata'
        else:state='Override differs; review required'
        comparisons.append({'sourceId':record['id'],'url':record['url'],'field':key,'state':state})
oldmedia=json.loads(pathlib.Path('migration/pre-deployment/wordpress-api/media.json').read_text(encoding='utf-8-sig'))
assert isinstance(oldmedia,list)
old_media_ids={str(r['id']) for r in oldmedia}
attachments=[r for r in records if r['type']=='attachment']
attachment_ids={r['id'] for r in attachments}
report={'checkedAt':stamp,'status':'PASS','scope':'Authenticated all-content WXR downloaded through WordPress UI; offline XML structure, file hash, inventory and explicit SEO-override comparison. This is not a full database/files backup, media binary archive or restore.','sourceFile':str(copy).replace('\\','/'),'bytes':len(raw),'sha256':digest,'xmlParsed':True,'rawExportExcludedFromGit':True,'items':len(records),'typeStatusCounts':dict(collections.Counter(r['type']+':'+r['status'] for r in records)),'publishedPosts':sum(r['type']=='post' for r in published),'publishedPages':sum(r['type']=='page' for r in published),'newPublishedSourceIds':sorted(published_ids-set(byid)),'previousPublishedIdsAbsentFromExport':sorted(set(byid)-published_ids),'publishedModifiedSincePriorCapture':[{'sourceId':r['id'],'url':r['url']} for r in published if r['id'] in byid and r['modified'].replace(' ','T')!=byid[r['id']]['modifiedAt']],'seoOverrideComparisonCounts':dict(collections.Counter(r['state'] for r in comparisons)),'seoOverrideComparisons':comparisons,'rankMathMetaKeyCounts':dict(collections.Counter(key for r in published for key in r['meta'] if key.startswith('rank_math_'))),'attachments':{'exported':len(attachments),'previousPublicApi':len(oldmedia),'presentOnlyInAuthenticatedExport':[{'sourceId':r['id'],'status':r['status'],'sourceUrl':r['attachmentUrl']} for r in attachments if r['id'] not in old_media_ids],'previousApiIdsAbsent':sorted(old_media_ids-attachment_ids)},'unresolved':['Plugin/global Rank Math settings and redirect export','All custom content and private draft dispositions','Media binaries and rights reconciliation','Complete database/files backup and isolated restore','Final source delta and owner content approval'],'productionWrites':0,'recommendation':'NOT READY TO GO LIVE'}
assert len({r['id'] for r in records})==len(records), 'Duplicate exported IDs'
(folder/'inspection-private.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
pathlib.Path('migration/pre-deployment/wordpress-authenticated-export.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k not in ('seoOverrideComparisons','rankMathMetaKeyCounts')}))
