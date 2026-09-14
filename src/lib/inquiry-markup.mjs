// Allow only the reviewed contact form; inherited WordPress forms stay excluded.
export function inquiryMarkupErrors($,pagePath){
 const forms=$('form'),errors=[];
 if(pagePath!=='/contact-us/')return forms.length?['form-outside-contact']:[];
 if(forms.length!==1)return ['contact-form-count'];
 const form=forms.first();
 if(form.attr('action')!=='/api/inquiry/'||form.attr('method')!=='post'||form.attr('data-inquiry-form')===undefined)errors.push('inquiry-action');
 if(form.attr('hidden')===undefined||form.find('[data-inquiry-submit][disabled]').length!==1)errors.push('inquiry-readiness-guard');
 if(form.find('input[type=file],input[type=password]').length)errors.push('unexpected-sensitive-field');
 for(const name of ['name','email','itemType','message','permission']){
  const field=form.find(`[name="${name}"]`),id=field.attr('id');
  if(field.length!==1||field.attr('required')===undefined||!id||!form.find('label').toArray().some(el=>$(el).attr('for')===id))errors.push('inquiry-label-'+name);
 }
 if(form.find('[data-inquiry-status][role=status][tabindex="-1"]').length!==1)errors.push('inquiry-status');
 return errors;
}
