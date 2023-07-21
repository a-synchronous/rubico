const Bluebird = require('bluebird')
const async = require('async')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const filter = require('../filter')

const asyncFilter = async.filter
const bluebirdFilter = Bluebird.filter

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico filter', async () => {
  await filter([1, 2, 3, 4, 5], async value => value % 2 == 1)
})

suite.add('rubico filter tacit', async () => {
  await filter(async value => value % 2 == 1)([1, 2, 3, 4, 5])
})

suite.add('async filter', async () => {
  await asyncFilter([1, 2, 3, 4, 5], async value => value % 2 == 1)
})

suite.add('Bluebird filter', async () => {
  await bluebirdFilter([1, 2, 3, 4, 5], async value => value % 2 == 1)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
