const assert = require('assert')
const timeInLoop = require('./timeInLoop')

describe('timeInLoop', () => {
  it('timeInLoop(desc string, loopCount number, fn function) -> y undefined', async () => {
    const y = timeInLoop('hey', 1e5, () => 'hey')
    assert.strictEqual(y, undefined)
  })

  it('timeInLoop.async(desc string, loopCount number, fn function) -> y undefined', async () => {
    const p = timeInLoop.async('asyncHey', 1e5, async () => 'asyncHey')
    assert(p instanceof Promise)
    const y = await p
    assert.strictEqual(y, undefined)
  })
})
