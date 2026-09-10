export function initializeMenuSound(header:HTMLElement){
 const toggle=header.querySelector<HTMLButtonElement>('[data-sound-toggle]');
 if(!toggle||!window.AudioContext)return;
 toggle.hidden=false;
 const preference='cash4gold-menu-sound';
 let enabled=false;
 try{enabled=localStorage.getItem(preference)==='on';}catch{}
 let context:AudioContext|undefined;
 let lastTone=-Infinity;
 const update=()=>{toggle.setAttribute('aria-pressed',String(enabled));const label=`Turn menu sounds ${enabled?'off':'on'}`;toggle.setAttribute('aria-label',label);toggle.title=label;};
 const unlock=async()=>{
  try{context??=new AudioContext();if(context.state==='suspended')await context.resume();return context.state==='running';}catch{return false;}
 };
 const tone=(index=0)=>{
  if(!enabled||context?.state!=='running'||document.hidden||performance.now()-lastTone<90)return;
  lastTone=performance.now();
  const oscillator=context.createOscillator();
  const envelope=context.createGain();
  const start=context.currentTime;
  oscillator.type='sine';
  oscillator.frequency.setValueAtTime(660+(index%5)*55,start);
  oscillator.frequency.exponentialRampToValueAtTime(480+(index%5)*40,start+.09);
  envelope.gain.setValueAtTime(0,start);
  envelope.gain.linearRampToValueAtTime(.035,start+.009);
  envelope.gain.exponentialRampToValueAtTime(.0001,start+.11);
  oscillator.connect(envelope);envelope.connect(context.destination);
  oscillator.start(start);oscillator.stop(start+.12);
  oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();};
 };
 toggle.addEventListener('click',async()=>{
  enabled=!enabled;update();
  try{localStorage.setItem(preference,enabled?'on':'off');}catch{}
  if(enabled){if(await unlock())tone();}
  else if(context?.state==='running')void context.suspend().catch(()=>{});
 });
 // Browsers require a gesture before a remembered sound preference can play.
 const resumeOnGesture=()=>{if(enabled)void unlock();};
 document.addEventListener('pointerdown',resumeOnGesture,{passive:true});
 document.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')resumeOnGesture();});
 const targets=header.querySelectorAll<HTMLElement>('nav a, nav summary, .header-appointment, .redesigned-mobile>summary');
 targets.forEach((target,index)=>{
  target.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')tone(index);});
  target.addEventListener('focus',()=>{if(target.matches(':focus-visible'))tone(index);});
 });
 update();
}
