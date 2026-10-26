'use strict';
const variants=[
 {order:[12,4,5],power:[3,4],like:[7,11],minus:[11,7,4],plus:[6,3,4],dist:[4,3,2],xdist:[4,3,5],sub:[22,5,3],combo:[4,5,3,3,4,2,2],words:[80,3,64,7],factor:[4,8],reverse:[9,8],qplus:[7,4],qminus:[7,3],nested:[20,2,5,3,7,4],cubeOrder:[8,5,2,3,6],squareCube:[3,2,5,4],fracOrder:[8,12,2,5],advA:[3,4,5,2,4,9,-2],advB:[4,3,2,5,3,-2],qx:[7,5,3],qy:[8,4,3],qp:[6,3,5],qm:[4,3,7]},
 {order:[18,3,4],power:[4,3],like:[8,13],minus:[12,8,5],plus:[7,5,2],dist:[5,4,3],xdist:[5,2,4],sub:[25,7,2],combo:[6,3,2,2,5,1,4],words:[120,4,72,5],factor:[5,6],reverse:[6,11],qplus:[11,3],qminus:[9,4],nested:[26,3,6,2,8,3],cubeOrder:[9,7,3,2,5],squareCube:[4,3,5,6],fracOrder:[10,19,3,4],advA:[5,2,3,3,2,4,-4],advB:[2,5,3,6,4,-4],qx:[8,3,5],qy:[12,5,2],qp:[7,4,3],qm:[6,5,3]},
 {order:[14,6,2],power:[2,5],like:[6,14],minus:[9,6,2],plus:[8,4,5],dist:[7,2,3],xdist:[2,5,7],sub:[31,6,4],combo:[3,4,5,2,3,2,3],words:[90,5,84,6],factor:[8,9],reverse:[8,7],qplus:[13,5],qminus:[11,5],nested:[30,4,5,2,9,5],cubeOrder:[6,4,2,3,8],squareCube:[2,3,6,5],fracOrder:[7,13,2,6],advA:[2,5,3,4,3,5,-5],advB:[5,2,3,4,6,-5],qx:[9,4,7],qy:[9,7,4],qp:[5,6,7],qm:[8,3,5]}
];
function buildSections(seed){
 const d=variants[seed%variants.length],rnd=n=>Math.round(n*1e10)/1e10,raw=n=>String(rnd(n));
 const show=s=>String(s).replace(/\^([23])/g,'<sup>$1</sup>').replace(/\*/g,' · ').replace(/-/g,' − ').replace(/\+/g,' + ').replace(/(\d)\.(\d)/g,'$1,$2');
 const frac=(a,b)=>'<span class="fraction"><span>'+a+'</span><span>'+b+'</span></span>';
 const split=s=>{let depth=0,start=0,out=[];for(let i=0;i<s.length;i++){if(s[i]==='(')depth++;if(s[i]===')')depth--;if(i>0&&depth===0&&'+-'.includes(s[i])){out.push(s.slice(start,i));start=i}}out.push(s.slice(start));return out};
 const board=(s,note='')=>'<div class="review-board"><div class="equation review-equation">'+split(s).map(t=>'<span class="review-part">'+show(t)+'</span>').join('')+'</div>'+(note?'<p class="given-note">'+note+'</p>':'')+'</div>';
 const fractionBoard=(num,den,note='')=>'<div class="review-board"><div class="equation">'+frac(show(num),show(den))+'</div>'+(note?'<p class="given-note">'+note+'</p>':'')+'</div>';
 const story=s=>'<div class="story"><p>'+s+'</p></div>';
 const poly=(a,b,c=0,v='x')=>[[a,v+'^2'],[b,v],[c,'']].filter(([n])=>n!==0).map(([n,k],i)=>(i&&n>0?'+':'')+(k&&Math.abs(n)===1?(n<0?'-':''):raw(n))+k).join('')||'0';
 const expression=(title,intro,content,answer,variables,hints,explain,extra={})=>({type:'expression',title,intro,board:content,answer,variables,label:'Stæða',unit:'',inputMode:'text',inputHelp:'Nota má '+variables[0]+'² eða '+variables[0]+'^2 og tugabrotskommu.',hints,explain,wrong:'Athugaðu hvern lið og taktu formerkið með. Vísbendingin getur hjálpað.',...extra});
 const number=(title,intro,content,answer,hints,explain,extra={})=>({type:'number',title,intro,board:content,answer:rnd(answer),label:'Svar',unit:'',hints,explain,wrong:'Farðu yfir röð aðgerða: sviga, veldi, margföldun og deilingu, síðan samlagningu og frádrátt.',...extra});
 const choice=(title,intro,content,options,correct,hints,explain,extra={})=>({type:'choices',title,intro,board:content,options,correct,hints,explain,wideChoices:true,wrong:'Lestu hvað er beðið um og athugaðu hvaða aðgerð hver hluti stæðunnar sýnir.',...extra});
 function collect(original,answer,vars,hints,title='Einfaldaðu stæðuna'){
  return expression(title,'Fjarlægðu sviga ef þeir eru til staðar og dragðu saman líka liði.',board(original),answer,vars,hints,
   show(original)+' = '+show(answer)+'.',{label:'Einfaldað',collected:true,noDivision:true,qa:{kind:'collect',original}});
 }
 function value(original,x,answer,title='Settu töluna inn fyrir x'){
  return number(title,'Reiknaðu gildi stæðunnar.',board(original,'x = '+show(x)),answer,
   ['Settu '+show(x)+' í stað hvers x. Notaðu sviga utan um neikvæða tölu.','Reiknaðu veldi áður en margfaldað er. Mínus sinnum mínus gefur plús.'],
   show(original.replace(/x/g,'('+x+')'))+' = '+show(raw(answer))+'.',
   {wrong:'Skiptu út öllum x-um og notaðu sviga utan um neikvæða tölu. Athugaðu veldin og formerkin.',qa:{kind:'value',original,substitutions:{x}}});
 }
 const [oa,ob,oc]=d.order,[pa,pb]=d.power;
 const order1=oa+'+'+ob+'*'+oc+'+('+oa+'+'+ob+')*'+oc,order2=pa+'*'+pb+'^2+('+pa+'*'+pb+')^2';
 const order={name:'Röð aðgerða',tasks:[
  number('Svigar og margföldun','Reiknaðu stæðuna í réttri röð.',board(order1),oa+ob*oc+(oa+ob)*oc,
   ['Reiknaðu inni í sviganum fyrst. Margföldun kemur á undan samlagningu.','Stæðan verður '+show(oa+'+'+ob*oc+'+'+(oa+ob)+'*'+oc)+'.'],
   show(oa+'+'+ob*oc+'+'+(oa+ob)*oc)+' = '+(oa+ob*oc+(oa+ob)*oc)+'.',{qa:{kind:'number',original:order1}}),
  number('Hvað er hafið í annað veldi?','Reiknaðu stæðuna. Gættu að því sem stendur innan svigans.',board(order2),pa*pb**2+(pa*pb)**2,
   ['Í fyrri liðnum er aðeins '+pb+' í öðru veldi. Í seinni liðnum er allt margfeldið í öðru veldi.','Reiknaðu '+show(pa+'*'+pb**2+'+'+pa*pb+'^2')+'.'],
   pa*pb**2+' + '+(pa*pb)**2+' = '+(pa*pb**2+(pa*pb)**2)+'.',{qa:{kind:'number',original:order2}})
 ]};
 const [la,lb]=d.like,[ma,mb,mc]=d.minus,[sa,sc,sb]=d.plus,[da,db,dc]=d.dist,[xa,xb,xc]=d.xdist;
 const algebra={name:'Líkir liðir og svigar',tasks:[
  collect(la+'x+'+lb+'x',(la+lb)+'x',['x'],['Báðir liðir eru x-liðir. Leggðu stuðlana saman.','Bókstafurinn x helst; aðeins stuðlarnir eru lagðir saman.']),
  collect(la+'x-'+lb+'x',(la-lb)+'x',['x'],['Taktu mínusmerkið með seinni liðnum.','Stuðullinn verður '+la+' − '+lb+'. Hann er neikvæður.']),
  collect(ma+'y-('+mb+'y-'+mc+')',poly(0,ma-mb,mc,'y'),['y'],['Mínus fyrir framan sviga breytir formerki allra liðanna inni í honum.','Þegar sviginn fer verður stæðan '+show(ma+'y-'+mb+'y+'+mc)+'.'],'Mínus fyrir framan sviga'),
  collect('('+sa+'y+'+sc+')+('+sb+'y-'+sc+')',(sa+sb)+'y',['y'],['Plús fyrir framan sviga breytir ekki formerkjum.','Föstu liðirnir '+sc+' og −'+sc+' eyða hvor öðrum.']),
  collect(da+'('+db+'x-'+dc+')',poly(0,da*db,-da*dc),['x'],['Margfaldaðu báða liðina í sviganum með '+da+'.','Margfaldaðu líka neikvæða fasta liðinn; hann helst neikvæður.'],'Dreifireglan'),
  collect(xa+'x('+xb+'x+'+xc+')',poly(xa*xb,xa*xc),['x'],['Margfaldaðu '+xa+'x með báðum liðunum.','x · x = x². Seinni liðurinn verður áfram x-liður.'],'Bókstafur utan svigans')
 ]};
 const [va,vb,vx]=d.sub,[ca,cb,cc,cd,ce,cf,cx]=d.combo,[wa,wb,wn,wc]=d.words;
 const vexpr=va+'-'+vb+'x',combo=ca+'x('+cb+'x-'+cc+')-'+cd+'x('+ce+'x-'+cf+')',comboA=ca*cb-cd*ce,comboB=-ca*cc+cd*cf,comboResult=poly(comboA,comboB);
 const application={name:'Innsetning og orð í stæður',tasks:[
  value(vexpr,vx,va-vb*vx),
  value(vexpr,-vx,va+vb*vx,'Neikvæð tala í stað x'),
  collect(combo,comboResult,['x'],['Margfaldaðu inn í báða svigana. Mínusmerkið fyrir framan seinna margfeldið gildir um það allt.','Safnaðu x²-liðum saman og x-liðum saman; þessir tveir flokkar sameinast ekki.'],'Tveir svigar og ólíkir liðir'),
  value(comboResult,cx,comboA*cx**2+comboB*cx,'Notaðu einfölduðu stæðuna'),
  expression('Orð verða að stæðu','Skrifaðu bókstafastæðuna.',story('Summan af <strong>'+wa+'</strong> og <strong>'+wb+'x</strong>.'),wa+'+'+wb+'x',['x'],
   ['Summa merkir að leggja saman.','Annar liðurinn er '+wa+' og hinn er '+wb+'x.'],
   'Stæðan er '+wa+' + '+wb+'x.',{qa:{kind:'wordsSum',constant:wa,coefficient:wb}}),
  choice('Hvaðan er dregið frá?','Veldu stæðuna sem lýsir textanum.',story('<strong>'+wc+' minna en '+wn+' deilt með y.</strong><br>Gefið er að y ≠ 0.'),
   [frac(wn-wc,'y'),wc+' − '+frac(wn,'y'),frac(wn,'y')+' − '+wc,frac('y',wn)+' − '+wc],2,
   ['Finndu fyrst stæðuna fyrir „'+wn+' deilt með y“.','„'+wc+' minna en“ merkir að draga '+wc+' frá þeirri stæðu.'],
   'Stæðan er '+frac(wn,'y')+' − '+wc+'. Fyrst er deilt; síðan er dregið frá.',
   {qa:{kind:'wordsQuotient',numerator:wn,subtract:wc}})
 ]};
 function quotient(original,den,answer,vars,condition='',factorization=''){
  return expression('Þáttaðu og styttu','Skrifaðu einfaldaða stæðu án brotastriks og dragðu saman líka liði.',fractionBoard(original,den,condition),answer,vars,
   ['Þáttaðu teljarann svo sameiginlegur þáttur teljara og nefnara sjáist.','Styttu með sama þætti í teljara og nefnara. Deilingin nær til allra liða teljarans.'],
   frac(show(factorization),show(den))+' = '+show(answer)+'.'+(condition?' Skilyrðið <span class="domain-condition">'+condition+'</span> gildir áfram.':''),
   {label:'Einfaldað',noDivision:true,collected:true,wrong:'Deildu hverjum lið teljarans með nefnaranum. Haltu formerkjum og gættu að veldum.',qa:{kind:'quotient',original,den,factorization,condition}});
 }
 const [fa,fb]=d.factor,[ra,rb]=d.reverse,[qa,qb]=d.qplus,[na,nb]=d.qminus;
 const factorOriginal=fa+'x+'+fa*fb,revOriginal=ra*rb+'-'+ra+'y';
 const factoring={name:'Þáttun og stytting',tasks:[
  choice('Taktu stærsta þáttinn út','Veldu þáttun með stærsta sameiginlega þættinum utan svigans.',board(factorOriginal),
   [fa+'(x + '+fa*fb+')',fa+'(x + '+fb+')','x('+fa+' + '+fa*fb+')',fa+'(x − '+fb+')'],1,
   ['Finndu stærstu heiltöluna sem gengur upp í báða stuðlana.','Deildu báðum liðum með '+fa+' til að finna stæðuna í sviganum.'],
   show(factorOriginal)+' = '+fa+'(x + '+fb+').',{qa:{kind:'factorChoice',original:factorOriginal,factor:fa}}),
  expression('Hvað vantar í svigann?','Þátturinn utan svigans er gefinn. Skrifaðu aðeins innihald svigans.',board(revOriginal,'= '+ra+'( ? )'),rb+'-y',['y'],
   ['Deildu báðum liðum með '+ra+'.','Seinni liðurinn er neikvæður. −'+ra+'y deilt með '+ra+' gefur −y.'],
   show(revOriginal)+' = '+ra+'('+rb+' − y).',{label:'Innan sviga',qa:{kind:'inside',original:revOriginal,factor:''+ra}}),
  quotient(qa+'x+'+qa*qb,''+qa,'x+'+qb,['x'],'',qa+'(x+'+qb+')'),
  quotient(na+'-'+na*nb+'a',''+na,'1-'+nb+'a',['a'],'',na+'(1-'+nb+'a)')
 ]};
 const [n1,n2,n3,n4,n5,n6]=d.nested,[b1,b2,b3,b4,b5]=d.cubeOrder,[c1,c2,c3,c4]=d.squareCube,[r1,r2,r3,r4]=d.fracOrder;
 const ex1=n1+'-'+n2+'('+n3+'^2-'+n4+'('+n5+'-'+n6+'))',ex2=b1+'^2-('+b2+'+'+b3+'('+b4+'^3-'+b5+'))',ex3=c1+'(('+c2+'*'+c3+')^2-'+c4+'^3)',ex4='('+r1+'^2-'+r2+')/'+r3+'^3+'+r4;
 const ans1=n1-n2*(n3**2-n4*(n5-n6)),ans2=b1**2-(b2+b3*(b4**3-b5)),ans3=c1*((c2*c3)**2-c4**3),ans4=(r1**2-r2)/r3**3+r4;
 const extra=[
  number('Svigi innan í sviga','Reiknaðu stæðuna.',board(ex1),ans1,
   ['Byrjaðu á innsta sviganum. Reiknaðu síðan veldið og margföldunina í ytri sviganum.','Innsti sviginn er '+(n5-n6)+'. Ytri sviginn verður '+show(n3**2+'-'+n4+'*'+(n5-n6))+'.'],
   'Ytri sviginn gefur '+(n3**2-n4*(n5-n6))+'. Þá fæst '+show(n1+'-'+n2+'*'+(n3**2-n4*(n5-n6)))+' = '+show(ans1)+'.',{qa:{kind:'number',original:ex1}}),
  number('Veldi og svigar','Reiknaðu stæðuna.',board(ex2),ans2,
   ['Reiknaðu veldin og innsta svigann áður en þú dregur ytri svigann frá.','Innsti sviginn gefur '+(b4**3-b5)+'. Þá er ytri sviginn '+show(b2+'+'+b3+'*'+(b4**3-b5))+'.'],
   b1**2+' − '+(b2+b3*(b4**3-b5))+' = '+show(ans2)+'.',{qa:{kind:'number',original:ex2}}),
  number('Margfeldi í öðru veldi','Reiknaðu stæðuna.',board(ex3),ans3,
   ['Reiknaðu margfeldið inni í innri sviganum og hefðu það allt í annað veldi.','Stæðan verður '+show(c1+'('+((c2*c3)**2)+'-'+c4**3+')')+'.'],
   show(c1+'*'+((c2*c3)**2-c4**3))+' = '+ans3+'.',{qa:{kind:'number',original:ex3}}),
  number('Brotastrik og veldi','Reiknaðu brotið fyrst og bættu síðan við tölunni utan þess.','<div class="review-board"><div class="equation">'+frac(show(r1+'^2-'+r2),show(r3+'^3'))+' + '+r4+'</div></div>',ans4,
   ['Reiknaðu teljara og nefnara hvorn í sínu lagi.','Teljarinn er '+(r1**2-r2)+' og nefnarinn er '+r3**3+'. Deildu og leggðu síðan '+r4+' við.'],
   frac(r1**2-r2,r3**3)+' + '+r4+' = '+show(raw(ans4))+'.',{qa:{kind:'number',original:ex4}})
 ];
 const [aa,ab,ac,ad,ae,af,ax]=d.advA,[ba,bb,bc,bd,be,bx]=d.advB;
 const advA=aa+'x('+ab+'-'+ac+'x)-'+ad+'('+ae+'x-'+af+')',advAResult=poly(-aa*ac,aa*ab-ad*ae,ad*af),advAValue=-aa*ac*ax**2+(aa*ab-ad*ae)*ax+ad*af;
 const advB='-'+ba+'('+bb+'x^2-'+bc+'x)+'+bd+'(x-'+be+')',advBResult=poly(-ba*bb,ba*bc+bd,-bd*be),advBValue=-ba*bb*bx**2+(ba*bc+bd)*bx-bd*be;
 extra.push(
  collect(advA,advAResult,['x'],['Margfaldaðu inn í báða sviga. Gættu að frádrættinum fyrir framan seinni svigann.','Safnaðu x²-liðum, x-liðum og föstum liðum hverjum fyrir sig.'],'Einfaldaðu áður en þú setur inn'),
  value(advAResult,ax,advAValue,'Settu neikvæða tölu inn'),
  collect(advB,advBResult,['x'],['Margfaldaðu báða liði fyrri svigans með neikvæðu tölunni.','Mínus sinnum mínus gefur plús. Safnaðu svo saman líkum liðum.'],'Neikvæð tala utan svigans'),
  value(advBResult,bx,advBValue,'Athugaðu veldi neikvæðrar tölu')
 );
 const [fx,fxb,fxc]=d.qx,[fy,fyb,fyc]=d.qy,[fp,fpb,fpc]=d.qp,[fm,fmb,fmc]=d.qm;
 extra.push(
  quotient(fx*fxb+'x^2+'+fx*fxc+'x',fx+'x',fxb+'x+'+fxc,['x'],'x ≠ 0',fx+'x('+fxb+'x+'+fxc+')'),
  quotient(fy*fyb+'y-'+fy*fyc,''+fy,fyb+'y-'+fyc,['y'],'',fy+'('+fyb+'y-'+fyc+')'),
  quotient(fp*fpb+'p^2-'+fp*fpc+'p',fp+'p',fpb+'p-'+fpc,['p'],'p ≠ 0',fp+'p('+fpb+'p-'+fpc+')'),
  quotient(raw(fm*fmb/10)+'m^2+'+raw(fm*fmc/10)+'m',raw(fm/10)+'m',fmb+'m+'+fmc,['m'],'m ≠ 0',raw(fm/10)+'m('+fmb+'m+'+fmc+')')
 );
 return [order,algebra,application,factoring,{name:'Aukaáskorun',optional:true,tasks:extra}];
}
