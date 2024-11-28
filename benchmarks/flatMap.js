const _ = require('lodash')
const _fp = require('lodash/fp')
const R = require('ramda')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const flatMap = require('../flatMap')

const lodashFlatMap = _.flatMap
const lodashFpFlatMap = _fp.flatMap
const ramdaFlatmap = R.chain

const suite = new TimeInLoopSuite()

suite.add('vanilla flatMap', () => {
  [1, 2, 3, 4, 5].flatMap(n => [n, n])
})

suite.add('rubico flatMap', () => {
  flatMap([1, 2, 3, 4, 5], n => [n, n])
})

suite.add('rubico flatMap lazy', () => {
  flatMap(n => [n, n])([1, 2, 3, 4, 5])
})

suite.add('lodash flatMap', () => {
  lodashFlatMap([1, 2, 3, 4, 5], n => [n, n])
})

suite.add('lodash/fp flatMap', () => {
  lodashFpFlatMap(n => [n, n])([1, 2, 3, 4, 5])
})

suite.add('ramda flatMap', () => {
  ramdaFlatmap(n => [n, n])([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
