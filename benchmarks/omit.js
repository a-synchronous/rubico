const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const omit = require('../omit')

const suite = new TimeInLoopSuite()

suite.add('rubico omit', () => {
  omit({ a: 1, b: 2, c: 3 }, ['b', 'c'])
})

suite.add('rubico omit lazy', () => {
  omit(['b', 'c'])({ a: 1, b: 2, c: 3 })
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
