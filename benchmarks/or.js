const { pipe, or } = require('..')
const timeInLoop = require('../x/timeInLoop')
const trace = require('../x/trace')

const numLoops = 1e6

describe('or', () => {
  it('or(conditions)(x); timeInLoop versus ||', async () => {
    console.log(
      'or([x => x % 2 === 1, x => x > 2])',
      timeInLoop(
        numLoops,
        or([
          x => x % 2 === 1,
          x => x > 2,
        ]),
      ) + 'ms',
    )
    console.log(
      'x => x % 2 === 1 || x > 2',
      timeInLoop(
        numLoops,
        x => x % 2 === 1 || x > 2,
      ) + 'ms',
    )
  })
  xit('TODO: figure out why or takes longer than and')
})

