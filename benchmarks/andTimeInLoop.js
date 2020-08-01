const { and } = require('..')
const timeInLoop = require('../x/timeInLoop')

const isOdd = x => x % 2 === 1

// 4.326ms
timeInLoop('isOdd', 1e6, () => {
  isOdd(9)
})

const gt2 = x => x > 2

// 10.47ms
timeInLoop('gt2', 1e6, () => {
  gt2(9)
})

const isOddGt2 = x => isOdd(x) && gt2(x)

// 10.458ms
timeInLoop('x => isOdd(x) && gt2(x)', 1e6, () => {
  isOddGt2(9)
})

const testRubicoAnd = and([
  x => x % 2 === 1,
  x => x > 2,
])

// 68.633ms
timeInLoop('and_rubicoHappyPath', 1e6, () => {
  testRubicoAnd(9)
})

// 153.602ms
timeInLoop('and_rubicoIncludingInit', 1e6, () => {
  and([
    x => x % 2 === 1,
    x => x > 2,
  ])(9)
})
