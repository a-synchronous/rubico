const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const get = require('../get')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico get', async () => {
  await get({}, 'a', async () => 1)
})

suite.add('rubico get tacit', async () => {
  await get('a', async () => 1)({})
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
