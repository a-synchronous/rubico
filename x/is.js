const Instance = require('../monad/Instance')

const instanceIs = Instance.is

const is = constructor => x => instanceIs(x, constructor)

module.exports = is
