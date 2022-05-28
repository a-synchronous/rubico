/**
 * rubico v1.8.15
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
const spread2=r=>function([e,n]){return r(e,n)},isPromise=r=>null!=r&&"function"==typeof r.then,promiseAll=Promise.all.bind(Promise),greaterThanOrEqual=(r,e)=>r>=e,__=Symbol.for("placeholder"),curry2ResolveArg0=(r,e)=>function(n){return r(n,e)},curry2ResolveArg1=(r,e)=>function(n){return r(e,n)},curry2=function(r,e,n){return e==__?curry2ResolveArg0(r,n):curry2ResolveArg1(r,e)},always=r=>function(){return r},gte=function(r,e){const n="function"==typeof r,t="function"==typeof e;return n&&t?function(n){const t=r(n),u=e(n),o=isPromise(t),c=isPromise(u);return o&&c?promiseAll([t,u]).then((i=greaterThanOrEqual,function([r,e]){return i(r,e)})):o?t.then(curry2(greaterThanOrEqual,__,u)):c?u.then(curry2(greaterThanOrEqual,t,__)):t>=u;var i}:n?function(n){const t=r(n);return isPromise(t)?t.then(curry2(greaterThanOrEqual,__,e)):t>=e}:t?function(n){const t=e(n);return isPromise(t)?t.then(curry2(greaterThanOrEqual,r,__)):r>=t}:r>=e};export default gte;
