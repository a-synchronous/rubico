const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const or = require('../or')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico or', async () => {
  await or({ a: 1 }, [
    async value => value.a == 2,
    async value => typeof value == 'object',
  ])
})

suite.add('rubico or lazy', async () => {
  await or([
    async value => value.a == 2,
    async value => typeof value == 'object',
  ])({ a: 1 })
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
