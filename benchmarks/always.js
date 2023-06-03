const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const always = require('../always')

const suite = new TimeInLoopSuite({ loopCount: 1e7 })

suite.add('rubico always', () => {
  always(1)()
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
