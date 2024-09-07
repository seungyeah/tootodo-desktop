import{O as Pe,P as Ve,s as Q,H as $,i as P,f as y,D as G,k as ue,y as z,z as te,r as le,l as M,e as F,c as B,b as K,A as x,Q as Oe,u as H,m as j,o as L,w as pe,C as je,x as De,a as re,g as ie,q as oe,h as ae,p as Le,L as Ue,t as fe,d as ce}from"../chunks/scheduler.LqW0zi1Y.js";import{S as J,i as X,g as Ne,a as v,c as Se,t as k,f as Ge,b as O,d as D,m as N,e as S}from"../chunks/index.CBSmUvEG.js";import{t as qe,o as Fe,e as Be,m as he,n as Ke,y as ve,b as Y,k as Qe,l as ke,v as Je,r as R,g as se,c as ee,a as Ie,z as ye,A as Xe,B as de}from"../chunks/index.DWLc_sPO.js";import{g as Ye}from"../chunks/locale.2WNLRJku.js";import{d as Ze,w as we}from"../chunks/index.CYC7l4Lj.js";import{h as U}from"../chunks/rovingFocus.pjVoh4TB.js";import{c as $e,r as xe,g as et,a as tt}from"../chunks/updater.J5FXuFE5.js";import{a as lt}from"../chunks/arrays.CcCWK78l.js";import{g as Z}from"../chunks/entry.CO2krkw7.js";import{p as st}from"../chunks/stores.DdO-PSNM.js";const ot={type:"single",orientation:"horizontal",loop:!0,rovingFocus:!0,disabled:!1,defaultValue:""},{name:Ae,selector:w}=Ke("toggle-group"),at=s=>{const e={...ot,...s},l=qe(Fe(e,"value")),{type:t,orientation:o,loop:a,rovingFocus:r,disabled:n}=l,u=e.defaultValue?e.defaultValue:e.type==="single"?void 0:[],i=e.value??we(u),c=Be(i,e==null?void 0:e.onValueChange),_=he(Ae(),{stores:o,returned:g=>({role:"group","data-orientation":g})}),f=he(Ae("item"),{stores:[c,n,o,t],returned:([g,p,A,T])=>m=>{const V=typeof m=="string"?m:m.value,q=typeof m=="string"?!1:!!m.disabled,I=p||q,b=Array.isArray(g)?g.includes(V):g===V,d=T==="single",E=T==="multiple"||T===void 0;return{disabled:ve(I),pressed:b,"data-orientation":A,"data-disabled":ve(I),"data-state":b?"on":"off","data-value":V,"aria-pressed":E?b:void 0,"aria-checked":d?b:void 0,type:"button",role:d?"radio":void 0,tabindex:b?0:-1}},action:g=>{let p=Je;const A=g.closest(w());if(!Y(A))return{};const T=Array.from(A.querySelectorAll(w("item"))),m=c.get();!(Array.isArray(m)?m.length>0:!!m)&&T[0]===g&&(g.tabIndex=0);function q(){const b=g.dataset.value,d=g.dataset.disabled==="true";return{value:b,disabled:d}}function I(){const{value:b,disabled:d}=q();b===void 0||d||c.update(E=>Array.isArray(E)?E.includes(b)?E.filter(C=>C!==b):[...E,b]:E===b?void 0:b)}return p=Qe(ke(g,"click",()=>{I()}),ke(g,"keydown",b=>{if(b.key===R.SPACE||b.key===R.ENTER){b.preventDefault(),I();return}if(!r.get())return;const d=b.currentTarget;if(!Y(d))return;const E=d.closest(w());if(!Y(E))return;const C=Array.from(E.querySelectorAll(w("item")+":not([data-disabled])")).filter(W=>Y(W)),ge=C.indexOf(d),_e=Ye(d),me=o.get(),Me={horizontal:_e==="rtl"?R.ARROW_LEFT:R.ARROW_RIGHT,vertical:R.ARROW_DOWN}[me??"horizontal"],He={horizontal:_e==="rtl"?R.ARROW_RIGHT:R.ARROW_LEFT,vertical:R.ARROW_UP}[me??"horizontal"],be=a.get();if(b.key===Me){b.preventDefault();const W=ge+1;W>=C.length&&be?U(C[0]):U(C[W])}else if(b.key===He){b.preventDefault();const W=ge-1;W<0&&be?U(C[C.length-1]):U(C[W])}else b.key===R.HOME?(b.preventDefault(),U(C[0])):b.key===R.END&&(b.preventDefault(),U(C[C.length-1]))})),{destroy:p}}}),h=Ze(c,g=>p=>Array.isArray(g)?g.includes(p):g===p);return{elements:{root:_,item:f},states:{value:c},helpers:{isPressed:h},options:l}};function We(){return{NAME:"toggle-group",PARTS:["root","item"]}}function nt(s){const{NAME:e,PARTS:l}=We(),t=$e(e,l),o={...at(xe(s)),getAttrs:t};return Pe(e,o),{...o,updateOption:et(o.options)}}function rt(){const{NAME:s}=We();return Ve(s)}const it=s=>({builder:s&4}),Te=s=>({builder:s[2]}),ut=s=>({builder:s&4}),Ce=s=>({builder:s[2]});function ft(s){let e,l,t,o;const a=s[13].default,r=M(a,s,s[12],Te);let n=[s[2],s[4]],u={};for(let i=0;i<n.length;i+=1)u=z(u,n[i]);return{c(){e=F("div"),r&&r.c(),this.h()},l(i){e=B(i,"DIV",{});var c=K(e);r&&r.l(c),c.forEach(y),this.h()},h(){x(e,u)},m(i,c){P(i,e,c),r&&r.m(e,null),s[14](e),l=!0,t||(o=Oe(s[2].action(e)),t=!0)},p(i,c){r&&r.p&&(!l||c&4100)&&H(r,a,i,i[12],l?L(a,i[12],c,it):j(i[12]),Te),x(e,u=se(n,[c&4&&i[2],c&16&&i[4]]))},i(i){l||(k(r,i),l=!0)},o(i){v(r,i),l=!1},d(i){i&&y(e),r&&r.d(i),s[14](null),t=!1,o()}}}function ct(s){let e;const l=s[13].default,t=M(l,s,s[12],Ce);return{c(){t&&t.c()},l(o){t&&t.l(o)},m(o,a){t&&t.m(o,a),e=!0},p(o,a){t&&t.p&&(!e||a&4100)&&H(t,l,o,o[12],e?L(l,o[12],a,ut):j(o[12]),Ce)},i(o){e||(k(t,o),e=!0)},o(o){v(t,o),e=!1},d(o){t&&t.d(o)}}}function dt(s){let e,l,t,o;const a=[ct,ft],r=[];function n(u,i){return u[1]?0:1}return e=n(s),l=r[e]=a[e](s),{c(){l.c(),t=$()},l(u){l.l(u),t=$()},m(u,i){r[e].m(u,i),P(u,t,i),o=!0},p(u,[i]){let c=e;e=n(u),e===c?r[e].p(u,i):(Ne(),v(r[c],1,1,()=>{r[c]=null}),Se(),l=r[e],l?l.p(u,i):(l=r[e]=a[e](u),l.c()),k(l,1),l.m(t.parentNode,t))},i(u){o||(k(l),o=!0)},o(u){v(l),o=!1},d(u){u&&y(t),r[e].d(u)}}}function gt(s,e,l){let t;const o=["type","disabled","loop","value","orientation","onValueChange","asChild","el"];let a=G(e,o),r,{$$slots:n={},$$scope:u}=e,{type:i="single"}=e,{disabled:c=void 0}=e,{loop:_=void 0}=e,{value:f=void 0}=e,{orientation:h=void 0}=e,{onValueChange:g=void 0}=e,{asChild:p=!1}=e,{el:A=void 0}=e;const{elements:{root:T},states:{value:m},updateOption:V,getAttrs:q}=nt({disabled:c,type:i,defaultValue:f,loop:_,orientation:h,onValueChange:({next:d})=>Array.isArray(d)?((!Array.isArray(f)||!lt(f,d))&&(g==null||g(d),l(5,f=d)),d):(f!==d&&(g==null||g(d),l(5,f=d)),d)});ue(s,T,d=>l(11,r=d));const I=q("root");function b(d){le[d?"unshift":"push"](()=>{A=d,l(0,A)})}return s.$$set=d=>{e=z(z({},e),te(d)),l(4,a=G(e,o)),"type"in d&&l(6,i=d.type),"disabled"in d&&l(7,c=d.disabled),"loop"in d&&l(8,_=d.loop),"value"in d&&l(5,f=d.value),"orientation"in d&&l(9,h=d.orientation),"onValueChange"in d&&l(10,g=d.onValueChange),"asChild"in d&&l(1,p=d.asChild),"el"in d&&l(0,A=d.el),"$$scope"in d&&l(12,u=d.$$scope)},s.$$.update=()=>{s.$$.dirty&32&&f!==void 0&&m.set(Array.isArray(f)?[...f]:f),s.$$.dirty&128&&V("disabled",c),s.$$.dirty&256&&V("loop",_),s.$$.dirty&64&&V("type",i),s.$$.dirty&512&&V("orientation",h),s.$$.dirty&2048&&l(2,t=r),s.$$.dirty&4&&Object.assign(t,I)},[A,p,t,T,a,f,i,c,_,h,g,r,u,n,b]}let _t=class extends J{constructor(e){super(),X(this,e,gt,dt,Q,{type:6,disabled:7,loop:8,value:5,orientation:9,onValueChange:10,asChild:1,el:0})}};const mt=s=>({builder:s&4}),ze=s=>({builder:s[2]}),bt=s=>({builder:s&4}),Ee=s=>({builder:s[2]});function pt(s){let e,l,t,o;const a=s[10].default,r=M(a,s,s[9],ze);let n=[s[2],s[5]],u={};for(let i=0;i<n.length;i+=1)u=z(u,n[i]);return{c(){e=F("button"),r&&r.c(),this.h()},l(i){e=B(i,"BUTTON",{});var c=K(e);r&&r.l(c),c.forEach(y),this.h()},h(){x(e,u)},m(i,c){P(i,e,c),r&&r.m(e,null),e.autofocus&&e.focus(),s[11](e),l=!0,t||(o=[Oe(s[2].action(e)),pe(e,"m-click",s[4]),pe(e,"m-keydown",s[4])],t=!0)},p(i,c){r&&r.p&&(!l||c&516)&&H(r,a,i,i[9],l?L(a,i[9],c,mt):j(i[9]),ze),x(e,u=se(n,[c&4&&i[2],c&32&&i[5]]))},i(i){l||(k(r,i),l=!0)},o(i){v(r,i),l=!1},d(i){i&&y(e),r&&r.d(i),s[11](null),t=!1,je(o)}}}function ht(s){let e;const l=s[10].default,t=M(l,s,s[9],Ee);return{c(){t&&t.c()},l(o){t&&t.l(o)},m(o,a){t&&t.m(o,a),e=!0},p(o,a){t&&t.p&&(!e||a&516)&&H(t,l,o,o[9],e?L(l,o[9],a,bt):j(o[9]),Ee)},i(o){e||(k(t,o),e=!0)},o(o){v(t,o),e=!1},d(o){t&&t.d(o)}}}function vt(s){let e,l,t,o;const a=[ht,pt],r=[];function n(u,i){return u[1]?0:1}return e=n(s),l=r[e]=a[e](s),{c(){l.c(),t=$()},l(u){l.l(u),t=$()},m(u,i){r[e].m(u,i),P(u,t,i),o=!0},p(u,[i]){let c=e;e=n(u),e===c?r[e].p(u,i):(Ne(),v(r[c],1,1,()=>{r[c]=null}),Se(),l=r[e],l?l.p(u,i):(l=r[e]=a[e](u),l.c()),k(l,1),l.m(t.parentNode,t))},i(u){o||(k(l),o=!0)},o(u){v(l),o=!1},d(u){u&&y(t),r[e].d(u)}}}function kt(s,e,l){let t;const o=["value","disabled","asChild","el"];let a=G(e,o),r,{$$slots:n={},$$scope:u}=e,{value:i}=e,{disabled:c=!1}=e,{asChild:_=!1}=e,{el:f=void 0}=e;const{elements:{item:h},getAttrs:g}=rt();ue(s,h,m=>l(8,r=m));const p=tt(),A=g("item");function T(m){le[m?"unshift":"push"](()=>{f=m,l(0,f)})}return s.$$set=m=>{e=z(z({},e),te(m)),l(5,a=G(e,o)),"value"in m&&l(6,i=m.value),"disabled"in m&&l(7,c=m.disabled),"asChild"in m&&l(1,_=m.asChild),"el"in m&&l(0,f=m.el),"$$scope"in m&&l(9,u=m.$$scope)},s.$$.update=()=>{s.$$.dirty&448&&l(2,t=r({value:i,disabled:c})),s.$$.dirty&4&&Object.assign(t,A)},[f,_,t,h,p,a,i,c,r,u,n,T]}let yt=class extends J{constructor(e){super(),X(this,e,kt,vt,Q,{value:6,disabled:7,asChild:1,el:0})}};const At=s=>({builder:s&256}),Re=s=>({builder:s[8]});function Tt(s){let e;const l=s[5].default,t=M(l,s,s[7],Re);return{c(){t&&t.c()},l(o){t&&t.l(o)},m(o,a){t&&t.m(o,a),e=!0},p(o,a){t&&t.p&&(!e||a&384)&&H(t,l,o,o[7],e?L(l,o[7],a,At):j(o[7]),Re)},i(o){e||(k(t,o),e=!0)},o(o){v(t,o),e=!1},d(o){t&&t.d(o)}}}function Ct(s){let e,l,t;const o=[{class:ee("flex items-center justify-center gap-1",s[1])},s[2]];function a(n){s[6](n)}let r={$$slots:{default:[Tt,({builder:n})=>({8:n}),({builder:n})=>n?256:0]},$$scope:{ctx:s}};for(let n=0;n<o.length;n+=1)r=z(r,o[n]);return s[0]!==void 0&&(r.value=s[0]),e=new _t({props:r}),le.push(()=>Ge(e,"value",a)),{c(){O(e.$$.fragment)},l(n){D(e.$$.fragment,n)},m(n,u){N(e,n,u),t=!0},p(n,[u]){const i=u&6?se(o,[u&2&&{class:ee("flex items-center justify-center gap-1",n[1])},u&4&&Ie(n[2])]):{};u&384&&(i.$$scope={dirty:u,ctx:n}),!l&&u&1&&(l=!0,i.value=n[0],De(()=>l=!1)),e.$set(i)},i(n){t||(k(e.$$.fragment,n),t=!0)},o(n){v(e.$$.fragment,n),t=!1},d(n){S(e,n)}}}function zt(s,e,l){const t=["class","variant","size","value"];let o=G(e,t),{$$slots:a={},$$scope:r}=e,{class:n=void 0}=e,{variant:u="default"}=e,{size:i="default"}=e,{value:c=void 0}=e;Ot({variant:u,size:i});function _(f){c=f,l(0,c)}return s.$$set=f=>{e=z(z({},e),te(f)),l(2,o=G(e,t)),"class"in f&&l(1,n=f.class),"variant"in f&&l(3,u=f.variant),"size"in f&&l(4,i=f.size),"value"in f&&l(0,c=f.value),"$$scope"in f&&l(7,r=f.$$scope)},[c,n,o,u,i,a,_,r]}class Et extends J{constructor(e){super(),X(this,e,zt,Ct,Q,{class:1,variant:3,size:4,value:0})}}function Rt(s){let e;const l=s[6].default,t=M(l,s,s[7],null);return{c(){t&&t.c()},l(o){t&&t.l(o)},m(o,a){t&&t.m(o,a),e=!0},p(o,a){t&&t.p&&(!e||a&128)&&H(t,l,o,o[7],e?L(l,o[7],a,null):j(o[7]),null)},i(o){e||(k(t,o),e=!0)},o(o){v(t,o),e=!1},d(o){t&&t.d(o)}}}function Pt(s){let e,l;const t=[{class:ee(ye({variant:s[4].variant||s[1],size:s[4].size||s[2]}),s[0])},{value:s[3]},s[5]];let o={$$slots:{default:[Rt]},$$scope:{ctx:s}};for(let a=0;a<t.length;a+=1)o=z(o,t[a]);return e=new yt({props:o}),{c(){O(e.$$.fragment)},l(a){D(e.$$.fragment,a)},m(a,r){N(e,a,r),l=!0},p(a,[r]){const n=r&63?se(t,[r&23&&{class:ee(ye({variant:a[4].variant||a[1],size:a[4].size||a[2]}),a[0])},r&8&&{value:a[3]},r&32&&Ie(a[5])]):{};r&128&&(n.$$scope={dirty:r,ctx:a}),e.$set(n)},i(a){l||(k(e.$$.fragment,a),l=!0)},o(a){v(e.$$.fragment,a),l=!1},d(a){S(e,a)}}}function Vt(s,e,l){const t=["class","variant","size","value"];let o=G(e,t),{$$slots:a={},$$scope:r}=e,{class:n=void 0}=e,{variant:u="default"}=e,{size:i="default"}=e,{value:c}=e;const _=Dt();return s.$$set=f=>{e=z(z({},e),te(f)),l(5,o=G(e,t)),"class"in f&&l(0,n=f.class),"variant"in f&&l(1,u=f.variant),"size"in f&&l(2,i=f.size),"value"in f&&l(3,c=f.value),"$$scope"in f&&l(7,r=f.$$scope)},[n,u,i,c,_,o,a,r]}class ne extends J{constructor(e){super(),X(this,e,Vt,Pt,Q,{class:0,variant:1,size:2,value:3})}}function Ot(s){Pe("toggleGroup",s)}function Dt(){return Ve("toggleGroup")}function Nt(s){let e;return{c(){e=fe("Task")},l(l){e=ce(l,"Task")},m(l,t){P(l,e,t)},d(l){l&&y(e)}}}function St(s){let e,l;return e=new de({props:{$$slots:{default:[Nt]},$$scope:{ctx:s}}}),e.$on("click",s[5]),{c(){O(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,o){N(e,t,o),l=!0},p(t,o){const a={};o&512&&(a.$$scope={dirty:o,ctx:t}),e.$set(a)},i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){v(e.$$.fragment,t),l=!1},d(t){S(e,t)}}}function Gt(s){let e;return{c(){e=fe("Note")},l(l){e=ce(l,"Note")},m(l,t){P(l,e,t)},d(l){l&&y(e)}}}function It(s){let e,l;return e=new de({props:{$$slots:{default:[Gt]},$$scope:{ctx:s}}}),e.$on("click",s[6]),{c(){O(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,o){N(e,t,o),l=!0},p(t,o){const a={};o&512&&(a.$$scope={dirty:o,ctx:t}),e.$set(a)},i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){v(e.$$.fragment,t),l=!1},d(t){S(e,t)}}}function Wt(s){let e;return{c(){e=fe("Habit")},l(l){e=ce(l,"Habit")},m(l,t){P(l,e,t)},d(l){l&&y(e)}}}function Mt(s){let e,l;return e=new de({props:{$$slots:{default:[Wt]},$$scope:{ctx:s}}}),e.$on("click",s[7]),{c(){O(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,o){N(e,t,o),l=!0},p(t,o){const a={};o&512&&(a.$$scope={dirty:o,ctx:t}),e.$set(a)},i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){v(e.$$.fragment,t),l=!1},d(t){S(e,t)}}}function Ht(s){let e,l,t,o,a,r;return e=new ne({props:{value:"tasks","aria-label":"task",class:"w-1/3 p-1 ml-2 h-3/4",$$slots:{default:[St]},$$scope:{ctx:s}}}),t=new ne({props:{value:"notes","aria-label":"note",class:"w-1/3 p-1 h-3/4",$$slots:{default:[It]},$$scope:{ctx:s}}}),a=new ne({props:{value:"habits","aria-label":"habit",class:"w-1/3 p-1 mr-2 h-3/4",$$slots:{default:[Mt]},$$scope:{ctx:s}}}),{c(){O(e.$$.fragment),l=re(),O(t.$$.fragment),o=re(),O(a.$$.fragment)},l(n){D(e.$$.fragment,n),l=ie(n),D(t.$$.fragment,n),o=ie(n),D(a.$$.fragment,n)},m(n,u){N(e,n,u),P(n,l,u),N(t,n,u),P(n,o,u),N(a,n,u),r=!0},p(n,u){const i={};u&512&&(i.$$scope={dirty:u,ctx:n}),e.$set(i);const c={};u&512&&(c.$$scope={dirty:u,ctx:n}),t.$set(c);const _={};u&512&&(_.$$scope={dirty:u,ctx:n}),a.$set(_)},i(n){r||(k(e.$$.fragment,n),k(t.$$.fragment,n),k(a.$$.fragment,n),r=!0)},o(n){v(e.$$.fragment,n),v(t.$$.fragment,n),v(a.$$.fragment,n),r=!1},d(n){n&&(y(l),y(o)),S(e,n),S(t,n),S(a,n)}}}function jt(s){let e,l,t,o,a,r,n;function u(f){s[8](f)}let i={class:"flex h-full w-[240px] items-center rounded-xl bg-white shadow-md ",$$slots:{default:[Ht]},$$scope:{ctx:s}};s[0]!==void 0&&(i.value=s[0]),t=new Et({props:i}),le.push(()=>Ge(t,"value",u));const c=s[4].default,_=M(c,s,s[9],null);return{c(){e=F("div"),l=F("div"),O(t.$$.fragment),a=re(),r=F("div"),_&&_.c(),this.h()},l(f){e=B(f,"DIV",{class:!0});var h=K(e);l=B(h,"DIV",{class:!0});var g=K(l);D(t.$$.fragment,g),g.forEach(y),a=ie(h),r=B(h,"DIV",{class:!0});var p=K(r);_&&_.l(p),p.forEach(y),h.forEach(y),this.h()},h(){oe(l,"class","relative z-10 flex h-10 w-[calc(100%-460px)] justify-start space-x-2"),oe(r,"class","h-[calc(100%-60px)] w-full"),oe(e,"class","flex flex-col items-center justify-center w-full h-full sm:absolute sm:top-0")},m(f,h){P(f,e,h),ae(e,l),N(t,l,null),ae(e,a),ae(e,r),_&&_.m(r,null),n=!0},p(f,[h]){const g={};h&512&&(g.$$scope={dirty:h,ctx:f}),!o&&h&1&&(o=!0,g.value=f[0],De(()=>o=!1)),t.$set(g),_&&_.p&&(!n||h&512)&&H(_,c,f,f[9],n?L(c,f[9],h,null):j(f[9]),null)},i(f){n||(k(t.$$.fragment,f),k(_,f),n=!0)},o(f){v(t.$$.fragment,f),v(_,f),n=!1},d(f){f&&y(e),S(t),_&&_.d(f)}}}function Lt(s,e,l){let t,o;ue(s,st,p=>l(3,o=p));let{$$slots:a={},$$scope:r}=e;const n=Xe(),u=n.start,i=n.end;Le(async()=>{await c(n)});async function c(p){const A=p.start,T=p.end,m=new URLSearchParams({start_date:A,end_date:T});await Z(`/too/tasks?${m.toString()}`),await Ue()}const _=()=>Z(`/too/tasks?start_date=${u}&end_date=${i}`),f=()=>Z("/too/notes"),h=()=>Z("/too/habits");function g(p){t=p,l(0,t),l(3,o)}return s.$$set=p=>{"$$scope"in p&&l(9,r=p.$$scope)},s.$$.update=()=>{s.$$.dirty&8&&l(0,t=o.url.pathname.split("/")[2])},[t,u,i,o,a,_,f,h,g,r]}class xt extends J{constructor(e){super(),X(this,e,Lt,jt,Q,{})}}export{xt as component};
