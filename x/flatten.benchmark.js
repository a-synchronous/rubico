const timeInLoop = require('./timeInLoop')
const flatten = require('./flatten')
const R = require('ramda')
const _ = require('lodash')

const nested = [[1], 2, [[3]]]

// 126.669ms
timeInLoop('[...].flat(1)', 1e5, () => {
  nested.flat(1)
})

// 32.433ms
timeInLoop('rubico flatten', 1e5, () => {
  flatten(nested)
})

// 143.928ms
timeInLoop('R.unnest', 1e5, () => {
  R.unnest(nested)
})

// 20.189ms
timeInLoop('_.flatten', 1e5, () => {
  _.flatten(nested)
})
