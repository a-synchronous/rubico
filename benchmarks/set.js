const Bluebird = require('bluebird')
const _ = require('lodash')
const _fp = require('lodash/fp')
const R = require('ramda')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const set = require('../set')

const lodashSet = _.set
const lodashFpSet = _fp.set
const ramdaSet = R.set

const suite = new TimeInLoopSuite()

suite.add('vanilla set', () => {
  const obj = {}
  obj.a = 1
})

suite.add('rubico set', () => {
  set({}, 'a', 1)
})

suite.add('rubico set lazy', () => {
  set('a', 1)({})
})

suite.add('lodash set', () => {
  lodashSet({}, 'a', 1)
})

suite.add('lodash/fp set', () => {
  lodashFpSet('a', 1)({})
})

const ramdaALens = R.lensProp('a')

suite.add('ramda get', () => {
  ramdaSet(ramdaALens, 1, {})
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
