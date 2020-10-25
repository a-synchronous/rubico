const timeInLoop = require('./timeInLoop')
const _ = require('lodash')
const differenceWith = require('./differenceWith')

const _differenceWith = _.differenceWith

/**
 * @name differenceWith-race
 *
 * @benchmark
 * rubico.differenceWith: 1e+5: 45.083ms
 * _.differenceWith: 1e+5: 79.651ms
 */

const isStrictEqual = (a, b) => a === b

// console.log(differenceWith(isStrictEqual, [1, 2, 3, 4, 5])([1, 2, 4]))
// console.log(_differenceWith([1, 2, 3, 4, 5], [1, 2, 4], isStrictEqual))

// timeInLoop('rubico.differenceWith', 1e5, () => differenceWith(isStrictEqual, [1, 2, 3, 4, 5])([1, 2, 4]))

// timeInLoop('_.differenceWith', 1e5, () => _differenceWith([1, 2, 3, 4, 5], [1, 2, 4], isStrictEqual))
