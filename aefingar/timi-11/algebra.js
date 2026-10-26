'use strict';
// Parse a restricted algebra grammar; never execute student input.
function parseExpression(input,allowedVariables=['x']){
 try{
  if(typeof input!=='string'||input.length>100||!input.trim())return null;
  const text=input.replace(/−/g,'-').replace(/[×·]/g,'*').replace(/²/g,'^2').replace(/³/g,'^3').replace(/,/g,'.');
  const tokens=[];let pos=0,depth=0;
  while(pos<text.length){
   if(/\s/.test(text[pos])){pos++;continue;}
   const n=text.slice(pos).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
   if(n){const value=Number(n[0]);if(!Number.isFinite(value)||value>1e9)throw Error();tokens.push({kind:'number',value});pos+=n[0].length;continue;}
   const c=text[pos++];
   if(/[a-z]/.test(c)&&allowedVariables.includes(c))tokens.push({kind:'variable',value:c});
   else if('+-*/^()'.includes(c))tokens.push({kind:c});
   else throw Error();
  }
  let at=0;const peek=()=>tokens[at]?.kind,take=()=>tokens[at++];
  const tidy=p=>{for(const k of Object.keys(p)){if(!Number.isFinite(p[k])||Math.abs(p[k])>1e12||k.length>6)throw Error();if(Math.abs(p[k])<1e-12)delete p[k];}if(Object.keys(p).length>50)throw Error();return p;};
  const add=(a,b,sign=1)=>{const r={...a};for(const k of Object.keys(b))r[k]=(r[k]||0)+sign*b[k];return tidy(r);};
  const mul=(a,b)=>{const r={};for(const i of Object.keys(a))for(const j of Object.keys(b)){const k=(i+j).split('').sort().join('');r[k]=(r[k]||0)+a[i]*b[j];}return tidy(r);};
  const scale=(a,n)=>tidy(Object.fromEntries(Object.entries(a).map(([k,v])=>[k,v*n])));
  function atom(){
   const t=take();if(!t)throw Error();
   if(t.kind==='number')return tidy({'':t.value});
   if(t.kind==='variable')return {[t.value]:1};
   if(t.kind==='('){if(++depth>20)throw Error();const p=sum();if(take()?.kind!==')')throw Error();depth--;return p;}
   throw Error();
  }
  function power(){let p=atom();if(peek()==='^'){take();const t=take();if(t?.kind!=='number'||!Number.isInteger(t.value)||t.value<0||t.value>3)throw Error();const b=p;p={'':1};for(let i=0;i<t.value;i++)p=mul(p,b);}return p;}
  function unary(){if(peek()==='+'){take();return unary();}if(peek()==='-'){take();return scale(unary(),-1);}return power();}
  function product(){
   let p=unary();
   while(peek()==='*'||peek()==='/'||peek()==='variable'||peek()==='('){
    const op=peek()==='*'||peek()==='/'?take().kind:'*',q=unary();
    if(op==='*')p=mul(p,q);
    else{if(Object.keys(q).some(k=>k!=='')||!q[''])throw Error();p=scale(p,1/q['']);}
   }return p;
  }
  function sum(){let p=product();while(peek()==='+'||peek()==='-'){const op=take().kind;p=add(p,product(),op==='+'?1:-1);}return p;}
  const result=sum();if(at!==tokens.length)throw Error();return tidy(result);
 }catch{return null;}
}
function sameExpression(input,target,variables){
 const a=parseExpression(input,variables),b=parseExpression(target,variables);
 return !!a&&!!b&&[...new Set([...Object.keys(a),...Object.keys(b)])].every(k=>Math.abs((a[k]||0)-(b[k]||0))<=1e-10);
}
