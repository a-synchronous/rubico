const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const gt = require('../gt')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico gt Promises', async () => {
  await gt(1, Promise.resolve(1))
})

suite.add('rubico gt left value right resolver', async () => {
  await gt({ a: 1 }, 1, async value => value.a)
})

suite.add('rubico gt left resolver right resolver', async () => {
  await gt({ a: 1 }, async value => value.a, async value => value.a)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
