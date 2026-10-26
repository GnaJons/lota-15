'use strict';
const variants=[
 {start:[4,5,3],subtract:[11,4,5],plusNeg:[14,3,6],minusNeg:[30,6,4],pairPlus:[6,2,5,3,4],pairMinus:[8,3,5,2,3],linear:[2,4,6,3],quadratic:[4,2,5,4],value:2,practice:[[5,3,2,4],[14,7,5,3],[5,3,2,4],[2,3,5,4,2]],pi:[3,8,9],piPowers:[3,4,5],twoVars:[3,4,4,5],order:[7,2,3,5,4],fraction:[4,3,3,3],decimal:[7,15,2,3,4],last:[7,3,2,5,4,2,2]},
 {start:[6,7,4],subtract:[13,5,4],plusNeg:[18,4,5],minusNeg:[25,8,3],pairPlus:[7,3,6,4,3],pairMinus:[9,4,6,3,2],linear:[3,5,7,4],quadratic:[6,4,3,2],value:4,practice:[[6,4,3,5],[15,8,6,2],[4,5,3,2],[4,2,3,3,5]],pi:[4,7,11],piPowers:[2,5,6],twoVars:[4,2,6,3],order:[9,4,2,3,5],fraction:[5,4,3,2],decimal:[8,12,3,5,6],last:[8,2,3,3,6,4,3]},
 {start:[5,8,6],subtract:[16,3,7],plusNeg:[20,5,7],minusNeg:[35,7,5],pairPlus:[8,4,7,5,2],pairMinus:[12,2,7,4,4],linear:[4,3,8,5],quadratic:[7,3,6,5],value:5,practice:[[7,5,4,6],[18,9,7,4],[6,2,4,3],[5,3,2,2,4]],pi:[6,9,12],piPowers:[4,5,6],twoVars:[5,3,3,4],order:[11,3,4,6,2],fraction:[3,2,5,3],decimal:[9,14,4,6,8],last:[6,4,5,2,7,3,4]}
];
function buildSections(seed){
 const d=variants[seed%variants.length],round=n=>Math.round(n*1e8)/1e8,fmt=n=>String(round(n)).replace('-','−').replace('.',','),fixed=n=>n.toFixed(2).replace('.',',');
 const term=(c,v='',p=1)=>(c<0?'−':'')+((v&&Math.abs(round(c))===1)?'':fmt(Math.abs(c)))+(v?v+(p===2?'<sup>2</sup>':''):'');
 const expr=ts=>ts.filter(t=>round(t[0])!==0).map(([c,v,p],i)=>(i?(c<0?' − ':' + '):(c<0?'−':''))+term(Math.abs(c),v,p)).join('')||'0';
 const poly=(a,b,c,v='x')=>expr([[a,v,2],[b,v],[c,'']]);
 const par=n=>n<0?'('+fmt(n)+')':fmt(n);
 const bracket=s=>'('+s+')';
 const frac=(a,b)=>'<span class="fraction"><span>'+a+'</span><span>'+b+'</span></span>';
 const board=(parts,givens={})=>'<div class="substitution-board"><div class="equation bracket-equation">'+(Array.isArray(parts)?parts:[parts]).map(s=>'<span class="math-chunk">'+s+'</span>').join('')+'</div>'+(Object.keys(givens).length?'<div class="given-values">'+Object.entries(givens).map(([v,n])=>'<span>'+v+' = '+fmt(n)+'</span>').join('')+'</div>':'')+'</div>';
 const num=(title,intro,parts,givens,answer,hints,explain,extra={})=>({type:'number',title,intro,board:board(parts,givens),answer:round(answer),label:'Gildi',unit:'',inputHelp:'Skráðu tölu. Nota má kommu eða punkt í tugabroti og mínusmerki ef þarf.',hints,explain,wrong:'Settu uppgefið gildi inn fyrir hvert tilvik bókstafsins. Notaðu sviga utan um neikvæð gildi og fylgdu röð reikniaðgerða.',...extra});
 const pick=(title,intro,parts,givens,options,correct,hints,explain,extra={})=>({type:'choices',title,intro,board:board(parts,givens),options,correct,hints,explain,wrong:'Skoðaðu formerkin og hvað margfaldast saman. Ef þú einfaldar fyrst skaltu halda ólíkum bókstafahlutum aðskildum.',...extra});
 const [a,b,x]=d.start,first=poly(0,a,b),[c,e,y]=d.subtract,sub=c+' − '+term(e,'y'),[f,g,n]=d.plusNeg,pn=f+' + '+term(g,'x'),[h,j,k]=d.minusNeg,mn=h+' − '+term(j,'y');
 const substitution={name:'Settu töluna inn',tasks:[
  pick('Skiptu bókstafnum út fyrir töluna','Hvaða útreikningur fæst þegar þú setur uppgefið gildi inn fyrir x?',first,{x},
   [a+' + '+x+' + '+b,a+' · '+x+' + '+b,a+' · '+b+' + '+x],1,
   [term(a,'x')+' merkir '+a+' margfaldað með x.','Skiptu x út fyrir '+x+'. Stuðullinn '+a+' og fastaliðurinn '+b+' haldast óbreyttir.'],
   first+' verður '+a+' · '+x+' + '+b+'.',{wideChoices:true}),
  num('Reiknaðu gildið','Margfaldaðu áður en þú leggur saman.',first,{x},a*x+b,
   ['Settu '+x+' inn fyrir x.','Reiknaðu '+a+' · '+x+' fyrst og leggðu síðan '+b+' við.'],
   a+' · '+x+' + '+b+' = '+a*x+' + '+b+' = '+(a*x+b)+'.'),
  num('Svarið getur verið neikvætt','Reiknaðu gildið þegar y hefur uppgefið gildi.',sub,{y},c-e*y,
   ['Margföldunin kemur á undan frádrættinum.','Reiknaðu '+c+' − ('+e+' · '+y+').'],
   c+' − '+e*y+' = '+fmt(c-e*y)+'.'),
  num('Settu neikvætt gildi inn','Notaðu sviga utan um neikvæðu töluna þegar þú skrifar útreikninginn.',pn,{x:-n},f-g*n,
   ['x er −'+n+', svo margfeldið er '+g+' · (−'+n+').','Margfeldið verður neikvætt. Leggðu það við '+f+'.'],
   f+' + '+g+' · (−'+n+') = '+f+' − '+g*n+' = '+fmt(f-g*n)+'.'),
  pick('Mínus og neikvætt gildi','Veldu rétta innsetningu. Ekki reikna allt strax.',mn,{y:-k},
   [h+' − '+j+' · '+k,'('+h+' − '+j+') · (−'+k+')',h+' − '+j+' · (−'+k+')'],2,
   ['Mínusmerkið fyrir framan liðinn helst á sínum stað.','Í stað y kemur talan −'+k+'. Hún er einn þáttur í margfeldinu.'],
   'Innsetningin er '+h+' − '+j+' · (−'+k+').',{wideChoices:true}),
  num('Dragðu neikvætt margfeldi frá','Reiknaðu gildið. Passaðu bæði mínusmerkin.',mn,{y:-k},h+j*k,
   ['Margfeldið '+j+' · (−'+k+') er −'+j*k+'.','Að draga neikvæða tölu frá jafngildir því að leggja jákvæða tölu við.'],
   h+' − (−'+j*k+') = '+h+' + '+j*k+' = '+(h+j*k)+'.')
 ]};
 const [p1,p2,p3,p4,p5]=d.pairPlus,plus=[bracket(poly(0,p1,p2)),'+ ('+p3+' + '+term(p4,'x')+')'],pb=p1+p4,pc=p2+p3;
 const [m1,m2,m3,m4,m5]=d.pairMinus,minus=['('+m1+' + '+term(m2,'y')+')','− ('+m3+' − '+term(m4,'y')+')'],mb=m2+m4,mc=m1-m3;
 const simplifyFirst={name:'Einfaldaðu fyrst',tasks:[
  pick('Safnaðu líkum liðum','Einfaldaðu stæðuna áður en tölugildi er sett inn.',plus,{},
   [poly(0,pb,pc),poly(0,p1-p4,pc),poly(0,pb,p2-p3),term(pb+pc,'x')],0,
   ['Plús fyrir framan seinni svigann heldur formerkjunum óbreyttum.','x-stuðlarnir eru '+p1+' og '+p4+'. Fastaliðirnir eru '+p2+' og '+p3+'.'],
   plus.join(' ')+' = '+poly(0,pb,pc)+'.'),
  num('Notaðu einfölduðu stæðuna','Reiknaðu gildið fyrir uppgefið x.',plus,{x:p5},pb*p5+pc,
   ['Stæðan einfaldast í '+poly(0,pb,pc)+'.','Reiknaðu '+pb+' · '+p5+' + '+pc+'.'],
   pb+' · '+p5+' + '+pc+' = '+(pb*p5+pc)+'.'),
  pick('Mínus fyrir framan sviga','Einfaldaðu. Taktu mínusmerkið inn á báða liði seinni svigans.',minus,{},
   [poly(0,m2-m4,mc,'y'),poly(0,mb,m1+m3,'y'),poly(0,-mb,mc,'y'),poly(0,mb,mc,'y')],3,
   ['Seinni sviginn verður −'+m3+' + '+term(m4,'y')+'.','Sameinaðu '+term(m2,'y')+' og '+term(m4,'y')+'. Fastaliðirnir gefa '+m1+' − '+m3+'.'],
   minus.join(' ')+' = '+poly(0,mb,mc,'y')+'.'),
  num('Neikvætt gildi í einfaldaða stæðu','Reiknaðu gildið þegar y er neikvætt.',minus,{y:-m5},-mb*m5+mc,
   ['Einfölduð stæða er '+poly(0,mb,mc,'y')+'.','Settu −'+m5+' inn fyrir y: '+mb+' · (−'+m5+') + '+mc+'.'],
   fmt(-mb*m5)+' + '+mc+' = '+fmt(-mb*m5+mc)+'.')
 ]};
 const [l1,l2,l3,l4]=d.linear,linear=['(y + '+l1+')','+ '+bracket(poly(0,l2,l3,'y'))],lb=1+l2,lc=l1+l3;
 const [q1,q2,q3,q4]=d.quadratic,quadratic=[term(q1,'x',2),'− '+term(q2,'x')+'('+q3+' − x)'],qa=q1+q2,qb=-q2*q3;
 const powers={name:'Einföldun og veldi',tasks:[
  pick('Einn y-liður og fleiri y-liðir','Einfaldaðu stæðuna.',linear,{},
   [poly(0,l2,lc,'y'),poly(0,lb,lc,'y'),poly(0,lb,l1-l3,'y'),term(lb+lc,'y')],1,
   ['Stuðull fyrsta y-liðarins er 1.','Leggðu saman 1 og '+l2+' fyrir y-liðina og '+l1+' og '+l3+' fyrir fastaliðina.'],
   linear.join(' ')+' = '+poly(0,lb,lc,'y')+'.'),
  num('Finndu gildi stæðunnar','Settu uppgefið gildi inn eftir einföldun.',linear,{y:l4},lb*l4+lc,
   ['Notaðu '+poly(0,lb,lc,'y')+'.','Reiknaðu '+lb+' · '+l4+' + '+lc+'.'],
   lb+' · '+l4+' + '+lc+' = '+(lb*l4+lc)+'.'),
  pick('Margfaldaðu og safnaðu','Einfaldaðu stæðuna með x² og x.',quadratic,{},
   [poly(q1-q2,qb,0),poly(qa,-qb,0),poly(qa,qb,0),term(qa+qb,'x',2)],2,
   ['Margfaldaðu allan liðinn −'+term(q2,'x')+' inn í svigann.','Þú færð '+term(qb,'x')+' + '+term(q2,'x',2)+' úr margfölduninni.'],
   quadratic.join(' ')+' = '+poly(qa,qb,0)+'.'),
  num('Veldið kemur á undan margföldun','Reiknaðu gildið. Mundu að x² þýðir x margfaldað með sjálfu sér.',quadratic,{x:q4},qa*q4*q4+qb*q4,
   ['Einfaldaða stæðan er '+poly(qa,qb,0)+'.','Byrjaðu á '+q4+'² = '+q4*q4+'. Margfaldaðu síðan með stuðlunum.'],
   qa+' · '+q4*q4+' − '+(-qb)+' · '+q4+' = '+qa*q4*q4+' − '+(-qb*q4)+' = '+(qa*q4*q4+qb*q4)+'.')
 ]};
 const value=d.value,[r1,r2,r3,r4]=d.practice[0],practice1=[bracket(poly(0,r1,-r2)),'− '+bracket(poly(0,r3,r4))],rB=r1-r3,rC=-r2-r4;
 const [s1,s2,s3,s4]=d.practice[1],practice2=['('+s1+' − '+term(s2,'x')+')','− ('+s3+' − '+term(s4,'x')+')'],sB=-s2+s4,sC=s1-s3;
 const [t1,t2,t3,t4]=d.practice[2],practice3=[t1+'(x + '+t2+')','− '+t3+'(x + '+t4+')'],tB=t1-t3,tC=t1*t2-t3*t4;
 const [u1,u2,u3,u4,u5]=d.practice[3],practice4=[term(u1,'x')+bracket(poly(0,u2,u3)),'+ x'+bracket(poly(0,u4,-u5))],uA=u1*u2+u4,uB=u1*u3-u5;
 const practice={name:'Prófaðu aðferðina',tasks:[
  num('Svigar og frádráttur','Einfaldaðu og reiknaðu gildið fyrir uppgefið x.',practice1,{x:value},rB*value+rC,
   ['Skiptu um formerki á báðum liðum seinni svigans.','Stæðan einfaldast í '+poly(0,rB,rC)+'. Settu síðan '+value+' inn fyrir x.'],
   poly(0,rB,rC)+' gefur '+rB+' · '+value+' − '+(-rC)+' = '+fmt(rB*value+rC)+'.'),
  num('Fastaliðir fremst','Reiknaðu gildið. Mínus fyrir framan sviga nær til allra liða hans.',practice2,{x:value},sB*value+sC,
   ['Seinni sviginn verður −'+s3+' + '+term(s4,'x')+'.','Einfölduð stæða er '+poly(0,sB,sC)+'.'],
   fmt(sB)+' · '+value+' + '+sC+' = '+fmt(sB*value+sC)+'.'),
  num('Tvær margfaldanir','Margfaldaðu inn í svigana, safnaðu líkum liðum og reiknaðu gildið.',practice3,{x:value},tB*value+tC,
   ['Margfaldaðu '+t1+' inn í fyrri svigann og −'+t3+' inn í þann seinni.','Stæðan einfaldast í '+poly(0,tB,tC)+'.'],
   tB+' · '+value+(tC?' + '+fmt(tC):'')+' = '+fmt(tB*value+tC)+'.'),
  num('Bókstafur fyrir framan báða sviga','Reiknaðu gildið. Haltu x²-liðum og x-liðum aðskildum við einföldun.',practice4,{x:value},uA*value*value+uB*value,
   ['x · x = x². Margfaldaðu með báðum liðum hvers sviga.','Einfölduð stæða er '+poly(uA,uB,0)+'. Reiknaðu '+value+'² áður en þú margfaldar með '+uA+'.'],
   uA+' · '+value*value+' + '+uB+' · '+value+' = '+(uA*value*value+uB*value)+'.')
 ]};
 const piSum=d.pi.reduce((a,b)=>a+b,0),piExpr=expr(d.pi.map(n=>[n,'π'])),piApprox=Math.round(piSum*Math.PI*100)/100;
 const piSquares=d.piPowers.reduce((a,b)=>a+b*b,0),piPowerExpr=d.piPowers.map(n=>'π · '+n+'<sup>2</sup>').join(' + '),piPowerApprox=Math.round(piSquares*Math.PI*100)/100;
 const [va,vb,vx,vy]=d.twoVars,twoVars=term(va,'x',2)+' + '+term(vb,'y',2),twoValue=va*vx*vx+vb*vy*vy;
 const [o1,o2,o3,o4,o5]=d.order,order=['('+o1+' − x)','+ '+o2+bracket(poly(0,o3,-o4))],orderValue=o1-o5+o2*(o3*o5-o4);
 const [fa,fb,fc,fy]=d.fraction,numerator=poly(fa,-fb,0,'y'),denominator=fc+' − y',fraction=frac(numerator,denominator),top=fa*fy*fy+fb*fy,bottom=fc+fy;
 const [da,db,dc,dd,dz]=d.decimal,decimal=[bracket(poly(0,da/10,db/10,'z')),'− '+bracket(poly(0,dc/10,-dd,'z'))],decB=(da-dc)/10,decC=db/10+dd,decValue=decB*dz+decC;
 const [la,lb2,lc2,ld,le,lf,lt]=d.last,last=[la+bracket(poly(0,lb2,-lc2,'t')),'− '+ld+'('+le+' − '+term(lf,'t')+')'],lastB=la*lb2+ld*lf,lastC=-la*lc2-ld*le,lastValue=-lastB*lt+lastC;
 const extra={name:'Aukaáskorun',optional:true,tasks:[
  num('Nákvæmt svar með π','Safnaðu π-liðunum. Nákvæma svarið er tala margfölduð með π. Skráðu aðeins stuðul π.',piExpr,{},piSum,
   ['Hugsaðu um π eins og sameiginlegan þátt í öllum liðunum.','Leggðu stuðlana '+d.pi.join(', ').replace(/, ([^,]*)$/,' og $1')+' saman.'],
   piExpr+' = '+term(piSum,'π')+'. Þetta er nákvæmt svar.',{label:'Stuðull π',wrong:'Leggðu stuðla π-liðanna saman. Skráðu aðeins töluna sem stendur fyrir framan π.'}),
  num('Nálgun með π-takkanum','Notaðu π-takka á vasareikni og námundaðu svarið að tveimur aukastöfum.',term(piSum,'π'),{},piApprox,
   ['π er um það bil 3,14159265… Notaðu π-takkann til að varðveita nákvæmnina.','Margfaldaðu '+piSum+' með π og námundaðu aðeins lokasvarið.'],
   term(piSum,'π')+' ≈ '+fixed(piApprox)+'.',{label:'Nálgun',wrong:'Notaðu π-takkann og námundaðu aðeins lokasvarið að tveimur aukastöfum.',inputHelp:'Námundaðu að tveimur aukastöfum. Nota má kommu eða punkt.'}),
  num('Veldi fyrir framan π','Reiknaðu veldin og safnaðu síðan π-liðunum. Skráðu stuðul π í nákvæma svarinu.',piPowerExpr,{},piSquares,
   ['Veldi reiknast áður en liðirnir eru lagðir saman.','Veldin eru '+d.piPowers.map(n=>n*n).join(', ').replace(/, ([^,]*)$/,' og $1')+'. Leggðu þau saman.'],
   piPowerExpr+' = '+term(piSquares,'π')+'.',{label:'Stuðull π',wrong:'Reiknaðu veldin fyrst. Leggðu síðan stuðla π-liðanna saman og skráðu aðeins stuðulinn.'}),
  num('Nálgun eftir einföldun','Notaðu π-takka og námundaðu að tveimur aukastöfum.',term(piSquares,'π'),{},piPowerApprox,
   ['Notaðu nákvæma stuðulinn úr fyrra skrefi.','Reiknaðu '+piSquares+' · π. Ekki námunda π fyrst.'],
   term(piSquares,'π')+' ≈ '+fixed(piPowerApprox)+'.',{label:'Nálgun',wrong:'Notaðu π-takkann og námundaðu aðeins lokasvarið að tveimur aukastöfum.',inputHelp:'Námundaðu að tveimur aukastöfum. Nota má kommu eða punkt.'}),
  num('Neikvæð tala í öðru veldi','Reiknaðu y² áður en þú notar það í stæðunni með tveimur breytum.','y<sup>2</sup>',{y:-vy},vy*vy,
   ['Settu neikvæðu töluna í sviga áður en þú tekur annað veldi.','(−'+vy+')² = (−'+vy+') · (−'+vy+').'],
   '(−'+vy+')² = '+vy*vy+'. Margfeldi tveggja neikvæðra talna er jákvætt.'),
  num('Tvær breytur í sömu stæðu','Settu hvort gildi inn fyrir réttan bókstaf. Reiknaðu veldin fyrst.',twoVars,{x:vx,y:-vy},twoValue,
   ['x² = '+vx*vx+' og y² = '+vy*vy+'.','Reiknaðu '+va+' · '+vx*vx+' + '+vb+' · '+vy*vy+'.'],
   va*vx*vx+' + '+vb*vy*vy+' = '+twoValue+'.'),
  num('Fylgdu röð reikniaðgerða','Reiknaðu gildið. Þú mátt einfalda fyrst eða setja gildið beint inn.',order,{x:o5},orderValue,
   ['Settu '+o5+' inn fyrir bæði tilvik x.','Stæðan verður ('+o1+' − '+o5+') + '+o2+'('+o3+' · '+o5+' − '+o4+').'],
   fmt(o1-o5)+' + '+o2+' · '+fmt(o3*o5-o4)+' = '+fmt(orderValue)+'.'),
  num('Reiknaðu teljarann fyrst','Finndu aðeins gildið fyrir ofan brotastrikið.',fraction,{y:-fy},top,
   ['Teljarinn er '+numerator+'. Notaðu (−'+fy+')² = '+fy*fy+'.','Teljarinn verður '+fa+' · '+fy*fy+' − '+fb+' · (−'+fy+').'],
   fa*fy*fy+' + '+fb*fy+' = '+top+'.',{label:'Teljari'}),
  num('Reiknaðu nefnarann','Finndu nú gildið fyrir neðan brotastrikið.',fraction,{y:-fy},bottom,
   ['Nefnarinn er '+denominator+'.','Settu y = −'+fy+' inn: '+fc+' − (−'+fy+').'],
   fc+' + '+fy+' = '+bottom+'.',{label:'Nefnari'}),
  num('Deildu að lokum','Reiknaðu gildi alls brotsins. Ekki námunda svarið.',fraction,{y:-fy},top/bottom,
   ['Teljarinn er '+top+' og nefnarinn er '+bottom+'.','Brotastrikið táknar deilingu: '+top+' ÷ '+bottom+'.'],
   frac(top,bottom)+' = '+fmt(top/bottom)+'.'),
  num('Innsetning með tugabrotum','Einfaldaðu og reiknaðu gildið fyrir uppgefið z.',decimal,{z:dz},decValue,
   ['Mínusinn fyrir framan seinni svigann breytir báðum formerkjunum.','Einfölduð stæða er '+poly(0,decB,decC,'z')+'.'],
   fmt(decB)+' · '+dz+' + '+fmt(decC)+' = '+fmt(decValue)+'.'),
  num('Neikvætt t og tveir margfaldarar','Reiknaðu gildið. Taktu formerki margfaldaranna með inn í svigana.',last,{t:-lt},lastValue,
   ['Einfölduð stæða er '+poly(0,lastB,lastC,'t')+'.','Settu t = −'+lt+' inn: '+lastB+' · (−'+lt+') − '+(-lastC)+'.'],
   fmt(-lastB*lt)+' − '+(-lastC)+' = '+fmt(lastValue)+'.')
 ]};
 return [substitution,simplifyFirst,powers,practice,extra];
}
