/**
 * rubico v1.8.10
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
const spread2=r=>function([n,e]){return r(n,e)},isPromise=r=>null!=r&&"function"==typeof r.then,promiseAll=Promise.all.bind(Promise),lessThan=(r,n)=>r<n,__=Symbol.for("placeholder"),curry2ResolveArg0=(r,n)=>function(e){return r(e,n)},curry2ResolveArg1=(r,n)=>function(e){return r(n,e)},curry2=function(r,n,e){return n==__?curry2ResolveArg0(r,e):curry2ResolveArg1(r,n)},always=r=>function(){return r},lt=function(r,n){const e="function"==typeof r,t="function"==typeof n;return e&&t?function(e){const t=r(e),o=n(e),s=isPromise(t),u=isPromise(o);return s&&u?promiseAll([t,o]).then((c=lessThan,function([r,n]){return c(r,n)})):s?t.then(curry2(lessThan,__,o)):u?o.then(curry2(lessThan,t,__)):t<o;var c}:e?function(e){const t=r(e);return isPromise(t)?t.then(curry2(lessThan,__,n)):t<n}:t?function(e){const t=n(e);return isPromise(t)?t.then(curry2(lessThan,r,__)):r<t}:r<n};export default lt;
