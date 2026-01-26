const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const reduce = require('../reduce')

const suite = new TimeInLoopSuite()

suite.add('vanilla reduce', () => {
  [1, 2, 3, 4, 5].reduce((a, b) => a + b, 0)
})

suite.add('rubico reduce', () => {
  reduce([1, 2, 3, 4, 5], (a, b) => a + b, 0)
})

suite.add('rubico reduce lazy', () => {
  reduce((a, b) => a + b, 0)([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
