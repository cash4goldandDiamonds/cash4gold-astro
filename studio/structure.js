// Editor navigation only. Account roles, validation and release gates still
// enforce their own boundaries; these lists never approve or publish content.
export const editorFilters={
  pages:'_type == "page" && !(coalesce(kind, "page") in ["article", "archive"])',
  articles:'_type == "page" && kind == "article"',
  archives:'_type == "page" && kind == "archive"',
  review:'_type == "page" && (coalesce(reviewState, "draft") != "approved" || !coalesce(contentVerified, false) || !coalesce(seoVerified, false))',
  seo:'_type == "page" && (!defined(seo.title) || seo.title == "" || !defined(seo.description) || seo.description == "" || !defined(seo.canonical) || seo.canonical == "")',
  images:'_type == "page" && count(body[_type in ["image", "migratedImage"]]) > 0',
};

export const pageTemplates=[
  ['website-page','Website page','page'],
  ['selling-guide','Selling guide','article'],
  ['content-archive','Content archive','archive'],
].map(([id,title,kind])=>({id,title,schemaType:'page',value:{kind,contentMode:'richText',reviewState:'draft',contentVerified:false,seoVerified:false}}));

export function structure(S){
  const pages=(id,title,filter,template)=>S.listItem().id(id).title(title).schemaType('page').child(
    S.documentTypeList('page').id(id).title(title).filter(filter).apiVersion('2026-09-09')
      .defaultOrdering([{field:'title',direction:'asc'}])
      .initialValueTemplates(template?[S.initialValueTemplateItem(template)]:[])
  );
  const type=(name,title)=>S.documentTypeListItem(name).title(title);
  const group=(id,title,items)=>S.listItem().id(id).title(title).child(S.list().id(id).title(title).items(items));
  const handled=new Set(['page','service','category','faq','business','location','author','testimonial','navigation','redirect','socialAutomation']);
  return S.list().id('website').title('Website content').items([
    pages('pages','Pages',editorFilters.pages,'website-page'),
    pages('articles','Articles',editorFilters.articles,'selling-guide'),
    type('service','Services'),
    type('category','Categories'),
    pages('archives','Archives',editorFilters.archives,'content-archive'),
    type('faq','Questions and answers'),
    S.divider(),
    group('review','SEO and content review',[
      pages('awaiting-review','Awaiting content or SEO approval',editorFilters.review),
      pages('missing-seo','Missing SEO fields',editorFilters.seo),
    ]),
    group('media','Media',[
      pages('pages-with-images','Pages with images',editorFilters.images),
      S.listItem().id('uploaded-images').title('Uploaded images').child(
        S.documentTypeList('sanity.imageAsset').title('Uploaded images').initialValueTemplates([])
      ),
    ]),
    group('business-information','Business information',[
      type('business','Business profile'),type('location','Locations and hours'),
      type('author','Authors'),type('testimonial','Testimonials'),
    ]),
    type('navigation','Navigation and footer'),
    type('redirect','Redirects'),
    type('socialAutomation','Social publishing'),
    S.divider(),
    // Retain the original page ID so saved /structure/page;document links work.
    S.documentTypeListItem('page').title('All pages and articles'),
    // Preserve discoverability of future document types instead of silently
    // hiding them when schemas are extended.
    ...S.documentTypeListItems().filter(item=>!handled.has(item.getId())),
  ]);
}
