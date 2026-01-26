const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const filter = require('../filter')

const suite = new TimeInLoopSuite()

suite.add('vanilla filter', () => {
  [1, 2, 3, 4, 5].filter(value => value % 2 == 1)
})

suite.add('rubico filter', () => {
  filter([1, 2, 3, 4, 5], value => value % 2 == 1)
})

suite.add('rubico filter lazy', () => {
  filter(value => value % 2 == 1)([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
