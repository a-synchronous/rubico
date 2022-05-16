const timeInLoop = require('./timeInLoop')
const uniq = require('./uniq')
const R = require('ramda')
const _ = require('lodash')
const isArray = require('../_internal/isArray')
const reduce = require('../reduce')

/**
 * @name uniq
 *
 * @benchmark
 * uniq - original(1000, scatter: 10): 1e+5: 1.947s
 * uniq - lodash(1000), scatter: 10: 1e+5: 1.767s
 * uniq - new(1000), scatter: 10: 1e+5: 1.728s
 *
 * uniq - original(1000, scatter: 10): 1e+5: 1.947s
 * uniq - lodash(1000), scatter: 10: 1e+5: 1.767s
 * uniq - new(1000), scatter: 10: 1e+5: 1.728s
 *
 * uniq - original(100, scatter: 10): 1e+6: 2.291s
 * uniq - lodash(100), scatter: 10: 1e+6: 664.204ms
 * uniq - new(100), scatter: 10: 1e+6: 1.581s
 *
 * uniq - original(100, scatter: 100): 1e+6: 11.730s
 * uniq - lodash(100), scatter: 100: 1e+6: 3.411s
 * uniq - new(100), scatter: 100: 1e+6: 2.789s
 */

const SIZE = 100
const ITERATIONS = 1e6
const SCATTER = 100

const originalUniq = arr => {
  if (!isArray(arr)) throw Error('uniq(arr): arr is not an array')

  const seenSet = new Set()
  return reduce((acc, value) => {
    if (seenSet.has(value)) {
      return acc
    }
    seenSet.add(value)
    return [...acc, value]
  }, [])(arr)
}

const array = Array.from(Array(SIZE).keys()).map(i => Math.floor(Math.random() * SCATTER))

// console.log(array)

timeInLoop(`uniq - original(${SIZE}, scatter: ${SCATTER})`, ITERATIONS, () => { originalUniq(array) })

timeInLoop(`uniq - lodash(${SIZE}), scatter: ${SCATTER}`, ITERATIONS, () => { _.uniq(array) })

// timeInLoop(`uniq - ramda(${SIZE})`, ITERATIONS, () => { R.uniq()(array) })

timeInLoop(`uniq - new(${SIZE}), scatter: ${SCATTER}`, ITERATIONS, () => { uniq(array) })

