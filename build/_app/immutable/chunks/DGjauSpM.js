var en=Object.defineProperty;var Et=t=>{throw TypeError(t)};var tn=(t,e,n)=>e in t?en(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var P=(t,e,n)=>tn(t,typeof e!="symbol"?e+"":e,n),zt=(t,e,n)=>e.has(t)||Et("Cannot "+n);var o=(t,e,n)=>(zt(t,e,"read from private field"),n?n.call(t):e.get(t)),g=(t,e,n)=>e.has(t)?Et("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,n),x=(t,e,n,i)=>(zt(t,e,"write to private field"),i?i.call(t,n):e.set(t,n),n),xt=(t,e,n)=>(zt(t,e,"access private method"),n);import{c as R,a as I,t as Z}from"./CCTC-7cS.js";import{z as D,g as v,p as U,f as L,a as W,t as re,s as nn,c as ye,n as Xe,r as ve,u as Y,q as xe,aH as rn,aI as sn,I as an,b as $,d as V}from"./lJj1ROAO.js";import{i as se,d as S,r as Q,e as et,s as bt,p as Qe,f as on,l as ln}from"./gVHdC8Dn.js";import{u as Nt,E as cn,S as un,M as dn,ab as hn,ac as fn,a3 as pn,a1 as gn,ad as yn,d as vn,J as mn,ae as bn,C as Sn,aa as zn,a as me,h as qt,o as xn,j as O,m as Gt,c as Pe,af as wn,ag as Pn,ah as Cn,ai as k,q as In,I as kn,s as Dn}from"./BcgbVQLy.js";import{s as G}from"./BdomY8CC.js";import"./CJ1jPYAq.js";import{i as An}from"./BxqCI8nV.js";import{K as _n,s as En}from"./BDnc6AQL.js";import{o as Ln}from"./BAirJ6aW.js";const Rn="data-switch-root",Mn="data-switch-thumb";var ce,Ie,ke,Pt,nt,it;class Hn{constructor(e){g(this,ke);g(this,ce);g(this,Ie);P(this,"checked");P(this,"disabled");P(this,"required");P(this,"name");P(this,"value");g(this,nt,D(()=>({"data-disabled":dn(this.disabled.current),"data-state":hn(this.checked.current),"data-required":fn(this.required.current)})));g(this,it,D(()=>({...this.sharedProps,id:o(this,ce).current,role:"switch",disabled:pn(this.disabled.current),"aria-checked":gn(this.checked.current,!1),"aria-required":yn(this.required.current),[Rn]:"",onclick:this.onclick,onkeydown:this.onkeydown})));this.checked=e.checked,this.disabled=e.disabled,this.required=e.required,this.name=e.name,this.value=e.value,x(this,ce,e.id),x(this,Ie,e.ref),Nt({id:o(this,ce),ref:o(this,Ie)}),this.onkeydown=this.onkeydown.bind(this),this.onclick=this.onclick.bind(this)}onkeydown(e){!(e.key===cn||e.key===un)||this.disabled.current||(e.preventDefault(),xt(this,ke,Pt).call(this))}onclick(e){this.disabled.current||xt(this,ke,Pt).call(this)}get sharedProps(){return v(o(this,nt))}get props(){return v(o(this,it))}}ce=new WeakMap,Ie=new WeakMap,ke=new WeakSet,Pt=function(){this.checked.current=!this.checked.current},nt=new WeakMap,it=new WeakMap;var q,rt,st;class Tn{constructor(e){g(this,q);g(this,rt,D(()=>o(this,q).name.current!==void 0));g(this,st,D(()=>({type:"checkbox",name:o(this,q).name.current,value:o(this,q).value.current,checked:o(this,q).checked.current,disabled:o(this,q).disabled.current,required:o(this,q).required.current,"aria-hidden":vn(!0),style:mn(bn)})));x(this,q,e)}get shouldRender(){return v(o(this,rt))}get props(){return v(o(this,st))}}q=new WeakMap,rt=new WeakMap,st=new WeakMap;var ue,De,at;class Bn{constructor(e,n){g(this,ue);g(this,De);P(this,"root");g(this,at,D(()=>({...this.root.sharedProps,id:o(this,ue).current,[Mn]:""})));this.root=n,x(this,ue,e.id),x(this,De,e.ref),Nt({id:o(this,ue),ref:o(this,De)})}get props(){return v(o(this,at))}}ue=new WeakMap,De=new WeakMap,at=new WeakMap;const It=new Sn("Switch.Root");function Nn(t){return It.set(new Hn(t))}function qn(){return new Tn(It.get())}function Gn(t){return new Bn(t,It.get())}var jn=Z("<input>");function On(t,e){U(e,!1);const n=qn();An();var i=R(),r=L(i);{var s=a=>{var l=jn();zn(l);let u;re(()=>u=me(l,u,{...n.props})),I(a,l)};se(r,a=>{n.shouldRender&&a(s)})}I(t,i),W()}var Fn=Z("<button><!></button>"),Kn=Z("<!> <!>",1);function Un(t,e){U(e,!0);let n=S(e,"ref",15,null),i=S(e,"id",19,qt),r=S(e,"disabled",3,!1),s=S(e,"required",3,!1),a=S(e,"checked",15,!1),l=S(e,"value",3,"on"),u=S(e,"name",3,void 0),d=S(e,"type",3,"button"),h=S(e,"onCheckedChange",3,xn),c=Q(e,["$$slots","$$events","$$legacy","child","children","ref","id","disabled","required","checked","value","name","type","onCheckedChange"]);const p=Nn({checked:O.with(()=>a(),z=>{var _;a(z),(_=h())==null||_(z)}),disabled:O.with(()=>r()??!1),required:O.with(()=>s()),value:O.with(()=>l()),name:O.with(()=>u()),id:O.with(()=>i()),ref:O.with(()=>n(),z=>n(z))}),f=D(()=>Gt(c,p.props,{type:d()}));var y=Kn(),b=L(y);{var m=z=>{var _=R(),E=L(_);G(E,()=>e.child,()=>({props:v(f),checked:p.checked.current})),I(z,_)},w=z=>{var _=Fn();let E;var j=ye(_);G(j,()=>e.children??Xe,()=>({checked:p.checked.current})),ve(_),re(()=>E=me(_,E,{...v(f)})),I(z,_)};se(b,z=>{e.child?z(m):z(w,!1)})}var A=nn(b,2);On(A,{}),I(t,y),W()}var Wn=Z("<span><!></span>");function Vn(t,e){U(e,!0);let n=S(e,"ref",15,null),i=S(e,"id",19,qt),r=Q(e,["$$slots","$$events","$$legacy","child","children","ref","id"]);const s=Gn({id:O.with(()=>i()),ref:O.with(()=>n(),c=>n(c))}),a=D(()=>Gt(r,s.props));var l=R(),u=L(l);{var d=c=>{var p=R(),f=L(p);G(f,()=>e.child,()=>({props:v(a),checked:s.root.checked.current})),I(c,p)},h=c=>{var p=Wn();let f;var y=ye(p);G(y,()=>e.children??Xe,()=>({checked:s.root.checked.current})),ve(p),re(()=>f=me(p,f,{...v(a)})),I(c,p)};se(u,c=>{e.child?c(d):c(h,!1)})}I(t,l),W()}function Vi(t,e){U(e,!0);let n=S(e,"ref",15,null),i=S(e,"checked",15,!1),r=Q(e,["$$slots","$$events","$$legacy","ref","class","checked"]);var s=R(),a=L(s);const l=D(()=>Pe("focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input peer inline-flex h-6 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e.class));et(a,()=>Un,(u,d)=>{d(u,bt({get class(){return v(l)}},()=>r,{get ref(){return n()},set ref(h){n(h)},get checked(){return i()},set checked(h){i(h)},children:(h,c)=>{var p=R(),f=L(p);const y=D(()=>Pe("bg-background pointer-events-none block size-4  rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0"));et(f,()=>Vn,(b,m)=>{m(b,{get class(){return v(y)}})}),I(h,p)},$$slots:{default:!0}}))}),I(t,s),W()}function Jn(...t){return function(e){var n;for(const i of t)if(i){if(e.defaultPrevented)return;typeof i=="function"?i.call(this,e):(n=i.current)==null||n.call(this,e)}}}const Xn=/\d/,Yn=["-","_","/","."];function Zn(t=""){if(!Xn.test(t))return t!==t.toLowerCase()}function Qn(t){const e=[];let n="",i,r;for(const s of t){const a=Yn.includes(s);if(a===!0){e.push(n),n="",i=void 0;continue}const l=Zn(s);if(r===!1){if(i===!1&&l===!0){e.push(n),n=s,i=l;continue}if(i===!0&&l===!1&&n.length>1){const u=n.at(-1);e.push(n.slice(0,Math.max(0,n.length-1))),n=u+s,i=l;continue}}n+=s,i=l,r=a}return e.push(n),e}function jt(t){return t?Qn(t).map(e=>ei(e)).join(""):""}function $n(t){return ti(jt(t||""))}function ei(t){return t?t[0].toUpperCase()+t.slice(1):""}function ti(t){return t?t[0].toLowerCase()+t.slice(1):""}function $e(t){if(!t)return{};const e={};function n(i,r){if(i.startsWith("-moz-")||i.startsWith("-webkit-")||i.startsWith("-ms-")||i.startsWith("-o-")){e[jt(i)]=r;return}if(i.startsWith("--")){e[i]=r;return}e[$n(i)]=r}return wn(t,n),e}function Ot(...t){return(...e)=>{for(const n of t)typeof n=="function"&&n(...e)}}function ee(t,e,n,i){const r=Array.isArray(e)?e:[e];return r.forEach(s=>t.addEventListener(s,n,i)),()=>{r.forEach(s=>t.removeEventListener(s,n,i))}}function ni(t){var e;return t.length>2&&t.startsWith("on")&&t[2]===((e=t[2])==null?void 0:e.toLowerCase())}function kt(...t){const e={...t[0]};for(let n=1;n<t.length;n++){const i=t[n];for(const r in i){const s=e[r],a=i[r],l=typeof s=="function",u=typeof a=="function";if(l&&ni(r)){const d=s,h=a;e[r]=Jn(d,h)}else if(l&&u)e[r]=Ot(s,a);else if(r==="class"&&typeof s=="string"&&typeof a=="string")e[r]=Pn(s,a);else if(r==="style"){const d=typeof s=="object",h=typeof a=="object",c=typeof s=="string",p=typeof a=="string";if(d&&h)e[r]={...s,...a};else if(d&&p){const f=$e(a);e[r]={...s,...f}}else if(c&&h){const f=$e(s);e[r]={...f,...a}}else if(c&&p){const f=$e(s),y=$e(a);e[r]={...f,...y}}else d?e[r]=s:h&&(e[r]=a)}else e[r]=a!==void 0?a:s}}return typeof e.style=="object"&&(e.style=Cn(e.style).replaceAll(`
`," ")),e.hidden!==!0&&(e.hidden=void 0),e.disabled!==!0&&(e.disabled=void 0),e}function Dt({id:t,ref:e,deps:n=()=>!0,onRefChange:i=()=>{},getRootNode:r=()=>typeof document<"u"?document:void 0}){const s=D(()=>n()),a=D(()=>r());Y(()=>(t.current,v(s),v(a),xe(()=>{var u;const l=(u=v(a))==null?void 0:u.getElementById(t.current);l?e.current=l:e.current=null,i(e.current)}))),Y(()=>()=>{e.current=null,i(null)})}function ii({layout:t,panesArray:e,pivotIndices:n}){let i=0,r=100,s=0,a=0;const l=n[0];for(let c=0;c<e.length;c++){const{constraints:p}=e[c],{maxSize:f=100,minSize:y=0}=p;c===l?(i=y,r=f):(s+=y,a+=f)}const u=Math.min(r,100-s),d=Math.max(i,100-a),h=t[l];return{valueMax:u,valueMin:d,valueNow:h}}function C(t,e="Assertion failed!"){if(!t)throw console.error(e),new Error(e)}const ri=100,At=10;function B(t,e,n=At){return Ce(t,e,n)===0}function Ce(t,e,n=At){const i=Lt(t,n),r=Lt(e,n);return Math.sign(i-r)}function be(t,e){if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!1;return!0}function Lt(t,e){return Number.parseFloat(t.toFixed(e))}const St=typeof document<"u";function si(t){return t instanceof HTMLElement}function Ft(t){return t.type==="keydown"}function Kt(t){return t.type.startsWith("mouse")}function Ut(t){return t.type.startsWith("touch")}function le({paneConstraints:t,paneIndex:e,initialSize:n}){const i=t[e];C(i!=null,"Pane constraints should not be null.");const{collapsedSize:r=0,collapsible:s,maxSize:a=100,minSize:l=0}=i;let u=n;return Ce(u,l)<0&&(u=ai(u,s,r,l)),u=Math.min(a,u),Number.parseFloat(u.toFixed(At))}function ai(t,e,n,i){if(!e)return i;const r=(n+i)/2;return Ce(t,r)<0?n:i}function ie(){}function oi({groupId:t,layout:e,paneDataArray:n}){const i=Ye(t);for(let r=0;r<n.length-1;r++){const{valueMax:s,valueMin:a,valueNow:l}=ii({layout:e,panesArray:n,pivotIndices:[r,r+1]}),u=i[r];if(si(u)){const d=n[r];u.setAttribute("aria-controls",d.id),u.setAttribute("aria-valuemax",`${Math.round(s)}`),u.setAttribute("aria-valuemin",`${Math.round(a)}`),u.setAttribute("aria-valuenow",l!=null?`${Math.round(l)}`:"")}}return()=>{i.forEach(r=>{r.removeAttribute("aria-controls"),r.removeAttribute("aria-valuemax"),r.removeAttribute("aria-valuemin"),r.removeAttribute("aria-valuenow")})}}function Ye(t){return St?Array.from(document.querySelectorAll(`[data-pane-resizer-id][data-pane-group-id="${t}"]`)):[]}function Wt(t,e){return St?Ye(t).findIndex(r=>r.getAttribute("data-pane-resizer-id")===e)??null:null}function Rt(t,e){const n=Wt(t,e);return n!=null?[n,n+1]:[-1,-1]}function ae(t,e,n){const i=t.map(d=>d.constraints),r=oe(t,e),s=i[r],l=r===t.length-1?[r-1,r]:[r,r+1],u=n[r];return{...s,paneSize:u,pivotIndices:l}}function oe(t,e){return t.findIndex(n=>n.id===e.id)}function Se(t,e,n){for(let i=0;i<e.length-1;i++){const r=e[i],s=t[i];C(s);const{callbacks:a,constraints:l,id:u}=s,{collapsedSize:d=0,collapsible:h}=l,c=n[u];if(!(c==null||r!==c))return;n[u]=r;const{onCollapse:p,onExpand:f,onResize:y}=a;y==null||y(r,c),h&&(p||f)&&(f&&(c==null||c===d)&&r!==d&&f(),p&&(c==null||c!==d)&&r===d&&p())}}function li({paneDataArray:t}){const e=Array(t.length),n=t.map(s=>s.constraints);let i=0,r=100;for(let s=0;s<t.length;s++){const a=n[s];C(a);const{defaultSize:l}=a;l!=null&&(i++,e[s]=l,r-=l)}for(let s=0;s<t.length;s++){const a=n[s];C(a);const{defaultSize:l}=a;if(l!=null)continue;const u=t.length-i,d=r/u;i++,e[s]=d,r-=d}return e}function ci({layout:t,paneConstraints:e}){const n=[...t],i=n.reduce((s,a)=>s+a,0);if(n.length!==e.length)throw new Error(`Invalid ${e.length} pane layout: ${n.map(s=>`${s}%`).join(", ")}`);if(!B(i,100))for(let s=0;s<e.length;s++){const a=n[s];C(a!=null);const l=100/i*a;n[s]=l}let r=0;for(let s=0;s<e.length;s++){const a=n[s];C(a!=null);const l=le({paneConstraints:e,paneIndex:s,initialSize:a});a!==l&&(r+=a-l,n[s]=l)}if(!B(r,0))for(let s=0;s<e.length;s++){const a=n[s];C(a!=null);const l=a+r,u=le({paneConstraints:e,paneIndex:s,initialSize:l});if(a!==u&&(r-=u-a,n[s]=u,B(r,0)))break}return n}function ui(t){if(!St)return null;const e=document.querySelector(`[data-pane-group][data-pane-group-id="${t}"]`);return e||null}function _t(t){if(!St)return null;const e=document.querySelector(`[data-pane-resizer-id="${t}"]`);return e||null}function di(t,e,n,i){const r=n==="horizontal",s=_t(e);C(s);const a=s.getAttribute("data-pane-group-id");C(a);const{initialCursorPosition:l}=i,u=Vt(n,t),d=ui(a);C(d);const h=d.getBoundingClientRect(),c=r?h.width:h.height;return(u-l)/c*100}function hi(t,e,n,i,r){if(Ft(t)){const s=n==="horizontal";let a=0;t.shiftKey?a=100:r!=null?a=r:a=10;let l=0;switch(t.key){case"ArrowDown":l=s?0:a;break;case"ArrowLeft":l=s?-a:0;break;case"ArrowRight":l=s?a:0;break;case"ArrowUp":l=s?0:-a;break;case"End":l=100;break;case"Home":l=-100;break}return l}else return i==null?0:di(t,e,n,i)}function Vt(t,e){const n=t==="horizontal";if(Kt(e))return n?e.clientX:e.clientY;if(Ut(e)){const i=e.touches[0];return C(i),n?i.screenX:i.screenY}else throw new Error(`Unsupported event type "${e.type}"`)}function fi(t,e,n){var u,d;const i=_t(e),r=Ye(t),s=i?r.indexOf(i):-1,a=((u=n[s])==null?void 0:u.id)??null,l=((d=n[s+1])==null?void 0:d.id)??null;return[a,l]}let Mt=0;function tt(t="paneforge"){return Mt++,`${t}-${Mt}`}function Ht(t,e){return rn(t,e)}function pi(t,e){const n=t,i=typeof t=="symbol"?t.description:t;if(!sn(n)){if(e===void 0)throw new Error(`Missing context dependency: ${i} and no fallback was provided.`);return e}return an(t)}function gi(t,e){return`${t}Context`}function yi(t,e,n=!0){const i=gi(t),r=Symbol(i),s=i;function a(u){const d=pi(n?r:s,u);if(d===void 0)throw new Error(`Context \`${i}\` not found. Component must be used within ${Array.isArray(t)?`one of the following components: ${t.join(", ")}`:`\`${t}\``}`);return d}function l(u){return Ht(n?r:s,u)}return[l,a]}function ze({delta:t,layout:e,paneConstraints:n,pivotIndices:i,trigger:r}){if(B(t,0))return e;const s=[...e],[a,l]=i;let u=0;if(r==="keyboard"){{const h=t<0?l:a,c=n[h];if(C(c),c.collapsible){const p=e[h];C(p!=null);const f=n[h];C(f);const{collapsedSize:y=0,minSize:b=0}=f;if(B(p,y)){const m=b-p;Ce(m,Math.abs(t))>0&&(t=t<0?0-m:m)}}}{const h=t<0?a:l,c=n[h];C(c);const{collapsible:p}=c;if(p){const f=e[h];C(f!=null);const y=n[h];C(y);const{collapsedSize:b=0,minSize:m=0}=y;if(B(f,m)){const w=f-b;Ce(w,Math.abs(t))>0&&(t=t<0?0-w:w)}}}}{const h=t<0?1:-1;let c=t<0?l:a,p=0;for(;;){const y=e[c];C(y!=null);const m=le({paneConstraints:n,paneIndex:c,initialSize:100})-y;if(p+=m,c+=h,c<0||c>=n.length)break}const f=Math.min(Math.abs(t),Math.abs(p));t=t<0?0-f:f}{let c=t<0?a:l;for(;c>=0&&c<n.length;){const p=Math.abs(t)-Math.abs(u),f=e[c];C(f!=null);const y=f-p,b=le({paneConstraints:n,paneIndex:c,initialSize:y});if(!B(f,b)&&(u+=f-b,s[c]=b,u.toPrecision(3).localeCompare(Math.abs(t).toPrecision(3),void 0,{numeric:!0})>=0))break;t<0?c--:c++}}if(B(u,0))return e;{const h=t<0?l:a,c=e[h];C(c!=null);const p=c+u,f=le({paneConstraints:n,paneIndex:h,initialSize:p});if(s[h]=f,!B(f,p)){let y=p-f,m=t<0?l:a;for(;m>=0&&m<n.length;){const w=s[m];C(w!=null);const A=w+y,z=le({paneConstraints:n,paneIndex:m,initialSize:A});if(B(w,z)||(y-=z-w,s[m]=z),B(y,0))break;t>0?m--:m++}}}const d=s.reduce((h,c)=>c+h,0);return B(d,100)?s:e}let Ct=null,te=null;function Jt(t){switch(t){case"horizontal":return"ew-resize";case"horizontal-max":return"w-resize";case"horizontal-min":return"e-resize";case"vertical":return"ns-resize";case"vertical-max":return"n-resize";case"vertical-min":return"s-resize"}}function vi(){te!==null&&(document.head.removeChild(te),Ct=null,te=null)}function wt(t){if(Ct===t)return;Ct=t;const e=Jt(t);te===null&&(te=document.createElement("style"),document.head.appendChild(te)),te.innerHTML=`*{cursor: ${e}!important;}`}function mi({defaultSize:t,dragState:e,layout:n,paneData:i,paneIndex:r,precision:s=3}){const a=n[r];let l;return a==null?l=t??"1":i.length===1?l="1":l=a.toPrecision(s),{flexBasis:0,flexGrow:l,flexShrink:1,overflow:"hidden",pointerEvents:e!==null?"none":void 0}}function Tt(t){try{if(typeof localStorage>"u")throw new TypeError("localStorage is not supported in this environment");t.getItem=e=>localStorage.getItem(e),t.setItem=(e,n)=>localStorage.setItem(e,n)}catch(e){console.error(e),t.getItem=()=>null,t.setItem=()=>{}}}function Xt(t){return`paneforge:${t}`}function Yt(t){return t.map(n=>{const{constraints:i,id:r,idIsFromProps:s,order:a}=n;return s?r:a?`${a}:${JSON.stringify(i)}`:JSON.stringify(i)}).sort().join(",")}function Zt(t,e){try{const n=Xt(t),i=e.getItem(n),r=JSON.parse(i||"");if(typeof r=="object"&&r!==null)return r}catch{}return null}function bi(t,e,n){const i=Zt(t,n)||{},r=Yt(e);return i[r]||null}function Si(t,e,n,i,r){const s=Xt(t),a=Yt(e),l=Zt(t,r)||{};l[a]={expandToSizes:Object.fromEntries(n.entries()),layout:i};try{r.setItem(s,JSON.stringify(l))}catch(u){console.error(u)}}const Bt={};function zi(t,e=10){let n=null;return(...r)=>{n!==null&&clearTimeout(n),n=setTimeout(()=>{t(...r)},e)}}function xi({autoSaveId:t,layout:e,storage:n,paneDataArray:i,paneSizeBeforeCollapse:r}){if(e.length===0||e.length!==i.length)return;let s=Bt[t];s==null&&(s=zi(Si,ri),Bt[t]=s);const a=[...i],l=new Map(r);s(t,a,l,e,n)}const we={getItem:t=>(Tt(we),we.getItem(t)),setItem:(t,e)=>{Tt(we),we.setItem(t,e)}};var Ae,de,_e,F,he,Ee,Le,Re,Me,He,Te,ot,lt;class wi{constructor(e){P(this,"id");g(this,Ae);g(this,de);P(this,"direction");g(this,_e);g(this,F);g(this,he);g(this,Ee,$(null));g(this,Le,$([]));g(this,Re,$([]));g(this,Me,$(!1));g(this,He,$(Qe({})));P(this,"paneSizeBeforeCollapseMap",new Map);g(this,Te,$(0));P(this,"setLayout",e=>{this.layout=e});P(this,"registerResizeHandle",e=>n=>{var m,w;n.preventDefault();const i=this.direction.current,r=this.dragState,s=this.id.current,a=o(this,_e).current,l=this.layout,u=this.paneDataArray,{initialLayout:d}=r??{},h=Rt(s,e);let c=hi(n,e,i,r,a);if(c===0)return;const p=i==="horizontal";document.dir==="rtl"&&p&&(c=-c);const f=u.map(A=>A.constraints),y=ze({delta:c,layout:d??l,paneConstraints:f,pivotIndices:h,trigger:Ft(n)?"keyboard":"mouse-or-touch"}),b=!be(l,y);(Kt(n)||Ut(n))&&this.prevDelta!==c&&(this.prevDelta=c,wt(b?p?"horizontal":"vertical":p?c<0?"horizontal-min":"horizontal-max":c<0?"vertical-min":"vertical-max")),b&&(this.setLayout(y),(w=(m=o(this,F)).current)==null||w.call(m,y),Se(u,y,this.paneIdToLastNotifiedSizeMap))});P(this,"resizePane",(e,n)=>{var c,p;const i=this.layout,r=this.paneDataArray,s=r.map(f=>f.constraints),{paneSize:a,pivotIndices:l}=ae(r,e,i);C(a!=null);const d=oe(r,e)===r.length-1?a-n:n-a,h=ze({delta:d,layout:i,paneConstraints:s,pivotIndices:l,trigger:"imperative-api"});be(i,h)||(this.setLayout(h),(p=(c=o(this,F)).current)==null||p.call(c,h),Se(r,h,this.paneIdToLastNotifiedSizeMap))});P(this,"startDragging",(e,n)=>{const i=this.direction.current,r=this.layout,s=_t(e);C(s);const a=Vt(i,n);this.dragState={dragHandleId:e,dragHandleRect:s.getBoundingClientRect(),initialCursorPosition:a,initialLayout:r}});P(this,"stopDragging",()=>{vi(),this.dragState=null});P(this,"unregisterPane",e=>{const n=[...this.paneDataArray],i=oe(n,e);i<0||(n.splice(i,1),this.paneDataArray=n,delete this.paneIdToLastNotifiedSizeMap[e.id],this.paneDataArrayChanged=!0)});P(this,"isPaneCollapsed",e=>{const n=this.paneDataArray,i=this.layout,{collapsedSize:r=0,collapsible:s,paneSize:a}=ae(n,e,i);return s===!0&&a===r});P(this,"expandPane",e=>{var y,b;const n=this.layout,i=this.paneDataArray;if(!e.constraints.collapsible)return;const r=i.map(m=>m.constraints),{collapsedSize:s=0,paneSize:a,minSize:l=0,pivotIndices:u}=ae(i,e,n);if(a!==s)return;const d=this.paneSizeBeforeCollapseMap.get(e.id),h=d!=null&&d>=l?d:l,p=oe(i,e)===i.length-1?a-h:h-a,f=ze({delta:p,layout:n,paneConstraints:r,pivotIndices:u,trigger:"imperative-api"});be(n,f)||(this.setLayout(f),(b=(y=o(this,F)).current)==null||b.call(y,f),Se(i,f,this.paneIdToLastNotifiedSizeMap))});P(this,"collapsePane",e=>{var c,p;const n=this.layout,i=this.paneDataArray;if(!e.constraints.collapsible)return;const r=i.map(f=>f.constraints),{collapsedSize:s=0,paneSize:a,pivotIndices:l}=ae(i,e,n);if(C(a!=null),a===s)return;this.paneSizeBeforeCollapseMap.set(e.id,a);const d=oe(i,e)===i.length-1?a-s:s-a,h=ze({delta:d,layout:n,paneConstraints:r,pivotIndices:l,trigger:"imperative-api"});be(n,h)||(this.layout=h,(p=(c=o(this,F)).current)==null||p.call(c,h),Se(i,h,this.paneIdToLastNotifiedSizeMap))});P(this,"getPaneSize",e=>{const{paneSize:n}=ae(this.paneDataArray,e,this.layout);return n});P(this,"getPaneStyle",(e,n)=>{const i=this.paneDataArray,r=this.layout,s=this.dragState,a=oe(i,e);return mi({defaultSize:n,dragState:s,layout:r,paneData:i,paneIndex:a})});P(this,"isPaneExpanded",e=>{const{collapsedSize:n=0,collapsible:i,paneSize:r}=ae(this.paneDataArray,e,this.layout);return!i||r>n});P(this,"registerPane",e=>{const n=[...this.paneDataArray,e];n.sort((i,r)=>{const s=i.order,a=r.order;return s==null&&a==null?0:s==null?-1:a==null?1:s-a}),this.paneDataArray=n,this.paneDataArrayChanged=!0});g(this,ot,()=>{const e=this.id.current,n=Ye(e),i=this.paneDataArray,r=n.map(s=>{const a=s.getAttribute("data-pane-resizer-id");if(!a)return ie;const[l,u]=fi(e,a,i);if(l==null||u==null)return ie;const h=ee(s,"keydown",c=>{if(c.defaultPrevented||c.key!=="Enter")return;c.preventDefault();const p=this.paneDataArray,f=p.findIndex(E=>E.id===l);if(f<0)return;const y=p[f];C(y);const b=this.layout,m=b[f],{collapsedSize:w=0,collapsible:A,minSize:z=0}=y.constraints;if(!(m!=null&&A))return;const _=ze({delta:B(m,w)?z-m:w-m,layout:b,paneConstraints:p.map(E=>E.constraints),pivotIndices:Rt(e,a),trigger:"keyboard"});b!==_&&(this.layout=_)});return()=>{h()}});return()=>{for(const s of r)s()}});g(this,lt,D(()=>({id:this.id.current,"data-pane-group":"","data-direction":this.direction.current,"data-pane-group-id":this.id.current,style:{display:"flex",flexDirection:this.direction.current==="horizontal"?"row":"column",height:"100%",overflow:"hidden",width:"100%"}})));P(this,"createResizer",e=>new Ci(e,this));P(this,"createPane",e=>new Ii(e,this));this.id=e.id,x(this,Ae,e.ref),x(this,de,e.autoSaveId),this.direction=e.direction,x(this,_e,e.keyboardResizeBy),x(this,F,e.onLayout),x(this,he,e.storage),Dt({id:this.id,ref:o(this,Ae)}),Y(()=>{const n=this.id.current,i=this.layout,r=this.paneDataArray;xe(()=>oi({groupId:n,layout:i,paneDataArray:r}))}),Y(()=>{xe(()=>o(this,ot).call(this))}),Y(()=>{const n=o(this,de).current,i=this.layout,r=o(this,he).current;n&&xe(()=>{xi({autoSaveId:n,layout:i,storage:r,paneDataArray:this.paneDataArray,paneSizeBeforeCollapse:this.paneSizeBeforeCollapseMap})})}),Y(()=>{this.paneDataArrayChanged&&xe(()=>{var d,h;this.paneDataArrayChanged=!1;const i=o(this,de).current,r=o(this,he).current,s=this.layout,a=this.paneDataArray;let l=null;if(i){const c=bi(i,a,r);c&&(this.paneSizeBeforeCollapseMap=new Map(Object.entries(c.expandToSizes)),l=c.layout)}l==null&&(l=li({paneDataArray:a}));const u=ci({layout:l,paneConstraints:a.map(c=>c.constraints)});be(s,u)||(this.layout=u,(h=(d=o(this,F)).current)==null||h.call(d,u),Se(a,u,this.paneIdToLastNotifiedSizeMap))})})}get dragState(){return v(o(this,Ee))}set dragState(e){V(o(this,Ee),e)}get layout(){return v(o(this,Le))}set layout(e){V(o(this,Le),e)}get paneDataArray(){return v(o(this,Re))}set paneDataArray(e){V(o(this,Re),e)}get paneDataArrayChanged(){return v(o(this,Me))}set paneDataArrayChanged(e){V(o(this,Me),Qe(e))}get paneIdToLastNotifiedSizeMap(){return v(o(this,He))}set paneIdToLastNotifiedSizeMap(e){V(o(this,He),Qe(e))}get prevDelta(){return v(o(this,Te))}set prevDelta(e){V(o(this,Te),Qe(e))}get props(){return v(o(this,lt))}}Ae=new WeakMap,de=new WeakMap,_e=new WeakMap,F=new WeakMap,he=new WeakMap,Ee=new WeakMap,Le=new WeakMap,Re=new WeakMap,Me=new WeakMap,He=new WeakMap,Te=new WeakMap,ot=new WeakMap,lt=new WeakMap;const Pi=["ArrowDown","ArrowLeft","ArrowRight","ArrowUp","End","Home"];var N,ne,J,X,Be,M,Ne,fe,pe,ct,ut,dt,ht,ft,pt,gt,yt,vt;class Ci{constructor(e,n){g(this,N);g(this,ne);g(this,J);g(this,X);g(this,Be);g(this,M);g(this,Ne,D(()=>{var e;return((e=o(this,M).dragState)==null?void 0:e.dragHandleId)===o(this,N).current}));g(this,fe,$(!1));P(this,"resizeHandler",null);g(this,pe,()=>{const e=o(this,ne).current;e&&(e.blur(),o(this,M).stopDragging(),o(this,J).current(!1))});g(this,ct,e=>{if(o(this,X).current||!this.resizeHandler||e.defaultPrevented)return;if(Pi.includes(e.key)){e.preventDefault(),this.resizeHandler(e);return}if(e.key!=="F6")return;e.preventDefault();const n=Ye(o(this,M).id.current),i=Wt(o(this,M).id.current,o(this,N).current);if(i===null)return;let r=0;e.shiftKey?i>0?r=i-1:r=n.length-1:i+1<n.length?r=i+1:r=0,n[r].focus()});g(this,ut,()=>{V(o(this,fe),!1)});g(this,dt,()=>{V(o(this,fe),!0)});g(this,ht,e=>{e.preventDefault(),o(this,M).startDragging(o(this,N).current,e),o(this,J).current(!0)});g(this,ft,()=>{o(this,pe).call(this)});g(this,pt,()=>{o(this,pe).call(this)});g(this,gt,()=>{o(this,pe).call(this)});g(this,yt,e=>{e.preventDefault(),o(this,M).startDragging(o(this,N).current,e),o(this,J).current(!0)});g(this,vt,D(()=>({id:o(this,N).current,role:"separator","data-direction":o(this,M).direction.current,"data-pane-group-id":o(this,M).id.current,"data-active":v(o(this,Ne))?"pointer":v(o(this,fe))?"keyboard":void 0,"data-enabled":!o(this,X).current,"data-pane-resizer-id":o(this,N).current,"data-pane-resizer":"",tabIndex:o(this,Be).current,style:{cursor:Jt(o(this,M).direction.current),touchAction:"none",userSelect:"none","-webkit-user-select":"none","-webkit-touch-callout":"none"},onkeydown:o(this,ct),onblur:o(this,ut),onfocus:o(this,dt),onmousedown:o(this,ht),onmouseup:o(this,ft),ontouchcancel:o(this,pt),ontouchend:o(this,gt),ontouchstart:o(this,yt)})));x(this,N,e.id),x(this,ne,e.ref),x(this,M,n),x(this,J,e.onDraggingChange),x(this,X,e.disabled),x(this,Be,e.tabIndex),Dt({id:o(this,N),ref:o(this,ne)}),Y(()=>{o(this,X).current?this.resizeHandler=null:this.resizeHandler=o(this,M).registerResizeHandle(o(this,N).current)}),Y(()=>{const i=o(this,ne).current;if(!i)return;const r=o(this,X).current,s=this.resizeHandler,a=v(o(this,Ne));if(r||s===null||!a)return;const l=c=>{s(c)},u=c=>{s(c)},d=()=>{i.blur(),o(this,M).stopDragging(),o(this,J).current(!1)};return Ot(ee(document.body,"contextmenu",d),ee(document.body,"mousemove",l),ee(document.body,"touchmove",l,{passive:!1}),ee(document.body,"mouseleave",u),ee(window,"mouseup",d),ee(window,"touchend",d))})}get props(){return v(o(this,vt))}}N=new WeakMap,ne=new WeakMap,J=new WeakMap,X=new WeakMap,Be=new WeakMap,M=new WeakMap,Ne=new WeakMap,fe=new WeakMap,pe=new WeakMap,ct=new WeakMap,ut=new WeakMap,dt=new WeakMap,ht=new WeakMap,ft=new WeakMap,pt=new WeakMap,gt=new WeakMap,yt=new WeakMap,vt=new WeakMap;var K,qe,Ge,je,ge,Oe,Fe,Ke,Ue,We,Ve,H,T,Je,mt;class Ii{constructor(e,n){g(this,K);g(this,qe);g(this,Ge);g(this,je);g(this,ge);g(this,Oe);g(this,Fe);g(this,Ke);g(this,Ue);g(this,We);g(this,Ve);g(this,H);g(this,T,D(()=>({callbacks:{onCollapse:o(this,Ue).current,onExpand:o(this,We).current,onResize:o(this,Ve).current},constraints:{collapsedSize:o(this,Ge).current,collapsible:o(this,je).current,defaultSize:o(this,ge).current,maxSize:o(this,Oe).current,minSize:o(this,Fe).current},id:o(this,K).current,idIsFromProps:!1,order:o(this,Ke).current})));P(this,"pane",{collapse:()=>{o(this,H).collapsePane(v(o(this,T)))},expand:()=>o(this,H).expandPane(v(o(this,T))),getSize:()=>o(this,H).getPaneSize(v(o(this,T))),isCollapsed:()=>o(this,H).isPaneCollapsed(v(o(this,T))),isExpanded:()=>o(this,H).isPaneExpanded(v(o(this,T))),resize:e=>o(this,H).resizePane(v(o(this,T)),e),getId:()=>o(this,K).current});g(this,Je,D(()=>o(this,H).isPaneCollapsed(v(o(this,T)))));g(this,mt,D(()=>({id:o(this,K).current,style:o(this,H).getPaneStyle(v(o(this,T)),o(this,ge).current),"data-pane":"","data-pane-id":o(this,K).current,"data-pane-group-id":o(this,H).id.current,"data-collapsed":v(o(this,Je))?"":void 0,"data-expanded":v(o(this,Je))?void 0:""})));x(this,K,e.id),x(this,qe,e.ref),x(this,Ge,e.collapsedSize),x(this,je,e.collapsible),x(this,ge,e.defaultSize),x(this,Oe,e.maxSize),x(this,Fe,e.minSize),x(this,Ke,e.order),x(this,Ue,e.onCollapse),x(this,We,e.onExpand),x(this,Ve,e.onResize),x(this,H,n),Dt({id:o(this,K),ref:o(this,qe)}),Ln(()=>(o(this,H).registerPane(v(o(this,T))),()=>{o(this,H).unregisterPane(v(o(this,T)))}))}get props(){return v(o(this,mt))}}K=new WeakMap,qe=new WeakMap,Ge=new WeakMap,je=new WeakMap,ge=new WeakMap,Oe=new WeakMap,Fe=new WeakMap,Ke=new WeakMap,Ue=new WeakMap,We=new WeakMap,Ve=new WeakMap,H=new WeakMap,T=new WeakMap,Je=new WeakMap,mt=new WeakMap;const[ki,Qt]=yi("PaneGroup");function Di(t){return ki(new wi(t))}function Ai(t){return Qt().createResizer(t)}function _i(t){return Qt().createPane(t)}var Ei=Z("<div><!></div>");function Li(t,e){U(e,!0);let n=S(e,"autoSaveId",3,null),i=S(e,"id",19,tt),r=S(e,"keyboardResizeBy",3,null),s=S(e,"onLayoutChange",3,ie),a=S(e,"storage",3,we),l=S(e,"ref",15,null),u=Q(e,["$$slots","$$events","$$legacy","autoSaveId","direction","id","keyboardResizeBy","onLayoutChange","storage","ref","child","children"]);const d=Di({id:k.with(()=>i()??tt()),ref:k.with(()=>l(),A=>l(A)),autoSaveId:k.with(()=>n()),direction:k.with(()=>e.direction),keyboardResizeBy:k.with(()=>r()),onLayout:k.with(()=>s()),storage:k.with(()=>a())}),h=()=>d.layout,c=d.setLayout,p=()=>d.id.current,f=D(()=>kt(u,d.props));var y=R(),b=L(y);{var m=A=>{var z=R(),_=L(z);G(_,()=>e.child,()=>({props:v(f)})),I(A,z)},w=A=>{var z=Ei();let _;var E=ye(z);G(E,()=>e.children??Xe),ve(z),re(()=>_=me(z,_,{...v(f)})),I(A,z)};se(b,A=>{e.child?A(m):A(w,!1)})}return I(t,y),W({getLayout:h,setLayout:c,getId:p})}var Ri=Z("<div><!></div>");function Ji(t,e){U(e,!0);let n=S(e,"id",19,tt),i=S(e,"ref",15,null),r=S(e,"onCollapse",3,ie),s=S(e,"onExpand",3,ie),a=S(e,"onResize",3,ie),l=Q(e,["$$slots","$$events","$$legacy","id","ref","collapsedSize","collapsible","defaultSize","maxSize","minSize","onCollapse","onExpand","onResize","order","child","children"]);const u=_i({id:k.with(()=>n()),ref:k.with(()=>i(),E=>i(E)),collapsedSize:k.with(()=>e.collapsedSize),collapsible:k.with(()=>e.collapsible),defaultSize:k.with(()=>e.defaultSize),maxSize:k.with(()=>e.maxSize),minSize:k.with(()=>e.minSize),onCollapse:k.with(()=>r()),onExpand:k.with(()=>s()),onResize:k.with(()=>a()),order:k.with(()=>e.order)}),d=u.pane.collapse,h=u.pane.expand,c=u.pane.getSize,p=u.pane.isCollapsed,f=u.pane.isExpanded,y=u.pane.resize,b=u.pane.getId,m=D(()=>kt(l,u.props));var w=R(),A=L(w);{var z=E=>{var j=R(),Ze=L(j);G(Ze,()=>e.child,()=>({props:v(m)})),I(E,j)},_=E=>{var j=Ri();let Ze;var $t=ye(j);G($t,()=>e.children??Xe),ve(j),re(()=>Ze=me(j,Ze,{...v(m)})),I(E,j)};se(A,E=>{e.child?E(z):E(_,!1)})}return I(t,w),W({collapse:d,expand:h,getSize:c,isCollapsed:p,isExpanded:f,resize:y,getId:b})}var Mi=Z("<div><!></div>");function Hi(t,e){U(e,!0);let n=S(e,"id",19,tt),i=S(e,"ref",15,null),r=S(e,"disabled",3,!1),s=S(e,"onDraggingChange",3,ie),a=S(e,"tabIndex",3,0),l=Q(e,["$$slots","$$events","$$legacy","id","ref","disabled","onDraggingChange","tabIndex","child","children"]);const u=Ai({id:k.with(()=>n()),ref:k.with(()=>i(),y=>i(y)),disabled:k.with(()=>r()),onDraggingChange:k.with(()=>s()),tabIndex:k.with(()=>a())}),d=D(()=>kt(l,u.props));var h=R(),c=L(h);{var p=y=>{var b=R(),m=L(b);G(m,()=>e.child,()=>({props:v(d)})),I(y,b)},f=y=>{var b=Mi();let m;var w=ye(b);G(w,()=>e.children??Xe),ve(b),re(()=>m=me(b,m,{...v(d)})),I(y,b)};se(c,y=>{e.child?y(p):y(f,!1)})}I(t,h),W()}var Ti=Z("<div><!></div>");function Xi(t,e){U(e,!0);let n=S(e,"ref",15,null),i=S(e,"withHandle",3,!1),r=S(e,"handleClass",3,""),s=Q(e,["$$slots","$$events","$$legacy","ref","class","withHandle","handleClass"]);var a=R(),l=L(a);const u=D(()=>Pe("relative bg-border focus-visible:ring-ring flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 data-[direction=vertical]:h-px data-[direction=vertical]:w-full data-[direction=vertical]:after:left-0 data-[direction=vertical]:after:h-1 data-[direction=vertical]:after:w-full data-[direction=vertical]:after:-translate-y-1/2 data-[direction=vertical]:after:translate-x-0 [&[data-direction=vertical]>div]:rotate-90",e.class));et(l,()=>Hi,(d,h)=>{h(d,bt({get class(){return v(u)}},()=>s,{get ref(){return n()},set ref(c){n(c)},children:(c,p)=>{var f=R(),y=L(f);{var b=m=>{var w=Ti(),A=ye(w);_n(A,{class:"size-2.5"}),ve(w),re(z=>En(w,In(z)),[()=>Pe("bg-border z-10 flex h-4 w-3 items-center justify-center rounded-sm border",r())]),I(m,w)};se(y,m=>{i()&&m(b)})}I(c,f)},$$slots:{default:!0}}))}),I(t,a),W()}function Yi(t,e){U(e,!0),S(e,"ref",11,null);let n=S(e,"this",15),i=Q(e,["$$slots","$$events","$$legacy","ref","this","class"]);var r=R(),s=L(r);const a=D(()=>Pe("flex h-full w-full data-[direction=vertical]:flex-col",e.class));et(s,()=>Li,(l,u)=>{on(u(l,bt({get class(){return v(a)}},()=>i)),d=>n(d),()=>n())}),I(t,r),W()}function Zi(t,e){const n=ln(e,["children","$$slots","$$events","$$legacy"]);kn(t,bt({name:"bot-message-square"},()=>n,{iconNode:[["path",{d:"M12 6V2H8"}],["path",{d:"m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"}],["path",{d:"M2 12h2"}],["path",{d:"M9 11v2"}],["path",{d:"M15 11v2"}],["path",{d:"M20 12h2"}]],children:(r,s)=>{var a=R(),l=L(a);Dn(l,e,"default",{}),I(r,a)},$$slots:{default:!0}}))}export{Zi as B,Ji as P,Xi as R,Vi as S,Yi as a};
