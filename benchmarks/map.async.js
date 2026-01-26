const map = require('../map')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const arrayMap = require('../_internal/arrayMap')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico map', async () => {
  await map([1, 2, 3, 4, 5], async value => value + 1)
})

suite.add('rubico map lazy', async () => {
  await map(async value => value + 1)([1, 2, 3, 4, 5])
})

suite.add('vanilla map and Promise.all', async () => {
  await Promise.all([1, 2, 3, 4, 5].map(async value => value + 1))
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
