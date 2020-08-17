const timeInLoop = require('../x/timeInLoop')
const Mux = require('./Mux')
const _ = require('lodash')

/**
 * @name Mux.flatten
 *
 * @benchmark
 * Mux.flatten(nested): 1e+5: 25.588ms
 * _.flatten(nested): 1e+5: 28.935ms
 */

const muxConcat = Mux.concat

const nested = [[1], 2, [[3]]]

const muxConcatFlatten = arr => {
  const y = []
  for (const item of muxConcat(arr)) y.push(item)
  return y
}

const muxFlatten = Mux.flatten

const _flatten = _.flatten

// timeInLoop('Mux.flatten(nested)', 1e5, () => { muxFlatten(nested) })

// timeInLoop('_.flatten(nested)', 1e5, () => { _flatten(nested) })
