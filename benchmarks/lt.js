const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const lt = require('../lt')

const suite = new TimeInLoopSuite()

suite.add('rubico lt primitive', () => {
  lt(1, 1)
})

suite.add('rubico lt left value right resolver', () => {
  lt({ a: 1 }, 1, value => value.a)
})

suite.add('rubico lt left resolver right resolver', () => {
  lt({ a: 1 }, value => value.a, value => value.a)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
