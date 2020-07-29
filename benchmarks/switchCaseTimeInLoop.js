const { switchCase } = require('..')
const { timeInLoop } = require('../x')

const isOdd = x => x % 2 === 1

timeInLoop("isOdd", 1e6, () => isOdd(4))

timeInLoop("isOdd_ternary", 1e6, () => isOdd(4) ? 1 : 0)

timeInLoop("isOdd_ifElse", 1e6, () => {
  if (isOdd(4)) return 'odd'
  else return 'even'
})

timeInLoop("isOdd_switch", 1e6, () => {
  switch (isOdd(4)) {
    case true: return 'odd'
    default: return 'even'
  }
})

const oddOrEven = switchCase([isOdd, () => 'odd', () => 'even'])

timeInLoop("isOdd_rubicoSwitchCase", 1e6, () => oddOrEven(4))
