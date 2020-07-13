const assert = require('assert')
const isString = require('./isString')

describe('isString', () => {
  it('is String?', async () => {
    assert.strictEqual(isString('hey'), true)
    assert.strictEqual(isString(0), false)
    assert.strictEqual(isString({}), false)
    assert.strictEqual(isString(new String('yo')), true)
    assert.strictEqual(isString(''), true)
    assert.strictEqual(isString(undefined), false)
    assert.strictEqual(isString(null), false)
    assert.strictEqual(isString(), false)
  })
})
