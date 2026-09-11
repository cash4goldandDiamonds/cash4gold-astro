import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';

const project = path.resolve(process.env.ACCEPTANCE_PROJECT || '.');
const require = createRequire(path.join(project, 'package.json'));
const {load} = require('cheerio');
const tracker = /googletagmanager|google-analytics|gtag\s*\(|fbq\s*\(|connect\.facebook|clarity\.ms|hotjar|plausible|analytics\.js/i;
const hash = value => createHash('sha256').update(value).digest('hex');
function inspect(html, route) {
  const $ = load(html);
  const links = $('a[href]').map((_, element) => $(element).attr('href')).get();
  const forms = $('form').map((_, element) => {
    const form = $(element);
    // No hidden values, anti-CSRF nonces or customer data are recorded.
    return {method:form.attr('method') || 'get', action:form.attr('action') || '(current page)', fields:form.find('input:not([type=hidden]),textarea,select').map((_, input) => ({name:$(input).attr('name') || '', type:$(input).attr('type') || input.tagName})).get()};
  }).get();
  return {
    route, htmlSha256:hash(html), forms,
    bookingLinks:[...new Set(links.filter(href => /^https:\/\/calendly\.com\//.test(href)))],
    phoneLinks:[...new Set(links.filter(href => href.startsWith('tel:')))],
    emailLinks:[...new Set(links.filter(href => href.startsWith('mailto:')).map(href=>href.split('?')[0]))],
    scripts:$('script:not([type="application/ld+json"])').length,
    trackingScriptMatches:$('script').filter((_, script) => tracker.test(($(script).attr('src') || '') + $(script).text())).length,
    frameCount:$('iframe').length,
    consentControlCount:$('button,input').filter((_, node) => /cookie|consent|privacy preferences|reject all|accept all/i.test($(node).text()+' '+($(node).attr('aria-label')||''))).length,
  };
}
async function files(directory) {
  const entries = await fs.readdir(directory,{withFileTypes:true});
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(path.join(directory,entry.name)) : [path.join(directory,entry.name)]))).flat();
}
const built = [];
for(const file of await files(path.join(project,'dist'))) {
  if(!file.endsWith('.html'))continue;
  const route = '/' + path.relative(path.join(project,'dist'),file).replaceAll('\\','/').replace(/index\.html$/,'');
  built.push(inspect(await fs.readFile(file,'utf8'),route));
}
const live = [];
for(const route of ['/contact-us/','/start-selling-gold-and-diamonds/']) {
  try {
    const response=await fetch('https://cash4goldanddiamond.com'+route,{redirect:'follow',signal:AbortSignal.timeout(20000),headers:{'User-Agent':'Cash4Gold owner-authorized migration acceptance check'}});
    const body=await response.text();
    live.push({requestedRoute:route,status:response.status,finalUrl:response.url,observedAt:new Date().toISOString(),...inspect(body,route)});
  }catch(error){live.push({requestedRoute:route,status:'BLOCKED',errorType:error.name});}
}
const totals={htmlPages:built.length,forms:built.reduce((n,p)=>n+p.forms.length,0),pagesWithBookingLinks:built.filter(p=>p.bookingLinks.length).length,pagesWithPhoneLinks:built.filter(p=>p.phoneLinks.length).length,pagesWithTrackingScripts:built.filter(p=>p.trackingScriptMatches).length,frames:built.reduce((n,p)=>n+p.frameCount,0),consentControls:built.reduce((n,p)=>n+p.consentControlCount,0)};
const report={checkedAt:new Date().toISOString(),sourceProject:project,scope:'Static built HTML inspection and read-only public live contact-page GETs; does not prove rendered network behavior, form delivery, booking confirmation or consent/debug events',totals,built,live,deliveryTest:'NOT TESTED: no synthetic submission sent',bookingConfirmation:'NOT TESTED: no booking or invitation created',analyticsDebug:'NOT TESTED: no authorized debug property connected'};
await fs.mkdir('migration/pre-deployment',{recursive:true});
await fs.writeFile('migration/pre-deployment/interaction-surface.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({totals,live:live.map(p=>({route:p.requestedRoute,status:p.status,forms:p.forms?.length,trackers:p.trackingScriptMatches,bookingLinks:p.bookingLinks?.length}))}));
