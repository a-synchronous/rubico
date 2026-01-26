const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const __ = require('../__')
const curry = require('../curry')

const suite = new TimeInLoopSuite()

suite.add('rubico curry', () => {
  curry((a, b) => a + b, __, 1)(2)
})

suite.add('rubico curry lazy', () => {
  curry((a, b) => a + b)(__, 1)(2)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
