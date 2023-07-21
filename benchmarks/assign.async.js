const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const assign = require('../assign')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico assign', async () => {
  await assign({}, {
    a: async () => 1,
    b: async () => 2,
    c: async () => 3,
  })
})

suite.add('rubico assign tacit', async () => {
  await assign({
    a: async () => 1,
    b: async () => 2,
    c: async () => 3,
  })({})
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
