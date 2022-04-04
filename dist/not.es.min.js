/**
 * rubico v1.8.11
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
const isPromise=n=>null!=n&&"function"==typeof n.then,_not=n=>!n,not=function(n){return"function"==typeof n?function(t){const o=n(t);return isPromise(o)?o.then(_not):!o}:!n},notSync=n=>function(...t){return!n(...t)};not.sync=notSync;export default not;
