const { or } = require('..')
const timeInLoop = require('../x/timeInLoop')

const isOdd = x => x % 1 === 2

// 4.52ms
timeInLoop('isOdd', 1e6, () => {
  isOdd(0)
})

const gt2 = x => x > 2

// 10.674ms
timeInLoop('gt2', 1e6, () => {
  gt2(0)
})

const isOddGt2 = x => isOdd(x) || gt2(x)

// 10.696ms
timeInLoop('x => isOdd(x) || gt2(x)', 1e6, () => {
  isOddGt2(0)
})

const happyPath = or([
  x => x % 2 === 1,
  x => x > 2,
])

// 58.143ms
timeInLoop('or_rubicoHappyPath', 1e6, () => {
  happyPath(0)
})

// 143.205ms
timeInLoop('or_rubicoIncludingInit', 1e6, () => {
  or([
    x => x % 2 === 1,
    x => x > 2,
  ])(0)
})
