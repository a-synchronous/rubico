const Bluebird = require('bluebird')
const async = require('async')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const reduce = require('../reduce')

const bluebirdReduce = Bluebird.reduce
const asyncReduce = async.reduce

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico reduce', async () => {
  await reduce([1, 2, 3, 4, 5], async (a, b) => a + b, 0)
})

suite.add('rubico reduce tacit', async () => {
  await reduce(async (a, b) => a + b, 0)([1, 2, 3, 4, 5])
})

suite.add('async reduce', async () => {
  await asyncReduce([1, 2, 3, 4, 5], 0, async (a, b) => a + b)
})

suite.add('Bluebird reduce', async () => {
  await bluebirdReduce([1, 2, 3, 4, 5], async (a, b) => a + b, 0)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
