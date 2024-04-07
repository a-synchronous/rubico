const Bluebird = require('bluebird')
const _ = require('lodash')
const _fp = require('lodash/fp')
const R = require('ramda')
const map = require('../map')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const arrayMap = require('../_internal/arrayMap')

const lodashMap = _.map
const lodashFpMap = _fp.map
const ramdaMap = R.map

const suite = new TimeInLoopSuite()

suite.add('rubico map', () => {
  map([1, 2, 3, 4, 5], value => value + 1)
})

suite.add('rubico map lazy', () => {
  map(value => value + 1)([1, 2, 3, 4, 5])
})

suite.add('lodash map', () => {
  lodashMap([1, 2, 3, 4, 5], value => value + 1)
})

suite.add('lodash/fp map', () => {
  lodashFpMap(value => value + 1)([1, 2, 3, 4, 5])
})

suite.add('ramda map', () => {
  ramdaMap(value => value + 1)([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
