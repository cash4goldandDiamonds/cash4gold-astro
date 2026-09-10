import fs from 'node:fs';
import {load} from 'cheerio';
const $=load(fs.readFileSync('migration/source-evidence/homepage.html','utf8'));
console.log('content containers', $('main,article,[data-elementor-type]').map((i,e)=>({tag:e.tagName,cls:$(e).attr('class'),type:$(e).attr('data-elementor-type'),id:$(e).attr('data-elementor-id')})).get());
console.log('images', $('img').slice(0,15).map((i,e)=>({src:$(e).attr('src'),alt:$(e).attr('alt')})).get());
console.log('forms', $('form,iframe').map((i,e)=>({tag:e.tagName,action:$(e).attr('action'),src:$(e).attr('src'),id:$(e).attr('id')})).get());
console.log('css', $('link[rel=stylesheet]').map((i,e)=>$(e).attr('href')).get().slice(0,10));
