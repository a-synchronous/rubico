const timeInLoop = require('./timeInLoop')
const rubicoGroupBy = require('./groupBy')
const R = require('ramda')
const _ = require('lodash')

const ramdaGroupBy = R.groupBy

const _groupBy = _.groupBy

/**
 * @name groupByRaceProperty
 *
 * @benchmark
 * rubicoGroupBy: 1e+6: 365.717ms
 * ramdaGroupBy: 1e+6: 1.875s
 * _groupBy: 1e+6: 570.417ms
 */

const ages = [{ age: 21 }, { age: 22 }, { age: 23 }, { age: 21 }, { age: 21 }]

  /*
console.log(
  rubicoGroupBy(object => object.age)(ages),
  ramdaGroupBy(object => object.age, ages),
  _groupBy(ages, object => object.age),
)
  */

// timeInLoop('rubicoGroupBy', 1e6, () => rubicoGroupBy(object => object.age)(ages))

// timeInLoop('ramdaGroupBy', 1e6, () => ramdaGroupBy(object => object.age, ages))

// timeInLoop('_groupBy', 1e6, () => _groupBy(ages, object => object.age))
