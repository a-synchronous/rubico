const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const lte = require('../lte')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico lte Promises', async () => {
  await lte(1, Promise.resolve(1))
})

suite.add('rubico lte left value right resolver', async () => {
  await lte({ a: 1 }, 1, async value => value.a)
})

suite.add('rubico lte left resolver right resolver', async () => {
  await lte({ a: 1 }, async value => value.a, async value => value.a)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
