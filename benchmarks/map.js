const map = require('../map')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const arrayMap = require('../_internal/arrayMap')

const suite = new TimeInLoopSuite()

suite.add('vanilla map', () => {
  [1, 2, 3, 4, 5].map(value => value + 1)
})

suite.add('rubico map', () => {
  map([1, 2, 3, 4, 5], value => value + 1)
})

suite.add('rubico map lazy', () => {
  map(value => value + 1)([1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
