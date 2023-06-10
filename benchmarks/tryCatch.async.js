const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const tryCatch = require('../tryCatch')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e4 })

suite.add('rubico tryCatch', async () => {
  await tryCatch('hello', async message => {
    throw new Error(message)
    console.log(message)
  }, async error => error)
})

suite.add('rubico tryCatch tacit', async () => {
  await tryCatch(async message => {
    throw new Error(message)
  }, async error => error)('hello')
})

if (require.main == module) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.on('suiteBestRun', () => process.exit(0))
  suite.run()
}

module.exports = suite
