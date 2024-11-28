const _fp = require('lodash/fp')
const _ = require('lodash')
const R = require('ramda')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const reduce = require('../reduce')

const lodashReduce = _.reduce
const lodashFpReduce = _fp.reduce
const ramdaReduce = R.reduce

const suite = new TimeInLoopSuite()

suite.add('vanilla reduce', () => {
  [1, 2, 3, 4, 5].reduce((a, b) => a + b, 0)
})

suite.add('rubico reduce', () => {
  reduce([1, 2, 3, 4, 5], (a, b) => a + b, 0)
})

suite.add('rubico reduce lazy', () => {
  reduce((a, b) => a + b, 0)([1, 2, 3, 4, 5])
})

suite.add('lodash reduce', () => {
  lodashReduce([1, 2, 3, 4 ,5], (a, b) => a + b, 0)
})

suite.add('lodash/fp reduce', () => {
  lodashFpReduce((a, b) => a + b, 0)([1, 2, 3, 4, 5])
})

suite.add('ramda reduce', () => {
  ramdaReduce((a, b) => a + b, 0)([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
