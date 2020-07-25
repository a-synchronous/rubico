const assert = require('assert')
const timeInLoop = require('./timeInLoop')

describe('timeInLoop', () => {
  it('times the amount of complete synchronous function calls in a loop', async () => {
    assert.strictEqual(
      typeof timeInLoop('myFn', 1e6, () => 'yo'),
      'number',
    )
  })
})
