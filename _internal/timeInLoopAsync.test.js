const assert = require('assert')
const timeInLoopAsync = require('./timeInLoopAsync')

describe('timeInLoopAsync', () => {
  it('timeInLoopAsync(desc string, loopCount number, fn function) -> y undefined', async () => {
    const p = timeInLoopAsync('asyncHey', 1e5, async () => 'asyncHey')
    assert(p instanceof Promise)
    const y = await p
    assert.strictEqual(y, undefined)
  })
})
