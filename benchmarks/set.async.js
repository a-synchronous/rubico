const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const set = require('../set')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico set', async () => {
  await set({}, 'a', async () => 1)
})

suite.add('rubico set tacit', async () => {
  await set('a', async () => 1)({})
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
