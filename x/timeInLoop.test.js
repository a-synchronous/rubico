const assert = require('assert')
const timeInLoop = require('./timeInLoop')

describe('timeInLoop', () => {
  it('times the amount of complete synchronous function calls in a loop', async () => {
    assert.strictEqual(
      typeof timeInLoop('hey', 1e6, () => 'yo'),
      'undefined',
    )
  })

  it('0 for 0', async () => {
    assert.strictEqual(
      typeof timeInLoop('yo', 0, () => 'yo'),
      'undefined',
    )
  })
})
