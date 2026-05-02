const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const compose = require('../compose')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico compose', async () => {
  await compose(3, [
    async n => n + 1,
    async n => n * 2,
    async n => n - 3,
  ])
})

suite.add('rubico compose lazy', async () => {
  await compose([
    async n => n + 1,
    async n => n * 2,
    async n => n - 3,
  ])(3)
})

suite.add('rubico compose mathematical', async () => {
  await compose(
    async n => n + 1,
    async n => n * 2,
    async n => n - 3,
  )(3)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
