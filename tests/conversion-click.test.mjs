import assert from 'node:assert/strict';
import test from 'node:test';
import {conversionClick} from '../src/lib/conversion-click.mjs';
const page='https://staging.example.test/sell-your-golds/';
test('actual desktop, mobile and footer appointment CTAs are tracked',()=>{
  for(const label of ['Book an Appointment','Book an appointment ↗','Appointment'])assert.equal(conversionClick('/contact-us/',label,page),'appointment_click');
  assert.equal(conversionClick('https://calendly.com/calidiamond310/30min','Choose an appointment time',page),'appointment_click');
});
test('a general Contact Us link is not an appointment conversion',()=>{assert.equal(conversionClick('/contact-us/','Contact Us',page),null);});
test('Google review and profile links are not directions conversions',()=>{
  assert.equal(conversionClick('https://maps.app.goo.gl/zcu9rXLfB5BWKnKy9','Read all reviews on Google ↗',page),null);
  assert.equal(conversionClick('https://www.google.com/maps/place/Cash4Gold','Google profile',page),null);
});
test('actual directions, phone and email links retain tracking',()=>{
  assert.equal(conversionClick('https://www.google.com/maps/search/?api=1&query=business','Get directions ↗',page),'directions_click');
  assert.equal(conversionClick('https://www.google.com/maps/dir/?api=1&destination=business','Plan route',page),'directions_click');
  assert.equal(conversionClick('tel:+1-310-663-1340','Call us',page),'phone_click');
  assert.equal(conversionClick('mailto:synthetic@example.test','Email',page),'email_click');
});
test('untrusted origins and unrelated schemes do not create booking or direction events',()=>{
  for(const href of ['https://calendly.com.attacker.test/calidiamond310/30min','https://attacker.test/contact-us/','javascript:alert(1)','https://maps.app.goo.gl.attacker.test/route'])assert.equal(conversionClick(href,'Book an appointment directions',page),null);
});
