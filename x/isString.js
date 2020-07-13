const is = require('./is')

const isString = x => typeof x === 'string' || is(String)(x)

module.exports = isString
