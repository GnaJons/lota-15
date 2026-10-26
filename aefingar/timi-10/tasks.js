'use strict';
const variants=[
 {side:12,perimeter:100,product:[42,6],quotient:[6,84,11],percent:[15,8,400,500],fruit:[2,4,2],average:[96,144,4,8],milk:[3,4,5,6]},
 {side:15,perimeter:132,product:[56,7],quotient:[7,105,12],percent:[25,12,320,750],fruit:[4,6,4],average:[125,175,5,7],milk:[4,5,6,3]},
 {side:18,perimeter:156,product:[63,9],quotient:[8,120,13],percent:[30,6,250,800],fruit:[6,7,2],average:[180,240,6,8],milk:[5,3,4,7]}
];
function buildSections(seed){
 const d=variants[seed%variants.length],round=n=>Math.round(n*1e10)/1e10,fmt=n=>String(round(n)).replace('-','−').replace('.',',');
 const frac=(a,b)=>'<span class="fraction"><span>'+a+'</span><span>'+b+'</span></span>';
 const story=(...p)=>'<div class="story">'+p.map(t=>'<p>'+t+'</p>').join('')+'</div>';
 const math=(parts,note='')=>'<div class="substitution-board"><div class="equation bracket-equation">'+(Array.isArray(parts)?parts:[parts]).map(t=>'<span class="math-chunk">'+t+'</span>').join('')+'</div>'+(note?'<p class="given-note">'+note+'</p>':'')+'</div>';
 const expression=(title,intro,board,answer,variables,hints,explain,extra={})=>({type:'expression',title,intro,board,answer,variables,label:'Stæða',unit:'',inputMode:'text',inputHelp:'Skrifaðu aðeins stæðuna. Nota má t.d. 3'+variables[0]+', '+variables[0]+'/4 og tugabrotskommu. Jafngildar stæður eru samþykktar.',hints,explain,wrong:'Skoðaðu hvað er gefið og hvað á að finna. Hugsaðu hvort margfalda eigi eða deila og hvort prósentan sé hluti eða heildarbreyting.',...extra});
 const number=(title,intro,board,answer,hints,explain,extra={})=>({type:'number',title,intro,board,answer:round(answer),label:'Svar',unit:'',hints,explain,wrong:'Farðu yfir aðgerðina og hvað svarið á að tákna. Vísbendingin getur hjálpað.',...extra});
 const choice=(title,intro,board,options,correct,hints,explain,extra={})=>({type:'choices',title,intro,board,options,correct,hints,explain,wideChoices:true,wrong:'Tengdu hvern bókstaf við það sem hann táknar. Athugaðu röð aðgerða og eininguna.',...extra});
 const square=(label,note)=>'<div class="square-board"><svg viewBox="0 0 360 270" role="img" aria-label="Ferningur með fjórum jafn löngum hliðum, hver merkt '+label+'."><rect x="105" y="50" width="150" height="150" rx="0" fill="#edf3ef" stroke="#586b6c" stroke-width="2"/><path d="M105 64h14V50 M241 50v14h14 M255 186h-14v14 M119 200v-14h-14" fill="none" stroke="#7c8c87" stroke-width="1.5"/><path d="M176 45v10 M176 195v10 M100 121h10 M250 121h10" stroke="#ac572e" stroke-width="2"/><g fill="#24343b" font-family="Cambria,Georgia,serif" font-size="22" text-anchor="middle"><text x="180" y="32">'+label+'</text><text x="180" y="231">'+label+'</text><text x="70" y="132">'+label+'</text><text x="290" y="132">'+label+'</text></g></svg><p class="given-note">'+note+'</p></div>';
 const a=d.side,p=d.perimeter;
 const squares={name:'Ferningar og ummál',tasks:[
  choice('Hvaða aðgerð gefur ummálið?','Ummál er lengdin allan hringinn í kringum ferninginn.',square(a+' cm','Allar fjórar hliðarnar eru jafn langar.'),
   [a+'<sup>2</sup>','2 · '+a,'4 · '+a,a+' + 4'],2,
   ['Leggðu lengdir allra hliðanna saman.','Fjórar jafn langar hliðar gefa fjórum sinnum hliðarlengdina.'],
   'Ummálið fæst með 4 · '+a+'. Veldið '+a+'² myndi gefa flatarmálið.'),
  number('Reiknaðu ummálið','Hvert er ummál ferningsins?',square(a+' cm','Leggðu saman lengdir allra fjögurra hliðanna.'),4*a,
   ['Ummál fernings er fjórum sinnum hliðarlengdin.','Reiknaðu 4 · '+a+'.'],
   '4 · '+a+' = '+4*a+' cm.',{unit:'cm'}),
  expression('Hliðarlengdin verður a','Skrifaðu stæðu fyrir ummálið.',square('a','Hver hlið hefur lengdina a.'),'4a',['a'],
   ['Sama lengd kemur fjórum sinnum fyrir.','a + a + a + a má skrifa sem margfeldi.'],
   'Ummálið er a + a + a + a = 4a.'),
  number('Finndu hliðarlengdina','Ummálið er gefið. Hver er lengd einnar hliðar?',square('?','Ummál = '+p+' cm'),p/4,
   ['Ummálið skiptist jafnt á fjórar hliðar.','Deildu '+p+' með 4.'],
   p+' ÷ 4 = '+p/4+' cm.',{label:'Hlið',unit:'cm'}),
  expression('Ummálið verður u','Skrifaðu stæðu fyrir lengd einnar hliðar.',square('?','Ummál = u cm'),'u/4',['u'],
   ['u táknar alla leiðina í kringum ferninginn.','Deildu ummálinu jafnt á fjórar hliðar.'],
   'Hliðarlengdin er '+frac('u',4)+' cm.',{label:'Hlið',unit:'cm'})
 ]};
 const [prod,known]=d.product,[quot,total,den]=d.quotient;
 const ratioBoard=(more)=>math(frac('A','B')+' = '+quot,'B ≠ 0'+(more?' · '+more:''));
 const relations={name:'Margfeldi og deiling',tasks:[
  number('Finndu hinn þáttinn','Margfeldi tveggja talna er gefið.',story('Margfeldi tveggja talna er <strong>'+prod+'</strong>.','Önnur talan er <strong>'+known+'</strong>. Hver er hin?'),prod/known,
   ['Þú leitar að tölu sem gefur '+prod+' þegar hún er margfölduð með '+known+'.','Deildu '+prod+' með '+known+'.'],
   prod+' ÷ '+known+' = '+prod/known+'.'),
  choice('Þekkti þátturinn er x','Veldu stæðu fyrir hina töluna.',story('Margfeldi tveggja talna er <strong>'+prod+'</strong>.','Önnur talan er <strong>x</strong>, þar sem x ≠ 0.'),
   [frac('x',prod),frac(prod,'x'),prod+'x',prod+' − x'],1,
   ['Margföldun með x á að gefa '+prod+'.','Deildu margfeldinu með þekkta þættinum.'],
   'Hin talan er '+frac(prod,'x')+'. Þá er x · '+frac(prod,'x')+' = '+prod+'.'),
  number('Finndu töluna sem deilt er með','Finndu B þegar A = '+total+'.',ratioBoard('A = '+total),total/quot,
   ['A er '+quot+' sinnum B.','B fæst því með því að deila A með '+quot+'.'],
   'B = '+frac(total,quot)+' = '+total/quot+'.',{label:'B'}),
  expression('Finndu B út frá x','A = x. Skrifaðu stæðuna sem kemur hægra megin við B =.',ratioBoard('A = x, x ≠ 0'),'x/'+quot,['x'],
   ['Sambandið er A = '+quot+'B.','Deildu x með '+quot+' til að finna B.'],
   'B = '+frac('x',quot)+'.',{label:'B'}),
  number('Finndu töluna sem deilt er í','Finndu A þegar B = '+den+'.',ratioBoard('B = '+den),quot*den,
   ['A verður '+quot+' sinnum B.','Margfaldaðu '+den+' með '+quot+'.'],
   'A = '+quot+' · '+den+' = '+quot*den+'.',{label:'A'}),
  expression('Finndu A út frá x','B = x. Skrifaðu stæðuna sem kemur hægra megin við A =.',ratioBoard('B = x, x ≠ 0'),quot+'x',['x'],
   ['Nú táknar x töluna sem deilt er með.','Margfaldaðu x með '+quot+'.'],
   'A = '+quot+'x.',{label:'A'})
 ]};
 const [up,down,xValue,yValue]=d.percent,upPart=up/100,upWhole=1+upPart,downPart=down/100,downWhole=1-downPart;
 const percent={name:'Prósentur í stæðum',tasks:[
  expression('Prósenta af x','Skrifaðu stæðu fyrir hlutann sem prósentan táknar.',math(up+'% af x'),fmt(upPart)+'x',['x'],
   ['Prósent merkir af hundraði.','Skrifaðu '+up+'% sem '+fmt(upPart)+' og margfaldaðu með x.'],
   up+'% af x er '+frac(up,100)+'x = '+fmt(upPart)+'x.'),
  expression('x hækkað um prósentu','Skrifaðu stæðu fyrir nýja gildið eftir hækkun.',story('<strong>x hækkað um '+up+'% af x.</strong>'),fmt(upWhole)+'x',['x'],
   ['Upphaflega gildið x þarf líka að vera með.','Leggðu '+fmt(upPart)+'x við x.'],
   'x + '+fmt(upPart)+'x = '+fmt(upWhole)+'x. Nýja gildið er '+(100+up)+'% af upphaflega gildinu.'),
  number('Prófaðu hækkunina','Finndu nýja gildið þegar x = '+xValue+'.',math('x hækkað um '+up+'%','x = '+xValue),upWhole*xValue,
   ['Margfaldaðu '+xValue+' með '+fmt(upWhole)+'.','Þú mátt líka finna '+up+'% af '+xValue+' og leggja hækkunina við.'],
   xValue+' + '+fmt(upPart*xValue)+' = '+fmt(upWhole*xValue)+'.'),
  expression('Prósenta af y','Skrifaðu stæðu fyrir hlutann.',math(down+'% af y'),fmt(downPart)+'y',['y'],
   ['Deildu prósentutölunni með 100.','Margfaldaðu y með '+fmt(downPart)+'.'],
   down+'% af y er '+fmt(downPart)+'y.'),
  expression('y lækkað um prósentu','Skrifaðu stæðu fyrir nýja gildið eftir lækkun.',story('<strong>y lækkað um '+down+'% af y.</strong>'),fmt(downWhole)+'y',['y'],
   ['Dragðu lækkunina frá upphaflega gildinu y.','Stæðan er y − '+fmt(downPart)+'y.'],
   'y − '+fmt(downPart)+'y = '+fmt(downWhole)+'y. Eftir standa '+(100-down)+'%.'),
  number('Prófaðu lækkunina','Finndu nýja gildið þegar y = '+yValue+'.',math('y lækkað um '+down+'%','y = '+yValue),downWhole*yValue,
   ['Margfaldaðu '+yValue+' með '+fmt(downWhole)+'.','Þú mátt líka finna lækkunina og draga hana frá upphaflega gildinu.'],
   yValue+' − '+fmt(downPart*yValue)+' = '+fmt(downWhole*yValue)+'.')
 ]};
 const [groups,apples,pears]=d.fruit;
 const fruits=(formula)=>story('Epli kostar <strong>x kr.</strong> og pera <strong>y kr.</strong>')+math(formula);
 const [paidA,paidB,countA,countB]=d.average,sum=paidA+paidB;
 const averageStory=story('Pétur keypti <strong>a appelsínur</strong> og borgaði <strong>'+paidA+' kr.</strong>','Lísa keypti <strong>b appelsínur</strong> og borgaði <strong>'+paidB+' kr.</strong>');
 const milkStory=story('Arnar keypti <strong>x lítra</strong> af mjólk.','Eva keypti <strong>y lítra</strong>.');
 const [m1,m2,m3,m4]=d.milk,multWord={3:'þrefalt',4:'fjórfalt',5:'fimmfalt',6:'sexfalt',7:'sjöfalt'},partWord={4:'fjórðung',5:'fimmtung',6:'sjöttung'};
 const bonus={name:'Aukaáskorun',optional:true,tasks:[
  choice('Hvað táknar summan?','Veldu lýsinguna sem passar við stæðuna.',fruits('x + y'),
   ['Verð á tveimur eplum.','Verð á einu epli og einni peru.','Fjölda epla og pera.','Verð á tveimur perum.'],1,
   ['x og y tákna verð, ekki fjölda ávaxta.','Einu verði af hvorri tegund er bætt saman.'],
   'x + y er heildarverð á einu epli og einni peru. Einingin er kr.'),
  number('Hve mörg epli eru keypt?','Stæðan táknar heildarverð. Finndu fjölda epla.',fruits(groups+'(x + y)'),groups,
   ['Margfaldarinn nær til beggja liða svigans.','Stæðan jafngildir '+groups+'x + '+groups+'y.'],
   'Keypt eru '+groups+' epli.',{label:'Fjöldi epla',unit:'epli'}),
  number('Hve margar perur eru keyptar?','Finndu nú fjölda pera í sömu kaupum.',fruits(groups+'(x + y)'),groups,
   ['Allur sviginn margfaldast með '+groups+'.','Stuðullinn við y segir til um fjölda pera.'],
   'Keyptar eru '+groups+' perur.',{label:'Fjöldi pera',unit:'perur'}),
  choice('Ólíkur fjöldi ávaxta','Veldu lýsingu á því sem stæðan táknar.',fruits(apples+'x + '+pears+'y'),
   ['Verð á '+pears+' eplum og '+apples+' perum.','Fjölda epla og pera samtals.','Verð á '+apples+' eplum og '+pears+' perum.','Verð á '+apples+' eplum og einni peru.'],2,
   ['Stuðullinn við x er fjöldi epla.','Stuðullinn við y er fjöldi pera.'],
   'Stæðan táknar heildarverð á '+apples+' eplum og '+pears+' perum.'),
  choice('Fjöldi eða verð?','Hvað táknar a + b og hver er einingin?',averageStory+math('a + b'),
   ['Heildarfjölda appelsína; eining: appelsínur.','Heildarverð; eining: kr.','Meðalverð á appelsínu; eining: kr./appelsínu.','Mismun á fjölda appelsína; eining: appelsínur.'],0,
   ['a og b tákna bæði fjölda.','Að leggja saman tvo fjölda gefur heildarfjölda.'],
   'a + b er heildarfjöldi appelsína sem þau keyptu.'),
  choice('Hvað táknar brotið?','Veldu túlkunina og rétta einingu.',averageStory+math(frac(sum,'a + b')),
   ['Heildarfjölda appelsína; eining: appelsínur.','Heildarverð á appelsínunum; eining: kr.','Fjölda appelsína fyrir hverja krónu; eining: appelsínur/kr.','Meðalverð á appelsínu; eining: kr./appelsínu.'],3,
   ['Teljarinn er samanlögð upphæð sem þau borguðu.','Nefnarinn er heildarfjöldi appelsína. Verði er deilt með fjölda.'],
   sum+' er heildarkostnaðurinn. '+frac(sum,'a + b')+' er meðalverð á einni appelsínu.'),
  number('Reiknaðu meðalverðið','Pétur keypti '+countA+' appelsínur og Lísa '+countB+'. Hvert var meðalverðið á appelsínu?',averageStory+math(frac(sum,'a + b'),'a = '+countA+' · b = '+countB),sum/(countA+countB),
   ['Leggðu fyrst saman fjölda appelsína.','Deildu '+sum+' kr. með '+(countA+countB)+' appelsínum.'],
   frac(sum,countA+countB)+' = '+fmt(sum/(countA+countB))+' kr./appelsínu.',{label:'Meðalverð',unit:'kr./appelsínu'}),
  choice('Arnar kaupir meira','Veldu jöfnu sem lýsir sambandinu.',milkStory+story('<strong>Arnar keypti '+multWord[m1]+' það magn sem Eva keypti.</strong>'),
   ['x = '+m1+'y','y = '+m1+'x','x + y = '+m1,'x = y + '+m1],0,
   ['x er magn Arnars og y er magn Evu.','Magn Arnars fæst með því að margfalda magn Evu með '+m1+'.'],
   'Jafnan er x = '+m1+'y.'),
  expression('Eva kaupir meira','Ljúktu jöfnunni y = með stæðu sem lýsir magni Evu.',milkStory+story('<strong>Eva keypti '+multWord[m2]+' það magn sem Arnar keypti.</strong>'),m2+'x',['x'],
   ['y á að vera meira en x.','Margfaldaðu x með '+m2+'.'],
   'Jafnan er y = '+m2+'x.',{label:'y'}),
  expression('Arnar kaupir hluta af magni Evu','Ljúktu jöfnunni x = með stæðu sem lýsir magni Arnars.',milkStory+story('<strong>Arnar keypti '+partWord[m3]+' af því magni sem Eva keypti.</strong>'),'y/'+m3,['y'],
   ['x táknar minna magnið.','Deildu magni Evu, y, með '+m3+'.'],
   'Jafnan er x = '+frac('y',m3)+'.',{label:'x'}),
  expression('Settu sambandið fram sem jöfnu','Ljúktu jöfnunni y =.',milkStory+story('<strong>Eva keypti '+multWord[m4]+' það magn sem Arnar keypti.</strong>'),m4+'x',['x'],
   ['Byrjaðu á því að finna hvort x eða y táknar meira magn.','y er '+m4+' sinnum x.'],
   'Jafnan er y = '+m4+'x.',{label:'y'})
 ]};
 return [squares,relations,percent,bonus];
}
