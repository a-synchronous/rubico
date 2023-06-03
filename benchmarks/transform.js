const R = require('ramda')
const Transducer = require('../Transducer')
const TimeInLoopSuite = require('../_internal/TimeInLoopSuite')
const transform = require('../transform')

const ramdaInto = R.into
const ramdaMap = R.map

const suite = new TimeInLoopSuite()

suite.add('rubico transform array -> array', () => {
  transform([1, 2, 3, 4, 5], Transducer.map(number => number ** 2), [])
})

suite.add('rubico transform array -> array tacit', () => {
  transform(Transducer.map(number => number ** 2), [])([1, 2, 3, 4, 5])
})

suite.add('rubico transform array -> string', () => {
  transform([1, 2, 3, 4, 5], Transducer.map(number => number ** 2), '')
})

suite.add('rubico transform array -> string tacit', () => {
  transform(Transducer.map(number => number ** 2), '')([1, 2, 3, 4, 5])
})

suite.add('ramda into array -> array', () => {
  ramdaInto([], ramdaMap(number => number ** 2), [1, 2, 3, 4, 5])
})

suite.add('ramda into array -> string', () => {
  ramdaInto('', ramdaMap(number => number ** 2), [1, 2, 3, 4, 5])
})

if (process.argv[1] == __filename) {
  suite.on('caseBestRun', run => console.log(run.output))
  suite.run()
}

module.exports = suite
