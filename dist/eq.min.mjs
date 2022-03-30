/**
 * rubico v1.8.10
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
const spread2=e=>function([r,n]){return e(r,n)},isPromise=e=>null!=e&&"function"==typeof e.then,promiseAll=Promise.all.bind(Promise),sameValueZero=function(e,r){return e===r||e!=e&&r!=r},__=Symbol.for("placeholder"),curry2ResolveArg0=(e,r)=>function(n){return e(n,r)},curry2ResolveArg1=(e,r)=>function(n){return e(r,n)},curry2=function(e,r,n){return r==__?curry2ResolveArg0(e,n):curry2ResolveArg1(e,r)},always=e=>function(){return e},eq=function(e,r){const n="function"==typeof e,o="function"==typeof r;return n||o?n&&o?function(n){const o=e(n),u=r(n),t=isPromise(o),s=isPromise(u);return t&&s?promiseAll([o,u]).then((c=sameValueZero,function([e,r]){return c(e,r)})):t?o.then(curry2(sameValueZero,__,u)):s?u.then(curry2(sameValueZero,o,__)):sameValueZero(o,u);var c}:n?function(n){const o=e(n);return isPromise(o)?o.then(curry2(sameValueZero,__,r)):sameValueZero(o,r)}:o?function(n){const o=r(n);return isPromise(o)?o.then(curry2(sameValueZero,e,__)):sameValueZero(e,o)}:function(n){return null!=n&&"function"==typeof n.eq?n.eq(e,r):sameValueZero(e,r)}:sameValueZero(e,r)};export default eq;
