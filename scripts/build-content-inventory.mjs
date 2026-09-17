// Merges the structural crawl (reports/CONTENT_INVENTORY_RAW_2026-09-17.json, produced by
// scripts/audit-content-inventory.mjs against a built dist/) with the existing editorial
// judgments already on file from prior audits:
//   - migration/final-seo-audit/article-decisions.json (111-row KEEP/IMPROVE/MERGE/REDIRECT ledger)
//   - migration/keyword-map.csv (role/primaryIntent/primaryService/relatedQueries/relatedPages)
//   - migration/duplicate-article-canonicals.json (already-resolved near-duplicate pairs)
// into the single 19-column content inventory the Sept 17, 2026 audit brief asked for.
// This script makes NO content, redirect, or indexability changes. It only reads existing
// files and writes a report. Any path not covered by prior editorial review is labeled
// "NOT PREVIOUSLY REVIEWED" rather than guessed at.
import fs from 'node:fs/promises';

function parseCsv(text) {
  const clean = text.replace(/^﻿/, '');
  const lines = clean.split(/\r?\n/).filter(l => l.length);
  const header = splitCsvLine(lines[0]);
  return lines.slice(1).map(line => {
    const cells = splitCsvLine(line);
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? '']));
  });
}
function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else cur += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

const raw = JSON.parse(await fs.readFile('reports/CONTENT_INVENTORY_RAW_2026-09-17.json', 'utf8'));
const decisionsDoc = JSON.parse(await fs.readFile('migration/final-seo-audit/article-decisions.json', 'utf8'));
const decisionsByPath = new Map(decisionsDoc.rows.map(r => [r.path, r]));
const keywordRows = parseCsv(await fs.readFile('migration/keyword-map.csv', 'utf8'));
const keywordByPath = new Map(keywordRows.map(r => [r.path, r]));
const dupCanonicals = JSON.parse(await fs.readFile('migration/duplicate-article-canonicals.json', 'utf8'));
const alreadyResolvedDupPaths = new Set(dupCanonicals.map(d => d.path));

const LA_TERMS = /los angeles|downtown|\bla\b|hill street|90014|southern california/i;

function contentDepth(wordCount) {
  if (wordCount === 0) return 'N/A (non-article shell)';
  if (wordCount < 300) return 'Thin (<300 words)';
  if (wordCount < 800) return 'Moderate (300-800 words)';
  return 'Deep (800+ words)';
}

function pageType(path, kw, isHome) {
  if (isHome) return 'Homepage';
  if (path.startsWith('/blogs/')) return 'Blog archive/index';
  if (kw?.role === 'Primary commercial destination') return 'Primary commercial/service page';
  if (kw?.role === 'Supporting page/archive') return 'Supporting page';
  if (kw?.role === 'Supporting article') return 'Supporting article';
  return 'Article (unclassified role - not in keyword map)';
}

function cannibalizationGroup(path, decision) {
  if (alreadyResolvedDupPaths.has(path)) return 'N/A - resolved duplicate, redirected out of sitemap';
  const peer = decision?.closestTextPeer;
  if (peer && peer.jaccardFiveWordShingles >= 0.15) {
    return `Possible overlap with ${peer.path} (shingle similarity ${peer.jaccardFiveWordShingles.toFixed(2)})`;
  }
  return 'None detected (nearest text peer below 0.15 similarity threshold)';
}

function recommendedAction(path, decision) {
  if (!decision) return 'NOT PREVIOUSLY REVIEWED - needs manual editorial pass before any action';
  return decision.decision;
}

const rows = raw.map(r => {
  const isHome = r.path === '/';
  const kw = keywordByPath.get(r.path);
  const decision = decisionsByPath.get(r.path);
  const laRelevant = LA_TERMS.test(r.title) || LA_TERMS.test(r.h1) || LA_TERMS.test(kw?.primaryIntent || '') || LA_TERMS.test(kw?.relatedQueries || '');
  return {
    url: r.url,
    pageType: pageType(r.path, kw, isHome),
    primaryTopic: kw?.title || r.title || r.h1,
    primarySearchIntent: decision?.currentIntent || kw?.primaryIntent || 'Not documented in prior audits',
    targetServiceCategory: kw?.primaryService || (isHome ? 'All services (homepage)' : 'Not mapped in keyword-map.csv'),
    laLocalRelevance: laRelevant ? 'Yes' : 'Not explicit in title/H1/intent (may still be implicit via footer NAP/schema)',
    title: r.title,
    h1: r.h1 || '(no H1 - see h1Count)',
    canonical: r.canonical,
    indexability: r.indexable ? 'Indexable (follow, index)' : 'Noindex',
    contentDepth: `${r.wordCount} words - ${contentDepth(r.wordCount)}`,
    internalLinksIn: r.internalLinksIn,
    internalLinksOut: r.internalLinksOut,
    internalLinksOutBody: r.internalLinksOutBody,
    ctaPresent: r.hasContactCta ? 'Yes' : 'No',
    authorExpertiseSignals: r.authorSignal ? `Byline: "${r.authorSignal}"; schema: ${r.schemaType || 'none'}` : `No visible byline; schema: ${r.schemaType || 'none'}`,
    externalCitations: r.externalCitationCount > 0 ? `${r.externalCitationCount} (${r.externalCitationHosts.join(', ')})` : 'None',
    freshness: r.modified || 'No article:modified_time/published_time meta found',
    cannibalizationGroup: cannibalizationGroup(r.path, decision),
    recommendedAction: recommendedAction(r.path, decision),
    _path: r.path,
    _legacyRankingUrl: decision?.legacyRankingUrl || false,
    _priorFindings: decision?.priorFindings || [],
  };
});

await fs.mkdir('reports', { recursive: true });
await fs.writeFile('reports/CONTENT_INVENTORY_2026-09-17.json', JSON.stringify(rows, null, 2));

const csvHeader = ['URL','Page Type','Primary Topic','Primary Search Intent','Target Service/Category','LA/Local Relevance','Title','H1','Canonical','Indexability','Content Depth','Internal Links In','Internal Links Out','CTA Present','Author/Expertise Signals','External Citations','Freshness','Cannibalization Group','Recommended Action'];
function csvEscape(v) { const s = String(v ?? ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
const csvLines = [csvHeader.join(',')];
for (const r of rows) {
  csvLines.push([r.url,r.pageType,r.primaryTopic,r.primarySearchIntent,r.targetServiceCategory,r.laLocalRelevance,r.title,r.h1,r.canonical,r.indexability,r.contentDepth,r.internalLinksIn,r.internalLinksOut,r.ctaPresent,r.authorExpertiseSignals,r.externalCitations,r.freshness,r.cannibalizationGroup,r.recommendedAction].map(csvEscape).join(','));
}
await fs.writeFile('reports/CONTENT_INVENTORY_2026-09-17.csv', csvLines.join('\n') + '\n');

const notReviewed = rows.filter(r => r.recommendedAction.startsWith('NOT PREVIOUSLY'));
const byAction = {};
for (const r of rows) byAction[r.recommendedAction] = (byAction[r.recommendedAction] || 0) + 1;
console.log(JSON.stringify({ totalRows: rows.length, byAction, notReviewedPaths: notReviewed.map(r => r._path) }, null, 2));
