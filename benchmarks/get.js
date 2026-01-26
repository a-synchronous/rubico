const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const get = require('../get')

const suite = new TimeInLoopSuite()

suite.add('vanilla get', () => {
  ({ a: 1 }).a
})

suite.add('rubico get', () => {
  get({ a: 1 }, 'a')
})

suite.add('rubico get lazy', () => {
  get('a')({ a: 1 })
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
