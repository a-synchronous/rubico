const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const some = require('../some')

const suite = new TimeInLoopSuite()

suite.add('rubico some', () => {
  some([1, 2, 3, 4, 5], number => number % 2 == 1)
})

suite.add('rubico some lazy', () => {
  some(number => number % 2 == 1)([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
