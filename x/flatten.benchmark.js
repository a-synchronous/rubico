const timeInLoop = require('./timeInLoop')
const flatten = require('./flatten')
const R = require('ramda')
const _ = require('lodash')

const nested = [[1], 2, [[3]]]

console.log(nested.flat(1))
console.log(flatten(nested))
console.log(R.unnest(nested))
console.log(_.flatten(nested))

timeInLoop('[...].flat(1)', 1e5, () => {
  nested.flat(1)
})

timeInLoop('rubico flatten', 1e5, () => {
  flatten(nested)
})

timeInLoop('R.unnest', 1e5, () => {
  R.unnest(nested)
})

timeInLoop('_.flatten', 1e5, () => {
  _.flatten(nested)
})
