const { switchCase } = require('..')
const { timeInLoop } = require('../x')

const isOdd = x => x % 2 === 1

// 4.448ms
timeInLoop("isOdd", 1e6, () => isOdd(4))

// 10.631ms
timeInLoop("isOdd_ternary", 1e6, () => isOdd(4) ? 1 : 0)

// 9.585ms
timeInLoop("isOdd_ifElse", 1e6, () => {
  if (isOdd(4)) return 'odd'
  else return 'even'
})

// 10.137ms
timeInLoop("isOdd_switch", 1e6, () => {
  switch (isOdd(4)) {
    case true: return 'odd'
    default: return 'even'
  }
})

const oddOrEven = switchCase([isOdd, () => 'odd', () => 'even'])

// 24.529ms
timeInLoop("isOdd_rubicoSwitchCase", 1e6, () => oddOrEven(4))

// 127.702ms
timeInLoop("isOdd_rubicoIncludingInit", 1e6, () => {
  switchCase([isOdd, () => 'odd', () => 'even'])(4)
})
