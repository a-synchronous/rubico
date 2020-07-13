const assert = require('assert')
const isEqual = require('./isEqual')

describe('isEqual', () => {
  it('left equals right? eager version of eq', async () => {
    assert.strictEqual(isEqual(1, 1), true)
    assert.strictEqual(isEqual(1, 0), false)
    assert.strictEqual(isEqual('hey', 'hey'), true)
    assert.strictEqual(isEqual(1, {}), false)
    assert.strictEqual(isEqual({}, {}), false)
    assert.strictEqual(isEqual([], {}), false)
  })
})
