const assert = require('assert')
const timeInLoopAsync = require('./timeInLoopAsync')

describe('timeInLoopAsync', () => {
  it('times an async function in a loop', async () => {
    const p = timeInLoopAsync('asyncHey', 1e5, async () => 'asyncHey')
    assert(p instanceof Promise)
    const result = await p
    assert.equal(result.description, 'asyncHey')
    assert.equal(result.loopCount, 1e5)
    assert.equal(typeof result.duration, 'number')
  })

  it('can be silent', async () => {
    const p = timeInLoopAsync('asyncHey', 1e5, async () => 'asyncHey', { silent: true })
    assert(p instanceof Promise)
    const result = await p
    assert.equal(result.description, 'asyncHey')
    assert.equal(result.loopCount, 1e5)
    assert.equal(typeof result.duration, 'number')
  })
})
