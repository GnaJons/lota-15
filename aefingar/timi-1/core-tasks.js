'use strict';
// Content follows 15.1-15.6. Each new round uses one of three checked sets.
const ExerciseTasks = (() => {
  const names=['Reiknaðu veldin','Berðu saman','Veldi með bókstöfum','Finndu hlið fernings','Margfaldaðu veldi','Deildu veldum'];
  const counts=[4,3,3,2,2,2];
  const power=(b,n)=>`${b}<sup>${n}</sup>`;
  const frac=(a,b)=>`<span class="fraction"><span>${a}</span><span>${b}</span></span>`;
  const equation=s=>`<div class="equation">${s}</div>`;
  const numeric=(title,intro,expression,answer,hints,explain,extra={})=>({type:'number',title,intro,board:equation(expression),answer,hints,explain,label:'Svar',unit:'',...extra});
  const choices=(title,intro,expression,options,correct,hints,explain,extra={})=>({type:'choices',math:true,title,intro,board:equation(expression),options,correct,hints,explain,...extra});
  function task(seed,i,p){
    const k=seed%3;
    if(i===0){
      if(p===0){const [a,m,b,n]=[[5,2,2,4],[2,6,3,3],[4,3,5,2]][k];
        return numeric('Veldin koma fyrst','Reiknaðu stæðuna. Leggðu saman þegar þú hefur reiknað bæði veldin.',`${power(a,m)} + ${power(b,n)}`,a**m+b**n,
          ['Veldisvísirinn segir hversu margir þættir eru í margfölduninni.',`${power(a,m)} = ${Array(m).fill(a).join(' × ')}. Reiknaðu hitt veldið á sama hátt.`],
          `${power(a,m)} + ${power(b,n)} = ${a**m} + ${b**n} = ${a**m+b**n}.`);
      }
      if(p===1){const [a,b]=[[7,4],[8,5],[9,6]][k];return numeric('Mínus inni í sviga','Reiknaðu stæðuna. Gættu að formerkinu þegar neikvæð tala er hafin í annað veldi.',`${power(a,2)} − ${power('(−'+b+')',2)}`,a*a-b*b,
        ['Allur sviginn er stofninn. Tvær neikvæðar tölur margfaldaðar saman gefa jákvætt svar.',`${power('(−'+b+')',2)} = (−${b}) × (−${b}) = ${b*b}. Dragðu það frá ${power(a,2)}.`],
        `${a*a} − ${b*b} = ${a*a-b*b}. Veldið á sviganum er jákvætt; síðan drögum við það frá.`);}
      if(p===2){const[a,m,b,n]=[[3,3,2,2],[2,4,5,2],[4,2,3,3]][k];return numeric('Ólíkir stofnar','Reiknaðu bæði veldin og margfaldaðu svo niðurstöðurnar.',`${power(a,m)} × ${power(b,n)}`,a**m*b**n,
        ['Stofnarnir eru ólíkir. Reglan um að leggja veldisvísa saman á því ekki við.',`${power(a,m)} = ${a**m}. Reiknaðu ${power(b,n)} og margfaldaðu.`],
        `${power(a,m)} × ${power(b,n)} = ${a**m} × ${b**n} = ${a**m*b**n}.`);}
      const[a,b]=[[2,6],[4,3],[5,2]][k];return numeric('Hvað er hafið í annað veldi?','Reiknaðu stæðuna. Veldið á sviganum á við allt margfeldið.',`${power('('+a+' × '+b+')',2)} − ${a} × ${power(b,2)}`,(a*b)**2-a*b*b,
        ['Vinstra megin er allt margfeldið í öðru veldi. Hægra megin er aðeins síðari talan í öðru veldi.',`Fyrri liðurinn er ${power(a*b,2)}. Seinni liðurinn er ${a} × ${b*b}. Reiknaðu hvorn lið áður en þú dregur frá.`],
        `${(a*b)**2} − ${a*b*b} = ${(a*b)**2-a*b*b}. Svigarnir breyta því hvað er hafið í veldi.`);
    }
    if(i===1){
      const sets=[[[2,3,3,2],[4,3,8,2],[3,4,4,3]],[[2,6,3,4],[3,4,9,2],[5,3,6,2]],[[3,2,2,3],[2,8,16,2],[5,2,3,3]]];
      const[a,m,b,n]=sets[k][p],l=a**m,r=b**n,cmp=l<r?0:l>r?1:2,symbol=['&lt;','&gt;','='][cmp];
      return choices('Hvaða merki passar?','Veldu merkið sem á að standa milli veldanna.',`${power(a,m)} <span class="missing">?</span> ${power(b,n)}`,
        ['&lt; <small>minna en</small>','&gt; <small>stærra en</small>','= <small>jafnt og</small>'],cmp,
        ['Reiknaðu gildið hvorum megin. Ekki bera aðeins saman stofnana eða veldisvísana.',`${power(a,m)} = ${l}. Reiknaðu nú ${power(b,n)}.`],
        `${power(a,m)} = ${l} og ${power(b,n)} = ${r}. Því er ${power(a,m)} ${symbol} ${power(b,n)}.`,{wrong:'Berðu saman gildin eftir að þú hefur reiknað bæði veldin.'});
    }
    if(i===2){const v=['x','a','y'][k];
      if(p===0){const c=[6,7,8][k];return choices('Allur sviginn í veldi','Einfaldaðu stæðuna.',power('('+c+v+')',2),
        [`${c}${power(v,2)}`,`${c*c}${power(v,2)}`,`${2*c}${power(v,2)}`,`${c*c}${v}`],1,
        ['Bæði talan og bókstafurinn eru inni í sviganum.',`Skrifaðu (${c}${v}) × (${c}${v}). Margfaldaðu tölurnar saman og bókstafina saman.`],
        `${power('('+c+v+')',2)} = ${c} × ${c} × ${v} × ${v} = ${c*c}${power(v,2)}.`,{wrong:'Veldið á við bæði stuðulinn og bókstafinn.'});}
      const[a,b]=p===1?[[2,7],[5,3],[4,6]][k]:[[3,4],[2,5],[4,5]][k];
      const expression=p===1?`${a}${v} × ${b}${v}`:`(−${a}${v})(−${b}${v})`;
      return choices(p===1?'Margfaldaðu stæðurnar':'Tvær neikvæðar stæður','Einfaldaðu og skrifaðu sem eitt margfeldi.',expression,
        [`${a*b}${v}`,`${a+b}${power(v,2)}`,`−${a*b}${power(v,2)}`,`${a*b}${power(v,2)}`],3,
        [p===1?'Margfaldaðu stuðlana saman. Margfaldaðu síðan bókstafina saman.':'Mínus sinnum mínus gefur plús. Margfaldaðu tölurnar og svo bókstafina.',`${v} × ${v} = ${power(v,2)}. Hvað er ${a} × ${b}?`],
        `${expression} = ${a*b}${power(v,2)}. ${p===1?'Stuðlarnir margfaldast':'Margfeldi neikvæðu stuðlanna er jákvætt'} og ${v} × ${v} = ${power(v,2)}.`,
        {wrong:'Athugaðu stuðlana, formerkið og að bókstafurinn kemur tvisvar fyrir sem þáttur.'});
    }
    if(i===3){const side=[9,11,15][k],area=side*side;
      const board=`<svg viewBox="0 0 440 230" role="img" aria-label="Ferningur með flatarmálið ${area} fersentímetrar og óþekkta hlið h."><rect x="130" y="20" width="180" height="180" fill="#eaf3f8" stroke="#425963" stroke-width="2"/><text x="220" y="115" text-anchor="middle" class="figure-label">${area} cm²</text><text x="220" y="222" text-anchor="middle" class="figure-label">h = ?</text></svg>`;
      if(p===0)return choices('Frá flatarmáli að hlið','Flatarmál ferningsins er gefið. Hvaða aðgerð finnur hliðarlengdina?', '',
        [`${area} × ${area}`,`${frac(area,4)}`,`√${area}`,`${frac(area,2)}`],2,
        ['Flatarmál fernings er hliðarlengdin margfölduð með sjálfri sér.','Leitaðu að jákvæðri tölu sem gefur flatarmálið þegar hún er hafin í annað veldi.'],
        `Þar sem h² = ${area} tökum við ferningsrót: h = √${area}.`,{board,wrong:'Flatarmál er ekki ummál. Hliðin margfölduð með sjálfri sér gefur flatarmálið.'});
      return numeric('Hve löng er hliðin?','Finndu hliðarlengd ferningsins. Þú mátt nota ferningsrótartakkann á vasareikni.','',side,
        [`Finndu jákvæða tölu sem gefur ${area} þegar hún er margfölduð með sjálfri sér.`,`Reiknaðu √${area}. Eining hliðarlengdar er cm.`],
        `h = √${area} = ${side} cm, því ${side} × ${side} = ${area}.`,{board,label:'h',unit:'cm'});
    }
    if(i===4){const[b,m,n]=p===0?[[6,3,4],[7,2,5],[4,5,3]][k]:[['x',4,6],['y',3,8],['a',7,4]][k];
      return numeric('Skrifaðu sem eitt veldi','Stofninn stendur þegar í svarinu. Skráðu veldisvísinn sem vantar.',`${power(b,m)} × ${power(b,n)} = ${power(b,'?')}`,m+n,
        ['Við margföldun velda með sama stofni leggjum við veldisvísana saman.',`Teldu þættina: ${m} í fyrra veldinu og ${n} í því síðara.`],
        `${power(b,m)} × ${power(b,n)} = ${power(b,m+' + '+n)} = ${power(b,m+n)}. Stofninn helst óbreyttur.`,
        {label:'Veldisvísir',inputKind:'exponent',base:b,wrong:'Haltu stofninum. Leggðu veldisvísana saman; ekki margfalda þá.'});
    }
    const[b,m,n]=p===0?[[7,8,3],[5,9,4],[6,7,2]][k]:[['x',9,3],['y',8,2],['a',10,3]][k];
    return numeric('Deiling með sama stofni',`Skrifaðu brotið sem eitt veldi. Skráðu veldisvísinn sem vantar.${p===1?' Gerum ráð fyrir að '+b+' sé ekki núll.':''}`,`${frac(power(b,m),power(b,n))} = ${power(b,'?')}`,m-n,
      ['Við deilingu velda með sama stofni styttast sameiginlegir þættir.',`Byrjaðu á veldisvísinum í teljaranum og dragðu veldisvísinn í nefnaranum frá: ${m} − ${n}.`],
      `${frac(power(b,m),power(b,n))} = ${power(b,m+' − '+n)} = ${power(b,m-n)}. ${n} þættir styttast út og ${m-n} verða eftir.`,
      {label:'Veldisvísir',inputKind:'exponent',base:b,wrong:'Dragðu veldisvísinn í nefnaranum frá veldisvísinum í teljaranum. Ekki deila veldisvísunum.'});
  }
  function parseNumber(value){const text=String(value).trim().replace(/−/g,'-').replace(',','.');return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)&&Number.isFinite(Number(text))?Number(text):null;}
  return {names,counts,task,parseNumber};
})();
if(typeof module!=='undefined')module.exports=ExerciseTasks;
