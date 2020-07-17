const { map, tap } = require('..')

const forEach = f => map(tap(f))

module.exports = forEach
