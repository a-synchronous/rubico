const { pipe, and } = require('..')
const timeInLoop = require('../x/timeInLoop')
const trace = require('../x/trace')

const numLoops = 1e6

describe('and', () => {
  it('and(conditions)(x); timeInLoop versus &&', async () => {
    console.log(
      'and([x => x % 2 === 1, x => x > 2])',
      timeInLoop(
        numLoops,
        and([
          x => x % 2 === 1,
          x => x > 2,
        ]),
      ) + 'ms',
    )
    console.log(
      'x => x % 2 === 1 && x > 2',
      timeInLoop(
        numLoops,
        x => x % 2 === 1 && x > 2,
      ) + 'ms',
    )
  })
  /* and([x => x % 2 === 1, x => x > 2]) 12ms
   * x => x % 2 === 1 && x > 2 150ms
   *
   * TODO: figure out why rubico is faster than vanilla JS syntax
   */
})
