import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {load} from 'cheerio';
import {inquiryMarkupErrors} from '../src/lib/inquiry-markup.mjs';

// Exercise the actual form's static markup, before runtime availability enables it.
const component=await fs.readFile(new URL('../src/components/InquiryForm.astro',import.meta.url),'utf8');
const fixture=component.match(/<form\b[\s\S]*?<\/form>/)?.[0];
assert.ok(fixture,'The reviewed inquiry component must contain its form');
const contact='/contact-us/';
const copy=()=>load(fixture);

test('the actual inquiry form passes its pre-availability markup safeguards',()=>{
 assert.deepEqual(inquiryMarkupErrors(copy(),contact),[]);
 assert.deepEqual(inquiryMarkupErrors(load('<main><h1>Gold buying</h1></main>'),'/sell-your-golds/'),[]);
});

test('legacy or extra forms cannot enter content routes',()=>{
 assert.deepEqual(inquiryMarkupErrors(copy(),'/sell-your-golds/'),['form-outside-contact']);
 assert.deepEqual(inquiryMarkupErrors(load(''),contact),['contact-form-count']);
 assert.deepEqual(inquiryMarkupErrors(load(fixture+'<form action="/old-wordpress-handler/" method="post"></form>'),contact),['contact-form-count']);
});

test('unsafe submission targets and sensitive upload/password inputs are rejected',()=>{
 for(const mutate of [
  $=>$('form').attr('action','https://unrelated.invalid/collect'),
  $=>$('form').attr('method','get'),
  $=>$('form').removeAttr('data-inquiry-form'),
 ]){const $=copy();mutate($);assert.ok(inquiryMarkupErrors($,contact).includes('inquiry-action'));}
 for(const type of ['file','password']){
  const $=copy();$('form').append(`<input type="${type}" name="private-document">`);
  assert.ok(inquiryMarkupErrors($,contact).includes('unexpected-sensitive-field'));
 }
});

test('required inquiry fields must each retain a unique explicitly labelled control',()=>{
 for(const name of ['name','email','itemType','message','permission']){
  for(const mutate of [
   ($,field)=>$('label').filter((i,label)=>$(label).attr('for')===field.attr('id')).remove(),
   ($,field)=>field.removeAttr('required'),
   ($,field)=>field.removeAttr('id'),
   ($,field)=>field.after(field.clone()),
  ]){const $=copy();mutate($,$(`[name="${name}"]`));assert.ok(inquiryMarkupErrors($,contact).includes('inquiry-label-'+name),name);}
 }
});

test('an unready form cannot render enabled or lose its accessible status region',()=>{
 for(const mutate of [
  $=>$('form').removeAttr('hidden'),
  $=>$('[data-inquiry-submit]').removeAttr('disabled'),
 ]){const $=copy();mutate($);assert.ok(inquiryMarkupErrors($,contact).includes('inquiry-readiness-guard'));}
 for(const mutate of [
  $=>$('[data-inquiry-status]').remove(),
  $=>$('[data-inquiry-status]').removeAttr('role'),
  $=>$('[data-inquiry-status]').attr('tabindex','0'),
 ]){const $=copy();mutate($);assert.ok(inquiryMarkupErrors($,contact).includes('inquiry-status'));}
});
