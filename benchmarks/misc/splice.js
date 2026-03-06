const TimeInLoopSuite = require('../../_internal/TimeInLoopSuite')
const assert = require('assert')

const suite = new TimeInLoopSuite({ loopCount: 1e6 })

suite.add('vanilla splice', () => {
  const array = [1, 2, 3, 4, 5]
  array.splice(2, 1)
  assert.deepEqual(array, [1, 2, 4, 5])
})

suite.add('slice splice', async () => {
  const array = [1, 2, 3, 4, 5]
  const left = array.slice(0, 2)
  const right = array.slice(3)
  const array2 = left.concat(right)
  assert.deepEqual(array2, [1, 2, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
