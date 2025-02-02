const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const all = require('../all')

const suite = new TimeInLoopSuite({ async: true, loopCount: 1e5 })

suite.add('rubico async array all promises', async () => {
  await all([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
  ])
})

suite.add('rubico async object all promises', async () => {
  await all({
    a: Promise.resolve(1),
    b: Promise.resolve(2),
    c: Promise.resolve(3),
  })
})

suite.add('rubico async array all', async () => {
  await all(5, [
    async value => value + 1,
    async value => value + 2,
    async value => value + 3,
  ])
})

suite.add('rubico async array all lazy', async () => {
  await all([
    async value => value + 1,
    async value => value + 2,
    async value => value + 3,
  ])(5)
})

suite.add('rubico async object all', async () => {
  await all(5, {
    a: async value => value + 1,
    b: async value => value + 2,
    c: async value => value + 3,
  })
})

suite.add('rubico async object all lazy', async () => {
  await all({
    a: async value => value + 1,
    b: async value => value + 2,
    c: async value => value + 3,
  })(5)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
