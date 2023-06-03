const _ = require('lodash')
const _fp = require('lodash/fp')
const R = require('ramda')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const pick = require('../pick')

const lodashPick = _.pick
const lodashFpPick = _fp.pick
const ramdaPick = R.pick

const suite = new TimeInLoopSuite()

suite.add('rubico pick', () => {
  pick({ a: 1, b: 2, c: 3 }, ['a'])
})

suite.add('rubico pick tacit', () => {
  pick(['a'])({ a: 1, b: 2, c: 3 })
})

suite.add('lodash pick', () => {
  lodashPick({ a: 1, b: 2, c: 3 }, ['a'])
})

suite.add('lodash fp pick', () => {
  lodashFpPick(['a'])({ a: 1, b: 2, c: 3 })
})

suite.add('ramda pick', () => {
  ramdaPick(['a'])({ a: 1, b: 2, c: 3 })
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
