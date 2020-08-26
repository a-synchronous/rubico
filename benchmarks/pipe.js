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
 *
 * funcConcat1 - async: 1e+6: 302.914ms
 * funcConcat2 - async: 1e+6: 302.83ms
 * funcConcat20 - async: 1e+6: 297.492ms
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

{
  const funcA = number => number + 1

  const funcB = number => number + 2

  const asyncFuncA = async number => number + 1

  const asyncFuncB = async number => number + 2

  // console.log(funcConcat1(funcA, funcB)(2))
  // console.log(funcConcat2(funcA, funcB)(2))
  // console.log(funcConcat20(funcA, funcB)(2))
  // funcConcat1(asyncFuncA, asyncFuncB)(2).then(console.log)
  // funcConcat2(asyncFuncA, asyncFuncB)(2).then(console.log)
  // funcConcat20(asyncFuncA, asyncFuncB)(2).then(console.log)

  // timeInLoop('funcConcat1', 1e6, () => funcConcat1(funcA, funcB)(2))

  // timeInLoop('funcConcat2', 1e6, () => funcConcat2(funcA, funcB)(2))

  // timeInLoop('funcConcat20', 1e6, () => funcConcat20(funcA, funcB)(2))

  // timeInLoop.async('funcConcat1 - async', 1e6, () => funcConcat1(asyncFuncA, asyncFuncB)(2))

  // timeInLoop.async('funcConcat2 - async', 1e6, () => funcConcat2(asyncFuncA, asyncFuncB)(2))

  // timeInLoop.async('funcConcat20 - async', 1e6, () => funcConcat20(asyncFuncA, asyncFuncB)(2))
}

/**
 * @name pipe
 *
 * @benchmark
 * rubicoPipeline(2): 1e+6: 46.3ms
 * lodashPipeline(2): 1e+6: 41.381ms
 * ramdaPipeline(2): 1e+6: 39.743ms
 */


const funcs = [
  number => number + 1,
  number => number + 2,
  number => number + 3,
]

const rubicoPipeline = pipe(funcs)

const lodashPipeline = _.pipe(funcs)

const ramdaPipeline = R.pipe(...funcs)

// console.log('rubicoPipeline(2)', rubicoPipeline(2))
// console.log('lodashPipeline(2)', lodashPipeline(2))
// console.log('ramdaPipeline(2)', ramdaPipeline(2))

// timeInLoop('rubicoPipeline(2)', 1e6, () => rubicoPipeline(2))

// timeInLoop('lodashPipeline(2)', 1e6, () => lodashPipeline(2))

// timeInLoop('ramdaPipeline(2)', 1e6, () => ramdaPipeline(2))
