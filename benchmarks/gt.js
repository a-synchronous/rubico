const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const gt = require('../gt')

const suite = new TimeInLoopSuite()

suite.add('rubico gt primitive', () => {
  gt(1, 1)
})

suite.add('rubico gt left value right resolver', () => {
  gt({ a: 1 }, 1, value => value.a)
})

suite.add('rubico gt left resolver right resolver', () => {
  gt({ a: 1 }, value => value.a, value => value.a)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
