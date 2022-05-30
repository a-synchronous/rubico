/**
 * rubico v1.9.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
const noop=function(){},isPromise=n=>null!=n&&"function"==typeof n.then,funcConcat=(n,t)=>function(...o){const e=n(...o);return null!=(c=e)&&"function"==typeof c.then?e.then(t):t(e);var c},funcConcatSync=(n,t)=>function(...o){return t(n(...o))},objectProto=Object.prototype,nativeObjectToString=objectProto.toString,objectToString=n=>nativeObjectToString.call(n),generatorFunctionTag="[object GeneratorFunction]",isGeneratorFunction=n=>objectToString(n)==generatorFunctionTag,asyncGeneratorFunctionTag="[object AsyncGeneratorFunction]",isAsyncGeneratorFunction=n=>objectToString(n)==asyncGeneratorFunctionTag,pipe=function(...n){const t=n.pop();if(n.length>0)return t.reduce(funcConcat)(...n);let o=noop,e=noop;return function(...n){const c=n[0];return"function"!=typeof c||objectToString(c)==generatorFunctionTag||isAsyncGeneratorFunction(c)?(o==noop&&(o=t.reduce(funcConcat)),o(...n)):(e==noop&&(e=t.reduceRight(funcConcat)),e(c))}},pipeSync=n=>n.reduce(funcConcatSync);pipe.sync=pipeSync;export default pipe;
