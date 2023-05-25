const assert = require('assert')
const timeInLoop = require('./timeInLoop')

describe('timeInLoop', () => {
  it('timeInLoop(desc string, loopCount number, fn function) -> y undefined', async () => {
    const result = timeInLoop('hey', 1e5, () => 'hey')
    assert.equal(result.description, 'hey')
    assert.equal(result.loopCount, 1e5)
    assert.equal(typeof result.duration, 'number')
  })

  it('timeInLoop.async(desc string, loopCount number, fn function) -> y undefined', async () => {
    const p = timeInLoop.async('asyncHey', 1e5, async () => 'asyncHey')
    assert(p instanceof Promise)
    const result = await p
    assert.equal(result.description, 'asyncHey')
    assert.equal(result.loopCount, 1e5)
    assert.equal(typeof result.duration, 'number')
  })
})
