const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const pick = require('../pick')

const suite = new TimeInLoopSuite()

suite.add('rubico pick', () => {
  pick({ a: 1, b: 2, c: 3 }, ['a'])
})

suite.add('rubico pick lazy', () => {
  pick(['a'])({ a: 1, b: 2, c: 3 })
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
