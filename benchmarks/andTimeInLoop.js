const { and } = require('..')
const timeInLoop = require('../x/timeInLoop')

const isOdd = x => x % 2 === 1

timeInLoop('isOdd', 1e6, () => {
  isOdd(9)
})

const gt2 = x => x > 2

timeInLoop('gt2', 1e6, () => {
  gt2(9)
})

const isOddGt2 = x => isOdd(x) && gt2(x)

timeInLoop('x => isOdd(x) && gt2(x)', 1e6, () => {
  isOddGt2(9)
})

const testRubicoAnd = and([
  x => x % 2 === 1,
  x => x > 2,
])

timeInLoop('and([x => x % 2 === 1, x => x > 2])', 1e6, () => {
  testRubicoAnd(9)
})

const testRubicoAnd2 = and([
  isOdd,
  gt2,
])

timeInLoop('and([isOdd, greaterThan2])', 1e6, () => {
  testRubicoAnd2(9)
})
