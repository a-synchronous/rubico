const timeInLoop = require('../x/timeInLoop')
const Flattenable = require('./Flattenable')
const _ = require('lodash')

  /*
   * @name Flattenable.flatten
   *
   * @benchmark
   * Flattenable.flatten(nested): 1e+5: 24.592ms
   * _.flatten(nested): 1e+5: 29.746ms
   */

const flattenableFlatten = Flattenable.flatten

const nested = [[1], 2, [[3]]]

// timeInLoop('Flattenable.flatten(nested)', 1e5, () => { flattenableFlatten(nested) })

const _flatten = _.flatten

timeInLoop('_.flatten(nested)', 1e5, () => { _flatten(nested) })
