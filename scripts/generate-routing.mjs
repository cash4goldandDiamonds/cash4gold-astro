import fs from 'node:fs/promises';
import {validateRedirects} from '../src/lib/editorial-checks.mjs';
const aliases=JSON.parse(await fs.readFile('src/data/redirects.json','utf8'));
const chains=JSON.parse(await fs.readFile('migration/source-redirect-chains.json','utf8'));
const rules=Object.entries(aliases).map(([from,to])=>({from,to,status:chains.find(c=>new URL(c.url).pathname===from)?.chain[0]?.status||301}));
const errors=validateRedirects(rules);if(errors.length)throw new Error(errors.join('\n'));
await fs.writeFile('public/_redirects',rules.map(r=>`${r.from} ${r.to} ${r.status===302?302:301}`).join('\n')+'\n');
console.log('Prepared',rules.length,'static-host redirect rules from observed source redirects.');
