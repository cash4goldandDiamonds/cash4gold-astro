import {load} from 'cheerio';
export const diamondPolicy='We buy natural, cut and polished diamonds of any size or shape, loose or in jewelry. We do not buy laboratory-grown, uncut or rough diamonds.';
export const gemstonePolicy='We buy only large, high-quality gemstones, including green Colombian emeralds, Burmese rubies and Ceylon blue sapphires. Certificates are welcome but not required.';
export const businessDescription='Cash 4 Gold & Diamonds buys gold jewelry, scrap gold, Cuban chains, gold and silver coins, natural polished diamonds, luxury watches and large, high-quality gemstones in Downtown Los Angeles. Cash, bank wire and business check are available for agreed purchases.';
export function assertBuyingPolicy(pages){
 for(const p of pages){
  if(p.path==='/uncut-diamond-buyers-los-angeles/')throw new Error('The retired uncut-diamond page cannot be imported. Use /large-diamond-buyer-los-angeles/.');
  const $=load(p.html||'');$('.article-related,.article-resources,.article-toc,figure,script').remove();
  const text=[p.title,p.heading,p.description,$.text().replace(/\s+/g,' ')].join(' ');
  for(const sentence of text.split(/(?<=[.!?])\s+/)){
   if(/\b(?:we|our (?:business|store|service)|cash 4 gold[^.]{0,20})\s+(?:also\s+)?(?:buy|buys|purchase|purchases|accept|accepts|welcome|welcomes)\b[^.!?]{0,110}\b(?:uncut|rough|lab(?:oratory)?[- ]grown)\s+diamonds?\b/i.test(sentence)&&!/(?:do not|does not|don't|doesn't|no |not |excluding|except)/i.test(sentence))throw new Error('Buying-policy conflict on '+p.path+': '+sentence);
   if(/(?:buy|purchase|accept)\s+(?:all\s+)?gemstones?\s+(?:of |in )?(?:any|every|all)\s+(?:size|quality)/i.test(sentence))throw new Error('Gemstone buying is limited to large, high-quality stones: '+p.path);
  }
  if(p.path==='/sell-gemstones-for-cash-in-los-angeles/'&&(!/large[ ,]+high[- ]quality/i.test(text)||!/(?:certificates?[^.]{0,65}(?:not required|optional)|(?:report|certificate)[^.]{0,50}not (?:a )?(?:prerequisite|required))/i.test(text)))throw new Error('Gemstone service must state large/high-quality scope and optional certificates.');
 }
}
