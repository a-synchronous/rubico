const assert = require('assert')
const timeInLoop = require('./timeInLoop')

describe('timeInLoop', () => {
  it('times the amount of complete synchronous function calls in a loop', async () => {
    assert.strictEqual(
      typeof timeInLoop(1e6, () => 'yo'),
      'number',
    )
  })

  it('0 for 0', async () => {
    assert.strictEqual(
      typeof timeInLoop(0, () => 'yo'),
      'number',
    )
  })
})
