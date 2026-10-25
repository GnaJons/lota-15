'use strict';
// Navigation, feedback and layout adapted from the approved GGJ exercise.
const {names,counts,task,parseNumber}=ExerciseTasks;
const $=id=>document.getElementById(id);
const KEY='ggj-lota15-timi01-aefing-v1';
const blank=()=>({choice:null,answer:'',verified:false,hints:0,attempts:0});
const cleanState=(seed=0)=>({version:1,seed,index:0,steps:counts.map(n=>({phase:0,phases:Array.from({length:n},blank)}))});
const isInt=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
function validState(s){
  if(!s||s.version!==1||!isInt(s.seed,0,2)||!isInt(s.index,0,names.length)||!Array.isArray(s.steps)||s.steps.length!==names.length)return false;
  return s.steps.every((step,i)=>step&&isInt(step.phase,0,counts[i]-1)&&Array.isArray(step.phases)&&step.phases.length===counts[i]&&step.phases.every((p,j)=>{
    const t=task(s.seed,i,j);
    if(!p||(p.choice!==null&&!isInt(p.choice,0,(t.options?.length??0)-1))||typeof p.answer!=='string'||p.answer.length>100||typeof p.verified!=='boolean'||!isInt(p.hints,0,t.hints.length)||!isInt(p.attempts,0,1e7))return false;
    return !p.verified||(t.type==='number'?parseNumber(p.answer)===t.answer:p.choice===t.correct);
  }));
}
let storageWorks=true,state;
try{state=JSON.parse(localStorage.getItem(KEY));if(!validState(state))state=cleanState();}catch{state=cleanState();storageWorks=false;}
let message='';
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageWorks=false;}};
const phaseState=()=>state.steps[state.index].phases[state.steps[state.index].phase];
const currentTask=()=>task(state.seed,state.index,state.steps[state.index].phase);
const completed=i=>state.steps[i].phases.every(p=>p.verified);
const storageNote=()=>storageWorks?'Framvindan geymist í þessum vafra. Svör eru ekki send til kennara.':'Vafrinn leyfir ekki vistun. Framvindan helst á meðan þessi síða er opin.';
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function inputHTML(t,s){
  if(t.type==='choices')return '<div class="choices" role="group" aria-label="Svarmöguleikar">'+t.options.map((o,i)=>`<button class="choice ${s.choice===i?'selected ':''}${s.verified&&s.choice===i?'correct':''}" data-choice="${i}" aria-pressed="${s.choice===i}" ${s.verified?'disabled':''}><span class="letter">${String.fromCharCode(65+i)}</span><span class="math">${o}</span></button>`).join('')+'</div>';
  return `<div class="input-row ${t.inputKind==='exponent'?'exponent-row':''}"><label for="answer">${t.label}${t.inputKind==='exponent'?'':' ='}</label><input id="answer" type="text" inputmode="decimal" autocomplete="off" maxlength="100" aria-describedby="input-help" value="${escapeHTML(s.answer)}" ${s.verified?'disabled':''}><span class="unit">${t.unit}</span></div><p class="input-help" id="input-help">${t.inputKind==='exponent'?'Skráðu aðeins veldisvísinn.':'Skráðu tölu. Þú mátt nota vasareikni.'}</p>`;
}
function render(focus=false){
  save();const done=names.filter((_,i)=>completed(i)).length;
  $('progress').innerHTML=names.map((_,i)=>`<i class="${completed(i)?'done ':''}${state.index===i?'current':''}"></i>`).join('');
  $('progress').setAttribute('aria-label',`${done} af ${names.length} hlutum lokið`);
  if(state.index===names.length){renderSummary(focus);return;}
  const s=phaseState(),t=currentTask(),idx=state.index,p=state.steps[idx].phase;
  $('stepcount').textContent=`Hluti ${idx+1} af ${names.length}`;
  $('subcount').textContent=`Skref ${p+1} af ${counts[idx]}`;
  $('exercise').innerHTML=`<div class="eyebrow">${names[idx]}</div><h1 id="heading" tabindex="-1">${t.title}</h1><p class="intro">${t.intro}</p><div class="board">${t.board}</div>${inputHTML(t,s)}<div id="feedback" aria-live="polite" aria-atomic="true"></div>${s.hints?'<div class="hint-box" role="status"><strong>Vísbending '+s.hints+'</strong>'+t.hints.slice(0,s.hints).join('<br>')+'</div>':''}`;
  $('back').disabled=idx===0&&p===0;
  $('hint').hidden=false;$('hint').disabled=s.verified||s.hints>=t.hints.length;
  $('check').hidden=false;$('check').disabled=false;
  $('check').innerHTML=(s.verified?(idx===names.length-1&&p===counts[idx]-1?'Skoða yfirlit':'Áfram'):'Athuga svar')+' <span aria-hidden="true">→</span>';
  document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{
    if(s.verified)return;s.choice=Number(b.dataset.choice);message='';render();document.querySelector(`[data-choice="${s.choice}"]`).focus({preventScroll:true});
  });
  if($('answer')){
    $('answer').oninput=e=>{s.answer=e.target.value;message='';$('feedback').innerHTML='';save();};
    $('answer').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check();}};
  }
  if(s.verified||message)$('feedback').innerHTML=`<div class="feedback ${s.verified?'success':''}"><strong>${s.verified?'Rétt hjá þér':'Skoðum þetta aðeins'}</strong>${s.verified?t.explain:message}</div>`;
  if(focus)$('heading').focus({preventScroll:true});
}
function check(){
  if(state.index===names.length)return;
  const s=phaseState(),t=currentTask();
  if(s.verified){advance();return;}
  const value=t.type==='number'?parseNumber(s.answer):s.choice;
  if(value===null){message=t.type==='number'?'Skráðu tölu í svarreitinn.':'Veldu svarmöguleika fyrst.';render();$('answer')?.focus({preventScroll:true});return;}
  s.attempts++;s.verified=value===(t.type==='number'?t.answer:t.correct);
  message=s.verified?'':(t.wrong||'Reiknaðu hvert veldi sérstaklega og athugaðu síðan aðgerðina á milli. Vísbendingin getur hjálpað.');
  render();if(s.verified)$('check').focus({preventScroll:true});else if($('answer')){$('answer').focus({preventScroll:true});$('answer').select();}
}
function moveTo(i,p){state.index=i;if(p!==undefined)state.steps[i].phase=p;message='';render(true);window.scrollTo({top:0,behavior:'smooth'});}
function advance(){const i=state.index,p=state.steps[i].phase;if(p<counts[i]-1)moveTo(i,p+1);else moveTo(i+1,i+1<names.length?0:undefined);}
function firstIncomplete(){for(let i=0;i<names.length;i++)for(let p=0;p<counts[i];p++)if(!state.steps[i].phases[p].verified)return [i,p];return [names.length];}
$('check').onclick=check;
$('hint').onclick=()=>{const s=phaseState();s.hints=Math.min(s.hints+1,currentTask().hints.length);render();};
$('back').onclick=()=>{const i=state.index;if(i===names.length)moveTo(i-1,counts[i-1]-1);else if(state.steps[i].phase>0)moveTo(i,state.steps[i].phase-1);else if(i>0)moveTo(i-1,counts[i-1]-1);};
function renderSummary(focus=false){
  const done=names.filter((_,i)=>completed(i)).length,all=done===names.length;
  $('stepcount').textContent='Yfirlit';$('subcount').textContent=`${done} af ${names.length} hlutum lokið`;
  $('hint').hidden=true;$('check').hidden=true;$('back').disabled=false;
  $('exercise').innerHTML=`<div class="summary"><div class="seal" aria-hidden="true">${all?'✓':'↗'}</div><div class="eyebrow">Lota 15 · 1. tími</div><h1 id="heading" tabindex="-1">${all?'Vel gert. Æfingunni er lokið.':'Haltu áfram að æfa þig.'}</h1><p class="intro">${all?'Þú hefur reiknað og borið saman veldi, einfaldað stæður og fundið hlið fernings. Nú getur þú nýtt aðferðirnar í verkefnablaðinu.':'Þú átt enn eftir nokkur skref. Haltu áfram þar sem þú átt eftir að svara.'}</p><ul class="summary-list">${names.filter((_,i)=>completed(i)).map(n=>'<li>'+n+'</li>').join('')}</ul><button class="primary" id="again">${all?'Æfa aftur með nýjum tölum':'Halda áfram'} →</button><p class="storage-note">${storageNote()}</p></div>`;
  $('again').onclick=()=>{if(all){state=cleanState((state.seed+1)%3);moveTo(0,0);}else moveTo(...firstIncomplete());};
  if(focus)$('heading').focus({preventScroll:true});
}
$('outline').onclick=()=>{
  $('outlineItems').innerHTML=names.map((n,i)=>`<button class="outline-item" data-goto="${i}"><span>${String(i+1).padStart(2,'0')}</span>${n}<small>${completed(i)?'Lokið':state.index===i?'Hér ert þú':''}</small></button>`).join('')+'<button class="outline-item" id="summary-button">Skoða lokayfirlit</button>';
  $('outlineDialog').querySelector('.storage-note').textContent=storageNote();
  document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.goto),p=state.steps[i].phases.findIndex(p=>!p.verified);$('outlineDialog').close();moveTo(i,p<0?0:p);});
  $('summary-button').onclick=()=>{$('outlineDialog').close();moveTo(names.length);};
  $('outlineDialog').showModal();
};
$('closeDialog').onclick=()=>$('outlineDialog').close();
$('outlineDialog').addEventListener('click',e=>{if(e.target===$('outlineDialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
render();
