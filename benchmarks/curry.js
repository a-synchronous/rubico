const _fp = require('lodash/fp')
const R = require('ramda')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const __ = require('../__')
const curry = require('../curry')

const lodashFpCurry = _fp.curry
const lodashFp__ = _fp.__
const ramdaCurry = R.curry
const ramda__ = R.__

const suite = new TimeInLoopSuite()

suite.add('rubico curry', () => {
  curry((a, b) => a + b, __, 1)(2)
})

suite.add('rubico curry tacit', () => {
  curry((a, b) => a + b)(__, 1)(2)
})

suite.add('lodash/fp curry', () => {
  lodashFpCurry((a, b) => a + b)(lodashFp__, 1)(2)
})

suite.add('ramda curry', () => {
  ramdaCurry((a, b) => a + b)(ramda__, 1)(2)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
