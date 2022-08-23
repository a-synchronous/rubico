/**
 * rubico v1.9.3
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
const isPromise=r=>null!=r&&"function"==typeof r.then,__=Symbol.for("placeholder"),curry3ResolveArg0=(r,t,c)=>function(e){return r(e,t,c)},curry3ResolveArg1=(r,t,c)=>function(e){return r(t,e,c)},curry3ResolveArg2=(r,t,c)=>function(e){return r(t,c,e)},curry3=function(r,t,c,e){return t==__?curry3ResolveArg0(r,c,e):c==__?curry3ResolveArg1(r,t,e):curry3ResolveArg2(r,t,c)},catcherApply=function(r,t,c){return r(t,...c)},tryCatch=function(...r){if(r.length>2){const t=r.pop(),c=r.pop();try{const e=c(...r);return isPromise(e)?e.catch(curry3(catcherApply,t,__,r)):e}catch(c){return t(c,...r)}}const t=r[0],c=r[1];return function(...r){try{const e=t(...r);return isPromise(e)?e.catch(curry3(catcherApply,c,__,r)):e}catch(t){return c(t,...r)}}};export default tryCatch;
