const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const and = require('../and')

const suite = new TimeInLoopSuite()

suite.add('rubico and', () => {
  and({ a: 1 }, [
    value => value.a == 1,
    value => typeof value == 'object',
  ])
})

suite.add('rubico and tacit', () => {
  and([
    value => value.a == 1,
    value => typeof value == 'object',
  ])({ a: 1 })
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
