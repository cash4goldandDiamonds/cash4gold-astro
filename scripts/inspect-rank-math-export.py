"""Inspect a downloaded Rank Math export without importing or changing WordPress."""
import datetime, hashlib, json, pathlib, re, subprocess, sys
from urllib.parse import urlsplit

source = pathlib.Path(sys.argv[1]).resolve()
raw = source.read_bytes()
assert 0 < len(raw) < 10_000_000, 'Unexpected settings export size'
data = json.loads(raw)
assert all(key in data for key in ('general', 'titles', 'sitemap', 'redirections'))
stamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
folder = pathlib.Path('exports/rank-math') / stamp.replace(':', '-')
folder.mkdir(parents=True, exist_ok=False)
copy = folder / source.name
with copy.open('xb') as out:
    out.write(raw)
assert subprocess.run(['git', 'check-ignore', '-q', str(copy)], check=False).returncode == 0
digest = hashlib.sha256(raw).hexdigest()
assert hashlib.sha256(copy.read_bytes()).hexdigest() == digest
aliases = json.loads(pathlib.Path('src/data/redirects.json').read_text(encoding='utf-8-sig'))
pages = json.loads(pathlib.Path('src/data/pages.json').read_text(encoding='utf-8-sig'))
paths = {p['path'] for p in pages}
redirects = []
for rule in data['redirections']:
    # Recognize only the exact plain-string array structure actually exported.
    # Never deserialize PHP objects or evaluate the exported string as code.
    match = re.fullmatch(r'a:1:\{i:0;a:3:\{s:6:"ignore";s:0:"";s:7:"pattern";s:(\d+):"([^"\r\n]+)";s:10:"comparison";s:5:"exact";\}\}', rule['sources'])
    if not match or len(match[2].encode()) != int(match[1]):
        redirects.append({'id': rule['id'], 'status': 'BLOCKED', 'reason': 'Unsupported source representation requires review'})
        continue
    target = urlsplit(rule['url_to'])
    assert target.scheme == 'https' and target.netloc == 'cash4goldanddiamond.com' and not target.query and not target.fragment
    path = '/' + match[2].lstrip('/')
    assert not re.search(r'[?#\\\s]', path) and '..' not in path
    covered = aliases.get(path) == target.path and str(rule['header_code']) == '301'
    redirects.append({'id': rule['id'], 'source': path, 'destination': target.path, 'httpStatus': int(rule['header_code']), 'active': rule['status'] == 'active', 'configured': covered, 'destinationContentPresent': target.path in paths, 'sourceConflictsWithContent': path in paths, 'status': 'PASS' if covered else 'BLOCKED'})
title_keys = ('pt_post_title', 'pt_post_description', 'pt_page_title', 'pt_page_description', 'tax_category_title', 'tax_category_description', 'tax_post_tag_title', 'tax_post_tag_description', 'robots_global', 'author_robots', 'noindex_empty_taxonomies', 'noindex_paginated_pages')
sitemap_keys = ('pt_post_sitemap', 'pt_page_sitemap', 'pt_attachment_sitemap', 'tax_category_sitemap', 'tax_post_tag_sitemap', 'exclude_posts')
report = {
    'checkedAt': stamp, 'status': 'PASS',
    'scope': 'Authenticated read-only settings export and offline structural/redirect comparison. Full SEO migration remains BLOCKED.',
    'sourceFile': str(copy).replace('\\', '/'), 'bytes': len(raw), 'sha256': digest,
    'rawExportExcludedFromGit': True, 'sectionNames': list(data),
    'publicTemplateDefaults': {k: data['titles'].get(k) for k in title_keys},
    'publicSitemapSettings': {k: data['sitemap'].get(k) for k in sitemap_keys},
    'redirects': redirects,
    'unresolved': ['Resolve uncovered redirects without losing existing page content', 'Compare resolved global templates and explicit overrides to rendered source', 'Review current taxonomy indexing intent and approved production behavior', 'Full backup and isolated restore'],
    'productionWrites': 0, 'recommendation': 'NOT READY TO GO LIVE',
}
pathlib.Path('migration/pre-deployment/rank-math-authenticated-export.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print(json.dumps(report, indent=2))
