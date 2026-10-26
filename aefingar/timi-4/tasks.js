'use strict';
const variants=[
 {basic:[5,8,17,6,6,9],signed:[4,6,10,8,6],power:[3,8,2,12,5],mix:[7,8,3,5],square:[8,11,5,4],powers:[6,13,9,5],front:[9,4,6,7],decimal:[8,17,23,36,2,14,28],long:[14,-7,3,-9,5,-8],longer:[3,7,-2,6,-9,5,-4,-3,6],expand:[4,3,2,2,5,3],fraction:[18,3,4,2,3]},
 {basic:[7,9,19,8,8,12],signed:[5,7,12,9,8],power:[4,9,3,15,6],mix:[9,6,4,8],square:[9,12,4,3],powers:[8,15,12,6],front:[12,6,5,8],decimal:[16,9,27,41,3,18,26],long:[13,-8,4,-7,3,-6],longer:[4,6,-3,8,-8,4,-5,-2,7],expand:[3,4,5,2,7,4],fraction:[22,4,3,5,2]},
 {basic:[8,11,24,7,9,15],signed:[6,9,13,12,9],power:[5,7,4,18,8],mix:[8,5,2,9],square:[12,15,7,5],powers:[9,16,14,7],front:[14,3,7,9],decimal:[13,18,34,48,4,23,29],long:[16,-11,5,-10,7,-9],longer:[5,8,-4,9,-11,6,-3,-4,5],expand:[5,2,3,3,4,2],fraction:[27,5,3,6,3]}
];
function buildSections(seed){
 const d=variants[seed%variants.length];
 const fmt=n=>String(Math.round(n*100000)/100000).replace('-', '−').replace('.',',');
 const variable=(v,p=1)=>v+(p===1?'':'<sup>'+p+'</sup>');
 const term=(c,v='',p=1)=>(c<0?'−':'')+((v&&Math.abs(c)===1)?'':fmt(Math.abs(c)))+(v?variable(v,p):'');
 const expr=terms=>terms.filter(t=>t[0]!==0).map(([c,v,p],i)=>(i?(c<0?' − ':' + '):(c<0?'−':''))+term(Math.abs(c),v,p)).join('')||'0';
 const poly=(a,b,c,v='x')=>expr([[a,v,2],[b,v,1],[c,'',1]]);
 const eq=s=>'<div class="equation">'+s+'</div>';
 const parts=s=>'<div class="equation long-equation">'+s+'</div>';
 const chunks=terms=>terms.map(([c,v,p],i)=>'<span class="math-chunk">'+(i?(c<0?'− ':'+ '):(c<0?'−':''))+term(Math.abs(c),v,p)+'</span>').join('');
 const frac=(a,b)=>'<span class="fraction"><span>'+a+'</span><span>'+b+'</span></span>';
 const num=(title,intro,expression,answer,hints,explain,extra={})=>({type:'number',title,intro,board:eq(expression),answer,label:'Talan',unit:'',inputHelp:'Skráðu aðeins töluna sem vantar í reitinn, með mínusmerki ef þarf.',hints,explain,wrong:'Leggðu saman eða dragðu frá stuðlana. Formerkið fylgir liðnum og bókstafahlutinn helst óbreyttur.',...extra});
 const pick=(title,intro,expression,options,correct,hints,explain,extra={})=>({type:'choices',title,intro,board:eq(expression),options,correct,hints,explain,wrong:'Sameinaðu aðeins liði sem hafa sama bókstafahluta og sömu veldisvísa. Gættu að formerkinu á hverjum lið.',...extra});
 const blank=(s,v='x',p=1)=>s+' = <span class="missing" aria-label="óþekktur stuðull">□</span>'+variable(v,p);
 const [b1,b2,b3,b4,b5,b6]=d.basic;
 const basic={name:'Safnaðu x-liðum',tasks:[
  num('Leggðu stuðlana saman','Líkir liðir hafa sama bókstafahluta. Talan fyrir framan bókstafinn kallast stuðull. Hvaða stuðull á að vera í reitnum?',
   blank(expr([[b1,'x'],[b2,'x']])),b1+b2,
   ['Báðir liðirnir eru x-liðir. Leggðu aðeins stuðlana saman.',b1+' + '+b2+' gefur nýja stuðulinn. Bókstafurinn x helst óbreyttur.'],
   expr([[b1,'x'],[b2,'x']])+' = ('+b1+' + '+b2+')x = '+term(b1+b2,'x')+'. Við samlagningu bætist enginn veldisvísir við.'),
  num('Frádráttur líkra liða','Safnaðu x-liðunum og fylltu inn stuðulinn.',
   blank(expr([[b3,'x'],[-b4,'x']])),b3-b4,
   ['Mínusmerkið fylgir seinni stuðlinum.','Reiknaðu '+b3+' − '+b4+'.'],
   expr([[b3,'x'],[-b4,'x']])+' = ('+b3+' − '+b4+')x = '+term(b3-b4,'x')+'.'),
  num('Hvað felst í einu x?','Eitt x er það sama og 1x. Safnaðu líkum liðum.',
   blank(expr([[1,'x'],[b5,'x']])),1+b5,
   ['Þegar engin tala er skrifuð fyrir framan x er stuðullinn 1.','Reiknaðu 1 + '+b5+'.'],
   'x + '+term(b5,'x')+' = (1 + '+b5+')x = '+term(1+b5,'x')+'.'),
  num('Dragðu eitt x frá','Finndu stuðulinn sem vantar.',
   blank(expr([[b6,'x'],[-1,'x']])),b6-1,
   ['−x merkir −1x.','Reiknaðu '+b6+' − 1.'],
   term(b6,'x')+' − x = ('+b6+' − 1)x = '+term(b6-1,'x')+'.')
 ]};
 const [count,z1,z2,t,s]=d.signed,repeat=Array.from({length:count},()=>[1,'y']);
 const signs={name:'Formerkið fylgir liðnum',tasks:[
  num('Teldu y-liðina','Allir liðirnir hafa stuðulinn 1. Safnaðu þeim saman.',blank(expr(repeat),'y'),count,
   ['Hvert y stendur fyrir 1y.','Leggðu saman einn fyrir hvern y-lið.'],
   expr(repeat)+' = '+term(count,'y')+'.'),
  num('Neikvæður stuðull','Einfaldaðu og skráðu stuðulinn með réttu formerki.',blank(expr([[z1,'z'],[-z2,'z']]),'z'),z1-z2,
   ['Báðir liðirnir eru z-liðir. Taktu mínusmerkið með í reikninginn.',z1+' − '+z2+' er neikvæð tala því þú dregur stærri tölu frá minni.'],
   expr([[z1,'z'],[-z2,'z']])+' = ('+z1+' − '+z2+')z = '+term(z1-z2,'z')+'.'),
  num('Tvö mínusmerki, tveir liðir','Safnaðu t-liðunum. Hvert mínusmerki fylgir liðnum á eftir því.',blank(expr([[t,'t'],[-1,'t'],[-1,'t']]),'t'),t-2,
   ['Stuðlarnir eru '+t+', −1 og −1.','Þú dregur 1 frá tvisvar: '+t+' − 1 − 1.'],
   term(t,'t')+' − t − t = ('+t+' − 1 − 1)t = '+term(t-2,'t')+'.'),
  num('Stæðan byrjar á mínus','Safnaðu s-liðunum. Mundu eftir fyrsta mínusmerkinu.',blank(expr([[-1,'s'],[-s,'s']]),'s'),-1-s,
   ['Stuðull fyrsta liðarins er −1.','Leggðu saman stuðlana −1 og −'+s+'.'],
   '−s − '+term(s,'s')+' = (−1 − '+s+')s = '+term(-1-s,'s')+'.')
 ]};
 const [p1,p2,p3,p4,p5]=d.power,pSum=p1+p2-p3,pTail=p4-1-p5;
 const powers={name:'Sami bókstafur, sama veldi',tasks:[
  pick('Hvaða liðir eru líkir?','Veldu liðinn sem má sameina við liðinn í rammanum.',term(p1,'x',2),
   [term(p2,'x'),term(-p2,'x',2),term(p2,'y',2)],1,
   ['Líkir liðir hafa sama bókstaf og sama veldisvísi.','Stuðullinn má vera annar og formerkið líka. Leitaðu að öðrum x²-lið.'],
   term(p1,'x',2)+' og '+term(-p2,'x',2)+' eru líkir liðir. Báðir hafa bókstafahlutann x².'),
  num('Þrír x-liðir','Reiknaðu stuðulinn sem vantar.',blank(expr([[p1,'x'],[p2,'x'],[-p3,'x']])),pSum,
   ['Allir liðirnir eru x-liðir.','Reiknaðu '+p1+' + '+p2+' − '+p3+'.'],
   expr([[p1,'x'],[p2,'x'],[-p3,'x']])+' = '+term(pSum,'x')+'.'),
  num('Sömu stuðlar, x í öðru veldi','Safnaðu x²-liðunum. Veldisvísirinn helst 2.',blank(expr([[p1,'x',2],[p2,'x',2],[-p3,'x',2]]),'x',2),pSum,
   ['Við samlagningu líkra liða breytist aðeins stuðullinn.','Reiknaðu aftur '+p1+' + '+p2+' − '+p3+'. Haltu x² óbreyttu.'],
   expr([[p1,'x',2],[p2,'x',2],[-p3,'x',2]])+' = '+term(pSum,'x',2)+'. Veldisvísarnir leggjast ekki saman þegar liðir leggjast saman.'),
  num('Einn x²-liður dreginn frá','Mundu að stuðullinn fyrir framan x² getur verið óskrifaður.',blank(expr([[p4,'x',2],[-1,'x',2],[-p5,'x',2]]),'x',2),pTail,
   ['−x² hefur stuðulinn −1.','Reiknaðu '+p4+' − 1 − '+p5+'.'],
   expr([[p4,'x',2],[-1,'x',2],[-p5,'x',2]])+' = '+term(pTail,'x',2)+'.')
 ]};
 const [m1,m2,m3,m4]=d.mix,mx=m1-m3,mc=m2-m4,mExpr=expr([[m1,'x'],[m2,''],[-m3,'x'],[-m4,'']]);
 const [q1,q2,q3,q4]=d.square,qa=q1-q3,qc=-q2+q4,qExpr=expr([[q1,'x',2],[-q2,''],[-q3,'x',2],[q4,'']]);
 const [r1,r2,r3,r4]=d.powers,ra=r1-r3,rb=r2-r4,rExpr=expr([[r1,'x',2],[r2,'x'],[-r3,'x',2],[-r4,'x']]);
 const [f1,f2,f3,f4]=d.front,fb=-f2-f4,fc=f1+f3,fExpr=expr([[f1,''],[-f2,'y'],[f3,''],[-f4,'y']]);
 const mixed={name:'Flokkaðu og sameinaðu',tasks:[
  pick('Finndu x-liðina','Hvaða tveir liðir hafa bókstafahlutann x? Taktu formerkin með.',mExpr,
   [term(m1,'x')+' og '+term(m3,'x'),term(m1,'x')+' og '+term(-m3,'x'),fmt(m2)+' og '+fmt(-m4)],1,
   ['Tölur án bókstafs eru fastaliðir og tilheyra öðrum hópi.','Mínusmerkið á undan '+term(m3,'x')+' er hluti af þeim lið.'],
   'x-liðirnir eru '+term(m1,'x')+' og '+term(-m3,'x')+'. Fastaliðirnir eru '+fmt(m2)+' og '+fmt(-m4)+'.'),
  num('Safnaðu x-liðunum fyrst','Hvaða stuðull verður fyrir framan x? Skoðaðu aðeins x-liðina.',mExpr,mx,
   ['Sameinaðu '+term(m1,'x')+' og '+term(-m3,'x')+'.','Reiknaðu '+m1+' − '+m3+'.'],
   'x-liðirnir verða '+term(mx,'x')+'. Fastaliðirnir bíða næsta skrefs.',{label:'Stuðull x',inputHelp:'Skráðu stuðulinn fyrir framan x sem tölu.'}),
  num('Safnaðu síðan fastaliðunum','Hvaða tala fæst þegar liðirnir án bókstafs eru sameinaðir?',mExpr,mc,
   ['Fastaliðirnir eru '+fmt(m2)+' og '+fmt(-m4)+'.','Reiknaðu '+m2+' − '+m4+'.'],
   'Fastaliðirnir gefa '+fmt(mc)+'. Þeir sameinast ekki x-liðunum.',{label:'Fastaliður',inputHelp:'Skráðu töluna sem fæst, með mínusmerki ef þarf.'}),
  pick('Settu niðurstöðuna saman','Veldu alla einfölduðu stæðuna.',mExpr,
   [poly(0,mx,-mc),term(mx+mc,'x'),poly(0,mx,mc),poly(0,m1+m3,m2+m4)],2,
   ['x-liðir og fastaliðir haldast aðskildir.','Stuðull x er '+fmt(mx)+' og fastaliðurinn er '+fmt(mc)+'.'],
   mExpr+' = '+poly(0,mx,mc)+'.'),
  pick('x²-liðir og fastaliðir','Einfaldaðu stæðuna. Formerkin skipta máli.',qExpr,
   [poly(0,qa,qc),poly(qa,0,-qc),poly(q1+q3,0,qc),poly(qa,0,qc)],3,
   ['Safnaðu x²-liðunum saman og fastaliðunum sér.','x²-stuðullinn er '+q1+' − '+q3+' og fastaliðurinn er −'+q2+' + '+q4+'.'],
   qExpr+' = '+poly(qa,0,qc)+'.'),
  pick('Ekki blanda x og x²','Einfaldaðu með því að halda x²-liðum og x-liðum aðskildum.',rExpr,
   [poly(ra,rb,0),term(ra+rb,'x',2),poly(-ra,rb,0),poly(ra,r2+r4,0)],0,
   ['x og x² eru ólíkir bókstafahlutar. Safnaðu hvorum hópi fyrir sig.','Stuðull x² er '+r1+' − '+r3+'. Stuðull x er '+r2+' − '+r4+'.'],
   rExpr+' = '+poly(ra,rb,0)+'. Ekki er hægt að sameina þessa tvo liði frekar.'),
  pick('Fastaliðurinn kemur fyrst','Einfaldaðu alla stæðuna. Röð liðanna breytir ekki því hvaða liðir eru líkir.',fExpr,
   [poly(0,-fb,fc,'y'),poly(0,fb,-fc,'y'),poly(0,fb,fc,'y'),poly(0,-f2+f4,fc,'y')],2,
   ['Færðu formerkið með hverjum lið þegar þú flokkar.','y-liðirnir gefa ('+fmt(-f2)+' − '+f4+')y. Fastaliðirnir gefa '+f1+' + '+f3+'.'],
   fExpr+' = '+poly(0,fb,fc,'y')+'.')
 ]};
 const [d1,d2,d3,d4,d5,d6,d7]=d.decimal;
 const [l1,l2,l3,l4,l5,l6]=d.long,la=l1+l4,lb=l2+l5,lc=l3+l6;
 const longTerms=[[l1,'x',2],[l2,'x'],[l3,''],[l4,'x',2],[l5,'x'],[l6,'']],longExpr=expr(longTerms);
 const [n1,n2,n3,n4,n5,n6,n7,n8,n9]=d.longer,na=n3+n6+n9,nb=n2+n5+n8,nc=n1+n4+n7;
 const longerTerms=[[n1,''],[n2,'x'],[n3,'x',2],[n4,''],[n5,'x'],[n6,'x',2],[n7,''],[n8,'x'],[n9,'x',2]],longerExpr=expr(longerTerms);
 const [e1,e2,e3,e4,e5,e6]=d.expand,ea=e1*e2-e4*e5,ec=-e1*e3+e4*e6;
 const expanded=expr([[e1*e2,'a'],[-e1*e3,''],[-e4*e5,'a'],[e4*e6,'']]);
 const brackets=e1+'('+term(e2,'a')+' − '+e3+') − '+e4+'('+term(e5,'a')+' − '+e6+')';
 const [v1,v2,v3,v4,v5]=d.fraction,va=v1-v2*v3,vc=v2*v4;
 const numerator=term(v1,'m')+' − '+v2+'('+term(v3,'m')+' − '+v4+')',fBoard=frac(numerator,v5);
 const extra={name:'Aukaáskorun',optional:true,tasks:[
  num('Tugabrot sem stuðlar','Safnaðu líkum liðum. Nota má kommu eða punkt í svarinu.',
   blank(expr([[d1/10,'x'],[d2/10,'x']])),(d1+d2)/10,
   ['Bókstafahlutinn er x í báðum liðum. Leggðu tugabrotin saman.','Reiknaðu '+fmt(d1/10)+' + '+fmt(d2/10)+'.'],
   expr([[d1/10,'x'],[d2/10,'x']])+' = '+term((d1+d2)/10,'x')+'.'),
  num('Neikvæð niðurstaða með tugabrotum','Safnaðu y-liðunum og gættu að báðum mínusmerkjunum.',
   blank(expr([[d3/10,'y'],[-d4/10,'y'],[-d5/10,'y']]),'y'),(d3-d4-d5)/10,
   ['Sameinaðu stuðlana með sömu formerkjum og þeir hafa í stæðunni.','Reiknaðu '+fmt(d3/10)+' − '+fmt(d4/10)+' − '+fmt(d5/10)+'.'],
   expr([[d3/10,'y'],[-d4/10,'y'],[-d5/10,'y']])+' = '+term((d3-d4-d5)/10,'y')+'.'),
  num('Tugabrot og y í öðru veldi','Einfaldaðu. Síðasti liðurinn hefur stuðulinn −1.',
   blank(expr([[d6/10,'y',2],[d7/10,'y',2],[-1,'y',2]]),'y',2),(d6+d7-10)/10,
   ['Allir liðirnir hafa bókstafahlutann y².','Reiknaðu '+fmt(d6/10)+' + '+fmt(d7/10)+' − 1.'],
   expr([[d6/10,'y',2],[d7/10,'y',2],[-1,'y',2]])+' = '+term((d6+d7-10)/10,'y',2)+'.'),
  pick('Þrír hópar líkra liða','Einfaldaðu. Flokkaðu x²-liði, x-liði og fastaliði.',longExpr,
   [poly(la,lb,-lc),poly(la,lb,lc),poly(l1-l4,lb,lc),poly(la,-lb,lc)],1,
   ['Formerkið fylgir liðnum. Reiknaðu stuðlasummu fyrir hvern hóp.',
    'x²: '+fmt(l1)+' '+(l4<0?'− ':'+ ')+fmt(Math.abs(l4))+'; x: '+fmt(l2)+' + '+fmt(l5)+'; fastaliðir: '+fmt(l3)+' − '+fmt(-l6)+'.'],
   longExpr+' = '+poly(la,lb,lc)+'.',{board:parts(chunks(longTerms))}),
  pick('Lengri stæða, sama aðferð','Safnaðu hverjum flokki fyrir sig. Skrifaðu gjarnan milliskref á blað.',longerExpr,
   [poly(na,-nb,nc),poly(-na,nb,nc),poly(na,nb,-nc),poly(na,nb,nc)],3,
   ['Það eru þrír x²-liðir, þrír x-liðir og þrír fastaliðir.',
    'Stuðlasummurnar eru '+fmt(n3)+' + '+n6+' + '+n9+' fyrir x² og '+n2+' − '+(-n5)+' − '+(-n8)+' fyrir x. Fastaliðirnir eru '+n1+' + '+n4+' − '+(-n7)+'.'],
   'x²-liðirnir gefa '+term(na,'x',2)+', x-liðirnir '+term(nb,'x')+' og fastaliðirnir '+fmt(nc)+'. Niðurstaðan er '+poly(na,nb,nc)+'.',{board:parts(chunks(longerTerms))}),
  pick('Margfaldaðu inn í svigana','Veldu rétta stæðu eftir að margfaldað hefur verið inn í báða svigana. Ekki safna liðum strax.',brackets,
   [expanded,expr([[e1*e2,'a'],[-e3,''],[-e4*e5,'a'],[e6,'']]),expr([[e1*e2,'a'],[-e1*e3,''],[-e4*e5,'a'],[-e4*e6,'']])],0,
   ['Talan fyrir framan sviga margfaldast með hverjum lið í sviganum.','Seinni sviginn er margfaldaður með −'+e4+'. Því verður (−'+e4+') × (−'+e6+') jákvætt.'],
   brackets+' = '+expanded+'. Mínus margfaldaður með mínus gefur plús.',{board:parts('<span class="math-chunk">'+e1+'('+term(e2,'a')+' − '+e3+')</span><span class="math-chunk">− '+e4+'('+term(e5,'a')+' − '+e6+')</span>'),wideChoices:true}),
  pick('Safnaðu eftir margföldunina','Nú eru svigarnir farnir. Einfaldaðu stæðuna.',expanded,
   [poly(0,-ea,ec,'a'),poly(0,ea,-ec,'a'),poly(0,ea,ec,'a'),poly(0,e1*e2+e4*e5,ec,'a')],2,
   ['Safnaðu a-liðunum saman og fastaliðunum sér.','a-stuðullinn er '+e1*e2+' − '+e4*e5+'. Fastaliðurinn er −'+e1*e3+' + '+e4*e6+'.'],
   expanded+' = '+poly(0,ea,ec,'a')+'.'),
  pick('Byrjaðu á teljaranum','Einfaldaðu aðeins teljara brotsins. Hvaða stæða fæst áður en deilt er?',fBoard,
   [poly(0,va,-vc,'m'),poly(0,va,vc,'m'),poly(0,v1+v2*v3,vc,'m')],1,
   ['Margfaldaðu −'+v2+' inn í svigann.','Teljarinn verður '+term(v1,'m')+' − '+term(v2*v3,'m')+' + '+vc+'.'],
   'Teljarinn einfaldast í '+poly(0,va,vc,'m')+'. Nefnarinn er enn '+v5+'.',{board:'<div class="equation fraction-task">'+fBoard+'</div>'}),
  pick('Deildu í alla teljarann','Ljúktu við einföldun brotsins.',frac(poly(0,va,vc,'m'),v5),
   [poly(0,va/v5,vc,'m'),poly(0,va,vc/v5,'m'),poly(0,va/v5,-vc/v5,'m'),poly(0,va/v5,vc/v5,'m')],3,
   ['Brotastrikið deilir öllum teljaranum með '+v5+'.','Deildu bæði stuðli m og fastaliðnum með '+v5+'.'],
   frac(poly(0,va,vc,'m'),v5)+' = '+poly(0,va/v5,vc/v5,'m')+'.')
 ]};
 return [basic,signs,powers,mixed,extra];
}
