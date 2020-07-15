const { or, get } = require('..')
const is = require('./is')
const isString = require('./isString')

const last = x => {
  if (!is(Array)(x) && !isString(x)) {
    throw new TypeError('last(x); x is not an Array or String')
  }
  return get(x.length - 1)(x)
}

module.exports = last
