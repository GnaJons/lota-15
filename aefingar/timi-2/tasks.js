
'use strict';
const variants=[
 {simple:[7,4,3],bar:[18,6,3],power:[12,3,4],terms:[3,4,2,7],mixed:[80,4,6,3],top:[4,6,24,8],pair:[8,2,5,48,6,3],both:[12,4,5,3,5,13],small:[58,2,5,12],nested:[50,3,2,18,3,9,5,4],addfrac:[12,3,5,6,2,4,4],error:[18,6,4,7],judge:[11,7,3,5,true]},
 {simple:[9,3,5],bar:[20,8,4],power:[10,2,5],terms:[4,3,5,9],mixed:[90,3,7,2],top:[5,4,17,9],pair:[9,3,4,63,7,5],both:[8,6,3,2,4,10],small:[90,3,4,14],nested:[60,2,4,24,4,8,3,3],addfrac:[15,4,6,7,4,3,7],error:[24,5,3,8],judge:[14,6,4,9,false]},
 {simple:[8,5,4],bar:[30,10,5],power:[18,5,2],terms:[2,5,3,11],mixed:[70,5,4,4],top:[3,7,15,6],pair:[7,4,3,80,8,6],both:[10,2,7,3,6,24],small:[75,4,4,11],nested:[35,4,3,30,5,7,2,6],addfrac:[20,2,7,8,3,4,5],error:[16,7,5,9],judge:[9,8,5,6,true]}
];
function buildSections(seed){
 const d=variants[seed%variants.length],pow=(b,n)=>b+'<sup>'+n+'</sup>';
 const frac=(a,b)=>'<span class="fraction"><span>'+a+'</span><span>'+b+'</span></span>';
 const parts=(a,b)=>'<span class="math-chunk">'+a+'</span><span class="math-chunk">'+b+'</span>';
 const fmt=n=>String(n).replace('.',','),eq=(s,cls='')=>'<div class="equation '+cls+'">'+s+'</div>';
 const num=(title,intro,expr,answer,hints,explain,extra={})=>({type:'number',title,intro,board:eq(expr),answer,label:'Svar',unit:'',hints,explain,...extra});
 const pick=(title,intro,expr,options,correct,hints,explain,extra={})=>({type:'choices',title,intro,board:eq(expr),options,correct,hints,explain,...extra});
 const [a,b,c]=d.simple,plain=a+' + '+b+' × '+c,grouped='('+a+' + '+b+') × '+c;
 const first={name:'Svigar breyta röðinni',tasks:[
  pick('Hvað reiknarðu fyrst?','Veldu aðgerðina sem á að reikna fyrst.',plain,[a+' + '+b,b+' × '+c],1,
   ['Margföldun kemur á undan samlagningu þegar engir svigar breyta röðinni.','Tölurnar '+b+' og '+c+' eru margfaldaðar saman.'],
   'Reiknaðu '+b+' × '+c+' fyrst. Síðan leggurðu '+a+' við.',{wrong:'Ekki byrja sjálfkrafa lengst til vinstri. Margföldun kemur hér á undan samlagningu.'}),
  num('Ljúktu útreikningnum','Reiknaðu stæðuna.',plain,a+b*c,
   ['Reiknaðu margfeldið fyrst.',b+' × '+c+' = '+b*c+'. Leggðu síðan '+a+' við.'],plain+' = '+a+' + '+b*c+' = '+(a+b*c)+'.'),
  num('Nú eru komnir svigar','Reiknaðu stæðuna og athugaðu hvað svigarnir breyta.',grouped,(a+b)*c,
   ['Reiknaðu inni í sviganum fyrst.',a+' + '+b+' = '+(a+b)+'. Margfaldaðu summuna með '+c+'.'],grouped+' = '+(a+b)+' × '+c+' = '+(a+b)*c+'.',
   {wrong:'Hér þarf að leggja saman inni í sviganum áður en margfaldað er.'})
 ]};
 const [u,v,w]=d.bar,shortBar=u+' − '+frac(v,w),longBar=frac(u+' − '+v,w);
 const bars={name:'Hvað nær brotastrikið yfir?',tasks:[
  num('Aðeins síðari talan í teljara','Reiknaðu stæðuna. Skoðaðu hvað er fyrir ofan brotastrikið.',shortBar,u-v/w,
   ['Brotastrikið merkir deilingu. Aðeins '+v+' er í teljaranum.',v+' deilt með '+w+' er '+v/w+'. Dragðu það frá '+u+'.'],shortBar+' = '+u+' − '+v/w+' = '+(u-v/w)+'.'),
  num('Allur mismunurinn í teljara','Nú nær brotastrikið undir báðar tölurnar. Reiknaðu brotið.',longBar,(u-v)/w,
   ['Reiknaðu allan teljarann áður en þú deilir með nefnaranum.',u+' − '+v+' = '+(u-v)+'. Deildu niðurstöðunni með '+w+'.'],
   longBar+' = '+frac(u-v,w)+' = '+(u-v)/w+'. Brotastrikið hefur hér sömu áhrif og svigar utan um teljarann.',{wrong:'Báðar tölurnar eru í teljaranum. Finndu mismuninn fyrst og deildu síðan.'})
 ]};
 const [pa,pb,pc]=d.power,pex=pa+' + '+pb+' × '+pow(pc,2);
 const powers={name:'Veldi og svigar',tasks:[
  pick('Hvaða hluta reiknarðu fyrst?','Veldu rétta fyrsta skrefið.',pex,[pa+' + '+pb,pb+' × '+pc,pow(pc,2)],2,
   ['Veldi koma á undan margföldun.','Hér er '+pc+' hafið í annað veldi. Veldið nær ekki yfir '+pb+'.'],
   pow(pc,2)+' = '+pc*pc+'. Síðan margfaldarðu með '+pb+' og leggur '+pa+' við.'),
  num('Veldi, margföldun, samlagning','Reiknaðu alla stæðuna.',pex,pa+pb*pc*pc,
   ['Reiknaðu veldið, svo margfeldið og loks summuna.',pex+' = '+pa+' + '+pb+' × '+pc*pc+'.'],
   pex+' = '+pa+' + '+pb*pc*pc+' = '+(pa+pb*pc*pc)+'.'),
  num('Allur sviginn í öðru veldi','Reiknaðu summuna inni í sviganum áður en þú tekur annað veldi.',pa+' + '+pow('('+pb+' + '+pc+')',2),pa+(pb+pc)**2,
   ['Svigar koma á undan veldi sem stendur á sviganum.',pb+' + '+pc+' = '+(pb+pc)+'. Reiknaðu síðan '+pow(pb+pc,2)+'.'],
   pa+' + '+pow(pb+pc,2)+' = '+pa+' + '+(pb+pc)**2+' = '+(pa+(pb+pc)**2)+'.'),
  num('Sama röð við frádrátt','Reiknaðu stæðuna. Svarið má vera neikvætt.',pa+' − '+pb+' × '+pow(pc,2),pa-pb*pc*pc,
   ['Reiknaðu veldið og margfeldið áður en þú dregur frá.',pb+' × '+pc*pc+' = '+pb*pc*pc+'. Dragðu það frá '+pa+'.'],
   pa+' − '+pb*pc*pc+' = '+(pa-pb*pc*pc)+'. Frádrátturinn breytir ekki því að veldi og margföldun koma fyrst.')
 ]};
 const [ta,tb,tc,td]=d.terms,[ma,mb,mc,md]=d.mixed;
 const mixedExpr=ma+' − '+mb+' × '+mc+' + '+md+' × '+pow(mc,2),mid=ma+' − '+mb*mc+' + '+md*mc*mc;
 const many={name:'Fleiri liðir í sömu stæðu',tasks:[
  num('Reiknaðu liði áður en þú sameinar','Reiknaðu stæðuna.',ta+' × '+pow(tb,2)+' + '+tc+' × '+tb+' − '+td,ta*tb*tb+tc*tb-td,
   ['Reiknaðu veldið og síðan bæði margfeldin.',ta*tb*tb+' + '+tc*tb+' − '+td+'. Nú eru aðeins samlagning og frádráttur eftir.'],
   ta*tb*tb+' + '+tc*tb+' − '+td+' = '+(ta*tb*tb+tc*tb-td)+'.'),
  pick('Hvað kemur næst?','Veldið og margfeldin hafa þegar verið reiknuð. Hvaða aðgerð kemur næst?',mid,
   [mb*mc+' + '+md*mc*mc,ma+' − '+mb*mc],1,
   ['Samlagning og frádráttur hafa sama forgang.','Þegar aðeins þessar aðgerðir eru eftir vinnum við frá vinstri til hægri.'],
   'Reiknaðu '+ma+' − '+mb*mc+' fyrst. Síðan leggurðu '+md*mc*mc+' við.',{wrong:'Samlagning hefur ekki forgang fram yfir frádrátt. Vinna þarf frá vinstri til hægri.'}),
  num('Ljúktu stæðunni','Reiknaðu alla stæðuna.',mixedExpr,ma-mb*mc+md*mc*mc,
   ['Veldið kemur fyrst, svo margfeldin. Að lokum vinnurðu samlagningu og frádrátt frá vinstri til hægri.',mid+' = '+(ma-mb*mc)+' + '+md*mc*mc+'.'],
   mixedExpr+' = '+mid+' = '+(ma-mb*mc+md*mc*mc)+'.')
 ]};
 const [fa,fb,fc,fd]=d.top,topExpr=fa+' × '+pow(fb,2)+' − '+fc,topValue=fa*fb*fb-fc;
 const numerator={name:'Reiknaðu teljarann fyrst',tasks:[
  num('Hvert er gildi teljarans?','Reiknaðu aðeins teljarann, fyrir ofan brotastrikið.',frac(topExpr,fd),topValue,
   ['Í teljaranum þarf líka að fylgja röð reikniaðgerða.',fa+' × '+fb*fb+' − '+fc+' = '+fa*fb*fb+' − '+fc+'.'],
   'Teljarinn er '+topValue+'. Enn á eftir að deila með '+fd+'.',{label:'Teljari'}),
  num('Deildu að lokum','Finndu gildi alls brotsins.',frac(topExpr,fd),topValue/fd,
   ['Notaðu gildið sem þú fannst fyrir teljarann.','Brotið er '+frac(topValue,fd)+'.'],frac(topValue,fd)+' = '+topValue/fd+'.')
 ]};
 const [ba,bb,bc,bn,bd,bminus]=d.pair,bl=ba+bb*bc,br=bn/bd-bminus;
 const [na,nb,nc,da,db,dc]=d.both,nt=na*(nb+nc),dt=da*(db*db-dc);
 const [sn,sm,sb,sd]=d.small,st=sn-sm*sb*sb,sden=sd**4;
 const combined={name:'Settu aðgerðirnar saman',tasks:[
  num('Tveir svigar','Reiknaðu gildi hvors sviga og margfaldaðu síðan.', parts('('+ba+' + '+bb+' × '+bc+')','× ('+frac(bn,bd)+' − '+bminus+')'),bl*br,
   ['Inni í hvorum sviga gildir venjuleg röð reikniaðgerða.','Fyrri sviginn er '+bl+' og sá síðari er '+br+'.'],
   '('+ba+' + '+bb*bc+') × ('+bn/bd+' − '+bminus+') = '+bl+' × '+br+' = '+bl*br+'.'),
  num('Teljari og nefnari','Reiknaðu teljarann og nefnarann hvorn fyrir sig og deildu síðan.',frac(na+' × ('+nb+' + '+nc+')',da+' × ('+pow(db,2)+' − '+dc+')'),nt/dt,
   ['Reiknaðu inn í svigana. Í neðri sviganum kemur veldið á undan frádrættinum.','Teljarinn er '+nt+' og nefnarinn er '+dt+'.'],
   frac(nt,dt)+' = '+fmt(nt/dt)+'.',{wrong:'Reiknaðu allan nefnarann áður en þú deilir. Hann er margfeldi tölunnar og svigans.'}),
  pick('Veldi í nefnara','Veldu rétt gildi brotsins. Þú þarft ekki að stytta brotið.',frac(sn+' − '+sm+' × '+pow(sb,2),pow(sd,4)),
   [frac(st,sd*4),frac((sn-sm)*sb*sb,sden),frac(st,sden),frac(st,sd**3)],2,
   ['Fylgdu röð reikniaðgerða í teljaranum. Reiknaðu svo veldið í nefnaranum.',pow(sd,4)+' = '+sd+' × '+sd+' × '+sd+' × '+sd+'. Veldisvísirinn er ekki tala sem þú margfaldar stofninn með.'],
   'Teljarinn er '+sn+' − '+sm*sb*sb+' = '+st+'. Nefnarinn er '+pow(sd,4)+' = '+sden+'. Gildið er því '+frac(st,sden)+'.')
 ]};
 const [za,zb,zc,zn,zd,zp,zq,zr]=d.nested,inner=zn/zd+(zp-zq)*zr;
 const [aa,ab,ac,ad,ae,af,ag]=d.addfrac,an=(ab+ac)*(ad-ae)**2,adeno=af+ag;
 const [ea,eb,ec,ed]=d.error,good=ea+eb*ec-ed,bad=(ea+eb)*ec-ed;
 const [ja,jb,jc,jd,valid]=d.judge,jgood=(ja+jb)*jc+jd,jshown=valid?jgood:ja+jb*jc+jd;
 const errorBoard='<div class="worked"><div>'+ea+' + '+eb+' × '+ec+' − '+ed+'</div><div>= ('+ea+' + '+eb+') × '+ec+' − '+ed+'</div><div>= '+bad+'</div></div>';
 const judgeBoard='<div class="worked"><div>('+ja+' + '+jb+') × '+jc+' + '+jd+'</div><div>= '+(valid?(ja+jb)+' × '+jc+' + '+jd:ja+' + '+jb+' × '+jc+' + '+jd)+'</div><div>= '+jshown+'</div></div>';
 const bonus={name:'Aukaáskorun og villuleit',optional:true,tasks:[
  num('Svigi inni í sviga','Reiknaðu stæðuna. Taktu einn hluta í einu.',parts(za+' + '+zb+' × '+pow(zc,2),'− ('+frac(zn,zd)+' + ('+zp+' − '+zq+') × '+zr+')'),za+zb*zc*zc-inner,
   ['Byrjaðu á innri sviganum. Inni í stærri sviganum þarf svo að reikna deilingu og margföldun áður en lagt er saman.','Gildi stærri svigans er '+inner+'. Utan hans færðu '+za+' + '+zb*zc*zc+' − '+inner+'.'],
   za+' + '+zb*zc*zc+' − '+inner+' = '+(za+zb*zc*zc-inner)+'.'),
  num('Brot inni í stæðu','Reiknaðu brotið og leggðu síðan töluna fyrir framan við.',aa+' + '+frac('('+ab+' + '+ac+') × '+pow('('+ad+' − '+ae+')',2),af+' + '+ag),aa+an/adeno,
   ['Reiknaðu svigana í teljaranum og summuna í nefnaranum.','Teljarinn er '+an+' og nefnarinn er '+adeno+'.'],
   aa+' + '+frac(an,adeno)+' = '+aa+' + '+an/adeno+' = '+(aa+an/adeno)+'.'),
  pick('Finndu fyrsta ranga skrefið','Fyrsta jafnaðarmerkið hér er rangt. Hvað fór úrskeiðis?','',
   ['Frádrátturinn var reiknaður á undan margföldun.','Samlagningin var sett í sviga og fékk ranglega forgang.','Frádrátturinn var felldur brott úr útreikningnum.'],1,
   ['Berðu fyrstu tvær línurnar saman.','Engir svigar standa í upprunalegu stæðunni. Þeir breyta röðinni þegar þeim er bætt við.'],
   'Í fyrstu línunni á að margfalda '+eb+' × '+ec+' áður en lagt er saman. Það má ekki setja '+ea+' + '+eb+' í sviga.',{board:errorBoard}),
  num('Leiðréttu niðurstöðuna','Reiknaðu upprunalegu stæðuna í réttri röð.',ea+' + '+eb+' × '+ec+' − '+ed,good,
   ['Reiknaðu margfeldið fyrst.','Þá fæst '+ea+' + '+eb*ec+' − '+ed+'.'],
   ea+' + '+eb*ec+' − '+ed+' = '+good+'.'),
  pick('Er þessi útreikningur réttur?','Skoðaðu báðar jafnaðarsetningarnar. Veldu hvort útreikningurinn sé réttur.','',
   ['Réttur','Rangur'],valid?0:1,
   ['Athugaðu fyrst hvað svigarnir segja til um.','Það þarf að leggja '+ja+' og '+jb+' saman áður en margfaldað er með '+jc+'.'],
   (valid?'Útreikningurinn er réttur. ':'Útreikningurinn er rangur: svigarnir voru felldir brott áður en lagt var saman. ')+
   '('+ja+' + '+jb+') × '+jc+' + '+jd+' = '+(ja+jb)+' × '+jc+' + '+jd+' = '+jgood+'.',{board:judgeBoard})
 ]};
 return [first,bars,powers,many,numerator,combined,bonus];
}
