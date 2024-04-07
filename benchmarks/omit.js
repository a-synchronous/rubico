const _ = require('lodash')
const _fp = require('lodash/fp')
const R = require('ramda')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const omit = require('../omit')

const suite = new TimeInLoopSuite()

const lodashOmit = _.omit
const lodashFpOmit = _fp.omit
const ramdaOmit = R.omit

suite.add('rubico omit', () => {
  omit({ a: 1, b: 2, c: 3 }, ['b', 'c'])
})

suite.add('rubico omit lazy', () => {
  omit(['b', 'c'])({ a: 1, b: 2, c: 3 })
})

suite.add('lodash omit', () => {
  lodashOmit({ a: 1, b: 2, c: 3 }, ['b', 'c'])
})

suite.add('lodash/fp omit', () => {
  lodashFpOmit(['b', 'c'])({ a: 1, b: 2, c: 3 })
})

suite.add('ramda omit', () => {
  ramdaOmit(['b', 'c'])({ a: 1, b: 2, c: 3 })
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
