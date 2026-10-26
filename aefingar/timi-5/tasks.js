'use strict';
const variants=[
 {one:[4,6,8,5,21,8,3,30,4,18],plus:[2,9,5,4],minus:[6,3,2,5],cancel:[6,7],qadd:[3,4,5,7],qconst:[7,4,3,9],qcancel:[7,2],qdouble:12,qfront:[3,5,4],four:[32,3,6,7,2],long:[9,4,7,15,6,5],inner:[18,9,3,6,5,2],vanish:[3,5,13,4,2],advA:[8,5,2,3,3,6],advB:[7,8,4,3,2,5,6,2],advCancel:[-3,9,-2,8,-4,5,5,5,-3]},
 {one:[6,9,9,7,26,9,4,34,5,21],plus:[4,8,7,3],minus:[8,2,3,6],cancel:[8,9],qadd:[6,2,3,8],qconst:[8,5,2,11],qcancel:[9,3],qdouble:14,qfront:[2,7,5],four:[36,5,4,8,3],long:[11,5,8,14,8,6],inner:[22,10,4,8,7,3],vanish:[4,6,15,3,5],advA:[10,6,4,5,2,8],advB:[8,6,3,4,3,7,8,1],advCancel:[-4,11,-3,10,-5,7,6,6,-4]},
 {one:[8,7,12,8,28,11,5,41,6,24],plus:[5,11,8,6],minus:[9,5,4,8],cancel:[9,6],qadd:[7,5,4,6],qconst:[9,6,4,13],qcancel:[11,4],qdouble:16,qfront:[6,8,3],four:[48,6,7,9,4],long:[13,7,9,18,9,4],inner:[25,12,5,9,6,4],vanish:[5,7,18,6,4],advA:[12,7,5,4,4,9],advB:[10,9,5,3,4,6,7,2],advCancel:[-5,13,-4,12,-6,9,7,7,-5]}
];
function buildSections(seed){
 const d=variants[seed%variants.length],fmt=n=>String(n).replace('-','−');
 const term=(c,v='',p=1)=>(c<0?'−':'')+((v&&Math.abs(c)===1)?'':Math.abs(c))+(v?v+(p===2?'<sup>2</sup>':''):'');
 const expr=terms=>terms.filter(t=>t[0]!==0).map(([c,v,p],i)=>(i?(c<0?' − ':' + '):(c<0?'−':''))+term(Math.abs(c),v,p)).join('')||'0';
 const poly=(a,b,c,v='x')=>expr([[a,v,2],[b,v],[c,'']]);
 const bracket=s=>'('+s+')';
 const board=parts=>'<div class="equation bracket-equation">'+(Array.isArray(parts)?parts:[parts]).map(s=>'<span class="math-chunk">'+s+'</span>').join('')+'</div>';
 const num=(title,intro,parts,answer,label,hints,explain)=>({type:'number',title,intro,board:board(parts),answer,label,unit:'',inputHelp:'Skráðu aðeins tölu, með mínusmerki ef þarf.',hints,explain,wrong:'Skoðaðu merkið fyrir framan hvorn sviga. Mínus þar skiptir um formerki á öllum liðunum innan hans. Safnaðu svo líkum liðum.'});
 const pick=(title,intro,parts,options,correct,hints,explain,extra={})=>({type:'choices',title,intro,board:board(parts),options,correct,hints,explain,wrong:'Plús fyrir framan sviga heldur formerkjunum óbreyttum. Mínus fyrir framan sviga skiptir um formerki á hverjum lið innan hans.',...extra});
 const [a,b,c,e,A,B,C,D,E,F]=d.one,first=term(a,'x')+' + (x − '+b+')',second=term(c,'x')+' − ('+e+' − x)',third=A+' − ('+B+' − '+term(C,'x')+')',fourth=D+' − ('+term(E,'x')+' + '+F+')';
 const basics={name:'Plús og mínus fyrir framan sviga',tasks:[
  pick('Plús heldur formerkjunum','Veldu rétta stæðu án sviga. Ekki safna liðum strax.',first,
   [expr([[a,'x'],[1,'x'],[-b,'']]),expr([[a,'x'],[-1,'x'],[-b,'']]),expr([[a,'x'],[1,'x'],[b,'']])],0,
   ['Plús stendur fyrir framan svigann. Þá haldast formerkin innan hans óbreytt.','+x helst +x og −'+b+' helst −'+b+'.'],
   first+' = '+expr([[a,'x'],[1,'x'],[-b,'']])+'.',{wideChoices:true}),
  num('Safnaðu x-liðunum','Hvaða stuðull verður fyrir framan x þegar stæðan er einfölduð?',first,a+1,'Stuðull x',
   ['Eftir að sviginn er fjarlægður eru x-liðirnir '+term(a,'x')+' og x.','Stuðull x er 1. Leggðu '+a+' og 1 saman.'],
   first+' = '+poly(0,a+1,-b)+'. Stuðull x er '+(a+1)+'.'),
  pick('Mínus breytir báðum formerkjum','Veldu rétta stæðu án sviga. Gættu sérstaklega að liðnum −x inni í sviganum.',second,
   [expr([[c,'x'],[-e,''],[-1,'x']]),expr([[c,'x'],[-e,''],[1,'x']]),expr([[c,'x'],[e,''],[1,'x']])],1,
   ['Að draga allan svigann frá jafngildir því að margfalda hvern lið hans með −1.','Talan '+e+' verður −'+e+' og −x verður +x.'],
   second+' = '+expr([[c,'x'],[-e,''],[1,'x']])+'.',{wideChoices:true}),
  pick('Einfaldaðu eftir að sviginn er farinn','Safnaðu líkum liðum og veldu alla niðurstöðuna.',second,
   [poly(0,c-1,-e),poly(0,c+1,e),poly(0,c+1,-e),poly(0,c-1,e)],2,
   ['Stæðan án sviga er '+expr([[c,'x'],[-e,''],[1,'x']])+'.','Leggðu stuðlana '+c+' og 1 saman. Fastaliðurinn er −'+e+'.'],
   second+' = '+poly(0,c+1,-e)+'.'),
  num('Fastaliður fyrst','Hvaða stuðull verður fyrir framan x eftir að sviganum er eytt?',third,C,'Stuðull x',
   ['Mínusinn fyrir framan svigann hefur áhrif á báða liðina.','Liðurinn −'+term(C,'x')+' inni í sviganum verður +'+term(C,'x')+' utan hans.'],
   third+' = '+A+' − '+B+' + '+term(C,'x')+' = '+poly(0,C,A-B)+'.'),
  pick('Sameinaðu fastaliðina','Ljúktu við einföldun stæðunnar.',third,
   [poly(0,-C,A-B),poly(0,C,A+B),poly(0,-C,A+B),poly(0,C,A-B)],3,
   ['Eftir að sviginn er farinn er stæðan '+A+' − '+B+' + '+term(C,'x')+'.','Fastaliðirnir gefa '+A+' − '+B+'.'],
   third+' = '+poly(0,C,A-B)+'.'),
  pick('Mínus fyrir framan summu','Hvað fæst þegar báðir liðir svigans eru dregnir frá?',fourth,
   [poly(0,-E,D-F),poly(0,-E,D+F),poly(0,E,D-F),poly(0,E,D+F)],0,
   ['Báðir liðirnir inni í sviganum hafa plúsmerki. Báðir fá mínus þegar sviganum er eytt.','Stæðan verður '+D+' − '+term(E,'x')+' − '+F+'.'],
   fourth+' = '+poly(0,-E,D-F)+'.')
 ]};
 const [p1,p2,p3,p4]=d.plus,pExpr=[bracket(poly(0,p1,p2)),'+ '+bracket(poly(0,p3,-p4))];
 const [m1,m2,m3,m4]=d.minus,mExpr=[bracket(poly(0,m1,m2)),'− '+bracket(poly(0,m3,-m4))],mExpanded=expr([[m1,'x'],[m2,''],[-m3,'x'],[m4,'']]);
 const [k,l]=d.cancel,yExpr=['(y + '+k+')','+ (y − '+k+')'],zExpr=['(z + '+l+')','− (z − '+l+')'];
 const pairs={name:'Tveir svigar',tasks:[
  num('Leggðu saman tvær stæður','Hvaða stuðull verður fyrir framan x eftir einföldun?',pExpr,p1+p3,'Stuðull x',
   ['Fyrri sviginn stendur fremst og plús er á undan þeim seinni. Engin formerki breytast.','x-liðirnir eru '+term(p1,'x')+' og '+term(p3,'x')+'.'],
   pExpr.join(' ')+' = '+poly(0,p1+p3,p2-p4)+'.'),
  pick('Dragðu seinni svigann frá','Veldu rétta stæðu eftir að báðum svigum hefur verið eytt.',mExpr,
   [expr([[m1,'x'],[m2,''],[-m3,'x'],[-m4,'']]),expr([[m1,'x'],[-m2,''],[-m3,'x'],[m4,'']]),mExpanded],2,
   ['Formerki í fyrri sviganum haldast. Mínus fyrir framan þann seinni breytir öllum formerkjum þar.','Seinni sviginn leggur til −'+term(m3,'x')+' og +'+m4+'.'],
   mExpr.join(' ')+' = '+mExpanded+'.',{wideChoices:true}),
  pick('Safnaðu hvorum hópi fyrir sig','Veldu einfaldaða stæðu.',mExpr,
   [poly(0,m1-m3,m2-m4),poly(0,m1-m3,m2+m4),poly(0,m1+m3,m2+m4),poly(0,m1+m3,m2-m4)],1,
   ['Stæðan án sviga er '+mExpanded+'.','Stuðull x er '+m1+' − '+m3+' og fastaliðurinn er '+m2+' + '+m4+'.'],
   mExpr.join(' ')+' = '+poly(0,m1-m3,m2+m4)+'.'),
  num('Fastaliðirnir eyðast út','Einfaldaðu stæðuna. Hvaða stuðull verður eftir fyrir framan y?',yExpr,2,'Stuðull y',
   ['Talan '+k+' og talan −'+k+' gefa samtals 0.','Eftir standa y + y. Hver liður hefur stuðulinn 1.'],
   yExpr.join(' ')+' = y + y + '+k+' − '+k+' = 2y.'),
  num('Bókstafaliðirnir eyðast út','Einfaldaðu alla stæðuna. Svarið er tala án bókstafs.',zExpr,2*l,'Svar',
   ['Þegar seinni sviganum er eytt verður stæðan z + '+l+' − z + '+l+'.','z − z = 0. Leggðu fastaliðina saman.'],
   zExpr.join(' ')+' = '+(2*l)+'. Bókstafaliðirnir eyðast út en fastaliðirnir leggjast saman.')
 ]};
 const [q1,q2,q3,q4]=d.qadd,addQ=[bracket(poly(q1,q2,0)),'+ '+bracket(poly(q3,q4,0))];
 const [r1,r2,r3,r4]=d.qconst,constQ=[bracket(poly(r1,0,r2,'y')),'− '+bracket(poly(r3,0,r4,'y'))];
 const [t1,t2]=d.qcancel,cancelQ=[bracket(poly(1,t1,0,'t')),'− '+bracket(expr([[t2,'t'],[1,'t',2]]))];
 const n=d.qdouble,doubleQ=['(t<sup>2</sup> − '+n+')','− ('+n+' − t<sup>2</sup>)'];
 const [s1,s2,s3]=d.qfront,frontQ=['('+s1+' − s<sup>2</sup>)','+ ('+s2+' + '+term(s3,'s',2)+')'];
 const squared={name:'Svigar með veldum',tasks:[
  pick('x og x² haldast aðskilin','Eyddu svigunum og safnaðu síðan líkum liðum.',addQ,
   [poly(q1+q3,q2-q4,0),term(q1+q2+q3+q4,'x',2),poly(q1-q3,q2+q4,0),poly(q1+q3,q2+q4,0)],3,
   ['Plús er á milli sviganna, svo engin formerki breytast.','Leggðu x²-stuðlana saman og síðan x-stuðlana. x og x² eru ekki líkir liðir.'],
   addQ.join(' ')+' = '+poly(q1+q3,q2+q4,0)+'.'),
  num('Passaðu fastaliðinn','Hvaða fastaliður verður eftir þegar stæðan er einfölduð?',constQ,r2-r4,'Fastaliður',
   ['Mínus fyrir framan seinni svigann breytir líka formerki fastaliðarins.','Fastaliðirnir verða '+r2+' − '+r4+'.'],
   constQ.join(' ')+' = '+poly(r1-r3,0,r2-r4,'y')+'. Fastaliðurinn er '+fmt(r2-r4)+'.'),
  num('t²-liðirnir eyðast út','Hvaða stuðull verður eftir fyrir framan t?',cancelQ,t1-t2,'Stuðull t',
   ['Eftir að seinni sviganum er eytt fæst −'+term(t2,'t')+' − t².','t² − t² = 0. Stuðlarnir fyrir framan t gefa '+t1+' − '+t2+'.'],
   cancelQ.join(' ')+' = '+term(t1-t2,'t')+'.'),
  pick('Mínusinn snýr báðum formerkjum','Einfaldaðu stæðuna. Ekki láta röð liðanna rugla þig.',doubleQ,
   [poly(2,0,-2*n,'t'),fmt(-2*n),poly(2,0,0,'t'),poly(2,0,2*n,'t')],0,
   ['Seinni sviginn gefur −'+n+' + t² þegar mínusinn hefur verið tekinn inn.','Stæðan verður t² − '+n+' − '+n+' + t².'],
   doubleQ.join(' ')+' = '+poly(2,0,-2*n,'t')+'.'),
  pick('Neikvæður veldisliður fremst','Einfaldaðu. Fyrri s²-liðurinn hefur stuðulinn −1.',frontQ,
   [poly(s3+1,0,s1+s2,'s'),poly(s3-1,0,s1-s2,'s'),poly(s3-1,0,s1+s2,'s'),poly(1-s3,0,s1+s2,'s')],2,
   ['Plús fyrir framan seinni sviga heldur formerkjunum óbreyttum.','s²-stuðullinn er −1 + '+s3+'. Fastaliðirnir gefa '+s1+' + '+s2+'.'],
   frontQ.join(' ')+' = '+poly(s3-1,0,s1+s2,'s')+'.')
 ]};
 const [v,a1,b1,a2,b2]=d.four,signs=[[-1,1],[1,1],[-1,-1],[1,-1]],answers=signs.map(([u,w])=>poly(0,u*a1+w*a2,v-u*b1+w*b2));
 const both={name:'Merkin fyrir framan svigana',tasks:signs.map(([u,w],i)=>{
  const raw=[String(v),(u===1?'+ ':'− ')+'('+term(a1,'x')+' − '+b1+')',(w===1?'+ ':'− ')+'('+term(a2,'x')+' + '+b2+')'];
  const expanded=expr([[v,''],[u*a1,'x'],[-u*b1,''],[w*a2,'x'],[w*b2,'']]);
  return pick(['Mínus, síðan plús','Plús fyrir framan báða sviga','Mínus fyrir framan báða sviga','Plús, síðan mínus'][i],
   'Einfaldaðu alla stæðuna. Athugaðu merkið fyrir framan hvorn sviga sérstaklega.',raw,
   [answers[2],answers[0],answers[3],answers[1]],[1,3,0,2][i],
   ['Í fyrri sviganum '+(u===1?'haldast formerkin óbreytt.':'breytast bæði formerkin.')+' Í þeim seinni '+(w===1?'haldast formerkin óbreytt.':'breytast bæði formerkin.'),
    'Stæðan án sviga er '+expanded+'.'],
   raw.join(' ')+' = '+expanded+' = '+answers[i]+'.');
 })};
 const [la,lb,lc,ld,le,lf]=d.long,longParts=[term(la,'x'),'− ('+term(lb,'x')+' − '+lc+')','+ '+ld,'− ('+term(le,'x')+' + '+lf+')'],longX=la-lb-le,longC=lc+ld-lf;
 const [ia,ib,ic,id,ie,ig]=d.inner,innerParts=[String(ia),'− ('+term(ib,'z')+' − '+term(ic,'z')+')','+ '+id,'− ('+ie+' − '+term(ig,'z')+')'],innerX=-ib+ic+ig,innerC=ia+id-ie;
 const [va,vb,vc,vd,ve]=d.vanish,vanishParts=[bracket(poly(0,va+vb,vc,'t')),'− '+bracket(poly(0,va,-vd,'t')),'− '+bracket(poly(0,vb,ve,'t'))],vanishC=vc+vd-ve;
 const [aa,ab,ac,ad,ae,af]=d.advA,advParts=[bracket(poly(aa,ab,0)),'− '+bracket(poly(ac,-ad,0)),'+ '+bracket(poly(ae,-af,0))],advA=aa-ac+ae,advB=ab+ad-af;
 const [ba,bb,bc,bd,be,bf,bg,bh]=d.advB,threeParts=[bracket(poly(ba,-bb,bc,'y')),'− '+bracket(poly(bd,be,-bf,'y')),'+ '+bracket(expr([[bg,''],[-bh,'y',2]]))],threeA=ba-bd-bh,threeB=-bb-be,threeC=bc+bf+bg;
 const [ca,cb,cc,cd,ce,cf,cg,ch,ci]=d.advCancel,allCancelParts=[bracket(poly(ca,cb,cc,'z')),'+ '+bracket(poly(cd,ce,cf,'z')),'− '+bracket(poly(cg,ch,ci,'z'))],allC=cc+cf-ci;
 const extra={name:'Aukaáskorun',optional:true,tasks:[
  pick('Fleiri svigar, sömu reglur','Eyddu svigunum og safnaðu líkum liðum. Skrifaðu gjarnan milliskref á blað.',longParts,
   [poly(0,la-lb+le,longC),poly(0,longX,lc+ld+lf),poly(0,longX,longC),poly(0,longX,-lc+ld-lf)],2,
   ['Báðir svigarnir eru dregnir frá. Skiptu um formerki á öllum liðum þeirra.','Stæðan verður '+expr([[la,'x'],[-lb,'x'],[lc,''],[ld,''],[-le,'x'],[-lf,'']])+'.'],
   'x-stuðullinn er '+la+' − '+lb+' − '+le+' = '+fmt(longX)+'. Fastaliðurinn er '+lc+' + '+ld+' − '+lf+' = '+longC+'. Niðurstaðan er '+poly(0,longX,longC)+'.'),
  num('Líkir liðir inni í sviga','Hvaða stuðull verður fyrir framan z eftir alla einföldunina?',innerParts,innerX,'Stuðull z',
   ['Þú mátt fyrst reikna '+term(ib,'z')+' − '+term(ic,'z')+' inni í fyrri sviganum. Mínus stendur fyrir framan allan svigann.','z-liðirnir utan sviga verða −'+term(ib,'z')+' + '+term(ic,'z')+' + '+term(ig,'z')+'.'],
   innerParts.join(' ')+' = '+poly(0,innerX,innerC,'z')+'.'),
  num('Enginn bókstafur eftir','Einfaldaðu alla stæðuna. Bókstafaliðirnir eyðast út.',vanishParts,vanishC,'Svar',
   ['Stuðull t verður '+(va+vb)+' − '+va+' − '+vb+' = 0.','Fastaliðirnir verða '+vc+' + '+vd+' − '+ve+'.'],
   vanishParts.join(' ')+' = '+vanishC+'. Þótt stæðan innihaldi t er gildi hennar alltaf '+vanishC+'.'),
  pick('Þrír svigar með x og x²','Einfaldaðu. Mínus er aðeins fyrir framan miðjusvigann.',advParts,
   [poly(advA,ab-ad-af,0),poly(advA,advB,0),poly(aa+ac+ae,advB,0),term(advA+advB,'x',2)],1,
   ['Í miðjusviganum verður '+term(ac,'x',2)+' að −'+term(ac,'x',2)+' og −'+term(ad,'x')+' verður +'+term(ad,'x')+'.','x²-stuðlarnir gefa '+aa+' − '+ac+' + '+ae+'. x-stuðlarnir gefa '+ab+' + '+ad+' − '+af+'.'],
   advParts.join(' ')+' = '+poly(advA,advB,0)+'.'),
  num('Byrjaðu á y²-liðunum','Hvaða stuðull verður fyrir framan y² eftir einföldun?',threeParts,threeA,'Stuðull y²',
   ['Taktu aðeins y²-liðina saman í þessu skrefi.','Stuðlarnir verða '+ba+' − '+bd+' − '+bh+'.'],
   'y²-liðirnir verða '+term(threeA,'y',2)+'. Gættu síðan að y-liðum og fastaliðum.'),
  pick('Settu þrjá hópa saman','Ljúktu við alla einföldun stæðunnar.',threeParts,
   [poly(threeA,-bb+be,threeC,'y'),poly(threeA,threeB,bc-bf+bg,'y'),poly(ba+bd-bh,threeB,threeC,'y'),poly(threeA,threeB,threeC,'y')],3,
   ['Mínus fyrir framan miðjusvigann breytir formerkjum allra þriggja liðanna.','y-stuðullinn er −'+bb+' − '+be+'. Fastaliðirnir gefa '+bc+' + '+bf+' + '+bg+'.'],
   threeParts.join(' ')+' = '+poly(threeA,threeB,threeC,'y')+'.',{wideChoices:true}),
  num('Bæði z² og z eyðast út','Einfaldaðu alla stæðuna. Hver verður talan sem stendur eftir?',allCancelParts,allC,'Svar',
   ['Athugaðu fyrst: '+fmt(ca)+' + '+cd+' − '+cg+' = 0 og '+cb+' − '+(-ce)+' − '+ch+' = 0.','Fastaliðirnir eru '+fmt(cc)+' + '+cf+' + '+(-ci)+'. Mínus fyrir framan síðasta sviga breytir '+fmt(ci)+' í +'+(-ci)+'.'],
   'Allir z²-liðir og z-liðir eyðast út. Eftir stendur '+fmt(cc)+' + '+cf+' + '+(-ci)+' = '+allC+'.')
 ]};
 return [basics,pairs,squared,both,extra];
}
