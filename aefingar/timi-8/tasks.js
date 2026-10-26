'use strict';
const variants=[
 {neg:3,a:[9,2,5,6],b:[12,8,7,4],c:[12,4,5,2,3],d:[6,5,2,9,3],positive:[3,2,4,4],negative:[5,7,4],y:[6,4,11,2],fraction:[10,4,3,5],t:[4,5,3,7,2],decimal:[5,12,7,3],blocks:[2800,180,14],card:[4500,320,16],single:[4,7,11],pair1:[4,3,2,3],pair2:[7,4,5,2],sci:[5,4,-2,5,7],ineq1:[3,4,19],ineq2:[3,10]},
 {neg:4,a:[11,3,6,8],b:[14,9,8,5],c:[14,3,4,3,5],d:[7,4,3,12,2],positive:[4,3,5,3],negative:[6,9,2],y:[5,6,8,3],fraction:[9,6,2,6],t:[5,6,4,8,3],decimal:[3,14,8,4],blocks:[3200,140,15],card:[4800,280,19],single:[6,5,9],pair1:[5,2,3,4],pair2:[8,5,4,3],sci:[6,3,-3,4,6],ineq1:[4,5,29],ineq2:[4,12]},
 {neg:5,a:[12,4,7,9],b:[15,6,9,5],c:[15,2,4,2,6],d:[8,6,2,10,4],positive:[5,2,6,3],negative:[7,10,3],y:[8,3,10,2],fraction:[8,5,4,6],t:[2,7,5,9,4],decimal:[6,13,9,2],blocks:[2600,220,11],card:[3900,450,14],single:[7,6,8],pair1:[6,5,2,3],pair2:[9,4,3,2],sci:[8,4,-2,4,6],ineq1:[5,2,37],ineq2:[5,14]}
];
function buildSections(seed){
 const d=variants[seed%variants.length],fmt=n=>(Number.isInteger(n)?String(n):n.toFixed(10).replace(/0+$/,'').replace(/\.$/,'')).replace('-','−').replace('.',','),money=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
 const term=(c,v='',p=1)=>(c<0?'−':'')+((v&&Math.abs(c)===1)?'':fmt(Math.abs(c)))+v+(p===2?'<sup>2</sup>':'');
 const expr=ts=>ts.filter(t=>t[0]!==0).map(([c,v,p],i)=>(i?(c<0?' − ':' + '):(c<0?'−':''))+term(Math.abs(c),v||'',p||1)).join('')||'0';
 const poly=(a,b,c,v='x')=>expr([[a,v,2],[b,v],[c]]);
 const frac=(a,b)=>'<span class="fraction"><span>'+a+'</span><span>'+b+'</span></span>';
 const board=(parts,givens={})=>'<div class="substitution-board"><div class="equation bracket-equation">'+(Array.isArray(parts)?parts:[parts]).map(s=>'<span class="math-chunk">'+s+'</span>').join('')+'</div>'+(Object.keys(givens).length?'<div class="given-values">'+Object.entries(givens).map(([v,n])=>'<span>'+v+' = '+(typeof n==='number'?fmt(n):n)+'</span>').join('')+'</div>':'')+'</div>';
 const num=(title,intro,parts,givens,answer,hints,explain,extra={})=>({type:'number',title,intro,board:board(parts,givens),answer:Number(answer.toFixed(12)),label:'Gildi',unit:'',hints,explain,inputHelp:'Skráðu tölu. Nota má mínusmerki og kommu eða punkt í tugabroti.',wrong:'Settu uppgefið gildi inn fyrir hvert tilvik bókstafsins. Reiknaðu veldi fyrst og gættu formerkjanna.',...extra});
 const pick=(title,intro,parts,givens,options,correct,hints,explain,extra={})=>({type:'choices',title,intro,board:board(parts,givens),options,correct,hints,explain,wrong:'Skoðaðu formerkin og prófaðu að setja tölurnar inn. Vísbendingin sýnir næsta skref.',...extra});
 const n=d.neg,[a,b,c,e]=d.a,A=['('+term(a,'x')+' − '+b+')','− ('+term(c,'x')+' + '+e+')'],ab=a-c,ac=-b-e;
 const [f,g,h,j]=d.b,B=['('+f+' − '+term(g,'x')+')','+ ('+h+' − '+term(j,'x')+')'],bb=-g-j,bc=f+h;
 const [k,l,m,o,p]=d.c,C=[k+'(x + '+l+')','− '+m+'('+term(o,'x')+' − '+p+')'],cb=k-m*o,cc=k*l+m*p;
 const [q,r,s,u,v]=d.d,D=[q+'('+r+' − '+term(s,'x')+')','+ '+u+'(x − '+v+')'],db=-q*s+u,dc=q*r-u*v;
 const brackets={name:'Svigar og neikvæð gildi',tasks:[
  pick('Einfaldaðu áður en þú setur inn','Hvaða stæða er jafngild þessari?',A,{},
   [poly(0,ab,-b+e),poly(0,ab,ac),poly(0,a+c,ac),poly(0,ab,b+e)],1,
   ['Mínus fyrir framan seinni svigann breytir formerki beggja liða hans.','Safnaðu x-liðunum og fastaliðunum sitt í hvoru lagi.'],
   A.join(' ')+' = '+poly(0,ab,ac)+'.'),
  num('Settu neikvæða gildið inn','Reiknaðu gildi stæðunnar.',A,{x:-n},-ab*n+ac,
   ['Notaðu einfölduðu stæðuna '+poly(0,ab,ac)+'.','Settu x = −'+n+' inn: '+ab+' · (−'+n+') − '+(-ac)+'.'],
   fmt(-ab*n)+' − '+(-ac)+' = '+fmt(-ab*n+ac)+'.'),
  num('Plús milli sviga','Reiknaðu gildið þegar x er neikvætt.',B,{x:-n},-bb*n+bc,
   ['Plús fyrir framan sviga heldur formerkjunum óbreyttum.','Stæðan einfaldast í '+poly(0,bb,bc)+'.'],
   fmt(bb)+' · (−'+n+') + '+bc+' = '+fmt(-bb*n+bc)+'.'),
  num('Margfaldaðu inn í báða sviga','Einfaldaðu og reiknaðu gildið.',C,{x:-n},-cb*n+cc,
   ['Margfaldaðu '+k+' inn í fyrri svigann og −'+m+' inn í seinni svigann.','Einfölduð stæða er '+poly(0,cb,cc)+'.'],
   cb+' · (−'+n+') + '+cc+' = '+fmt(-cb*n+cc)+'.'),
  num('Formerki í margföldun','Reiknaðu gildið. Báðir liðir hvors sviga margfaldast.',D,{x:-n},-db*n+dc,
   ['Margfaldaðu '+q+' inn í fyrri svigann og '+u+' inn í seinni svigann.','Einfölduð stæða er '+poly(0,db,dc)+'.'],
   poly(0,db,dc)+' gefur '+fmt(-db*n+dc)+' þegar x = −'+n+'.')
 ]};
 const [pa,pb,pc,px]=d.positive,positive=poly(pa,pb,pc),[na,nb,nx]=d.negative,negative=poly(1,-na,nb);
 const powers={name:'Veldi við innsetningu',tasks:[
  num('Jákvætt gildi og annað veldi','Settu x inn og reiknaðu veldið áður en þú margfaldar.',positive,{x:px},pa*px*px+pb*px+pc,
   ['x² = '+px+' · '+px+' = '+px*px+'.','Reiknaðu '+pa+' · '+px*px+' + '+pb+' · '+px+' + '+pc+'.'],
   pa*px*px+' + '+pb*px+' + '+pc+' = '+(pa*px*px+pb*px+pc)+'.'),
  num('Hvað verður neikvætt x í öðru veldi?','Finndu x². Skrifaðu neikvæðu töluna innan sviga.','x<sup>2</sup>',{x:-nx},nx*nx,
   ['x² merkir x margfaldað með sjálfu sér.','(−'+nx+') · (−'+nx+') er jákvætt.'],
   '(−'+nx+')² = '+nx*nx+'.',{label:'x²'}),
  num('Veldi og frádráttur','Reiknaðu alla stæðuna fyrir sama gildi á x.',negative,{x:-nx},nx*nx+na*nx+nb,
   ['Settu x = −'+nx+' inn í bæði x² og −'+term(na,'x')+'.','Þú færð '+nx*nx+' − '+na+' · (−'+nx+') + '+nb+'.'],
   nx*nx+' + '+na*nx+' + '+nb+' = '+(nx*nx+na*nx+nb)+'.')
 ]};
 const [ya,yb,yc,yn]=d.y,Y=poly(ya,-yb,yc,'y'),[fa,fb,fc,fz]=d.fraction,F=frac(poly(0,fa,-fb,'z'),fc+' − z'),top=fa*fz-fb,bottom=fc-fz;
 const [ta,tb,tc,td,tn]=d.t,T=[term(ta,'t')+'(t − '+tb+')','+ '+tc+'('+td+' − t)'],tv=ta*tn*(tn-tb)+tc*(td-tn);
 const [ka,kb,kc,kn]=d.decimal,K=poly(ka/10,-kb/10,kc,'k'),kv=ka/10*kn*kn+kb/10*kn+kc;
 const mixed={name:'Brot og fleiri stæður',tasks:[
  num('Neikvætt y í stæðu','Reiknaðu veldið fyrst og gættu að frádrættinum.',Y,{y:-yn},ya*yn*yn+yb*yn+yc,
   ['(−'+yn+')² = '+yn*yn+'.','Reiknaðu '+ya+' · '+yn*yn+' − '+yb+' · (−'+yn+') + '+yc+'.'],
   ya*yn*yn+' + '+yb*yn+' + '+yc+' = '+(ya*yn*yn+yb*yn+yc)+'.'),
  num('Byrjaðu á teljaranum','Reiknaðu aðeins það sem er fyrir ofan brotastrikið.',F,{z:fz},top,
   ['Teljarinn er '+poly(0,fa,-fb,'z')+'.','Settu z = '+fz+' inn og reiknaðu '+fa+' · '+fz+' − '+fb+'.'],
   fa*fz+' − '+fb+' = '+top+'.',{label:'Teljari'}),
  num('Nefnarinn getur verið neikvæður','Reiknaðu það sem er fyrir neðan brotastrikið.',F,{z:fz},bottom,
   ['Nefnarinn er '+fc+' − z.','Settu '+fz+' inn fyrir z. Ekki víxla tölunum í frádrættinum.'],
   fc+' − '+fz+' = '+fmt(bottom)+'.',{label:'Nefnari'}),
  num('Deildu teljara með nefnara','Reiknaðu allt brotið. Ekki námunda.',F,{z:fz},top/bottom,
   ['Teljarinn er '+top+' og nefnarinn er '+fmt(bottom)+'.','Jákvæð tala deilt með neikvæðri tölu gefur neikvætt svar.'],
   frac(top,fmt(bottom))+' = '+fmt(top/bottom)+'.'),
  num('Bókstafur fyrir framan sviga','Settu t inn í öll þrjú tilvik bókstafsins.',T,{t:tn},tv,
   ['Fyrri liðurinn verður '+ta+' · '+tn+' · ('+tn+' − '+tb+').','Seinni liðurinn verður '+tc+' · ('+td+' − '+tn+').'],
   fmt(ta*tn*(tn-tb))+' + '+tc*(td-tn)+' = '+fmt(tv)+'.'),
  num('Tugabrot og neikvætt gildi','Reiknaðu gildið. Stuðullinn margfaldast með veldinu.',K,{k:-kn},kv,
   ['Reiknaðu k² = '+kn*kn+' fyrst.','Settu inn: '+fmt(ka/10)+' · '+kn*kn+' − '+fmt(kb/10)+' · (−'+kn+') + '+kc+'.'],
   fmt(ka/10*kn*kn)+' + '+fmt(kb/10*kn)+' + '+kc+' = '+fmt(kv)+'.')
 ]};
 const [base,unit,count]=d.blocks,[fee,day,days]=d.card;
 const story1='<div class="story"><p>Leikfangaverslun selur kubbasett á <strong>'+money(base)+' kr.</strong> Hver aukakubbur kostar <strong>'+unit+' kr.</strong></p><p>Keypt er eitt sett og <strong>n aukakubbar</strong>.</p></div>';
 const story2='<div class="story"><p>Í þessu dæmi kostar strætókort <strong>'+money(fee)+' kr.</strong> í grunngjald og <strong>'+day+' kr.</strong> fyrir hvern dag sem það er virkt.</p><p>Kortið er virkt í <strong>d daga</strong>.</p></div>';
 const prices={name:'Frá texta að heildarverði',tasks:[
  {...pick('Veldu stæðu fyrir heildarverðið','V(n) táknar heildarverðið þegar keypt er eitt sett og n aukakubbar.','',{},
   ['V(n) = ('+money(base)+' + '+unit+')n','V(n) = '+money(base)+'n + '+unit,'V(n) = '+money(base)+' + '+unit+'n','V(n) = '+money(base)+' + '+unit+' + n'],2,
   ['Verð kubbasettsins er greitt einu sinni.','Verð aukakubbanna er '+unit+' margfaldað með fjöldanum n.'],
   'V(n) = '+money(base)+' + '+unit+'n. Grunnverðið er fast, en aukaverðið fer eftir fjöldanum.',{wideChoices:true}),board:story1},
  {...num('Hvað kosta settið og aukakubbarnir?','Reiknaðu V('+count+').','',{},base+unit*count,
   ['Settu n = '+count+' í V(n) = '+base+' + '+unit+'n.','Aukakubbarnir kosta '+unit+' · '+count+' kr. Leggðu verð settsins við.'],
   money(base)+' + '+money(unit*count)+' = '+money(base+unit*count)+' kr.',{label:'V('+count+')',unit:'kr.',inputHelp:'Skráðu heildarverðið. Bil milli þúsunda eru leyfð.'}),board:story1+'<p class="story-count">n = '+count+'</p>'},
  {...pick('Grunngjald og gjald á dag','K(d) táknar heildarkostnað þegar kortið er virkt í d daga.','',{},
   ['K(d) = '+money(fee)+' + '+day+'d','K(d) = '+money(fee)+'d + '+day,'K(d) = ('+money(fee)+' + '+day+')d','K(d) = '+money(fee)+' + '+day+' + d'],0,
   ['Grunngjaldið er greitt einu sinni.','Dagagjaldið '+day+' kr. margfaldast með fjölda daga d.'],
   'K(d) = '+money(fee)+' + '+day+'d.',{wideChoices:true}),board:story2},
  {...num('Reiknaðu kostnað kortsins','Reiknaðu K('+days+').','',{},fee+day*days,
   ['Settu d = '+days+' í stæðuna fyrir heildarkostnaðinn.','Margfaldaðu '+day+' með '+days+' og bættu '+fee+' við.'],
   money(fee)+' + '+money(day*days)+' = '+money(fee+day*days)+' kr.',{label:'K('+days+')',unit:'kr.',inputHelp:'Skráðu heildarkostnaðinn. Bil milli þúsunda eru leyfð.'}),board:story2+'<p class="story-count">d = '+days+'</p>'}
 ]};
 const [sa,sb,sy]=d.single,srhs=sa*sy+sb,eq=term(sa,'y')+' + '+sb+' = '+srhs;
 const pairTasks=(data,minus)=>{
  const [a,b,x,y]=data,rhs=a*x+(minus?-b:b)*y,eq=term(a,'x')+(minus?' − ':' + ')+term(b,'y')+' = '+rhs;
  const pairs=[[x+1,y],[x,y+1],[x,y],[x-1,y]],idx=minus?0:2,ordered=minus?[pairs[2],pairs[0],pairs[1],pairs[3]]:pairs;
  return [
   pick(minus?'Finndu par fyrir frádrátt':'Finndu heiltölupar','Fleiri en eitt heiltölupar getur uppfyllt jöfnuna. Hvaða par hér fyrir neðan passar?',eq,{},
    ordered.map(([u,v])=>'x = '+u+', y = '+v),idx,
    ['Prófaðu að setja x og y úr hverjum möguleika inn í vinstri hlið.','Gildið vinstra megin þarf að vera nákvæmlega '+rhs+'.'],
    'x = '+x+' og y = '+y+' passa: '+a+' · '+x+(minus?' − ':' + ')+b+' · '+y+' = '+rhs+'.',{wideChoices:true}),
   num('Sannreyndu parið með innsetningu','Reiknaðu vinstri hlið jöfnunnar fyrir parið sem passar.',term(a,'x')+(minus?' − ':' + ')+term(b,'y'),{x,y},rhs,
    ['Margfaldaðu hvorn stuðul með réttu gildi.','Reiknaðu '+a*x+(minus?' − ':' + ')+b*y+'.'],
    'Vinstri hliðin er '+rhs+', sama tala og hægri hliðin. Parið uppfyllir jöfnuna.')
  ];
 };
 const [sx,syc,ex,ey,ep]=d.sci,xv=sx*10**ex,yv=syc*10**ey;
 const standard=(a,e)=>a+' × 10<sup>'+String(e).replace('-','−')+'</sup>',givens={x:standard(sx,ex),y:standard(syc,ey)};
 const sciExtra={inputHelp:'Skráðu tugabrot eða e-rithátt, t.d. 1,2e-7 fyrir 1,2 × 10⁻⁷.',inputMode:'text',wrong:'Notaðu gefin gildi á x og y. Við margföldun leggjast veldisvísar saman; við deilingu er veldisvísir nefnarans dreginn frá veldisvísi teljarans.'};
 const [ia,ib,ic]=d.ineq1,threshold=(ic-ib)/ia,low=Array.from({length:threshold-1},(_,i)=>i+1),[ja,jb]=d.ineq2;
 const high=Array.from({length:10},(_,i)=>i+1).filter(x=>ja*x+jb<x*x),boundary=high[0]-1;
 const set=a=>'{'+a.join(', ')+'}';
 const bonus={name:'Aukaáskorun',optional:true,tasks:[
  num('Hvaða heiltala passar?','Finndu y og prófaðu lausnina með innsetningu.',eq,{},sy,
   ['Dragðu '+sb+' frá báðum hliðum.','Þá er '+term(sa,'y')+' = '+(srhs-sb)+'. Deildu báðum hliðum með '+sa+'.'],
   'y = '+sy+', því '+sa+' · '+sy+' + '+sb+' = '+srhs+'.',{label:'y',wrong:'Dragðu fastaliðinn frá báðum hliðum og deildu svo með stuðlinum við y.'}),
  ...pairTasks(d.pair1,false),...pairTasks(d.pair2,true),
  num('Margfaldaðu tölur í staðalformi','Reiknaðu xy.', 'xy',givens,xv*yv,
   ['Margfaldaðu stuðlana og leggðu veldisvísana saman.','xy = '+(sx*syc)+' × 10<sup>'+String(ex+ey).replace('-','−')+'</sup>.'],
   'xy = '+fmt(xv*yv)+'.',sciExtra),
  num('Deildu x með y','Reiknaðu brotið.',frac('x','y'),givens,xv/yv,
   ['Deildu stuðlunum. Dragðu veldisvísi nefnarans frá veldisvísi teljarans.','Þú færð '+fmt(sx/syc)+' × 10<sup>'+String(ex-ey).replace('-','−')+'</sup>.'],
   frac('x','y')+' = '+fmt(xv/yv)+'.',sciExtra),
  num('Víxlaðu teljara og nefnara','Reiknaðu nú y deilt með x.',frac('y','x'),givens,yv/xv,
   ['Nú er veldisvísirinn '+ey+' − ('+fmt(ex)+').','Stuðlahlutfallið er '+syc+' deilt með '+sx+'.'],
   frac('y','x')+' = '+fmt(yv/xv)+'.',sciExtra),
  num('Margföldun og samlagning','Reiknaðu margfeldið fyrst og bættu síðan y við.',['x × 10<sup>'+ep+'</sup>','+ y'],givens,xv*10**ep+yv,
   ['Í fyrri liðnum fæst '+sx+' × 10<sup>'+(ex+ep)+'</sup>.','Skrifaðu báða liðina með sama veldi af 10 eða sem venjulegar tölur áður en þú leggur saman.'],
   fmt(xv*10**ep)+' + '+fmt(yv)+' = '+fmt(xv*10**ep+yv)+'.',sciExtra),
  pick('Öll gildin sem passa','Hvaða mengi inniheldur allar heiltölur frá 1 til 10 sem uppfylla ójöfnuna?',term(ia,'x')+' + '+ib+' < '+ic,{},
   [set([...low,threshold]),set(low),set(low.slice(1)),set(Array.from({length:11-threshold},(_,i)=>threshold+i))],1,
   ['Tákninu < fylgir ströng krafa: jafnt og passar ekki.','Ójafnan jafngildir x < '+threshold+'. Veldu aðeins heiltölur frá 1 til 10.'],
   set(low)+' eru allar lausnirnar á bilinu. x = '+threshold+' gefur jöfnu, ekki stranga ójöfnu.',{wideChoices:true}),
  pick('Veldi í ójöfnu','Hvaða mengi inniheldur allar heiltölur frá 1 til 10 sem uppfylla ójöfnuna?',term(ja,'x')+' + '+jb+' < x<sup>2</sup>',{},
   [set([boundary,...high]),set(Array.from({length:boundary},(_,i)=>i+1)),set(high.slice(1)),set(high)],3,
   ['Prófaðu heiltölurnar frá 1 til 10. Vinstri hlið þarf að vera minni en x².','Við x = '+boundary+' eru báðar hliðar '+boundary*boundary+'. Sú tala uppfyllir því ekki <. Prófaðu næstu stærri tölur.'],
   set(high)+' eru allar lausnirnar á bilinu. Við x = '+high[0]+' er '+(ja*high[0]+jb)+' < '+high[0]*high[0]+', og ójafnan heldur áfram að gilda upp í 10.',{wideChoices:true})
 ]};
 return [brackets,powers,mixed,prices,bonus];
}
