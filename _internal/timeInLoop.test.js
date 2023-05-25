const assert = require('assert')
const timeInLoop = require('./timeInLoop')

describe('timeInLoop', () => {
  it('timeInLoop(desc string, loopCount number, fn function) -> y undefined', async () => {
    const y = timeInLoop('hey', 1e5, () => 'hey')
    assert.strictEqual(y, undefined)
  })
})
