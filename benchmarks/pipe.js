const _fp = require('lodash/fp')
const R = require('ramda')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const pipe = require('../pipe')

const lodashFpPipe = _fp.pipe
const ramdaPipe = R.pipe
const suite = new TimeInLoopSuite()

suite.add('rubico pipe', () => {
  pipe(1, [
    number => number + 1,
    number => number + 2,
    number => number + 3,
  ])
})

suite.add('rubico pipe lazy', () => {
  pipe([
    number => number + 1,
    number => number + 2,
    number => number + 3,
  ])(1)
})

suite.add('ramda pipe', () => {
  ramdaPipe(
    number => number + 1,
    number => number + 2,
    number => number + 3,
  )(1)
})

suite.add('lodash/fp pipe', () => {
  lodashFpPipe([
    number => number + 1,
    number => number + 2,
    number => number + 3,
  ])(1)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
