const Bluebird = require('bluebird')
const _ = require('lodash')
const _fp = require('lodash/fp')
const R = require('ramda')
const TimeInLoopSuite = require('../../_internal/TimeInLoopSuite')
const isPromise = require('../../_internal/isPromise')
const map = require('../map')

const lodashMap = _.map
const lodashFpMap = _fp.map
const ramdaMap = R.map

const suite = new TimeInLoopSuite({ loopCount: 1e5 })

suite.add('isPromise .then', () => {
  const p = Promise.resolve()
  isPromise(p)
})

suite.add('isPromise instanceof', () => {
  const p = Promise.resolve()
  p instanceof Promise
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
