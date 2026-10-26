'use strict';
const variants=[
 {one:[5,3,2],front:[5,8,3],firstVar:[4,5],single:[5,2,3],unit:[5,2],plus:[4,1,2,3,3,5],minus:[5,3,4,2,2,3],negInner:[6,2,4,3,5,2],varPlus:[3,4,5,2],varMinus:[5,2,3,4,2,2],varNegative:[4,2,3,3],decimal:[3,4,5,12,3,2],triple:[8,3,2,4,2,5,3,4,1],decimalVar:[5,12,8,2,150,200],negative:[4,3,16,3,5],mixed:[5,6,2,12,3,5,2],implicit:[6,5,4,2,3,8],tripleDecimal:[8,5,3,4,3,6,3,12,4]},
 {one:[4,5,3],front:[6,7,2],firstVar:[5,6],single:[3,4,2],unit:[7,3],plus:[5,1,3,2,4,7],minus:[7,2,5,3,3,4],negInner:[4,3,5,2,7,4],varPlus:[4,2,3,5],varMinus:[6,3,2,4,2,3],varNegative:[5,3,4,2],decimal:[4,3,7,15,2,4],triple:[7,4,3,5,2,4,2,3,2],decimalVar:[3,20,10,4,100,150],negative:[5,2,14,4,5],mixed:[4,7,3,15,2,4,3],implicit:[8,4,5,3,2,7],tripleDecimal:[7,4,2,5,2,3,2,11,6]},
 {one:[9,2,4],front:[9,4,5],firstVar:[8,2],single:[7,3,4],unit:[6,4],plus:[6,1,4,5,2,3],minus:[8,3,2,5,2,3],negInner:[9,2,3,4,6,3],varPlus:[6,3,2,4],varMinus:[7,2,4,3,3,2],varNegative:[7,2,3,5],decimal:[6,2,3,13,4,5],triple:[9,3,2,4,3,7,5,2,1],decimalVar:[4,15,20,3,200,100],negative:[3,6,12,3,5],mixed:[6,5,2,14,3,5,4],implicit:[5,6,3,4,4,9],tripleDecimal:[6,7,4,3,5,8,4,13,2]}
];
function buildSections(seed){
 const d=variants[seed%variants.length],round=n=>Math.round(n*1e6)/1e6,fmt=n=>String(round(n)).replace('-','−').replace('.',',');
 const term=(c,v='',p=1)=>(c<0?'−':'')+((v&&Math.abs(round(c))===1)?'':fmt(Math.abs(c)))+(v?v+(p===2?'<sup>2</sup>':''):'');
 const expr=ts=>ts.filter(t=>round(t[0])!==0).map(([c,v,p],i)=>(i?(c<0?' − ':' + '):(c<0?'−':''))+term(Math.abs(c),v,p)).join('')||'0';
 const poly=(a,b,c,v='x')=>expr([[a,v,2],[b,v],[c,'']]);
 const bracket=s=>'('+s+')';
 const board=parts=>'<div class="equation bracket-equation">'+(Array.isArray(parts)?parts:[parts]).map(s=>'<span class="math-chunk">'+s+'</span>').join('')+'</div>';
 const num=(title,intro,parts,answer,label,hints,explain)=>({type:'number',title,intro,board:board(parts),answer:round(answer),label,unit:'',inputHelp:'Skráðu aðeins tölu. Nota má kommu eða punkt í tugabroti og mínusmerki ef þarf.',hints,explain,wrong:'Margfaldaðu liðinn fyrir framan svigann með hverjum lið inni í honum. Gættu að formerkjum og safnaðu síðan líkum liðum.'});
 const pick=(title,intro,parts,options,correct,hints,explain,extra={})=>({type:'choices',title,intro,board:board(parts),options,correct,hints,explain,wrong:'Athugaðu bæði margfeldin úr hverjum sviga. Stuðlar margfaldast og x · x gefur x². Safnaðu svo líkum liðum.',...extra});
 const [a,b,c]=d.one,one=a+bracket(poly(0,b,c)),expanded=term(a*b,'x')+' + '+a*c;
 const [f,g,h]=d.front,front=f+'('+g+' − '+term(h,'x')+')';
 const [u,v]=d.firstVar,firstVar=term(u,'x')+'(x + '+v+')';
 const basics={name:'Margfaldaðu með báðum liðum',tasks:[
  pick('Hver liður fær margfaldarann','Hvaða stæða sýnir rétta margföldun inn í svigann?',one,
   [a+' · '+term(b,'x')+' + '+c,a+' · '+term(b,'x')+' + '+a+' · '+c,a+' + '+term(b,'x')+' + '+c],1,
   ['Talan fyrir framan margfaldar allan svigann. Það eru '+a+' eintök af bæði '+term(b,'x')+' og '+c+'.','Margfaldaðu '+a+' með fyrri liðnum og síðan með þeim seinni. Þetta kallast dreifiregla.'],
   one+' = '+a+' · '+term(b,'x')+' + '+a+' · '+c+' = '+expanded+'. Báðir liðir svigans eru endurteknir '+a+' sinnum.',{wideChoices:true}),
  num('Finndu x-stuðulinn','Hvaða stuðull verður fyrir framan x eftir margföldunina?',one,a*b,'Stuðull x',
   ['Margfaldaðu töluna fyrir framan svigann með stuðli x inni í honum.','Reiknaðu '+a+' · '+b+'.'],
   one+' = '+expanded+'. Stuðull x er '+a*b+'.'),
  num('Margfaldaðu líka fastaliðinn','Hvaða fastaliður verður eftir þegar margfaldað hefur verið inn í svigann?',one,a*c,'Fastaliður',
   ['Fastaliðurinn '+c+' er líka inni í sviganum.','Margfaldaðu '+a+' með '+c+'.'],
   one+' = '+expanded+'. Fastaliðurinn er '+a*c+'.'),
  pick('Fastaliður fyrst og mínus í sviga','Margfaldaðu inn í svigann og veldu alla niðurstöðuna.',front,
   [poly(0,f*h,f*g),poly(0,-f*h,g),poly(0,-f*h,f*g),poly(0,-h,f*g)],2,
   ['Röð liðanna breytir ekki dreifireglunni. Margfaldaðu með báðum.','Margfeldin eru '+f+' · '+g+' og '+f+' · (−'+term(h,'x')+').'],
   front+' = '+f*g+' − '+term(f*h,'x')+' = '+poly(0,-f*h,f*g)+'.'),
  pick('Nú er x líka fyrir framan svigann','Margfaldaðu allan liðinn fyrir framan svigann með báðum liðunum inni í honum.',firstVar,
   [poly(u,u*v,0),poly(0,u+u*v,0),poly(u,v,0),poly(u,-u*v,0)],0,
   ['x · x = x². Stuðullinn '+u+' margfaldast með stuðlinum 1.','Seinna margfeldið er '+term(u,'x')+' · '+v+' = '+term(u*v,'x')+'.'],
   firstVar+' = '+term(u,'x',2)+' + '+term(u*v,'x')+'. Hér eru x² og x ólíkir bókstafahlutar.')
 ]};
 const [s1,s2,s3]=d.single,single=term(s1,'y')+bracket(poly(0,s2,-s3,'y')),singleA=s1*s2,singleB=-s1*s3;
 const [w1,w2]=d.unit,unit='x('+w1+' − '+term(w2,'x')+')';
 const letters={name:'Bókstafur margfaldar sviga',tasks:[
  num('Margföldun tveggja y-liða','Hvaða stuðull verður fyrir framan y²?',single,singleA,'Stuðull y²',
   ['Margfaldaðu stuðlana og bókstafina: y · y = y².','Stuðlarnir gefa '+s1+' · '+s2+'.'],
   term(s1,'y')+' · '+term(s2,'y')+' = '+term(singleA,'y',2)+'.'),
  num('Margföldun með neikvæðum fastalið','Hvaða stuðull verður fyrir framan y?',single,singleB,'Stuðull y',
   ['Seinna margfeldið er '+term(s1,'y')+' · (−'+s3+').','Jákvæður stuðull margfaldaður með neikvæðri tölu gefur neikvæðan stuðul.'],
   term(s1,'y')+' · (−'+s3+') = '+term(singleB,'y')+'.'),
  pick('Haltu y² og y aðskildum','Veldu alla einfölduðu stæðuna.',single,
   [poly(singleA,-singleB,0,'y'),poly(0,singleA+singleB,0,'y'),poly(s1,singleB,0,'y'),poly(singleA,singleB,0,'y')],3,
   ['Fyrra margfeldið hefur y² en það seinna y.','Margfeldin eru '+term(singleA,'y',2)+' og '+term(singleB,'y')+'. Þau eru ekki líkir liðir.'],
   single+' = '+poly(singleA,singleB,0,'y')+'.'),
  pick('Óskrifaði stuðullinn er 1','Einfaldaðu stæðuna. Gættu að x · x og mínusmerkinu.',unit,
   [poly(w2,w1,0),poly(-w2,w1,0),poly(0,w1-w2,0),poly(-1,w1,0)],1,
   ['Fyrra margfeldið er x · '+w1+' = '+term(w1,'x')+'.','Seinna margfeldið er x · (−'+term(w2,'x')+') = '+term(-w2,'x',2)+'.'],
   unit+' = '+poly(-w2,w1,0)+'.')
 ]};
 const [pa,pb,pc,pd,pe,pf]=d.plus,plus=[pa+bracket(poly(0,pb,pc)),'+ '+pd+bracket(poly(0,pe,pf))],plusB=pa*pb+pd*pe,plusC=pa*pc+pd*pf;
 const [ma,mb,mc,md,me,mf]=d.minus,minus=[ma+bracket(poly(0,mb,mc)),'− '+md+bracket(poly(0,me,mf))],minusB=ma*mb-md*me,minusC=ma*mc-md*mf,minusExpanded=expr([[ma*mb,'x'],[ma*mc,''],[-md*me,'x'],[-md*mf,'']]);
 const [na,nb,nc,nd,ne,nf]=d.negInner,negativeInner=[na+bracket(poly(0,nb,nc)),'− '+nd+'('+ne+' − '+term(nf,'x')+')'],negB=na*nb+nd*nf,negC=na*nc-nd*ne;
 const two={name:'Tveir margfaldaðir svigar',tasks:[
  pick('Margfaldaðu, síðan safnaðu','Margfaldaðu inn í báða sviga áður en þú safnar líkum liðum.',plus,
   [poly(0,plusB,pc+pf),poly(0,pa*pb-pd*pe,plusC),poly(0,plusB,plusC),poly(0,plusB,-plusC)],2,
   ['Fyrri margföldunin gefur '+poly(0,pa*pb,pa*pc)+' og sú seinni '+poly(0,pd*pe,pd*pf)+'.','Leggðu x-stuðlana saman og fastaliðina sér.'],
   plus.join(' ')+' = '+poly(0,plusB,plusC)+'.'),
  pick('Neikvæður margfaldari við seinni sviga','Veldu rétta stæðu eftir margföldun. Ekki safna liðum strax.',minus,
   [minusExpanded,expr([[ma*mb,'x'],[ma*mc,''],[-md*me,'x'],[md*mf,'']]),expr([[ma*mb,'x'],[mc,''],[-md*me,'x'],[-mf,'']])],0,
   ['Mínusinn fyrir framan seinni margfaldarann fylgir honum inn í svigann.','Margfaldaðu báða liði seinni svigans með −'+md+'.'],
   minus.join(' ')+' = '+minusExpanded+'. Bæði seinni margfeldin hafa neikvæða stuðla.',{wideChoices:true}),
  num('Safnaðu x-liðunum','Hvaða stuðull verður fyrir framan x eftir alla einföldunina?',minus,minusB,'Stuðull x',
   ['x-liðirnir verða '+term(ma*mb,'x')+' og '+term(-md*me,'x')+'.','Reiknaðu '+ma*mb+' − '+md*me+'.'],
   'x-stuðullinn er '+minusB+'. Fastaliðirnir eru teknir saman í næsta skrefi.'),
  num('Safnaðu fastaliðunum','Hvaða fastaliður verður eftir?',minus,minusC,'Fastaliður',
   ['Fastaliðirnir eru '+ma*mc+' og −'+md*mf+'.','Reiknaðu '+ma*mc+' − '+md*mf+'.'],
   minus.join(' ')+' = '+poly(0,minusB,minusC)+'.'),
  pick('Neikvætt margfaldað með neikvæðu','Margfaldaðu inn í svigana og einfaldaðu.',negativeInner,
   [poly(0,na*nb-nd*nf,negC),poly(0,negB,na*nc+nd*ne),poly(0,-negB,negC),poly(0,negB,negC)],3,
   ['Seinni sviginn er margfaldaður með −'+nd+'.','(−'+nd+') · (−'+term(nf,'x')+') = +'+term(nd*nf,'x')+'.'],
   negativeInner.join(' ')+' = '+expr([[na*nb,'x'],[na*nc,''],[-nd*ne,''],[nd*nf,'x']])+' = '+poly(0,negB,negC)+'.')
 ]};
 const [xa,xb,xc,xd]=d.varPlus,varPlus=[term(xa,'x')+'(x − '+xb+')','+ '+term(xc,'x')+'(x − '+xd+')'],xpA=xa+xc,xpB=-xa*xb-xc*xd;
 const [ya,yb,yc,yd,ye,yf]=d.varMinus,varMinus=[term(ya,'x')+bracket(poly(0,yb,yc)),'− '+term(yd,'x')+bracket(poly(0,ye,-yf))],xmA=ya*yb-yd*ye,xmB=ya*yc+yd*yf;
 const [za,zb,zc,zd]=d.varNegative,varNegative=[term(za,'x')+'('+zb+' − x)','− '+term(zc,'x')+'('+zd+' + x)'],xnA=-za-zc,xnB=za*zb-zc*zd;
 const variableTwo={name:'Bókstafir fyrir framan tvo sviga',tasks:[
  num('Finndu x²-stuðulinn','Margfaldaðu inn í svigana. Hvaða stuðull verður fyrir framan x²?',varPlus,xpA,'Stuðull x²',
   ['Margfeldin með x · x gefa x²-liðina.','x²-stuðlarnir eru '+xa+' og '+xc+'.'],
   'x²-liðirnir gefa '+term(xpA,'x',2)+'.'),
  num('Finndu x-stuðulinn','Hvaða stuðull verður fyrir framan x eftir að líkum liðum hefur verið safnað?',varPlus,xpB,'Stuðull x',
   ['Margfaldaðu með föstu tölunum inni í svigunum.','Þú færð '+term(-xa*xb,'x')+' og '+term(-xc*xd,'x')+'.'],
   'x-stuðullinn er −'+xa*xb+' − '+xc*xd+' = '+fmt(xpB)+'.'),
  pick('Settu liðina saman','Veldu alla einfölduðu stæðuna.',varPlus,
   [poly(xpA,-xpB,0),poly(xpA,xpB,0),poly(0,xpA+xpB,0),poly(xa-xc,xpB,0)],1,
   ['x²-stuðullinn er '+xpA+' og x-stuðullinn er '+fmt(xpB)+'.','Ekki sameina x²-lið og x-lið.'],
   varPlus.join(' ')+' = '+poly(xpA,xpB,0)+'.'),
  pick('Mínus á milli margfeldanna','Margfaldaðu inn í báða sviga og einfaldaðu.',varMinus,
   [poly(xmA,xmB,0),poly(xmA,ya*yc-yd*yf,0),poly(ya*yb+yd*ye,xmB,0),poly(-xmA,xmB,0)],0,
   ['Seinni sviginn er margfaldaður með −'+term(yd,'x')+'.','Síðasti liðurinn verður jákvæður: (−'+term(yd,'x')+') · (−'+yf+') = '+term(yd*yf,'x')+'.'],
   varMinus.join(' ')+' = '+expr([[ya*yb,'x',2],[ya*yc,'x'],[-yd*ye,'x',2],[yd*yf,'x']])+' = '+poly(xmA,xmB,0)+'.'),
  pick('Neikvæðir x²-liðir','Einfaldaðu alla stæðuna. Fylgdu formerkjunum í hverju margfeldi.',varNegative,
   [poly(-xnA,xnB,0),poly(xnA,-xnB,0),poly(xnA,xnB,0),poly(-za+zc,xnB,0)],2,
   ['Fyrri sviginn gefur '+poly(-za,za*zb,0)+' og seinni margföldunin gefur '+poly(-zc,-zc*zd,0)+'.','Safnaðu x²-liðunum saman og x-liðunum sér.'],
   varNegative.join(' ')+' = '+poly(xnA,xnB,0)+'.')
 ]};
 const [d1,d2,d3,d4,d5,d6]=d.decimal,dec=[fmt(d1/10)+bracket(poly(0,d2,d3)),'+ '+fmt(d4/10)+bracket(poly(0,d5,-d6))],decB=(d1*d2+d4*d5)/10,decC=(d1*d3-d4*d6)/10;
 const [t1,t2,t3,t4,t5,t6,t7,t8,t9]=d.triple,triple=[t1+bracket(poly(0,t2,-t3,'z')),'− '+t4+bracket(poly(0,t5,-t6,'z')),'− '+t7+bracket(poly(0,t8,t9,'z'))],tripleB=t1*t2-t4*t5-t7*t8,tripleC=-t1*t3+t4*t6-t7*t9;
 const [dv1,dv2,dv3,dv4,dv5,dv6]=d.decimalVar,decimalVar=[term(dv1/10,'x')+bracket(poly(0,dv2,dv3)),'− '+term(dv4/100,'x')+'('+dv5+' − '+term(dv6,'x')+')'],dvA=dv1*dv2/10+dv4*dv6/100,dvB=dv1*dv3/10-dv4*dv5/100;
 const [n1,n2,n3,n4,n5]=d.negative,negative=['−'+n1+'(y − '+n2+')','+ '+fmt(n3/10)+bracket(poly(0,n4,n5/10,'y'))],negativeB=-n1+n3*n4/10,negativeC=n1*n2+n3*n5/100;
 const [q1,q2,q3,q4,q5,q6,q7]=d.mixed,mixed=[term(q1/10,'t')+'('+q2+' − '+term(q3,'t')+')','− '+fmt(q4/10)+bracket(poly(0,q5,-q6,'t')),'+ '+term(q7/10,'t')],mixedA=-q1*q3/10,mixedB=(q1*q2-q4*q5+q7)/10,mixedC=q4*q6/10;
 const [i1,i2,i3,i4,i5,i6]=d.implicit,implicit=[i1+'(a + '+fmt(i2/10)+')','− '+bracket(poly(0,i3,-i4,'a')),'+ '+fmt(i5/10)+'('+i6+' − a)'],implicitB=i1-i3-i5/10,implicitC=i1*i2/10+i4+i5*i6/10;
 const [j1,j2,j3,j4,j5,j6,j7,j8,j9]=d.tripleDecimal,tripleDecimal=[fmt(j1/10)+bracket(poly(0,j2,-j3,'m')),'+ '+fmt(j4/10)+bracket(poly(0,j5,j6,'m')),'− '+j7+bracket(poly(0,j8/10,-j9/10,'m'))],tdB=(j1*j2+j4*j5-j7*j8)/10,tdC=(-j1*j3+j4*j6+j7*j9)/10;
 const extra={name:'Aukaáskorun',optional:true,tasks:[
  num('Tugabrot sem margfaldarar','Margfaldaðu inn í svigana. Hvaða stuðull verður fyrir framan x?',dec,decB,'Stuðull x',
   ['Dreifireglan er sú sama þótt margfaldararnir séu tugabrot.','x-stuðlarnir eru '+fmt(d1/10)+' · '+d2+' og '+fmt(d4/10)+' · '+d5+'.'],
   'x-stuðullinn verður '+fmt(d1*d2/10)+' + '+fmt(d4*d5/10)+' = '+fmt(decB)+'.'),
  num('Fastaliðir með tugabrotum','Ljúktu við sömu stæðu. Hvaða fastaliður verður eftir?',dec,decC,'Fastaliður',
   ['Taktu formerki fastaliðanna með í margföldunina.','Reiknaðu '+fmt(d1/10)+' · '+d3+' − '+fmt(d4/10)+' · '+d6+'.'],
   dec.join(' ')+' = '+poly(0,decB,decC)+'.'),
  pick('Þrír svigar, tveir mínusar','Margfaldaðu inn í alla svigana og safnaðu líkum liðum.',triple,
   [poly(0,tripleB,-tripleC,'z'),poly(0,tripleB,tripleC,'z'),poly(0,t1*t2+t4*t5-t7*t8,tripleC,'z'),poly(0,tripleB,-t1*t3-t4*t6-t7*t9,'z')],1,
   ['Margfaldararnir eru '+t1+', −'+t4+' og −'+t7+'.','z-stuðullinn er '+t1*t2+' − '+t4*t5+' − '+t7*t8+'. Fastaliðurinn er −'+t1*t3+' + '+t4*t6+' − '+t7*t9+'.'],
   triple.join(' ')+' = '+poly(0,tripleB,tripleC,'z')+'.'),
  num('Hundraðshlutar og x²','Hvaða stuðull verður fyrir framan x² eftir einföldun?',decimalVar,dvA,'Stuðull x²',
   ['Taktu x²-liðina úr báðum margföldunum. Í seinni margfölduninni koma tvö mínusmerki saman.','Stuðullinn er '+fmt(dv1/10)+' · '+dv2+' + '+fmt(dv4/100)+' · '+dv6+'.'],
   decimalVar.join(' ')+' = '+poly(dvA,dvB,0)+'.'),
  pick('Neikvæður margfaldari fremst','Einfaldaðu. Margfaldaðu með öllum liðum, líka tugabrotinu inni í seinni sviganum.',negative,
   [poly(0,negativeB,-negativeC,'y'),poly(0,n1+n3*n4/10,negativeC,'y'),poly(0,negativeB,-n1*n2+n3*n5/100,'y'),poly(0,negativeB,negativeC,'y')],3,
   ['−'+n1+' · (−'+n2+') gefur +'+n1*n2+'.','Seinni fastaliðurinn er '+fmt(n3/10)+' · '+fmt(n5/10)+' = '+fmt(n3*n5/100)+'.'],
   negative.join(' ')+' = '+poly(0,negativeB,negativeC,'y')+'.'),
  num('Þrír flokkar liða','Finndu stuðul t. Haltu t²-liðnum og fastaliðnum til hliðar í þessu skrefi.',mixed,mixedB,'Stuðull t',
   ['Það kemur t-liður úr báðum margföldununum og einn er þegar utan sviga.','Stuðlasumman er '+fmt(q1*q2/10)+' − '+fmt(q4*q5/10)+' + '+fmt(q7/10)+'.'],
   'Stuðull t er '+fmt(mixedB)+'. t²-stuðullinn er '+fmt(mixedA)+' og fastaliðurinn er '+fmt(mixedC)+'.'),
  pick('Settu alla liðina saman','Veldu alla einfaldaða stæðuna.',mixed,
   [poly(-mixedA,mixedB,mixedC,'t'),poly(mixedA,-mixedB,mixedC,'t'),poly(mixedA,mixedB,mixedC,'t'),poly(mixedA,mixedB,-mixedC,'t')],2,
   ['Flokkaðu t²-liði, t-liði og fastaliði.','Úr fyrri sviganum fæst '+poly(mixedA,q1*q2/10,0,'t')+'. Úr þeim seinni fæst '+poly(0,-q4*q5/10,mixedC,'t')+'.'],
   mixed.join(' ')+' = '+poly(mixedA,mixedB,mixedC,'t')+'.',{wideChoices:true}),
  pick('Mínusinn einn er margfaldarinn −1','Einfaldaðu stæðuna. Miðjusviginn hefur óskrifaðan margfaldara.',implicit,
   [poly(0,implicitB,implicitC,'a'),poly(0,i1+i3-i5/10,implicitC,'a'),poly(0,implicitB,i1*i2/10-i4+i5*i6/10,'a'),poly(0,i1-i3+i5/10,implicitC,'a')],0,
   ['Mínus fyrir framan miðjusvigann þýðir að allir liðir hans eru margfaldaðir með −1.','a-stuðullinn er '+i1+' − '+i3+' − '+fmt(i5/10)+'. Fastaliðurinn er '+fmt(i1*i2/10)+' + '+i4+' + '+fmt(i5*i6/10)+'.'],
   implicit.join(' ')+' = '+poly(0,implicitB,implicitC,'a')+'.'),
  pick('Lokaskref: þrjár margfaldanir','Margfaldaðu inn í alla svigana og safnaðu líkum liðum.',tripleDecimal,
   [poly(0,-tdB,tdC,'m'),poly(0,tdB,tdC,'m'),poly(0,(j1*j2+j4*j5+j7*j8)/10,tdC,'m'),poly(0,tdB,(-j1*j3+j4*j6-j7*j9)/10,'m')],1,
   ['Taktu margfaldarann með formerki inn í hvern sviga.','m-stuðullinn er '+fmt(j1*j2/10)+' + '+fmt(j4*j5/10)+' − '+fmt(j7*j8/10)+'. Fastaliðurinn er −'+fmt(j1*j3/10)+' + '+fmt(j4*j6/10)+' + '+fmt(j7*j9/10)+'.'],
   tripleDecimal.join(' ')+' = '+poly(0,tdB,tdC,'m')+'.')
 ]};
 return [basics,letters,two,variableTwo,extra];
}
