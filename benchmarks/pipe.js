const timeInLoop = require('../x/timeInLoop')
const _ = require('lodash/fp')
const { pipe } = require('..')
const R = require('ramda')

const funcs = [
  number => number + 1,
  number => number + 2,
  number => number + 3,
]

/**
 * @name pipe
 *
 * @benchmark
 * rubicoPipeline(2): 1e+6: 46.3ms
 * lodashPipeline(2): 1e+6: 41.381ms
 * ramdaPipeline(2): 1e+6: 39.743ms
 */

const rubicoPipeline = pipe(funcs)

const lodashPipeline = _.pipe(funcs)

const ramdaPipeline = R.pipe(...funcs)

console.log('rubicoPipeline(2)', rubicoPipeline(2))
console.log('lodashPipeline(2)', lodashPipeline(2))
console.log('ramdaPipeline(2)', ramdaPipeline(2))

timeInLoop('rubicoPipeline(2)', 1e6, () => rubicoPipeline(2))

// timeInLoop('lodashPipeline(2)', 1e6, () => lodashPipeline(2))

// timeInLoop('ramdaPipeline(2)', 1e6, () => ramdaPipeline(2))
