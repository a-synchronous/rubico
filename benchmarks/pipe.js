const timeInLoop = require('../x/timeInLoop')
const _ = require('lodash/fp')
const { pipe } = require('..')
const R = require('ramda')

const isPromise = value => value != null && typeof value.then == 'function'

/**
 * @name funcConcat
 *
 * @benchmark
 * funcConcat1: 1e+6: 25.164ms
 * funcConcat2: 1e+6: 26.097ms
 * funcConcat20: 1e+6: 25.276ms
 * funcConcat30: 1e+6: 24.74ms
 * funcConcat31: 1e+6: 15.768ms
 *
 * funcConcat1 - async: 1e+6: 302.914ms
 * funcConcat2 - async: 1e+6: 302.83ms
 * funcConcat20 - async: 1e+6: 297.492ms
 * funcConcat30 - async: 1e+6: 250.784ms
 * funcConcat31 - async: 1e+6: 244.547ms
 */

const funcConcat1 = (funcA, funcB) => function pipedFunction(...args) {
  const intermediate = funcA.apply(null, args)
  const resolver = _funcCallResolver(funcB)
  return isPromise(intermediate)
    ? intermediate.then(res => funcB.call(null, res))
    : funcB.call(null, intermediate)
}

const _funcCallResolver = func => function resolver(value) {
  return func.call(null, value)
}

const funcConcat2 = (funcA, funcB) => function pipedFunction(...args) {
  const intermediate = funcA.apply(null, args)
  const resolver = _funcCallResolver(funcB)
  return isPromise(intermediate)
    ? intermediate.then(resolver)
    : resolver(intermediate)
}

const funcConcat20 = (funcA, funcB) => function pipedFunction(...args) {
  const intermediate = funcA.apply(null, args)
  const resolver = _funcCallResolver(funcB)
  return isPromise(intermediate)
    ? intermediate.then(resolver)
    : funcB.call(null, intermediate)
}

const funcConcat30 = (funcA, funcB) => function pipedFunction(...args) {
  const intermediate = funcA.apply(null, args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB.call(null, intermediate)
}

const funcConcat31 = (funcA, funcB) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
}

{
  const funcA = number => number + 1

  const funcB = number => number + 2

  const asyncFuncA = async number => number + 1

  const asyncFuncB = async number => number + 2

  // console.log(funcConcat1(funcA, funcB)(2))
  // console.log(funcConcat2(funcA, funcB)(2))
  // console.log(funcConcat20(funcA, funcB)(2))
  // console.log(funcConcat30(funcA, funcB)(2))
  // console.log(funcConcat31(funcA, funcB)(2))
  // funcConcat1(asyncFuncA, asyncFuncB)(2).then(console.log)
  // funcConcat2(asyncFuncA, asyncFuncB)(2).then(console.log)
  // funcConcat20(asyncFuncA, asyncFuncB)(2).then(console.log)
  // funcConcat30(asyncFuncA, asyncFuncB)(2).then(console.log)
  // funcConcat31(asyncFuncA, asyncFuncB)(2).then(console.log)

  // timeInLoop('funcConcat1', 1e6, () => funcConcat1(funcA, funcB)(2))

  // timeInLoop('funcConcat2', 1e6, () => funcConcat2(funcA, funcB)(2))

  // timeInLoop('funcConcat20', 1e6, () => funcConcat20(funcA, funcB)(2))

  // timeInLoop('funcConcat30', 1e6, () => funcConcat30(funcA, funcB)(2))

  // timeInLoop('funcConcat31', 1e6, () => funcConcat31(funcA, funcB)(2))

  // timeInLoop.async('funcConcat1 - async', 1e6, () => funcConcat1(asyncFuncA, asyncFuncB)(2))

  // timeInLoop.async('funcConcat2 - async', 1e6, () => funcConcat2(asyncFuncA, asyncFuncB)(2))

  // timeInLoop.async('funcConcat20 - async', 1e6, () => funcConcat20(asyncFuncA, asyncFuncB)(2))

  // timeInLoop.async('funcConcat30 - async', 1e6, () => funcConcat30(asyncFuncA, asyncFuncB)(2))

  // timeInLoop.async('funcConcat31 - async', 1e6, () => funcConcat31(asyncFuncA, asyncFuncB)(2))
}

const funcConcatSync = (
  funcA, funcB,
) => function pipedFunction(...args) {
  return funcB(funcA(...args))
}

const pipeSync = funcs => funcs.reduce(funcConcatSync)

/**
 * @name pipe
 *
 * @benchmark
 * rubico.pipe: 1e+6: 249.955ms
 * rubico.pipe.sync: 1e+6: 94.613ms
 * _.pipe: 1e+6: 463.235ms
 * R.pipe: 1e+6: 1.034s
 */


const funcs = [
  number => number + 1,
  number => number + 2,
  number => number + 3,
]

const rubicoPipeline = pipe(funcs)

const pipeSyncPipeline = pipeSync(funcs)

const lodashPipeline = _.pipe(funcs)

const ramdaPipeline = R.pipe(...funcs)

// console.log('rubicoPipeline(2)', pipe(funcs)(2))
// console.log('pipeSyncPipeline(2)', pipe.sync(funcs)(2))
// console.log('lodashPipeline(2)', _.pipe(funcs)(2))
// console.log('ramdaPipeline(2)', R.pipe(...funcs)(2))

// timeInLoop('rubico.pipe', 1e6, () => pipe(funcs)(2))

// timeInLoop('rubico.pipe.sync', 1e6, () => pipe.sync(funcs)(2))

// timeInLoop('_.pipe', 1e6, () => _.pipe(funcs)(2))

// timeInLoop('R.pipe', 1e6, () => R.pipe(funcs[0], funcs[1], funcs[2])(2))
