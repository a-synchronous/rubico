/**
 * rubico v1.9.7
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2023 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
const isPromise=r=>null!=r&&"function"==typeof r.then,funcConcat=(r,n)=>function(...o){const t=r(...o);return isPromise(t)?t.then(n):n(t)},always=r=>function(){return r},thunkifyArgs=(r,n)=>function(){return r(...n)},thunkConditional=(r,n,o)=>r?n():o(),__=Symbol.for("placeholder"),curry3ResolveArg0=(r,n,o)=>function(t){return r(t,n,o)},curry3ResolveArg1=(r,n,o)=>function(t){return r(n,t,o)},curry3ResolveArg2=(r,n,o)=>function(t){return r(n,o,t)},curry3=function(r,n,o,t){return n==__?curry3ResolveArg0(r,o,t):o==__?curry3ResolveArg1(r,n,t):curry3ResolveArg2(r,n,o)},tap=r=>function(...n){const o=n[0],t=r(...n);return isPromise(t)?t.then(always(o)):o};tap.if=(r,n)=>function(...o){const t=r(...o);if(isPromise(t))return t.then((e=thunkConditional,u=__,c=thunkifyArgs(tap(n),o),s=always(o[0]),u==__?curry3ResolveArg0(e,c,s):c==__?curry3ResolveArg1(e,u,s):curry3ResolveArg2(e,u,c)));var e,u,c,s;if(t){const r=n(...o);if(isPromise(r))return r.then(always(o[0]))}return o[0]};const consoleLog=console.log,trace=function(...r){const n=r[0];return"function"==typeof n?tap((o=n,t=consoleLog,function(...r){const n=o(...r);return isPromise(n)?n.then(t):t(n)})):tap(consoleLog)(...r);var o,t};export default trace;
