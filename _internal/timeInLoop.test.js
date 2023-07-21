const assert = require('assert')
const timeInLoop = require('./timeInLoop')

describe('timeInLoop', () => {
  it('times a function in a loop', async () => {
    const result = timeInLoop('hey', 1e5, () => 'hey')
    assert.equal(result.description, 'hey')
    assert.equal(result.loopCount, 1e5)
    assert.equal(typeof result.duration, 'number')
  })

  it('can be silent', async () => {
    const result = timeInLoop('hey', 1e5, () => 'hey', { silent: true })
    assert.equal(result.description, 'hey')
    assert.equal(result.loopCount, 1e5)
    assert.equal(typeof result.duration, 'number')
  })
})
