const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const assign = require('../assign')

const suite = new TimeInLoopSuite()

suite.add('rubico assign values', () => {
  assign({}, {
    a: 1,
    b: 2,
    c: 3,
  })
})

suite.add('rubico assign', () => {
  assign({}, {
    a: () => 1,
    b: () => 2,
    c: () => 3,
  })
})

suite.add('rubico assign lazy', () => {
  assign({
    a: () => 1,
    b: () => 2,
    c: () => 3,
  })({})
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
