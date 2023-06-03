const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const thunkify = require('../thunkify')

const suite = new TimeInLoopSuite({ loopCount: 1e7 })

suite.add('rubico thunkify', () => {
  thunkify((a, b) => a + b, 1, 1)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
