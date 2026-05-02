const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const compose = require('../compose')

const suite = new TimeInLoopSuite()

suite.add('rubico compose', () => {
  compose(1, [
    number => number + 1,
    number => number + 2,
    number => number + 3,
  ])
})

suite.add('rubico compose lazy', () => {
  compose([
    number => number + 1,
    number => number + 2,
    number => number + 3,
  ])(1)
})

suite.add('rubico compose mathematical', () => {
  compose(
    number => number + 1,
    number => number + 2,
    number => number + 3,
  )(1)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
