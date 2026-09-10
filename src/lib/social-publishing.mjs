export const SITE_ORIGIN='https://cash4goldanddiamond.com';
export const CHANNELS=['facebook','instagram'];
export const SCHEDULE={timeZone:'America/Los_Angeles',weekdays:['Mon','Wed','Fri'],hour:10,postsPerWeek:3};
export function publicationSlot(now=new Date()){
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:SCHEDULE.timeZone,weekday:'short',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));
 if(!SCHEDULE.weekdays.includes(parts.weekday)||Number(parts.hour)!==SCHEDULE.hour)return null;
 return `${parts.year}-${parts.month}-${parts.day}`;
}
export function publicArticleUrl(path){
 if(typeof path!=='string'||!/^\/(?!\/)(?:[a-z0-9-]+\/)+$/.test(path))throw Error('invalid_article_path');
 return SITE_ORIGIN+path;
}
export function trackedArticleUrl(path,channel){
 if(!CHANNELS.includes(channel))throw Error('unsupported_channel');
 const url=new URL(publicArticleUrl(path));
 url.search=new URLSearchParams({utm_source:channel,utm_medium:'organic_social',utm_campaign:'selling_guides',utm_content:path.slice(1,-1)}).toString();
 return url.href;
}
export function eligibleArticle(doc){
 const s=doc?.socialSharing;
 try{return Boolean(doc?._id&&!doc._id.startsWith('drafts.')&&doc.kind==='article'&&doc._rev&&doc.reviewState==='approved'&&doc.contentVerified===true&&doc.seoVerified===true&&doc.reviewedBy?._ref&&doc.reviewedAt&&s?.enabled===true&&s.approved===true&&s.mediaRightsConfirmed===true&&s.approvedBy?._ref&&s.approvedAt&&!doc.seo?.noindex&&(!doc.seo?.canonical||doc.seo.canonical===publicArticleUrl(doc.path)));}catch{return false;}
}
export function socialImageUrl(doc,context={}){
 const s=doc.socialSharing||{},ref=s.image?.asset?._ref;
 if(ref){
  const match=/^image-([a-zA-Z0-9]+)-(\d+)x(\d+)-(jpg|jpeg|png|webp)$/.exec(ref);
  if(!match||!context.projectId||context.dataset!=='production')throw Error('invalid_social_image');
  // Fixed JPEG output and square containment preserve the complete piece of jewelry.
  return `https://cdn.sanity.io/images/${context.projectId}/${context.dataset}/${match[1]}-${match[2]}x${match[3]}.${match[4]}?w=1080&h=1080&fit=fill&bg=1c1c1c&fm=jpg&q=85`;
 }
 const path=s.localImage;
 if(typeof path!=='string'||!/^\/media\/social\/[a-z0-9-]+\.jpg$/.test(path))throw Error('social_image_required');
 return SITE_ORIGIN+path;
}
export function makeSocialJob(doc,channel,context={}){
 if(!eligibleArticle(doc)||!CHANNELS.includes(channel)||!doc.socialSharing.channels?.includes(channel))throw Error('article_not_approved_for_channel');
 const caption=doc.socialSharing[channel+'Caption']?.trim();
 if(!caption||caption.length>(channel==='instagram'?1600:3000)||/[<>]|https?:\/\//i.test(caption))throw Error('invalid_caption');
 const alt=(doc.socialSharing.image?.alt||doc.socialSharing.imageAlt||'').trim();
 if(alt.length<8||alt.length>1000)throw Error('image_alt_required');
 const link=trackedArticleUrl(doc.path,channel);
 const text=channel==='facebook'?`${caption}\n\nRead the guide: ${link}`:`${caption}\n\nRead this guide through the link in our profile.\n${link}\n\n#LosAngeles #JewelrySelling`;
 if(channel==='instagram'&&Array.from(text).length>2200)throw Error('final_caption_too_long');
 return {id:`${doc._id}:${channel}`,documentId:doc._id,revision:doc._rev,channel,path:doc.path,title:doc.title,caption:text,link,imageUrl:socialImageUrl(doc,context),imageAlt:alt};
}
export function defaultSocialCaptions(page){
 const answer=String(page.editorial?.answer||page.description||'').replace(/\s+/g,' ').trim();
 const summary=answer.length>500?answer.slice(0,497).replace(/\s+\S*$/,'')+'…':answer;
 return {facebookCaption:`${page.heading}\n\n${summary}\n\nOur guide explains what to check before discussing an offer.`,instagramCaption:`Before you sell: ${page.heading}\n\n${summary}\n\nSave the guide for your visit to the Los Angeles Jewelry District.`};
}
