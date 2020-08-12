const timeInLoop = require('./timeInLoop')
const flatten = require('./flatten')
const R = require('ramda')
const _ = require('lodash')

/**
 * @name flatten
 *
 * @benchmark
 * [...].flat(1): 1e+5: 118.53ms
 * flatten: 1e+5: 25.87ms
 * R.unnest: 1e+5: 147.448ms
 * _.flatten: 1e+5: 27.811ms
 */

const nested = [[1], 2, [[3]]]

// timeInLoop('[...].flat(1)', 1e5, () => { nested.flat(1) })

// timeInLoop('flatten', 1e5, () => { flatten(nested) })

// timeInLoop('R.unnest', 1e5, () => { R.unnest(nested) })

// timeInLoop('_.flatten', 1e5, () => { _.flatten(nested) })
