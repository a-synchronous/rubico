const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const flatMap = require('../flatMap')

const suite = new TimeInLoopSuite()

suite.add('vanilla flatMap', () => {
  [1, 2, 3, 4, 5].flatMap(n => [n, n])
})

suite.add('rubico flatMap', () => {
  flatMap([1, 2, 3, 4, 5], n => [n, n])
})

suite.add('rubico flatMap lazy', () => {
  flatMap(n => [n, n])([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
