const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const eq = require('../eq')

const suite = new TimeInLoopSuite()

suite.add('rubico eq primitive', () => {
  eq(1, 1)
})

suite.add('rubico eq left value right resolver', () => {
  eq({ a: 1 }, 1, value => value.a)
})

suite.add('rubico eq left resolver right resolver', () => {
  eq({ a: 1 }, value => value.a, value => value.a)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
