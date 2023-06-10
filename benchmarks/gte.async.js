const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const gte = require('../gte')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico gte Promises', async () => {
  await gte(1, Promise.resolve(1))
})

suite.add('rubico gte left value right resolver', async () => {
  await gte({ a: 1 }, 1, async value => value.a)
})

suite.add('rubico gte left resolver right resolver', async () => {
  await gte({ a: 1 }, async value => value.a, async value => value.a)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
