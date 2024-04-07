const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const and = require('../and')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico and', async () => {
  await and({ a: 1 }, [
    async value => value.a == 1,
    async value => typeof value == 'object',
  ])
})

suite.add('rubico and lazy', async () => {
  await and([
    async value => value.a == 1,
    async value => typeof value == 'object',
  ])({ a: 1 })
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
