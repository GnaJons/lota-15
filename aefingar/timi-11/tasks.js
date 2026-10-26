'use strict';
const variants=[
 {pos:[8,5],neg:[9,6],large:[120,4],first:[7,3],coef:[11,4],sum:[9,6],minus:[300,2],last:[210,4],qplus:[8,7],qrev:[9,8],qconst:[17,5],qremain:[30,6,2],fdecimal:[8,3],fletter:[9,3,5],fsquare:[5,4,7],fminus:[14,3,2],fmixed:[6,7,3],fcube:[15,5,3],qx:[5,4,7],qy:[7,4,6],qab:[7,6,4],qm:[9,7,3],qz:[8,10,4],qt:[12,3,5]},
 {pos:[9,7],neg:[8,7],large:[140,3],first:[8,5],coef:[13,3],sum:[11,4],minus:[250,3],last:[180,5],qplus:[11,6],qrev:[12,7],qconst:[19,4],qremain:[40,8,2],fdecimal:[9,4],fletter:[8,5,7],fsquare:[6,5,7],fminus:[15,4,3],fmixed:[8,3,7],fcube:[14,3,5],qx:[7,3,5],qy:[9,6,8],qab:[8,4,6],qm:[8,9,5],qz:[7,8,6],qt:[15,4,7]},
 {pos:[7,6],neg:[7,8],large:[160,5],first:[9,4],coef:[12,5],sum:[12,7],minus:[400,3],last:[160,7],qplus:[12,5],qrev:[14,6],qconst:[23,3],qremain:[35,10,2],fdecimal:[7,5],fletter:[6,7,5],fsquare:[8,3,5],fminus:[12,5,3],fmixed:[9,5,2],fcube:[12,5,7],qx:[8,5,7],qy:[8,8,6],qab:[9,10,4],qm:[7,11,3],qz:[6,14,4],qt:[14,5,9]}
];
function buildSections(seed){
 const d=variants[seed%variants.length],rnd=n=>Math.round(n*1e10)/1e10,F=n=>String(rnd(n)).replace('.',','),raw=n=>String(rnd(n)),gcd=(a,b)=>b?gcd(b,a%b):a;
 const show=s=>String(s).replace(/\^([23])/g,'<sup>$1</sup>').replace(/-/g,' − ').replace(/\+/g,' + ').replace(/(\d)\.(\d)/g,'$1,$2');
 const frac=(a,b)=>'<span class="fraction"><span>'+a+'</span><span>'+b+'</span></span>';
 const math=(s,note='')=>'<div class="factor-board"><div class="equation">'+show(s)+'</div>'+(note?'<p class="given-note">'+note+'</p>':'')+'</div>';
 const gap=(original,factor)=>'<div class="factor-board"><div class="equation">'+show(original)+'</div><div class="equation factor-line">= <span class="factor-mark">'+show(factor)+'</span>(<span class="missing">?</span>)</div></div>';
 const help=vars=>'Skrifaðu aðeins stæðuna sem beðið er um. Nota má '+vars[0]+'² eða '+vars[0]+'^2, sviga og tugabrotskommu.';
 const expression=(title,intro,board,answer,variables,hints,explain,extra={})=>({type:'expression',title,intro,board,answer,variables,label:'Stæða',unit:'',inputMode:'text',inputHelp:help(variables),hints,explain,wrong:'Deildu hverjum lið með þættinum sem tekinn er út. Haltu formerkinu og athugaðu bókstafi og veldi.',...extra});
 const number=(title,intro,board,answer,hints,explain,extra={})=>({type:'number',title,intro,board,answer,label:'Þáttur',unit:'',hints,explain,wrong:'Talan þarf að ganga upp í báða stuðlana. Veldu stærsta jákvæða heiltöluþáttinn.',...extra});
 const choice=(title,intro,board,options,correct,hints,explain,extra={})=>({type:'choices',title,intro,board,options:options.map(show),correct,hints,explain,wideChoices:true,wrong:'Prófaðu að margfalda inn í svigann. Athugaðu líka hvort allur sameiginlegi þátturinn hafi verið tekinn út.',...extra});
 const inside=(original,factor,answer,vars,title='Hvað verður innan svigans?')=>expression(title,'Þátturinn utan svigans er gefinn. Skrifaðu aðeins það sem vantar innan hans.',gap(original,factor),answer,vars,
  ['Deildu báðum liðum með þættinum utan svigans.','Margfaldaðu svar þitt aftur með '+show(factor)+' til að athuga hvort upphaflega stæðan fæst.'],
  show(original)+' = <span class="factor-mark">'+show(factor)+'</span>('+show(answer)+').',{label:'Innan sviga',qa:{kind:'inside',original,factor,expected:answer}});
 const factorNum=(original,factor,title)=>number(title,'Finndu stærstu jákvæðu heiltöluna sem gengur upp í stuðla beggja liða.',math(original),factor,
  ['Leitaðu að tölu sem hægt er að deila báðum liðum með.','Stuðull bókstafsins þarf líka að deilast með tölunni sem þú velur.'],
  F(factor)+' er stærsti sameiginlegi heiltöluþátturinn.',{qa:{kind:'factorNumber',original,factor}});
 const [p,pb]=d.pos,[n,nb]=d.neg,[l,lb]=d.large;
 const positive=p+'x+'+p*pb,negative=n+'a-'+n*nb,large=l+'a+'+l*lb;
 const common={name:'Sameiginlegur þáttur',tasks:[
  factorNum(positive,p,'Finndu sameiginlega þáttinn'),
  inside(positive,''+p,'x+'+pb,['x']),
  choice('Taktu stærsta þáttinn út','Veldu þáttun þar sem stærsti sameiginlegi heiltöluþátturinn er utan svigans.',math(negative),
   [n+'(a+'+nb+')','a('+n+'-'+n*nb+')',n+'(a-'+nb+')',n+'(a-'+n*nb+')'],2,
   ['Deildu stuðli a og fasta liðnum með sama þætti.','Mínusmerkið á að haldast við fasta liðinn.'],
   show(negative)+' = '+n+'(a − '+nb+').',{qa:{kind:'factorChoice',original:negative,factor:n,expected:n+'(a-'+nb+')'}}),
  factorNum(large,l,'Stærri tölur, sama aðferð'),
  inside(large,''+l,'a+'+lb,['a'])
 ]};
 const [f,fb]=d.first,[c,cb]=d.coef,[s,sb]=d.sum,[m,mb]=d.minus,[e,eb]=d.last;
 const first=f*fb+'-'+f+'x',coef=c*cb+'z-'+c,sum=s*sb+'+'+s+'y',minus=m*mb+'-'+m+'t',last=e*eb+'t+'+e;
 const signs={name:'Röð og formerki',tasks:[
  choice('Fasti liðurinn kemur fyrst','Veldu rétta þáttun. Haltu röð liðanna í sviganum.',math(first),
   [f+'(x-'+fb+')',f+'('+fb+'-x)',f+'('+fb+'+x)',f+'('+fb+'-'+f+'x)'],1,
   ['Deildu bæði fasta liðnum og x-liðnum með '+f+'.','Fyrri liðurinn er fasti; seinni liðurinn er neikvæður x-liður.'],
   show(first)+' = '+f+'('+fb+' − x).',{qa:{kind:'factorChoice',original:first,factor:f,expected:f+'('+fb+'-x)'}}),
  inside(coef,''+c,cb+'z-1',['z'],'Þegar fasti liðurinn verður 1'),
  inside(sum,''+s,sb+'+y',['y']),
  inside(minus,''+m,mb+'-t',['t'],'Gættu að mínusmerkinu'),
  factorNum(last,e,'Sameiginlegi þátturinn í lokin')
 ]};
 const [q,qb]=d.qplus,[r,rb]=d.qrev,[v,vb]=d.qconst,[h,hb,hc]=d.qremain;
 const num=q+'x+'+q*qb;
 function simplified(original,den,answer,vars,condition='',factorization=''){
  return expression('Þátta og stytta','Skrifaðu einfaldaða stæðu án brotastriks.',math(frac(show(original),show(den)),condition),answer,vars,
   ['Þáttaðu teljarann. Þú mátt stytta sameiginlega þætti teljara og nefnara.','Deildu öllum liðum teljarans með nefnaranum; ekki aðeins einum lið.'],
   (factorization?frac(show(factorization),show(den))+' = ':'')+show(answer)+'.'+(condition?' Skilyrðið '+condition+' gildir áfram.':''),
   {label:'Einfaldað',noDivision:true,wrong:'Stytting nær til alls teljarans. Athugaðu hvern lið, formerkin og veldin eftir deilingu.',qa:{kind:'quotient',original,den,expected:answer,condition}});
 }
 const fractions={name:'Þáttun og stytting',tasks:[
  choice('Þáttaðu teljarann fyrst','Veldu sama brot með fullþáttuðum teljara.',math(frac(show(num),q)),
   [frac(q+'(x+'+qb+')',q),frac(q+'(x+'+q*qb+')',q),frac(q+'x+'+qb,q),frac('x+'+q*qb,q)],0,
   ['Taktu '+q+' út fyrir sviga í teljaranum.','Deildu bæði '+q+'x og '+q*qb+' með '+q+' til að finna liðina í sviganum.'],
   'Teljarinn er '+q+'(x + '+qb+'). Nefnarinn helst '+q+'.',{qa:{kind:'numeratorChoice',original:num,den:q,expected:q+'(x+'+qb+')'}}),
  simplified(num,''+q,'x+'+qb,['x'],'',q+'(x+'+qb+')'),
  simplified(r*rb+'-'+r+'x',''+r,rb+'-x',['x'],'',r+'('+rb+'-x)'),
  simplified(v+'-'+v*vb+'a',''+v,'1-'+vb+'a',['a'],'',v+'(1-'+vb+'a)'),
  simplified(h*hb+'-'+h*hc+'a',''+h,hb+'-'+hc+'a',['a'],'',h*hc+'('+hb/hc+'-a)')
 ]};
 const [fd,fdn]=d.fdecimal,[fl,flb,flc]=d.fletter,[fs,fsb,fsc]=d.fsquare,[fm,fmb,fmc]=d.fminus,[ft,ftb,ftc]=d.fmixed,[fc,fcb,fcc]=d.fcube;
 const decimal=raw(fd/10)+'xy+'+raw(fd*fdn/10)+'xy^2',letter=fl*flb+'ab-'+fl*flc+'a',square=fs*fsb+'x^2-'+fs*fsc+'xy',mixed=raw(ft*ftb/10)+'mn+'+raw(ft*ftc/10)+'n',cube=fc*fcb+'k^3-'+fc*fcc+'k^2';
 const extras=[
  inside(decimal,raw(fd/10)+'xy','1+'+fdn+'y',['y'],'Sameiginlegur þáttur með tugabroti'),
  expression('Bókstafur er líka sameiginlegur','Skrifaðu stærsta sameiginlega þáttinn: tölu og bókstaf.',math(letter),fl+'a',['a'],
   ['Báðir liðir hafa a sem þátt. Bókstafurinn b er aðeins í fyrri liðnum.','Finndu stærsta sameiginlega heiltöluþáttinn í '+fl*flb+' og '+fl*flc+'. Taktu a líka með.'],
   show(letter)+' = '+fl+'a('+flb+'b − '+flc+').',{label:'Þáttur',qa:{kind:'factorMonomial',original:letter,expected:fl+'a'}}),
  choice('Hversu mikið má taka út?','Veldu þáttun þar sem stærsti sameiginlegi þátturinn er utan svigans.',math(square),
   [fs+'('+fsb+'x^2-'+fsc+'xy)',fs+'x^2('+fsb+'-'+fsc+'y)',fs+'x('+fsb+'x-'+fsc+'y)',fs+'x('+fsb+'x+'+fsc+'y)'],2,
   ['Báðir liðir hafa x, en aðeins fyrri liðurinn hefur x².','Taktu '+fs+'x út. Eitt x verður þá eftir í fyrri liðnum.'],
   show(square)+' = '+fs+'x('+fsb+'x − '+fsc+'y).',{qa:{kind:'factorChoice',original:square,factor:fs+'x',expected:fs+'x('+fsb+'x-'+fsc+'y)',nonMaxEquivalent:0}}),
  inside(fm*fmb+'p-'+fm*fmc+'pq',fm+'p',fmb+'-'+fmc+'q',['q'],'Bókstafur hverfur úr fyrri liðnum'),
  inside(mixed,raw(ft/10)+'n',ftb+'m+'+ftc,['m'],'Deilt með tugabroti'),
  expression('Veldi í sameiginlega þættinum','Skrifaðu stærsta sameiginlega þáttinn.',math(cube),fc+'k^2',['k'],
   ['Veldu lægra veldið af k sem kemur fyrir í báðum liðum.','Finndu líka stærsta sameiginlega heiltöluþáttinn í '+fc*fcb+' og '+fc*fcc+'.'],
   show(cube)+' = '+show(fc+'k^2')+'('+fcb+'k − '+fcc+').',{label:'Þáttur',qa:{kind:'factorMonomial',original:cube,expected:fc+'k^2'}})
 ];
 const [xx,xb,xc]=d.qx,[yy,yb,yc]=d.qy,[aa,ab,ac]=d.qab,[mm,mbb,mc]=d.qm,[zz,zb,zc]=d.qz,[tt,tb,tc]=d.qt;
 const gy=gcd(yb,yc),ga=gcd(ab,ac),gz=gcd(zb,zc);
 extras.push(
  simplified(xx*xb+'x^2+'+xx*xc+'x',xx+'x',xb+'x+'+xc,['x'],'x ≠ 0',xx+'x('+xb+'x+'+xc+')'),
  simplified(yy*yb+'y-'+yy*yc,''+yy,yb+'y-'+yc,['y'],'',yy*gy+'('+yb/gy+'y-'+yc/gy+')'),
  simplified(aa*ab+'a^2b-'+aa*ac+'ab',aa+'ab',ab+'a-'+ac,['a'],'a ≠ 0 og b ≠ 0',aa*ga+'ab('+ab/ga+'a-'+ac/ga+')'),
  simplified(raw(mm*mbb/10)+'m-'+raw(mm*mc/10),raw(mm/10),mbb+'m-'+mc,['m'],'',raw(mm/10)+'('+mbb+'m-'+mc+')'),
  simplified(zz*zb+'z^3-'+zz*zc+'z',zz+'z',zb+'z^2-'+zc,['z'],'z ≠ 0',zz*gz+'z('+zb/gz+'z^2-'+zc/gz+')'),
  simplified(raw(tt*tb/100)+'t^2+'+raw(tt*tc/100)+'t',raw(tt/100)+'t',tb+'t+'+tc,['t'],'t ≠ 0',raw(tt/100)+'t('+tb+'t+'+tc+')')
 );
 return [common,signs,fractions,{name:'Aukaáskorun',optional:true,tasks:extras}];
}
