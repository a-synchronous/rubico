const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const some = require('../some')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico some', async () => {
  await some([1, 3, 5], async number => number % 2 == 1)
})

suite.add('rubico some tacit', async () => {
  await some(async number => number % 2 == 1)([1, 3, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
