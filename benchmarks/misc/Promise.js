const Bluebird = require('bluebird')
const _ = require('lodash')
const _fp = require('lodash/fp')
const R = require('ramda')
const TimeInLoopSuite = require('../../_internal/TimeInLoopSuite')

const suite = new TimeInLoopSuite()

const isPromise = value => value != null && typeof value.then == 'function'

suite.add('vanilla Promise', async () => {
  const p = Promise.resolve('hello')
  await p
})

suite.add('Bluebird Promise', async () => {
  const p = Bluebird.resolve('hello')
  await p
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
