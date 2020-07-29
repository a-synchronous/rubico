const { switchCase } = require('..')
const timeInLoop = require('../x/timeInLoop')

const numLoops = 1e6

const isOdd = x => x % 2 === 1

describe('switchCase', () => {
  describe('switchCase([isOdd, () => \'odd\', () => \'even\']); timeInLoop', () => {
    it('switchCase', async () => {
      console.log(
        timeInLoop(
          numLoops,
          switchCase([isOdd, () => 'odd', () => 'even']),
        ) + 'ms',
      )
    })
    it('switchCase (fresh scopes)', async () => {
      console.log(
        timeInLoop(
          numLoops,
          () => switchCase([isOdd, () => 'odd', () => 'even'])(),
        ) + 'ms',
      )
    })
    it('conditional operator cond ? a : b', async () => {
      console.log(
        timeInLoop(
          numLoops,
          x => isOdd(x) ? 1 : 0,
        ) + 'ms',
      )
    })
    it('if else statement', async () => {
      console.log(
        timeInLoop(
          numLoops,
          x => {
            if (isOdd(x)) return 'odd'
            else return 'even'
          },
        ) + 'ms',
      )
    })
    it('switch case statement', async () => {
      console.log(
        timeInLoop(
          numLoops,
          x => {
            switch (isOdd(x)) {
              case true: return 'odd'
              default: return 'even'
            }
          },
        ) + 'ms',
      )
    })
  })
})
