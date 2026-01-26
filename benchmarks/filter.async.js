const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const filter = require('../filter')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico filter', async () => {
  await filter([1, 2, 3, 4, 5], async value => value % 2 == 1)
})

suite.add('rubico filter lazy', async () => {
  await filter(async value => value % 2 == 1)([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
