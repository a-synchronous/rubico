const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const eq = require('../eq')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico eq Promises', async () => {
  await eq(1, Promise.resolve(1))
})

suite.add('rubico eq left value right resolver', async () => {
  await eq({ a: 1 }, 1, async value => value.a)
})

suite.add('rubico eq left resolver right resolver', async () => {
  await eq({ a: 1 }, async value => value.a, async value => value.a)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
