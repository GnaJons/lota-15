'use strict';
const variants=[
 {words:[6,9,14,4,18],combine:[9,11,7,3,6,4,5,8],age:[1996,6,2017],sum:[44,17],larger:[9,6],smaller:[18,82],gap:25,cash:400,fruit:[3,4,3,6,7],bus:[6,24],negative:4,quad:[6,4,5],brackets:[5,2,6,3],cube:[3,7],squared:[3,4]},
 {words:[8,11,13,5,21],combine:[7,13,8,4,5,6,3,9],age:[1993,8,2016],sum:[52,23],larger:[12,8],smaller:[19,91],gap:35,cash:500,fruit:[2,7,4,5,9],bus:[7,16],negative:2,quad:[8,3,6],brackets:[6,3,8,4],cube:[4,5],squared:[4,5]},
 {words:[9,6,17,6,24],combine:[8,14,9,5,7,2,4,11],age:[1998,7,2022],sum:[48,19],larger:[11,9],smaller:[17,86],gap:45,cash:600,fruit:[4,6,2,7,10],bus:[4,25],negative:5,quad:[5,6,8],brackets:[7,4,9,2],cube:[2,8],squared:[4,2]}
];
function buildSections(seed){
 const d=variants[seed%variants.length],fmt=n=>String(n).replace('-','−').replace('.',',');
 const term=(a,v='')=>(a<0?'−':'')+(v&&Math.abs(a)===1?'':Math.abs(a))+v;
 const lin=(a,b,v='x')=>term(a,v)+(b<0?' − ':' + ')+Math.abs(b);
 const frac=(a,b)=>'<span class="fraction"><span>'+a+'</span><span>'+b+'</span></span>';
 const story=(...p)=>'<div class="story">'+p.map(t=>'<p>'+t+'</p>').join('')+'</div>';
 const math=(parts,givens={})=>'<div class="substitution-board"><div class="equation bracket-equation">'+(Array.isArray(parts)?parts:[parts]).map(x=>'<span class="math-chunk">'+x+'</span>').join('')+'</div>'+(Object.keys(givens).length?'<div class="given-values">'+Object.entries(givens).map(([v,n])=>'<span>'+v+' = '+fmt(n)+'</span>').join('')+'</div>':'')+'</div>';
 const expression=(title,board,answer,hints,explain,variables=['x'],extra={})=>({type:'expression',title,intro:'Skrifaðu bókstafastæðu sem lýsir textanum.',board,answer,variables,label:'Stæða',unit:'',inputMode:'text',inputHelp:'Skrifaðu aðeins stæðuna. Nota má t.d. 3'+variables[0]+', '+variables[0]+'/4 og sviga. Jafngildar stæður eru samþykktar.',hints,explain,wrong:'Skoðaðu hvaða aðgerð textinn lýsir og í hvaða röð hún kemur. Notaðu sviga ef aðgerðin á við heila summu.',...extra});
 const choice=(title,intro,board,options,correct,hints,explain)=>({type:'choices',title,intro,board,options,correct,hints,explain,wideChoices:true,wrong:'Lestu röð aðgerðanna. Gættu sérstaklega að því hvað er dregið frá hverju og hvort sviga þarf.'});
 const number=(title,intro,board,answer,hints,explain,extra={})=>({type:'number',title,intro,board,answer,label:'Svar',unit:'',hints,explain,wrong:'Skoðaðu aðgerðina og prófaðu að reikna eitt skref í einu.',...extra});
 const [add,less,mult,div,diff]=d.words;
 const words={name:'Orð og aðgerðir',tasks:[
  expression('Meira en x',story('<strong>'+add+' meira en x.</strong>'),'x+'+add,
   ['Byrjaðu á x. Hvað merkir „meira en“?','Leggðu '+add+' við x.'],
   'Stæðan er x + '+add+'. Einnig má skrifa '+add+' + x.'),
  choice('Summa tveggja breyta','Veldu stæðuna sem lýsir textanum.',story('<strong>Summan af p og q.</strong>'),
   ['pq','p − q','p + q',frac('p','q')],2,
   ['Summa er útkoma úr samlagningu.','Báðar breyturnar eiga að vera liðir í sömu samlagningu.'],
   'Summan er p + q. Margfeldið pq er önnur aðgerð.'),
  expression('Minna en s',story('<strong>'+less+' minna en s.</strong>'),'s-'+less,
   ['Byrjaðu á s og minnkaðu það.','Dragðu '+less+' frá s, ekki s frá '+less+'.'],
   'Stæðan er s − '+less+'.',['s']),
  expression('Margfeldi',story('<strong>Margfeldið af '+mult+' og h.</strong>'),mult+'h',
   ['Margfeldi er útkoma úr margföldun.','Stuðullinn má standa beint við bókstafinn.'],
   mult+' · h er skrifað '+mult+'h.',['h']),
  expression('Deiling með bókstaf',story('<strong>x deilt með '+div+'.</strong>'),'x/'+div,
   ['x er talan sem deilt er í.','Skrifaðu x/'+div+' í svarreitinn.'],
   'Stæðan er '+frac('x',div)+'. Brotastrikið táknar deilingu.'),
  choice('Hvað er dregið frá hverju?','Veldu rétta röð í frádrættinum.',story('<strong>Mismunur '+diff+' og x.</strong>','Taktu x frá '+diff+'.'),
   ['x − '+diff,diff+' − x',diff+' + x',term(diff,'x')],1,
   ['Fyrri talan stendur á undan frádráttarmerkinu.','Byrjaðu á '+diff+' og dragðu x frá.'],
   'Stæðan er '+diff+' − x. Röð talnanna skiptir máli í frádrætti.')
 ]};
 const [extra,multiple,sub,den,scale,inside,qi,qa]=d.combine;
 const combine={name:'Fleiri en ein aðgerð',tasks:[
  expression('Meira en margfeldi',story('<strong>'+extra+' meira en margfeldi '+multiple+' og x.</strong>'),multiple+'x+'+extra,
   ['Skrifaðu margfeldið '+multiple+'x fyrst.','Leggðu '+extra+' við margfeldið.'],
   'Stæðan er '+lin(multiple,extra)+'.'),
  choice('Deiling og frádráttur','Veldu stæðuna. Deilingin á að koma á undan frádrættinum.',story('<strong>'+sub+' minna en útkoman þegar x er deilt með '+den+'.</strong>'),
   [frac('x − '+sub,den),sub+' − '+frac('x',den),frac('x',den)+' + '+sub,frac('x',den)+' − '+sub],3,
   ['Skrifaðu x deilt með '+den+' fyrst.','Dragðu síðan '+sub+' frá útkomunni.'],
   'Stæðan er '+frac('x',den)+' − '+sub+'. Frádrátturinn er utan brotsins.'),
  expression('Margfaldaðu heila summu',story('<strong>'+scale+' sinnum summan af y og '+inside+'.</strong>'),scale+'(y+'+inside+')',
   ['Summan er y + '+inside+'.','Settu sviga utan um summuna svo '+scale+' margfaldist með henni allri.'],
   'Stæðan er '+scale+'(y + '+inside+'), jafngild '+lin(scale,scale*inside,'y')+'.',['y']),
  choice('Bættu við heila stæðu','Veldu stæðuna sem lýsir viðbótinni.',story('<strong>'+qa+' meira en x(x + '+qi+').</strong>'),
   ['x(x + '+qi+') + '+qa,'x(x + '+(qi+qa)+')',qa+'x(x + '+qi+')','x(x + '+qi+') − '+qa],0,
   ['Stæðan x(x + '+qi+') er þegar ein heild.','Bættu '+qa+' við hana. Ekki margfalda viðbótina með x.'],
   'Rétt stæða er x(x + '+qi+') + '+qa+'.')
 ]};
 const [year,before,future]=d.age,years=future-year;
 const ages={name:'Aldur og ártöl',tasks:[
  expression('Aldur nokkrum árum áður',story('Árið <strong>'+year+'</strong> var Sara <strong>x ára</strong>.','Hve gömul var hún <strong>'+before+' árum áður</strong>?'),'x-'+before,
   ['Þegar farið er aftur í tímann lækkar aldurinn.','Dragðu fjölda áranna frá x.'],
   'Aldurinn var x − '+before+' ár.'),
  number('Hversu mörg ár líða?','Finndu fyrst muninn á ártölunum.',story('Sara var x ára árið <strong>'+year+'</strong>.','Hversu mörg ár líða frá '+year+' til <strong>'+future+'</strong>?'),years,
   ['Dragðu eldra ártalið frá því yngra.','Reiknaðu '+future+' − '+year+'.'],
   future+' − '+year+' = '+years+' ár.',{unit:'ár'}),
  expression('Aldur á seinna ári',story('Sara var <strong>x ára árið '+year+'</strong>.','Hve gömul var hún <strong>árið '+future+'</strong>?'),'x+'+years,
   ['Það liðu '+years+' ár frá '+year+' til '+future+'.','Leggðu árafjöldann við aldurinn x.'],
   'Aldurinn var x + '+years+' ár.')
 ]};
 const [total,known]=d.sum,[gapSmall,small]=d.larger,[gapBig,big]=d.smaller;
 const relationships={name:'Summa og mismunur',tasks:[
  number('Finndu hina töluna','Notaðu summuna og þekktu töluna.',story('Summa tveggja talna er <strong>'+total+'</strong>.','Önnur talan er <strong>'+known+'</strong>. Hver er hin?'),total-known,
   ['Þær tvær þurfa að gefa '+total+' þegar þær eru lagðar saman.','Dragðu '+known+' frá '+total+'.'],
   total+' − '+known+' = '+(total-known)+'.'),
  expression('Þekkta talan verður x',story('Summa tveggja talna er <strong>'+total+'</strong>.','Önnur talan er <strong>x</strong>. Hver er hin?'),total+'-x',
   ['Notaðu sömu aðgerð og þegar önnur talan var þekkt.','Dragðu x frá heildarsummunni.'],
   'Hin talan er '+total+' − x. Þá er x + ('+total+' − x) = '+total+'.'),
  number('Finndu stærri töluna','Mismunurinn er stærri talan mínus sú minni.',story('Mismunur tveggja talna er <strong>'+gapSmall+'</strong>.','Minni talan er <strong>'+small+'</strong>. Hver er stærri talan?'),small+gapSmall,
   ['Stærri talan er '+gapSmall+' hærri en sú minni.','Leggðu '+gapSmall+' við '+small+'.'],
   small+' + '+gapSmall+' = '+(small+gapSmall)+'.'),
  expression('Minni talan er x',story('Mismunur tveggja talna er <strong>'+gapSmall+'</strong>.','Minni talan er <strong>x</strong>. Skrifaðu stæðu fyrir stærri töluna.'),'x+'+gapSmall,
   ['Stærri talan er hærri en x.','Leggðu mismuninn við minni töluna.'],
   'Stærri talan er x + '+gapSmall+'.'),
  number('Finndu minni töluna','Nú er stærri talan gefin.',story('Mismunur tveggja talna er <strong>'+gapBig+'</strong>.','Stærri talan er <strong>'+big+'</strong>. Hver er minni talan?'),big-gapBig,
   ['Minni talan er '+gapBig+' lægri en sú stærri.','Dragðu '+gapBig+' frá '+big+'.'],
   big+' − '+gapBig+' = '+(big-gapBig)+'.'),
  expression('Stærri talan er x',story('Mismunur tveggja talna er <strong>'+gapBig+'</strong>.','Stærri talan er <strong>x</strong>. Skrifaðu stæðu fyrir minni töluna.'),'x-'+gapBig,
   ['Nú táknar x stærri töluna.','Dragðu mismuninn frá henni.'],
   'Minni talan er x − '+gapBig+'.')
 ]};
 const moneyStory=story('Arna á <strong>x kr.</strong>','Höllu vantar <strong>'+d.gap+' kr.</strong> upp á að eiga tvöfalt eins mikið og Arna.');
 const money={name:'Peningar og samanburður',tasks:[
  expression('Hvað á Halla mikið?',moneyStory,'2x-'+d.gap,
   ['Tvöföld upphæð Örnu er 2x.','Halla á '+d.gap+' kr. minna en það.'],
   'Halla á 2x − '+d.gap+' kr.'),
  expression('Hvað eiga þær samtals?',moneyStory,'3x-'+d.gap,
   ['Leggðu upphæð Örnu við upphæð Höllu.','Stæðan er x + (2x − '+d.gap+').'],
   'Saman eiga þær x + (2x − '+d.gap+') = 3x − '+d.gap+' kr.'),
  number('Prófaðu stæðuna með tölu','Hvað eiga þær samtals ef Arna á '+d.cash+' kr.?',moneyStory+ '<p class="story-count">x = '+d.cash+'</p>',3*d.cash-d.gap,
   ['Settu x = '+d.cash+' í stæðuna 3x − '+d.gap+'.','Þú getur líka fundið upphæð Höllu fyrst og lagt upphæð Örnu við.'],
   d.cash+' + '+(2*d.cash-d.gap)+' = '+(3*d.cash-d.gap)+' kr.',{unit:'kr.'})
 ]};
 const [pears,missing,boxes,target,offset]=d.fruit,one=pears+1,fruitStory=story('Í einum kassa eru <strong>x epli</strong> og <strong>'+lin(pears,-missing)+' perur</strong>.');
 const [tickets,increase]=d.bus,busStory=story('Einn strætómiði kostar <strong>m kr.</strong> í ár.','Á næsta ári hækkar verð <strong>hvers miða um x kr.</strong>');
 const n=d.negative,[a,b,c]=d.quad,[ba,bb,bc,bd]=d.brackets,[ca,cb]=d.cube,[sa,sb]=d.squared;
 const bonus={name:'Aukaáskorun',optional:true,tasks:[
  choice('Ávextir í einum kassa','Veldu stæðu fyrir heildarfjölda ávaxta í einum kassa.',fruitStory,
   [lin(one,-missing),lin(pears,-missing),lin(one,missing),term(one,'x')],0,
   ['Leggðu eplin og perurnar saman.','x + ('+lin(pears,-missing)+') gefur eina einfalda stæðu.'],
   'Í einum kassa eru '+lin(one,-missing)+' ávextir.'),
  expression('Fleiri eins kassar',fruitStory+ '<p class="story-count">'+boxes+' eins kassar</p>',boxes*one+'x-'+boxes*missing,
   ['Margfaldaðu fjöldann í einum kassa með '+boxes+'.','Notaðu '+boxes+'('+lin(one,-missing)+'). Margfaldaðu báða liðina.'],
   'Heildarfjöldinn er '+boxes+'('+lin(one,-missing)+') = '+lin(boxes*one,-boxes*missing)+'.',['x'],{intro:'Skrifaðu stæðu fyrir heildarfjölda ávaxta í kössunum.'}),
  expression('Hvað þarf að bæta við?',fruitStory+ '<p class="story-count">Markmið í einum kassa: '+lin(target,offset)+'</p>',(target-one)+'x+'+(offset+missing),
   ['Byrjaðu á einum upprunalegum kassa. Dragðu núverandi fjölda frá markmiðinu.','('+lin(target,offset)+') − ('+lin(one,-missing)+').'],
   'Bæta þarf við '+lin(target-one,offset+missing)+' eplum.',['x'],{intro:'Hve mörgum eplum þarf að bæta í einn kassa svo heildarfjöldinn verði eins og markmiðið segir?'}),
  expression('Miðar á verði þessa árs',busStory,tickets+'m',
   ['Hver miði kostar m kr.','Margfaldaðu verð eins miða með '+tickets+'.'],
   tickets+' miðar kosta '+tickets+'m kr.',['m'],{intro:'Skrifaðu stæðu fyrir kostnaði við '+tickets+' miða í ár.'}),
  expression('Miðar eftir verðhækkun',busStory,tickets+'(m+x)',
   ['Hver miði mun kosta m + x kr.','Margfaldaðu allt nýja verðið með '+tickets+'.'],
   tickets+' miðar munu kosta '+tickets+'(m + x) = '+tickets+'m + '+tickets+'x kr.',['m','x'],{intro:'Skrifaðu stæðu fyrir kostnaði við '+tickets+' miða á næsta ári.'}),
  number('Hversu mikil er heildarhækkunin?','Hve miklu meira kosta '+tickets+' miðar ef hver miði hækkar um '+increase+' kr.?',busStory+ '<p class="story-count">x = '+increase+'</p>',tickets*increase,
   ['Hækkunin leggst á hvern miða. Ekki þarf að vita gamla verðið m.','Reiknaðu '+tickets+' · '+increase+'.'],
   tickets+' · '+increase+' = '+tickets*increase+' kr.',{unit:'kr.'}),
  number('Neikvætt x í annars stigs stæðu','Reiknaðu gildið.',math([term(a,'x')+'<sup>2</sup>','− '+term(b,'x'),'+ '+c],{x:-n}),a*n*n+b*n+c,
   ['(−'+n+')² = '+n*n+'.','Mínus '+b+' sinnum neikvætt x gefur jákvæðan lið.'],
   a*n*n+' + '+b*n+' + '+c+' = '+(a*n*n+b*n+c)+'.'),
  number('Innsetning og tveir svigar','Reiknaðu gildið.',math(['('+lin(ba,bb)+')','− ('+bc+' − '+term(bd,'x')+')'],{x:-n}),-(ba+bd)*n+bb-bc,
   ['Mínusinn fyrir framan seinni svigann breytir báðum formerkjunum.','Einfölduð stæða er '+lin(ba+bd,bb-bc)+'.'],
   'Þegar x = −'+n+' er gildið '+fmt(-(ba+bd)*n+bb-bc)+'.'),
  number('Þriðja veldi neikvæðrar tölu','Reiknaðu gildið. Gættu að formerki þriðja veldisins.',math([term(ca,'x')+'<sup>3</sup>','+ '+term(cb,'x')],{x:-n}),-ca*n*n*n-cb*n,
   ['(−'+n+')³ = −'+n*n*n+'. Þrír neikvæðir þættir gefa neikvætt margfeldi.','Margfaldaðu veldið með '+ca+' og leggðu '+cb+' · (−'+n+') við.'],
   fmt(-ca*n*n*n)+' − '+cb*n+' = '+fmt(-ca*n*n*n-cb*n)+'.'),
  number('Heill svigi í öðru veldi','Reiknaðu fyrst inni í sviganum og taktu síðan veldið.',math(['(x − '+sa+')<sup>2</sup>','+ '+term(sb,'x')],{x:-n}),(n+sa)**2-sb*n,
   ['Svigi gefur −'+n+' − '+sa+' = −'+(n+sa)+'.','Taktu (−'+(n+sa)+')² og leggðu '+sb+' · (−'+n+') við.'],
   (n+sa)**2+' − '+sb*n+' = '+((n+sa)**2-sb*n)+'.')
 ]};
 return [words,combine,ages,relationships,money,bonus];
}
