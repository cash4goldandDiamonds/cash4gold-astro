export const INQUIRY_ENDPOINT='/api/inquiry/';
export const INQUIRY_MAX_BYTES=16_384;
export const INQUIRY_ITEMS=['gold','diamonds','watches','estate','other'];
export const INQUIRY_MESSAGES={
 unavailable:'Online inquiries are temporarily unavailable. Please call 310-663-1340 or email cash4goldanddiamond@gmail.com.',
 invalid:'Please check the highlighted fields and try again.',
 challenge:'Please complete the security check again. You can also call or email us.',
 rate:'Please wait a minute before trying again, or call 310-663-1340.',
 retry:'We could not confirm acceptance. Your message may have been received. Retry this same inquiry or call 310-663-1340; please do not send a second copy by email until you have checked.',
 accepted:'Your inquiry was accepted by our email service for delivery. This is not an appointment confirmation. If you need a prompt answer, call 310-663-1340.',
};
const emailPattern=/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
export const validEmail=value=>typeof value==='string'&&value.length<=254&&emailPattern.test(value);
export function validateInquiry(input,now=Date.now()){
 if(!input||typeof input!=='object'||Array.isArray(input))return {ok:false,fields:{form:'Please complete the form.'}};
 const allowed=new Set(['name','email','phone','itemType','message','permission','website','startedAt','requestId','turnstileToken']);
 const fields={};
 if(Object.keys(input).some(key=>!allowed.has(key)))fields.form='Unexpected form fields.';
 const clean=(key,max)=>typeof input[key]==='string'?input[key].trim().slice(0,max+1):'';
 const name=clean('name',100),email=clean('email',254),phone=clean('phone',35),message=clean('message',3000),itemType=clean('itemType',20);
 if(name.length<2||name.length>100||/[\r\n\x00-\x1f\x7f]/.test(name))fields.name='Enter your name (2–100 characters).';
 if(!validEmail(email))fields.email='Enter a valid email address.';
 if(phone&&(!/^[+()\d .-]{7,35}$/.test(phone)||phone.replace(/\D/g,'').length<7))fields.phone='Enter a valid phone number or leave it blank.';
 if(!INQUIRY_ITEMS.includes(itemType))fields.itemType='Choose the type of item.';
 if(message.length<10||message.length>3000||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(message))fields.message='Describe your items in 10–3,000 characters.';
 if(input.permission!==true)fields.permission='Please allow us to use these details to respond to your inquiry.';
 if(typeof input.website!=='string'||input.website!=='')fields.form='The form could not be accepted. Please call or email us.';
 if(!Number.isFinite(input.startedAt)||now-input.startedAt<1500||now-input.startedAt>7_200_000)fields.form='Please allow a moment to complete the form, then try again. Reload if it has been open for more than two hours.';
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId||''))fields.form='Please reload this page before submitting.';
 if(typeof input.turnstileToken!=='string'||!input.turnstileToken||input.turnstileToken.length>2048)fields.turnstile='Complete the security check.';
 return Object.keys(fields).length?{ok:false,fields}:{ok:true,value:{name,email,phone,itemType,message,requestId:input.requestId,turnstileToken:input.turnstileToken}};
}
export function inquiryEmail(value,{preview=false}={}){
 const prefix=preview?'[STAGING TEST] ':'';
 return {
  subject:prefix+'Website inquiry: '+value.itemType,
  text:[prefix+'Cash 4 Gold & Diamonds website inquiry','Reference: '+value.requestId,'','Name: '+value.name,'Reply email: '+value.email,'Phone: '+(value.phone||'Not provided'),'Item type: '+value.itemType,'','Message:',value.message,'','The visitor permitted a reply to this inquiry. This is not an appointment reservation.'].join('\n'),
 };
}
