const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const reduce = require('../reduce')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico reduce', async () => {
  await reduce([1, 2, 3, 4, 5], async (a, b) => a + b, 0)
})

suite.add('rubico reduce lazy', async () => {
  await reduce(async (a, b) => a + b, 0)([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
