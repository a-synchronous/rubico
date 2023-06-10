const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const Transducer = require('../Transducer')
const transform = require('../transform')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico transform', async () => {
  await transform(
    [1, 2, 3, 4, 5],
    Transducer.map(async number => number ** 2),
    [],
  )
})

suite.add('rubico transform tacit', async () => {
  await transform(
    Transducer.map(async number => number ** 2),
    [],
  )([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
