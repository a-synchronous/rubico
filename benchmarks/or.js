const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const or = require('../or')

const suite = new TimeInLoopSuite()

suite.add('rubico or', () => {
  or({}, [
    value => value.a == 1,
    value => typeof value == 'object',
  ])
})

suite.add('rubico or tacit', () => {
  or([
    value => value.a == 1,
    value => typeof value == 'object',
  ])({})
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
