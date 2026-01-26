const _fp = require('lodash/fp')
const R = require('ramda')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const forEach = require('../forEach')

const lodashFpForEach = _fp.forEach
const ramdaForEach = R.forEach
const suite = new TimeInLoopSuite()

suite.add('vanilla forEach', () => {
  [1, 2, 3, 4, 5].forEach(n => n ** 2)
})

suite.add('rubico forEach', () => {
  forEach([1, 2, 3, 4, 5], n => n ** 2)
})

suite.add('rubico forEach.series', () => {
  forEach.series([1, 2, 3, 4, 5], n => n ** 2)
})

suite.add('rubico forEach lazy', () => {
  forEach(n => n ** 2)([1, 2, 3, 4, 5])
})

suite.add('ramda forEach', () => {
  ramdaForEach(n => n ** 2, [1, 2, 3, 4, 5])
})

suite.add('lodash/fp forEach', () => {
  lodashFpForEach(n => n ** 2, [1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
