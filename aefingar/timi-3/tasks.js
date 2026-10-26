
'use strict';
const variants=[
 {p:[14,5,3],eight:[7,234],nine:[876,4],balls:[7,6,4,2],bakery:[100,3,40],f1:[180,3,4,3,3,24],f2:[5,3,4,10,2,3,1,4,3,2],f3:[2,6,3,2,5,3,4,7],fuel:[2.4,2.5,1.2],juice:[6.4,3,2,2,250]},
 {p:[18,7,4],eight:[8,3456],nine:[765,3],balls:[8,9,5,3],bakery:[90,4,30],f1:[140,2,5,2,6,72],f2:[4,2,3,8,2,3,1,3,2,1],f3:[3,4,2,3,4,4,6,5],fuel:[3.2,3.25,1.6],juice:[7.2,7,4,4,280]},
 {p:[20,6,5],eight:[9,456],nine:[654,2],balls:[9,7,4,3],bakery:[150,2,60],f1:[210,4,4,4,7,88],f2:[6,5,4,9,3,2,2,2,5,3],f3:[2,7,5,2,6,2,2,8],fuel:[1.8,4.5,1.5],juice:[9.6,5,4,5,320]}
];
function buildSections(seed){
 const d=variants[seed%variants.length],pow=(b,n)=>b+'<sup>'+n+'</sup>';
 const frac=(a,b)=>'<span class="fraction"><span>'+a+'</span><span>'+b+'</span></span>';
 const fmt=n=>{const [whole,decimal]=String(n).split('.');return whole.replace(/\B(?=(\d{3})+(?!\d))/g,' ')+(decimal?','+decimal:'')};
 const eq=s=>'<div class="equation">'+s+'</div>',parts=(a,b)=>'<span class="math-chunk">'+a+'</span><span class="math-chunk">'+b+'</span>';
 const story=s=>'<div class="story">'+s+'</div>';
 const num=(title,intro,expr,answer,hints,explain,extra={})=>({type:'number',title,intro,board:eq(expr),answer,label:'Svar',unit:'',hints,explain,...extra});
 const pick=(title,intro,expr,options,correct,hints,explain,extra={})=>({type:'choices',title,intro,board:eq(expr),options,correct,hints,explain,...extra});
 const [a,b,c]=d.p;
 const scope={name:'Hvað er hafið í veldi?',tasks:[
  num('Veldið nær aðeins yfir eina tölu','Reiknaðu stæðuna.',a+' + '+b+' × '+pow(c,2),a+b*c*c,
   ['Reiknaðu veldið á undan margföldun og samlagningu.',pow(c,2)+' = '+c*c+'. Margfaldaðu með '+b+' og leggðu svo '+a+' við.'],
   a+' + '+b+' × '+c*c+' = '+a+' + '+b*c*c+' = '+(a+b*c*c)+'.'),
  pick('Hvað á að hefja í annað veldi?','Veldu allan hlutann sem veldisvísirinn á við.',a+' + '+pow('('+b+' × '+c+')',2),
   [String(c),b+' × '+c,a+' + '+b+' × '+c],1,
   ['Veldisvísirinn stendur fyrir utan svigann.','Allt sem er inni í sviganum er stofn veldisins.'],
   'Margfeldið '+b+' × '+c+' er allt hafið í annað veldi. Talan '+a+' er utan svigans.'),
  num('Margfeldið í öðru veldi','Reiknaðu stæðuna.',a+' + '+pow('('+b+' × '+c+')',2),a+(b*c)**2,
   ['Reiknaðu margfeldið inni í sviganum fyrst.',b+' × '+c+' = '+b*c+'. Næst kemur '+pow(b*c,2)+'.'],
   a+' + '+pow(b*c,2)+' = '+a+' + '+fmt((b*c)**2)+' = '+fmt(a+(b*c)**2)+'.'),
  num('Nú er summan líka inni í sviganum','Reiknaðu allt inni í sviganum áður en þú tekur annað veldi.',pow('('+a+' + '+b+' × '+c+')',2),(a+b*c)**2,
   ['Inni í sviganum kemur margföldun á undan samlagningu.',a+' + '+b*c+' = '+(a+b*c)+'. Hefðu þá tölu í annað veldi.'],
   pow(a+b*c,2)+' = '+fmt((a+b*c)**2)+'.'),
  num('Neikvæð tala inni í sviganum','Reiknaðu stæðuna. Gættu að formerkinu þegar þú tekur annað veldi.',pow('('+a+' − '+b+' × '+c+')',2),(a-b*c)**2,
   ['Reiknaðu fyrst margfeldið og síðan frádráttinn inni í sviganum.',a+' − '+b*c+' = '+(a-b*c)+'. Neikvæð tala margfölduð með sjálfri sér gefur jákvætt svar.'],
   pow('('+(a-b*c)+')',2)+' = ('+(a-b*c)+') × ('+(a-b*c)+') = '+(a-b*c)**2+'.')
 ]};
 const [add,n8]=d.eight,[n9,last]=d.nine;
 const arithmetic={name:'Margföldun á undan samlagningu',tasks:[
  num('Stór tala, sama aðferð','Reiknaðu stæðuna. Þú mátt nota vasareikni.',add+' + '+fmt(n8)+' × 8',add+n8*8,
   ['Stærð talnanna breytir ekki röð reikniaðgerða.','Reiknaðu '+fmt(n8)+' × 8 fyrst. Leggðu síðan '+add+' við.'],
   add+' + '+fmt(n8*8)+' = '+fmt(add+n8*8)+'.'),
  num('Leggðu við að lokum','Reiknaðu stæðuna.',fmt(n9)+' × 9 + '+last,n9*9+last,
   ['Margföldunin kemur á undan samlagningunni.','Finndu '+fmt(n9)+' × 9 og leggðu síðan '+last+' við.'],
   fmt(n9*9)+' + '+last+' = '+fmt(n9*9+last)+'.')
 ]};
 const [boxes,per,sold,returned]=d.balls,total=boxes*per,soldBalls=sold*per,returns=sold*returned,ballLeft=total-soldBalls+returns;
 const ballStory=story('<p>Í íþróttabúð koma <strong>'+boxes+' kassar</strong> með <strong>'+per+' boltum</strong> í hverjum. Engir boltar voru í búðinni fyrir.</p><p>Allir boltarnir úr <strong>'+sold+' kössum</strong> seljast. Síðan er <strong>'+returned+' boltum úr hverjum þessara '+sold+' kassa</strong> skilað aftur í búðina.</p>');
 const ballExpr=boxes+' × '+per+' − '+sold+' × '+per+' + '+sold+' × '+returned;
 const stock={name:'Boltar: sala og skil',tasks:[
  pick('Hvaða stæða lýsir stöðunni?','Veldu stæðuna sem gefur fjölda bolta í búðinni eftir söluna og skilin.','',
   [ballExpr,boxes+' × '+per+' − '+sold+' + '+returned,boxes+' × '+per+' − '+sold+' × '+per+' − '+sold+' × '+returned,boxes+' × '+per+' − '+sold+' × '+per+' + '+returned],0,
   ['Byrjaðu á öllum boltunum. Dragðu seldan fjölda frá og bættu skilunum við.','Skilin eru '+returned+' boltar úr hverjum af '+sold+' seldum kössum. Því margfaldarðu '+sold+' × '+returned+'.'],
   'Fyrsti liðurinn telur alla boltana, annar þá sem seldust og sá þriðji þá sem komu aftur.',{board:ballStory,wrong:'Sala fækkar boltum, skil fjölga þeim. Margfalda þarf bæði fjölda seldra kassa og fjölda kassa sem skilað er úr með viðeigandi boltamagni.'}),
  num('Hve mörgum boltum er skilað?','Finndu fjölda bolta sem koma aftur í búðina.','',returns,
   ['Það er skilað úr öllum kössunum sem seldust.',sold+' kassar × '+returned+' boltar úr hverjum.'],
   sold+' × '+returned+' = '+returns+'. Það er því skilað '+returns+' boltum.',{board:ballStory,unit:'boltar'}),
  num('Hve margir boltar eru eftir?','Reiknaðu lokafjöldann í búðinni.','',ballLeft,
   ['Byrjaðu á heildarfjöldanum, dragðu söluna frá og leggðu skilin við.',total+' − '+soldBalls+' + '+returns+'.'],
   ballExpr+' = '+total+' − '+soldBalls+' + '+returns+' = '+ballLeft+' boltar.',{board:ballStory,unit:'boltar'})
 ]};
 const [rate,hours,percent]=d.bakery,baked=rate*hours,afterFirst=baked*(100-percent)/100,final=afterFirst/2;
 const bakeryStory=story('<p>Bakarí bakar <strong>'+rate+' kleinur á klukkustund</strong> í <strong>'+hours+' klukkustundir</strong>. Á þeim tíma seljast <strong>'+percent+'%</strong> af öllum kleinunum sem bakaðar eru.</p><p>Næstu klukkustund eru ekki bakaðar fleiri kleinur, en þá selst <strong>helmingur þeirra sem eftir eru</strong>.</p>');
 const bakery={name:'Kleinur: prósenta og helmingur',tasks:[
  num('Hve margar kleinur eru bakaðar?','Finndu heildarfjöldann sem er bakaður.','',baked,
   ['Margfaldaðu fjöldann á klukkustund með fjölda klukkustunda.',rate+' × '+hours+'.'],
   rate+' × '+hours+' = '+baked+' kleinur eru bakaðar.',{board:bakeryStory,unit:'stk.'}),
  num('Hve margar eru eftir fyrstu söluna?','Finndu fjöldann sem er óseldur eftir að '+percent+'% hafa selst.','',afterFirst,
   ['Finndu hvaða prósenta er eftir: 100% mínus selda prósentan.','Eftir eru '+(100-percent)+'% af '+baked+' kleinum.'],
   baked+' × '+fmt((100-percent)/100)+' = '+afterFirst+' kleinur eru eftir.',{board:bakeryStory,unit:'stk.',wrong:'Spurt er um það sem er eftir. Dragðu selda prósentu frá 100% áður en þú reiknar fjöldann.'}),
  pick('Helmingur af hverju?','Á hvaða fjölda á að reikna helminginn í síðustu sölunni?','',
   ['Öllum '+baked+' kleinunum sem voru bakaðar.',afterFirst+' kleinunum sem eru eftir fyrstu söluna.',(baked-afterFirst)+' kleinunum sem seldust í fyrri sölunni.'],1,
   ['Lestu sérstaklega orðin „þeirra sem eftir eru“.','Viðmið síðustu sölunnar er það sem er enn óselt.'],
   'Helmingurinn reiknast af '+afterFirst+' kleinum, því það er fjöldinn sem er eftir.',{board:bakeryStory}),
  num('Hve margar verða óseldar að lokum?','Finndu hve margar af þessum kleinum eru óseldar eftir báðar sölurnar.','',final,
   ['Eftir fyrstu söluna eru '+afterFirst+' kleinur eftir. Síðan selst helmingur þeirra.','Þegar helmingur selst verður hinn helmingurinn eftir. Deildu '+afterFirst+' með 2.'],
   afterFirst+' − '+frac(afterFirst,2)+' = '+final+' kleinur verða óseldar.',{board:bakeryStory,unit:'stk.'})
 ]};
 const [aa,ab,ac,ad,ae,af]=d.f1,top1=aa-ab*ac**3,den1=ad**2+ae,f1=top1/den1+af/16;
 const [ba,bb,bc,bd,be,bf,bg,bh,bi,bj]=d.f2,top2=ba**3-bb*bc**2+bd,den2=be**bf-bg,out2=bh*bi**2-bj,num2=top2+out2*den2;
 const [ca,cb,cc,cd,ce,cf,cg,ch]=d.f3,top3=ca**cb-cc**cd,den3=ce+cf,f3=top3/den3*cg+ch**2;
 const [flow,time,tank]=d.fuel,used=flow*1000*time,remaining=tank*10000-used;
 const fuelStory=story('<p>Flugvél notar að meðaltali <strong>'+fmt(flow)+' × '+pow(10,3)+' L á klukkustund</strong>. Hún flýgur í <strong>'+fmt(time)+' klukkustundir</strong>.</p><p>Við upphaf ferðar eru <strong>'+fmt(tank)+' × '+pow(10,4)+' L</strong> af eldsneyti í tankinum.</p>');
 const [production,timeN,timeD,sent,price]=d.juice,produced=production*100*timeN/timeD,left=produced-sent*100,revenue=left*price;
 const juiceStory=story('<p>Verksmiðja framleiðir <strong>'+fmt(production)+' × '+pow(10,2)+' safakassa á klukkustund</strong>. Engir kassar eru í salnum þegar framleiðslan hefst.</p><p>Eftir <strong>'+frac(timeN,timeD)+' klst.</strong> framleiðslu eru <strong>'+sent+' × '+pow(10,2)+' kassar</strong> sendir í verslanir. Kassarnir sem eftir eru seljast síðan á <strong>'+price+' kr. stykkið</strong>.</p>');
 const extra={name:'Aukaáskorun',optional:true,tasks:[
  num('Tvö brot í sömu stæðu','Reiknaðu brotin hvort fyrir sig og leggðu saman.',parts(frac(aa+' − '+ab+' × '+pow(ac,3),pow(ad,2)+' + '+ae),'+ '+frac(af,pow(2,4))),f1,
   ['Reiknaðu teljara og nefnara hvors brots samkvæmt röð reikniaðgerða.','Fyrra brotið er '+frac(top1,den1)+' og síðara brotið er '+frac(af,16)+'.'],
   fmt(top1/den1)+' + '+fmt(af/16)+' = '+fmt(f1)+'.'),
  pick('Brot og svigi','Reiknaðu stæðuna og veldu nákvæmt svar sem brot.',parts(frac(pow(ba,3)+' − '+bb+' × '+pow(bc,2)+' + '+bd,pow(be,bf)+' − '+bg),'+ ('+bh+' × '+pow(bi,2)+' − '+bj+')'),
   [frac(top2+out2,den2),frac(num2,den2),frac(top2-out2*den2,den2),frac(num2,den2+1)],1,
   ['Reiknaðu brotið og svigann sitt í hvoru lagi. Sviginn er utan við brotið.','Þú færð '+frac(top2,den2)+' + '+out2+'. Skrifaðu '+out2+' með nefnaranum '+den2+' áður en þú leggur saman.'],
   frac(top2,den2)+' + '+out2+' = '+frac(top2,den2)+' + '+frac(out2*den2,den2)+' = '+frac(num2,den2)+'.'),
  num('Margföldun á eftir broti','Reiknaðu stæðuna. Ekki námunda milliniðurstöður.',parts(frac(pow(ca,cb)+' − '+pow(cc,cd),ce+' + '+cf),'× '+cg+' + '+pow(ch,2)),f3,
   ['Reiknaðu gildin í brotinu. Margfaldaðu svo brotið áður en þú leggur síðasta veldið við.','Þú færð '+frac(top3,den3)+' × '+cg+' + '+ch**2+'.'],
   fmt(top3/den3*cg)+' + '+ch**2+' = '+fmt(f3)+'.'),
  num('Hve mikið eldsneyti eyðist?','Reiknaðu eldsneytisnotkun ferðarinnar miðað við meðaleyðsluna.','',used,
   ['Breyttu veldaritanum í lítra á klukkustund og margfaldaðu með flugtímanum.',fmt(flow)+' × '+pow(10,3)+' = '+fmt(flow*1000)+' L á klukkustund.'],
   fmt(flow*1000)+' × '+fmt(time)+' = '+fmt(used)+' L eyðast.',{board:fuelStory,unit:'L'}),
  num('Hve mikið er eftir í tankinum?','Dragðu notkun ferðarinnar frá eldsneytinu sem var í tankinum við upphaf.','',remaining,
   ['Breyttu upphafsmagninu úr veldariti í lítra.',fmt(tank)+' × '+pow(10,4)+' = '+fmt(tank*10000)+' L. Dragðu '+fmt(used)+' L frá.'],
   fmt(tank*10000)+' − '+fmt(used)+' = '+fmt(remaining)+' L eru eftir.',{board:fuelStory,unit:'L'}),
  num('Hve margir safakassar eru eftir?','Finndu fjöldann í salnum eftir framleiðsluna og sendinguna.','',left,
   ['Margfaldaðu framleiðslu á klukkustund með tímanum. Dragðu síðan sendu kassana frá.',fmt(production*100)+' × '+frac(timeN,timeD)+' = '+fmt(produced)+' kassar eru framleiddir.'],
   fmt(produced)+' − '+fmt(sent*100)+' = '+fmt(left)+' kassar eru eftir.',{board:juiceStory,unit:'stk.'}),
  num('Hver verður heildarveltan?','Allir kassarnir sem eftir eru seljast. Finndu heildarsöluverðið.','',revenue,
   ['Margfaldaðu fjölda kassa sem eftir eru með verði hvers kassa.',fmt(left)+' kassar × '+price+' kr. á kassa.'],
   fmt(left)+' × '+price+' = '+fmt(revenue)+' kr.',{board:juiceStory,unit:'kr.'})
 ]};
 return [scope,arithmetic,stock,bakery,extra];
}
