const timeInLoop = require('./timeInLoop')
const flatten = require('./flatten')
const R = require('ramda')
const _ = require('lodash')

const nested = [[1], 2, [[3]]]

// 119.954ms
timeInLoop('[...].flat(1)', 1e5, () => { nested.flat(1) })

// 37.223ms
timeInLoop('rubico.x.flatten', 1e5, () => { flatten(nested) })

// 148.861ms
timeInLoop('R.unnest', 1e5, () => { R.unnest(nested) })

// 28.193ms
timeInLoop('_.flatten', 1e5, () => { _.flatten(nested) })
