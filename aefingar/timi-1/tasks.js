
'use strict';
const variants=[0,1,2];
function buildSections(seed){
 const k=seed%3, core=ExerciseTasks.names.map((name,i)=>({name,tasks:Array.from({length:ExerciseTasks.counts[i]},(_,p)=>ExerciseTasks.task(k,i,p))}));
 const pow=(b,n)=>b+'<sup>'+n+'</sup>';
 const frac=(a,b)=>'<span class="fraction"><span>'+a+'</span><span>'+b+'</span></span>';
 const eq=t=>'<div class="equation">'+t+'</div>';
 const choice=(title,intro,expression,options,correct,hints,explain)=>({type:'choices',title,intro,board:eq(expression),options,correct,hints,explain});
 const number=(title,intro,expression,answer,hints,explain,unit='',label='Svar')=>({type:'number',title,intro,board:eq(expression),answer,hints,explain,unit,label});
 const area=[20,30,45][k],lo=Math.floor(Math.sqrt(area)),rounded=[4.47,5.48,6.71][k];
 const base=[7,4,9][k], exponent=[2,3,2][k],negativeBase=[5,4,7][k];
 const mixed=[{a:2,b:3,m:5,n:4,d:3},{a:3,b:2,m:3,n:9,d:8},{a:2,b:5,m:4,n:2,d:5}][k];
 const a=mixed.a,b=mixed.b,m=mixed.m, numerator=Math.pow(a,m)*b/a,denominator=4*b*b;
 const expression=frac(pow(a,m)+' × '+pow(a*b,'−1')+' × '+pow(b,2),pow(a*a,'−1')+' × '+pow(2*a*b,2));
 const orderSets=[[[2,7],[3,5],[5,3]],[[3,4],[2,8],[5,3]],[[2,9],[3,5],[4,4]]];
 const terms=orderSets[k].map(([b,n])=>({html:pow(b,n),value:Math.pow(b,n)}));
 const ordered=[...terms].sort((u,v)=>u.value-v.value);
 const orderOptions=[ordered.map(t=>t.html).join(' &lt; '),[ordered[1],ordered[0],ordered[2]].map(t=>t.html).join(' &lt; '),[...ordered].reverse().map(t=>t.html).join(' &lt; ')];
 const extra=[
 choice('Milli hvaða heiltalna?','Ferningur hefur flatarmálið '+area+' cm². Milli hvaða tveggja samliggjandi heiltalna liggur hliðarlengdin h?', 'h = √'+area+' cm',
 [(lo-1)+' cm og '+lo+' cm',lo+' cm og '+(lo+1)+' cm',(lo+1)+' cm og '+(lo+2)+' cm'],1,
 ['Finndu ferningstöluna næst fyrir neðan flatarmálið og þá næstu fyrir ofan.',lo+'² = '+lo*lo+' og '+(lo+1)+'² = '+(lo+1)*(lo+1)+'. Berðu flatarmálið saman við þær.'],
 lo*lo+' < '+area+' < '+(lo+1)*(lo+1)+', svo '+lo+' < √'+area+' < '+(lo+1)+'. Hliðarlengdin er því ekki heiltala.'),
 number('Námundaðu hliðarlengdina','Reiknaðu hliðarlengd ferningsins og námundaðu að tveimur aukastöfum. Nota má vasareikni.','h = √'+area,rounded,
 ['Notaðu ferningsrótartakkann á vasareikninum.','Skoðaðu þriðja aukastafinn til að ákveða hvort annar aukastafurinn hækkar.'],
 '√'+area+' ≈ '+String(Math.sqrt(area).toFixed(5)).replace('.',',')+'… Því er h ≈ '+String(rounded).replace('.',',')+' cm.','cm','h'),
 number('Hvað gerir núllti veldisvísirinn?','Reiknaðu margfeldið.',pow(base,0)+' × '+pow(base,exponent),Math.pow(base,exponent),
 ['Tala önnur en núll, hafin í núllta veldi, er 1.','Hér er '+base+'⁰ = 1. Reiknaðu hitt veldið og margfaldaðu með 1.'],
 pow(base,0)+' × '+pow(base,exponent)+' = 1 × '+Math.pow(base,exponent)+' = '+Math.pow(base,exponent)+'.'),
 choice('Neikvæður veldisvísir','Hvaða brot er jafngilt veldinu?',pow(negativeBase,'−2'),
 ['−'+pow(negativeBase,2),frac(1,negativeBase),frac(1,negativeBase*negativeBase)],2,
 ['Neikvæður veldisvísir segir til um umhverfu. Hann gerir stofninn ekki neikvæðan.',pow(negativeBase,'−2')+' = '+frac(1,pow(negativeBase,2))+'.'],
 pow(negativeBase,'−2')+' = '+frac(1,pow(negativeBase,2))+' = '+frac(1,negativeBase*negativeBase)+'.'),
 choice('Settu reglurnar saman','Einfaldaðu brotið. Skrifaðu milliskref á blað og veldu síðan svarið.',expression,
 [frac(mixed.d,mixed.n),frac(mixed.n,mixed.d),frac(2*mixed.n,mixed.d),frac(mixed.n,mixed.d*2)],1,
 ['Skrifaðu veldin með neikvæða veldisvísa sem brot. Reiknaðu síðan teljara og nefnara hvorn fyrir sig.',
 pow(a*b,'−1')+' = '+frac(1,a*b)+' og '+pow(a*a,'−1')+' = '+frac(1,a*a)+'.'],
 'Teljarinn er '+Math.pow(a,m)+' × '+frac(1,a*b)+' × '+b*b+' = '+numerator+'. Nefnarinn er '+frac(1,a*a)+' × '+Math.pow(2*a*b,2)+' = '+denominator+'. Brotið er því '+frac(numerator,denominator)+' = '+frac(mixed.n,mixed.d)+'.'),
 choice('Raðaðu veldunum','Veldu röðina frá minnstu tölu til stærstu.',terms.map(t=>t.html).join(' &nbsp; '),orderOptions,0,
 ['Reiknaðu gildi allra þriggja veldanna áður en þú raðar þeim.','Stærsti stofninn eða stærsti veldisvísirinn einn og sér segir ekki hvaða tala er stærst.'],
 ordered.map(t=>t.html+' = '+t.value).join(', ')+'. Því er '+ordered.map(t=>t.html).join(' &lt; ')+'.')
 ];
 return [...core,{name:'Aukaáskorun',optional:true,tasks:extra}];
}
