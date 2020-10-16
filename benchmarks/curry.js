const rubico = require('..')
const timeInLoop = require('../x/timeInLoop')
const R = require('ramda')

/**
 * @name race
 *
 * @benchmark
 * rubico.curry: 1e+5: 60.554ms
 * R.curry: 1e+5: 106.163ms
 */
const add6 = (a, b, c, d, e, f) => a + b + c + d + e + f

console.log(rubico.curry(add6)(1, 2)(3)(4, 5, 6)) // 21
console.log(R.curry(add6)(1, 2)(3)(4, 5, 6)) // 21

// timeInLoop('rubico.curry', 1e5, () => rubico.curry(add6)(1, 2)(3)(4, 5, 6))
// timeInLoop('R.curry', 1e5, () => R.curry(add6)(1, 2)(3)(4, 5, 6))
