const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const switchCase = require('../switchCase')

const suite = new TimeInLoopSuite()

suite.add('switchCase', () => {
  switchCase(1, [
    number => number % 2 == 1,
    'number is odd',
    'number is even',
  ])
})

suite.add('switchCase lazy', () => {
  switchCase([
    number => number % 2 == 1,
    'number is odd',
    'number is even',
  ])(1)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
