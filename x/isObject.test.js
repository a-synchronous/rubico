const isObject = require('./isObject')
const assert = require('assert')

describe('isObject', () => {
  it('is Object?', async () => {
    assert.strictEqual(isObject({}), true)
    assert.strictEqual(isObject([]), true)
    assert.strictEqual(isObject(Object), true)
    assert.strictEqual(isObject(''), false)
    assert.strictEqual(isObject(String()), false)
    assert.strictEqual(isObject(Object()), true)
    assert.strictEqual(isObject(undefined), false)
    assert.strictEqual(isObject(null), false)
    assert.strictEqual(isObject(), false)
  })
})
