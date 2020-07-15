const { or, get } = require('..')
const is = require('./is')
const isString = require('./isString')

const first = x => {
  if (!is(Array)(x) && !isString(x)) {
    throw new TypeError('first(x); x is not an Array or String')
  }
  return get(0)(x)
}

module.exports = first
