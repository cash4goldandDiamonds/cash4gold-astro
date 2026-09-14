// Classify click intent without collecting link URLs, queries or visitor data.
export function conversionClick(href, label, pageUrl) {
  let url, page;
  try { page = new URL(pageUrl); url = new URL(href, page); } catch { return null; }
  if (url.protocol === 'tel:') return 'phone_click';
  if (url.protocol === 'mailto:') return 'email_click';
  if (!['http:', 'https:'].includes(url.protocol)) return null;
  const text = String(label || '').replace(/\s+/g, ' ').trim();
  if (url.origin === 'https://calendly.com' && /^\/calidiamond310\/30min\/?$/.test(url.pathname)) return 'appointment_click';
  if (url.origin === page.origin && /^\/contact-us\/?$/.test(url.pathname) && /\bappointment\b/i.test(text)) return 'appointment_click';
  const maps = url.origin === 'https://www.google.com' && /^\/maps(?:\/|$)/.test(url.pathname);
  const mapsShort = url.origin === 'https://maps.app.goo.gl';
  if ((maps || mapsShort) && (/\bdirections\b/i.test(text) || (maps && /^\/maps\/dir(?:\/|$)/.test(url.pathname)))) return 'directions_click';
  return null;
}
