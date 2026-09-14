import {execFileSync} from 'node:child_process';
import {assertContentEnvironment} from './cms-release-gates.mjs';

// Explicit source selection leaves the separate CMS approval requirements intact.
export const STATIC_RELEASE_PATHS = [
  'src', 'public', 'studio', 'scripts', 'workers', 'cloudflare', 'tests', '.github',
  '.gitignore', '.npmrc', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'tsconfig.json', 'astro.config.mjs',
  'sanity.config.js', 'sanity.cli.js', 'wrangler.preview.jsonc', 'wrangler.production.jsonc',
];
export function assertStaticReleaseSource(env = {}, options = {}) {
  if (env.CONTENT_SOURCE !== 'reviewed-static') return null;
  assertContentEnvironment(env);
  const root = options.root || process.cwd();
  const git = options.git || (args => execFileSync('git', args, {
    cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1024 * 1024,
  }).trim());
  const actual = git(['rev-parse', '--verify', 'HEAD']).trim().toLowerCase();
  if (actual !== env.STATIC_RELEASE_COMMIT.toLowerCase()) throw new Error('Static release commit differs from the reviewed source.');
  git(['ls-files', '--error-unmatch', '--', 'src/data/pages.json', 'src/data/redirects.json', 'wrangler.production.jsonc']);
  if (git(['status', '--porcelain=v1', '--untracked-files=all', '--', ...STATIC_RELEASE_PATHS]).trim()) throw new Error('Static release requires clean tracked rendering source; use the reviewed Git checkout.');
  if (git(['ls-files', '--others', '--ignored', '--exclude-standard', '--', 'src', 'public', 'studio', 'scripts', 'workers', 'cloudflare']).trim()) throw new Error('Static release cannot include ignored untracked source or public assets.');
  return {contentSource: 'reviewed-static', sourceCommit: actual};
}
