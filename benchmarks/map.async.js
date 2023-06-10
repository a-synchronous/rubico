const Bluebird = require('bluebird')
const async = require('async')
const _ = require('lodash')
const _fp = require('lodash/fp')
const R = require('ramda')
const map = require('../map')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const arrayMap = require('../_internal/arrayMap')

const asyncMap = async.map
const lodashMap = _.map
const lodashFpMap = _fp.map
const ramdaMap = R.map
const bluebirdMap = Bluebird.map

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico map', async () => {
  await map([1, 2, 3, 4, 5], async value => value + 1)
})

suite.add('rubico map tacit', async () => {
  await map(async value => value + 1)([1, 2, 3, 4, 5])
})

suite.add('async map', async () => {
  await asyncMap([1, 2, 3, 4, 5], async value => value + 1)
})

suite.add('bluebird map', async () => {
  await bluebirdMap([1, 2, 3, 4, 5], async value => value + 1)
})

suite.add('vanilla map and Promise.all', async () => {
  await Promise.all([1, 2, 3, 4, 5].map(async value => value + 1))
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
