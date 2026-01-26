const TimeInLoopSuite = require('../../_internal/TimeInLoopSuite')

const suite = new TimeInLoopSuite({ loopCount: 1e5 })

suite.add('vanilla Promise', async () => {
  const p = Promise.resolve('hello')
  await p
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
