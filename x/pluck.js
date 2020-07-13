const { map, get } = require('..')

const pluck = path => map(get(path))

module.exports = pluck
