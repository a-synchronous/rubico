const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const every = require('../every')

const suite = new TimeInLoopSuite()

suite.add('rubico every', () => {
  every([1, 3, 5], number => number % 2 == 1)
})

suite.add('rubico every tacit', () => {
  every(number => number % 2 == 1)([1, 3, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
