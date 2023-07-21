const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const not = require('../not')

const suite = new TimeInLoopSuite()

suite.add('rubico not primitive', () => {
  not(true)
})

suite.add('rubico not predicate', () => {
  not({ a: 1 }, value => value.a == 1)
})

suite.add('rubico not predicate tacit', () => {
  not(value => value.a == 1)({ a: 1 })
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
