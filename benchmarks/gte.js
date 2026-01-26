const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const gte = require('../gte')

const suite = new TimeInLoopSuite()

suite.add('rubico gte primitive', () => {
  gte(1, 1)
})

suite.add('rubico gte left value right resolver', () => {
  gte({ a: 1 }, 1, value => value.a)
})

suite.add('rubico gte left resolver right resolver', () => {
  gte({ a: 1 }, value => value.a, value => value.a)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
