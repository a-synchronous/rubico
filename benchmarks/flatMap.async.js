const async = require('async')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const flatMap = require('../flatMap')

const asyncFlatMap = async.flatMap

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico flatMap', async () => {
  await flatMap([1, 2, 3, 4, 5], async n => [n, n])
})

suite.add('rubico flatMap tacit', async () => {
  await flatMap(async n => [n, n])([1, 2, 3, 4, 5])
})

suite.add('async flatMap', async () => {
  await asyncFlatMap([1, 2, 3, 4, 5], async n => [n, n])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
