const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const tryCatch = require('../tryCatch')

const suite = new TimeInLoopSuite({ loopCount: 1e5 })

suite.add('vanilla try/catch', () => {
  try {
    const message = 'hello'
    throw new Error(message)
  } catch (error) {
  }
})

suite.add('rubico tryCatch', () => {
  tryCatch('hello', message => {
    throw new Error(message)
  }, error => error)
})

suite.add('rubico tryCatch lazy', () => {
  tryCatch(message => {
    throw new Error(message)
  }, error => error)('hello')
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
