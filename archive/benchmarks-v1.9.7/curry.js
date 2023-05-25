const rubico = require('..')
const timeInLoop = require('../x/timeInLoop')
const R = require('ramda')
const curry1 = require('../_internal/curry1')
const curry2 = require('../_internal/curry2')
const curry3 = require('../_internal/curry3')
const curry4 = require('../_internal/curry4')

const { __ } = rubico

/**
 * @name curryRace
 *
 * @benchmark
 * rubico.curry: 1e+5: 60.554ms
 * R.curry: 1e+5: 106.163ms
 */
const add6 = (a, b, c, d, e, f) => a + b + c + d + e + f

// console.log(rubico.curry(add6)(1, 2)(3)(4, 5, 6)) // 21
// console.log(R.curry(add6)(1, 2)(3)(4, 5, 6)) // 21

// timeInLoop('rubico.curry', 1e5, () => rubico.curry(add6)(1, 2)(3)(4, 5, 6))
// timeInLoop('R.curry', 1e5, () => R.curry(add6)(1, 2)(3)(4, 5, 6))

/**
 * @name curryPlaceholderRace
 *
 * @benchmark
 * rubico.curry: 1e+5: 98.834ms
 * R.curry: 1e+5: 147.693ms
 */
// console.log(rubico.curry(add6)(1, 2, rubico.__)(3)(4, rubico.__, 6)(5)) // 21
// console.log(R.curry(add6)(1, 2, R.__)(3)(4, R.__, 6)(5)) // 21

// timeInLoop('rubico.curry', 1e5, () => rubico.curry(add6)(1, 2, rubico.__)(3)(4, rubico.__, 6)(5))
// timeInLoop('R.curry', 1e5, () => R.curry(add6)(1, 2, R.__)(3)(4, R.__, 6)(5))

/**
 * @name curryRaceUnary
 *
 * @benchmark
 * rubico.curry: 1e+5: 60.554ms
 * R.curry: 1e+5: 106.163ms
 *
 * rubico.curry: 1e+5: 45.475ms
 * R.curry: 1e+5: 66.493ms
 */
const identity = value => value

// console.log(rubico.curry(identity)(__)(1)) // 1
// console.log(R.curry(identity)(R.__)(1)) // 1

// timeInLoop('rubico.curry', 1e5, () => rubico.curry(identity)(__)(1))
// timeInLoop('R.curry', 1e5, () => R.curry(identity)(R.__)(1))
