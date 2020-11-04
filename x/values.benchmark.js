const timeInLoop = require('./timeInLoop')
const rubicoValues = require('./values')
const R = require('ramda')
const _ = require('lodash')

const ramdaValues = R.values

const _values = _.values

/**
 * @name valuesRace
 *
 * @benchmark
 * rubicoValues: 1e+6: 53.064ms
 * ramdaValues: 1e+6: 544.009ms
 * _values: 1e+6: 125.737ms
 */

/*
console.log(
  rubicoValues({ a: 1, b: 2, c: 3 }),
  ramdaValues({ a: 1, b: 2, c: 3 }),
  _values({ a: 1, b: 2, c: 3 }),
)
*/

// timeInLoop('rubicoValues', 1e6, () => rubicoValues({ a: 1, b: 2, c: 3 }))

// timeInLoop('ramdaValues', 1e6, () => ramdaValues({ a: 1, b: 2, c: 3 }))

// timeInLoop('_values', 1e6, () => _values({ a: 1, b: 2, c: 3 }))
