const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const tap = require('../tap')

const suite = new TimeInLoopSuite({ loopCount: 1e7 })

suite.add('tap', () => {
  tap(() => {})()
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
