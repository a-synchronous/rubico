const _ = require('lodash')
const _fp = require('lodash/fp')
const R = require('ramda')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const switchCase = require('../switchCase')

const ramdaCond = R.cond
const lodashCond = _.cond
const lodashFpCond = _fp.cond

const suite = new TimeInLoopSuite()

suite.add('switchCase', () => {
  switchCase(1, [
    number => number % 2 == 1,
    'number is odd',
    'number is even',
  ])
})

suite.add('switchCase tacit', () => {
  switchCase([
    number => number % 2 == 1,
    'number is odd',
    'number is even',
  ])(1)
})

suite.add('lodash cond', () => {
  lodashCond([
    [number => number % 2 == 1, R.always('number is odd')],
    [R.T, R.always('number is even')],
  ])(1)
})

suite.add('lodash/fp cond', () => {
  lodashFpCond([
    [number => number % 2 == 1, R.always('number is odd')],
    [R.T, R.always('number is even')],
  ])(1)
})

suite.add('ramda cond', () => {
  ramdaCond([
    [number => number % 2 == 1, R.always('number is odd')],
    [R.T, R.always('number is even')],
  ])(1)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
