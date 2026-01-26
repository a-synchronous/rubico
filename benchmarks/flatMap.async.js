const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const flatMap = require('../flatMap')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico flatMap', async () => {
  await flatMap([1, 2, 3, 4, 5], async n => [n, n])
})

suite.add('rubico flatMap lazy', async () => {
  await flatMap(async n => [n, n])([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
