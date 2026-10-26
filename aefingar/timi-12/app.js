'use strict';
const $=id=>document.getElementById(id);
const KEY='ggj-lota15-timi12-aefing-draft-v1';
const CORE_COUNT=buildSections(0).filter(s=>!s.optional).length;
const freshPhase=()=>({choice:null,answer:'',verified:false,hints:0,attempts:0,feedback:false});
const cleanState=(seed=0)=>({version:1,seed,index:0,steps:buildSections(seed).map(section=>({phase:0,phases:section.tasks.map(freshPhase)}))});
const parseNumber=value=>{let v=value.trim().replace(/−/g,'-');if(/^[+-]?\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?:[.,]\d+)?$/.test(v))v=v.replace(/[ \u00a0\u202f]/g,'');v=v.replace(',','.');return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(v)?Number(v):NaN};
function isCollected(input,vars){if(/^[+-]?0(?:[.,]0+)?$/.test(input.trim()))return true;if(/[()/]/.test(input))return false;const terms=input.replace(/−/g,'-').replace(/\s/g,'').split(/(?=[+-])/).filter(Boolean),seen=new Set();if(!terms.length)return false;for(const term of terms){const p=parseExpression(term,vars);if(!p||Object.keys(p).length!==1)return false;const key=Object.keys(p)[0];if(seen.has(key))return false;seen.add(key)}return true}
const correct=(task,phase)=>task.type==='expression'?(!task.noDivision||!phase.answer.includes('/'))&&(!task.collected||isCollected(phase.answer,task.variables))&&sameExpression(phase.answer,task.answer,task.variables):task.type==='number'?Number.isFinite(parseNumber(phase.answer))&&Math.abs(parseNumber(phase.answer)-task.answer)<=Math.max(1e-12,Math.abs(task.answer)*1e-10):phase.choice===task.correct;
function validState(s){
 const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
 if(!s||s.version!==1||!integer(s.seed,0,1000000))return false;
 const sections=buildSections(s.seed);
 return integer(s.index,0,sections.length)&&Array.isArray(s.steps)&&s.steps.length===sections.length&&s.steps.every((step,i)=>step&&integer(step.phase,0,sections[i].tasks.length-1)&&Array.isArray(step.phases)&&step.phases.length===sections[i].tasks.length&&step.phases.every((phase,j)=>phase&&typeof phase.answer==='string'&&phase.answer.length<=100&&(phase.choice===null||integer(phase.choice,0,(sections[i].tasks[j].options?.length??1)-1))&&typeof phase.verified==='boolean'&&typeof phase.feedback==='boolean'&&integer(phase.hints,0,sections[i].tasks[j].hints.length)&&integer(phase.attempts,0,1000000)&&(!phase.verified||correct(sections[i].tasks[j],phase))));
}
let storageWorks=true,state;
try{const stored=localStorage.getItem(KEY);try{state=JSON.parse(stored)}catch{state=null}if(!validState(state))state=cleanState()}catch{state=cleanState();storageWorks=false}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{storageWorks=false}};
const sections=()=>buildSections(state.seed);
const phaseState=()=>state.steps[state.index].phases[state.steps[state.index].phase];
const task=()=>sections()[state.index].tasks[state.steps[state.index].phase];
const done=i=>state.steps[i].phases.every(p=>p.verified);
const coreDone=()=>state.steps.slice(0,CORE_COUNT).every((_,i)=>done(i));
const storageNote=()=>storageWorks?'Framvindan geymist í þessum vafra. Svör eru ekki send til kennara.':'Vafrinn leyfir ekki vistun. Framvindan helst á meðan þessi síða er opin. Svör eru ekki send til kennara.';
const escapeHtml=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function inputHTML(t,p){
 if(t.type==='choices')return '<div class="choices '+(t.wideChoices?'wide-choices':'')+'" role="group" aria-label="Svarmöguleikar">'+t.options.map((text,i)=>`<button class="choice ${p.choice===i?'selected ':''}${p.verified&&p.choice===i?'correct':''}" data-choice="${i}" aria-pressed="${p.choice===i}" ${p.verified?'disabled':''}><span class="letter">${String.fromCharCode(65+i)}</span><span class="math">${text}</span></button>`).join('')+'</div>';
 return `<div class="input-row ${t.type==='expression'?'expression-row':''}"><label for="answer">${t.label} =</label><input id="answer" type="text" inputmode="${t.inputMode||'decimal'}" maxlength="100" autocomplete="off" value="${escapeHtml(p.answer)}" ${p.verified?'disabled':''}><span class="unit">${t.unit}</span></div><p class="input-help">${t.inputHelp?t.inputHelp:t.inputKind==='exponent'?'Skráðu aðeins veldisvísinn.':'Skráðu tölu. Nota má kommu eða punkt í tugabroti og bil milli þúsunda.'}</p>`;
}
function feedbackText(t,p){if(p.verified)return t.explain;if(t.noDivision&&p.answer.includes('/'))return 'Ljúktu styttingunni og skrifaðu niðurstöðuna án brotastriks. Deildu hverjum lið með nefnaranum.';if(t.collected&&parseExpression(p.answer,t.variables)&&!isCollected(p.answer,t.variables))return 'Fjarlægðu sviga og dragðu saman líka liði. Skrifaðu hvern liðaflokk aðeins einu sinni.';if(t.type==='number'&&!Number.isFinite(parseNumber(p.answer)))return 'Skráðu tölu í svarreitinn. Nota má mínusmerki og kommu eða punkt í tugabroti.';if(t.type==='expression'&&!parseExpression(p.answer,t.variables))return 'Skrifaðu aðeins stæðuna með bókstöfunum úr dæminu. Nota má +, −, *, / og sviga; t.d. 3x + 2 eða x/4.';if(t.type==='choices'&&p.choice===null)return 'Veldu svarmöguleika fyrst.';return t.wrong||'Flokkaðu líka liði og taktu formerkið með hverjum lið. Vísbendingin getur hjálpað.'}
function render(focus=false){
 save();const all=sections(),n=all.length;
 $('progress').innerHTML=all.map((s,i)=>`<i title="${s.name}${s.optional?' (valfrjálst)':''}" class="${done(i)?'done ':''}${state.index===i?'current':''}${s.optional?' optional':''}"></i>`).join('');
 $('progress').setAttribute('aria-label',`${state.steps.slice(0,CORE_COUNT).filter((_,i)=>done(i)).length} af ${CORE_COUNT} meginhlutum lokið`);
 if(state.index===n){renderSummary();if(focus)$('heading').focus({preventScroll:true});return}
 const p=phaseState(),t=task(),i=state.index,j=state.steps[i].phase;
 $('stepcount').textContent=all[i].optional?'Valfrjáls aukaáskorun':`Hluti ${i+1} af ${CORE_COUNT}`;
 $('subcount').textContent=`Skref ${j+1} af ${all[i].tasks.length}`;
 $('exercise').innerHTML=`<div class="eyebrow">${all[i].name}</div><h1 id="heading" tabindex="-1">${t.title}</h1><p class="intro">${t.intro}</p><div class="board">${t.board}</div>${inputHTML(t,p)}<div id="feedback" aria-live="polite">${p.feedback?`<div class="feedback ${p.verified?'success':''}"><strong>${p.verified?'Rétt hjá þér':'Skoðum þetta aðeins'}</strong>${feedbackText(t,p)}</div>`:''}</div>${p.hints?`<div class="hint-box" role="status"><strong>Vísbending ${p.hints}</strong>${t.hints.slice(0,p.hints).join('<br>')}</div>`:''}`;
 $('back').disabled=i===0&&j===0;$('hint').hidden=false;$('hint').disabled=p.verified||p.hints>=t.hints.length;$('check').hidden=false;
 $('check').innerHTML=(p.verified?(j===all[i].tasks.length-1&&(i===CORE_COUNT-1||i===n-1)?'Sjá yfirlit':'Áfram'):'Athuga svar')+' <span aria-hidden="true">→</span>';
 document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{p.choice=Number(b.dataset.choice);p.feedback=false;render();document.querySelector(`[data-choice="${p.choice}"]`).focus({preventScroll:true})});
 if($('answer')){$('answer').oninput=e=>{p.answer=e.target.value;p.feedback=false;$('feedback').innerHTML='';save()};$('answer').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check()}}}
 if(focus)$('heading').focus({preventScroll:true});
}
function check(){
 if(state.index===sections().length)return;
 const p=phaseState(),t=task();if(p.verified){advance();return}
 p.attempts=Math.min(p.attempts+1,1000000);p.verified=correct(t,p);p.feedback=true;render();
 if(p.verified)$('check').focus({preventScroll:true});else if(t.type!=='choices'){$('answer').focus({preventScroll:true});$('answer').select()}
}
function advance(){const all=sections(),step=state.steps[state.index];if(step.phase<all[state.index].tasks.length-1)step.phase++;else state.index=(state.index===CORE_COUNT-1?all.length:state.index+1);render(true);window.scrollTo({top:0,behavior:'smooth'})}
function renderSummary(){
 const finished=coreDone(),all=sections(),extra=done(all.length-1),count=state.steps.slice(0,CORE_COUNT).filter((_,i)=>done(i)).length;
 $('stepcount').textContent='Yfirlit';$('subcount').textContent=`${count} af ${CORE_COUNT} meginhlutum lokið`;$('hint').hidden=true;$('check').hidden=true;$('back').disabled=false;
 $('exercise').innerHTML=`<div class="summary"><div class="seal" aria-hidden="true">${finished?'✓':'↗'}</div><div class="eyebrow">Lota 15 · 12. tími</div><h1 id="heading" tabindex="-1">${finished?'Vel gert. Meginæfingunni er lokið.':'Haltu áfram að æfa þig.'}</h1><p class="intro">${finished?'Þú hefur rifjað upp röð aðgerða, einfaldað stæður, sett tölur inn fyrir bókstafi, þáttað og stytt brot. Nú getur þú nýtt aðferðirnar í verkefnablaðinu.':'Veldu ólokinn hluta og kláraðu skrefin.'}</p><ul class="summary-list">${all.filter((_,i)=>done(i)).map(s=>`<li>${s.name}</li>`).join('')}</ul>${finished&&!extra?'<button class="primary" id="bonus">Prófa aukaáskorun →</button><p class="callout">Valfrjálst: flóknari svigar og veldi, innsetning neikvæðra talna og stytting með bókstaf í nefnara.</p>':''}<button class="${finished?'quiet':'primary'}" id="again">${finished?'Æfa aftur með nýjum tölum':'Halda áfram'} →</button><p class="storage-note">${storageNote()}</p></div>`;
 if($('bonus'))$('bonus').onclick=()=>{state.index=all.length-1;render(true)};
 $('again').onclick=()=>{if(finished)state=cleanState((state.seed+1)%variants.length);else state.index=state.steps.slice(0,CORE_COUNT).findIndex((_,i)=>!done(i));render(true)};
}
$('check').onclick=check;
$('hint').onclick=()=>{const p=phaseState();p.hints=Math.min(p.hints+1,task().hints.length);render();if(!$('hint').disabled)$('hint').focus({preventScroll:true});else $('check').focus({preventScroll:true})};
$('back').onclick=()=>{if(state.index===sections().length)state.index=CORE_COUNT-1;else if(state.steps[state.index].phase>0)state.steps[state.index].phase--;else if(state.index>0)state.index--;render(true)};
$('outline').onclick=()=>{const all=sections();$('outlineItems').innerHTML=all.map((section,i)=>`<button class="outline-item" data-goto="${i}"><span>${i<CORE_COUNT?String(i+1).padStart(2,'0'):'+'}</span>${section.name}${section.optional?' (valfrjálst)':''}<small>${done(i)?'Lokið':state.index===i?'Hér ert þú':''}</small></button>`).join('')+'<button class="outline-item" data-goto="'+all.length+'"><span>↗</span>Samantekt</button>';$('outlineDialog').querySelector('.storage-note').textContent=storageNote();document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>{state.index=Number(b.dataset.goto);$('outlineDialog').close();render(true)});$('outlineDialog').showModal()};
$('closeDialog').onclick=()=>$('outlineDialog').close();
$('outlineDialog').addEventListener('click',e=>{if(e.target===$('outlineDialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
render();
