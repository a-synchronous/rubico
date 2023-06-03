const Bluebird = require('bluebird')
const _ = require('lodash')
const _fp = require('lodash/fp')
const R = require('ramda')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const get = require('../get')

const lodashGet = _.get
const lodashFpGet = _fp.get
const ramdaProp = R.prop

const suite = new TimeInLoopSuite()

suite.add('rubico get', () => {
  get({ a: 1 }, 'a')
})

suite.add('rubico get tacit', () => {
  get('a')({ a: 1 })
})

suite.add('lodash get', () => {
  lodashGet({ a: 1 }, 'a')
})

suite.add('lodash/fp get', () => {
  lodashFpGet('a')({ a: 1 })
})

suite.add('ramda get', () => {
  ramdaProp('a')({ a: 1 })
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
