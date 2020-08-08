const PossiblePromise = require('../monad/PossiblePromise')

const possiblePromiseArgs = PossiblePromise.args

const isEqual = possiblePromiseArgs((a, b) => a === b)

module.exports = isEqual
