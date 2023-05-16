const timeInLoop = require('./timeInLoop')
const forEach = require('./forEach')
const _ = require('lodash')
const R = require('ramda')

const _forEach = _.forEach

const RForEach = R.forEach

/**
 * @name forEachRace
 *
 * @benchmark
 * forEach: 1e+6: 16.504ms
 * _forEach: 1e+6: 85.831ms
 * RForEach: 1e+6: 21.437ms
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const identity = value => value

  // forEach(console.log)(numbers)
  // _forEach(numbers, console.log)
  // RForEach(console.log, numbers)

  // timeInLoop('forEach', 1e6, () => forEach(identity)(numbers))

  // timeInLoop('_forEach', 1e6, () => _forEach(numbers, identity))

  // timeInLoop('RForEach', 1e6, () => RForEach(identity, numbers))
}
