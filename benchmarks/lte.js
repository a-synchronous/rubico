const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const lte = require('../lte')

const suite = new TimeInLoopSuite()

suite.add('rubico lte primitive', () => {
  lte(1, 1)
})

suite.add('rubico lte left value right resolver', () => {
  lte({ a: 1 }, 1, value => value.a)
})

suite.add('rubico lte left resolver right resolver', () => {
  lte({ a: 1 }, value => value.a, value => value.a)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
