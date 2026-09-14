const reviewer={type:'reference',to:[{type:'author'}]};
export const socialSharingSchema={name:'socialSharing',title:'Share this article',type:'object',fields:[
 {name:'enabled',title:'Automatically share this article',type:'boolean',initialValue:false,description:'After approval and website publication, share once to each selected connected network at the next Monday, Wednesday or Friday 10 a.m. Los Angeles slot.'},
 {name:'channels',title:'Networks',type:'array',of:[{type:'string',options:{list:[{title:'Facebook Page',value:'facebook'},{title:'Instagram professional account',value:'instagram'}]}}],validation:Rule=>Rule.unique()},
 {name:'facebookCaption',title:'Facebook caption',type:'text',rows:5,description:'The tracked article link is added automatically. Do not paste a link here.',validation:Rule=>Rule.max(3000)},
 {name:'instagramCaption',title:'Instagram caption',type:'text',rows:5,description:'The profile-link instruction and tracked URL are added automatically. The public profile should link to the guide library.',validation:Rule=>Rule.max(1600)},
 {name:'image',title:'Instagram image',type:'image',options:{hotspot:true},fields:[{name:'alt',title:'Image description',type:'string',validation:Rule=>Rule.required()},{name:'rights',title:'Image rights / credit',type:'string'}],description:'Use a clear, substantial piece matching the article. Publishing produces a square JPEG without cropping out the jewelry.'},
 {name:'localImage',title:'Prepared article image',type:'string',readOnly:true},
 {name:'imageAlt',title:'Prepared image description',type:'string'},
 {name:'mediaRightsConfirmed',title:'Permission to reuse this image on social media confirmed',type:'boolean',initialValue:false},
 {name:'approved',title:'Captions, image and article reviewed for automatic sharing',type:'boolean',initialValue:false},
 {name:'approvedBy',title:'Social review by',...reviewer},
 {name:'approvedAt',title:'Actual social review date',type:'datetime'}
],validation:Rule=>Rule.custom(value=>{
 if(!value?.enabled)return true;
 if(!value.channels?.length)return 'Choose at least one supported network.';
 for(const channel of value.channels){const text=value[channel+'Caption'];if(!text?.trim()||/[<>]|https?:\/\//i.test(text))return 'Write a plain-text caption without links for '+channel+'.';}
 if(!value.image?.asset&&!value.localImage)return 'Select an image before enabling sharing.';
 if(!(value.image?.alt||value.imageAlt)?.trim())return 'Describe the image.';
 if(value.approved&&(!value.mediaRightsConfirmed||!value.approvedBy?._ref||!value.approvedAt))return 'Record media permission, reviewer and review date before approving.';
 return true;
})};
export const socialAutomationSchema={name:'socialAutomation',title:'Social publishing schedule',type:'document',fields:[
 {name:'enabled',title:'Run automatic publishing',type:'boolean',initialValue:false,description:'Pause all networks here. The server has a second launch switch. Both must be enabled after the connected-account test.'},
 {name:'channels',title:'Connected networks to use',type:'array',of:[{type:'string',options:{list:['facebook','instagram']}}],initialValue:['facebook','instagram'],validation:Rule=>Rule.unique()},
 {name:'schedule',title:'Owner-approved schedule',type:'string',initialValue:'Monday, Wednesday and Friday at 10:00 a.m. America/Los_Angeles',readOnly:true},
 {name:'notes',title:'Operator notes',type:'text',description:'Account connection and media-review notes only; never enter access tokens or passwords.'}
],preview:{prepare:()=>({title:'Social publishing — three posts per week'})}};
