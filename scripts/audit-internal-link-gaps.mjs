// Read-only analysis: checks how many of the hub-and-spoke relationships already proposed in
// migration/keyword-map.csv (each article's `primaryService` = its priority commercial hub page,
// `relatedPages` = sibling spoke articles) are ALREADY realized as an actual <a href> inside the
// rendered <main> body of the built dist/ HTML, versus missing. Makes no edits. Written for the
// Sept 17, 2026 internal-linking audit (Section 2 of the SEO/AEO/GEO brief).
import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

function parseCsv(text) {
  const clean = text.replace(/^﻿/, '');
  const lines = clean.split(/\r?\n/).filter(l => l.length);
  const header = splitCsvLine(lines[0]);
  return lines.slice(1).map(line => Object.fromEntries(header.map((h, i) => [h, splitCsvLine(line)[i] ?? ''])));
}
function splitCsvLine(line) {
  const out = []; let cur = ''; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"' && line[i+1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else { if (c === '"') q = true; else if (c === ',') { out.push(cur); cur=''; } else cur += c; }
  }
  out.push(cur);
  return out;
}

const kwRows = parseCsv(await fs.readFile('migration/keyword-map.csv', 'utf8'));
const distDir = path.resolve('dist');

async function bodyLinksFor(routePath) {
  const file = routePath === '/' ? path.join(distDir, 'index.html') : path.join(distDir, routePath.replace(/^\//, ''), 'index.html');
  try {
    const html = await fs.readFile(file, 'utf8');
    const $ = load(html);
    const links = new Set();
    $('main a[href]').each((i, el) => {
      const href = $(el).attr('href');
      try { const u = new URL(href, 'https://cash4goldanddiamond.com'); if (u.hostname === 'cash4goldanddiamond.com') links.add(u.pathname); } catch {}
    });
    return links;
  } catch { return null; }
}

const missingHubLinks = [];
const missingSpokeLinks = [];
let checked = 0, hubLinkOk = 0, hubLinkMissing = 0, noHtml = 0;

for (const row of kwRows) {
  if (!row.path || !row.primaryService) continue;
  const links = await bodyLinksFor(row.path);
  if (links === null) { noHtml++; continue; }
  checked++;
  if (row.primaryService && row.path !== row.primaryService) {
    if (links.has(row.primaryService)) hubLinkOk++;
    else { hubLinkMissing++; missingHubLinks.push({path: row.path, missingHub: row.primaryService}); }
  }
  if (row.relatedPages) {
    const related = row.relatedPages.split('|').map(s => s.trim()).filter(Boolean);
    const missing = related.filter(r => !links.has(r));
    if (missing.length) missingSpokeLinks.push({path: row.path, missingRelated: missing, hasRelated: related.filter(r=>links.has(r))});
  }
}

const summary = {
  rowsWithPrimaryService: kwRows.filter(r=>r.primaryService).length,
  checkedAgainstBuiltHtml: checked,
  notFoundInDist: noHtml,
  hubLinkAlreadyPresent: hubLinkOk,
  hubLinkMissing: hubLinkMissing,
};
console.log(JSON.stringify(summary, null, 2));
await fs.mkdir('reports', {recursive:true});
await fs.writeFile('reports/INTERNAL_LINK_GAPS_2026-09-17.json', JSON.stringify({summary, missingHubLinks, missingSpokeLinks}, null, 2));
