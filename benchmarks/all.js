const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const all = require('../all')

const suite = new TimeInLoopSuite()

suite.add('rubico array all', () => {
  all(5, [
    value => value + 1,
    value => value + 2,
    value => value + 3,
  ])
})

suite.add('rubico array all tacit', () => {
  all([
    value => value + 1,
    value => value + 2,
    value => value + 3,
  ])(5)
})

suite.add('rubico object all', () => {
  all(5, {
    a: value => value + 1,
    b: value => value + 2,
    c: value => value + 3,
  })
})

suite.add('rubico object all tacit', () => {
  all({
    a: value => value + 1,
    b: value => value + 2,
    c: value => value + 3,
  })(5)
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
