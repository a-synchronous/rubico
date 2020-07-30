const { or } = require('..')
const timeInLoop = require('../x/timeInLoop')

const isOdd = x => x % 1 === 2

timeInLoop('isOdd', 1e6, () => {
  isOdd(0)
})

const gt2 = x => x > 2

timeInLoop('gt2', 1e6, () => {
  gt2(0)
})

const isOddGt2 = x => isOdd(x) || gt2(x)

timeInLoop('x => isOdd(x) || gt2(x)', 1e6, () => {
  isOddGt2(0)
})

const testRubicoOr = or([
  x => x % 2 === 1,
  x => x > 2,
])

timeInLoop('or([x => x % 2 === 1, x => x > 2])', 1e6, () => {
  testRubicoOr(0)
})

const testRubicoOr2 = or([
  isOdd,
  gt2,
])

timeInLoop('or([isOdd, greaterThan2])', 1e6, () => {
  testRubicoOr2(0)
})
