export function responsiveCmsImage(value,context){
 const ref=value?.asset?._ref||value?.asset?._id,match=/^image-([\w-]+)-(\d+)x(\d+)-(\w+)$/.exec(ref||'');
 if(!match||!context.projectId||!context.dataset)return null;
 const width=Number(match[2]),height=Number(match[3]);
 const crop=value.crop||{},left=Math.round(width*(crop.left||0)),top=Math.round(height*(crop.top||0));
 const croppedWidth=width-left-Math.round(width*(crop.right||0)),croppedHeight=height-top-Math.round(height*(crop.bottom||0));
 if(croppedWidth<=0||croppedHeight<=0||left<0||top<0)throw new Error('Invalid CMS image crop.');
 const base=`https://cdn.sanity.io/images/${encodeURIComponent(context.projectId)}/${encodeURIComponent(context.dataset)}/${match[1]}-${width}x${height}.${match[4]}`;
 const max=Math.min(croppedWidth,1400),widths=[...new Set([320,480,800,1200,max].filter(w=>w<=max))].sort((a,b)=>a-b);
 const url=w=>base+`?w=${w}&auto=format`+(Object.keys(crop).length?`&rect=${left},${top},${croppedWidth},${croppedHeight}`:'');
 return {src:url(max),srcset:widths.map(w=>`${url(w)} ${w}w`).join(', '),sizes:'(max-width: 900px) 92vw, 880px',width:croppedWidth,height:croppedHeight};
}
