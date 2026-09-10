const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderMigratedImage(value){
 const attributes={src:value.localPath||value.sourceUrl,alt:value.alt||'',width:value.width,height:value.height,srcset:value.srcset,sizes:value.sizes,loading:'lazy',decoding:'async'};
 const attrs=Object.entries(attributes).filter(([,v])=>v!==undefined&&v!==null).map(([k,v])=>`${k}="${escape(v)}"`).join(' ');
 return `<figure class="cms-editorial-image"><img ${attrs}>${value.caption?`<figcaption>${escape(value.caption)}</figcaption>`:''}</figure>`;
}
