const Bluebird = require('bluebird')
const TimeInLoopSuite = require('../../_internal/TimeInLoopSuite')
const promiseAll = require('../../_internal/promiseAll')

const suite = new TimeInLoopSuite()

suite.add('rubico promiseAll', async () => {
  await promiseAll([
    Promise.resolve(1),
    Promise.resolve(1),
    Promise.resolve(1),
  ])
})

suite.add('vanilla Promise.all', async () => {
  await Promise.all([
    Promise.resolve(1),
    Promise.resolve(1),
    Promise.resolve(1),
  ])
})

suite.add('Bluebird Promise.all', async () => {
  await Bluebird.all([
    Promise.resolve(1),
    Promise.resolve(1),
    Promise.resolve(1),
  ])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
