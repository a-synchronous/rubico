const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const switchCase = require('../switchCase')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico switchCase', async () => {
  await switchCase('hello', [
    async s => s == 'hello',
    async () => 'world',
    async () => 'goodbye',
  ])
})

suite.add('rubico switchCase lazy', async () => {
  await switchCase([
    async s => s == 'hello',
    async () => 'world',
    async () => 'goodbye',
  ])('hello')
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
