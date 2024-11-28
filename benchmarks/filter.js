const _fp = require('lodash/fp')
const _ = require('lodash')
const R = require('ramda')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const filter = require('../filter')

const lodashFilter = _.filter
const lodashFpFilter = _fp.filter
const ramdaFilter = R.filter

const suite = new TimeInLoopSuite()

suite.add('vanilla filter', () => {
  [1, 2, 3, 4, 5].filter(value => value % 2 == 1)
})

suite.add('rubico filter', () => {
  filter([1, 2, 3, 4, 5], value => value % 2 == 1)
})

suite.add('rubico filter lazy', () => {
  filter(value => value % 2 == 1)([1, 2, 3, 4, 5])
})

suite.add('lodash filter', () => {
  lodashFilter([1, 2, 3, 4, 5], value => value % 2 == 1)
})

suite.add('lodash/fp filter', () => {
  lodashFpFilter(value => value % 2 == 1)([1, 2, 3, 4, 5])
})

suite.add('ramda filter', () => {
  ramdaFilter(value => value % 2 == 1)([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
