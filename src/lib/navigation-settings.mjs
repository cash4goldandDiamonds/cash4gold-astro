export function validateNavigation(items){
 if(!Array.isArray(items)||!items.length)throw new Error('Navigation must contain links.');
 return items.map(item=>{const href=String(item.href||'');if(!item.label?.trim()||!/^\/(?!\/)/.test(href)||/[\\\x00-\x20]/.test(href)||href.includes('..'))throw new Error('Navigation must use a label and a safe internal path.');return {label:item.label,href};});
}
