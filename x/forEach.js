const { map, tap } = require('..')

const isFunction = x => typeof x === 'function'

// const forEach = f => x => isFunction(x) ? tap(x) : tap(map(f))(x)

const forEach = f => map(tap(f))

module.exports = forEach
