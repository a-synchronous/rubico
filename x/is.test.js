const assert = require('assert')
const is = require('./is')

describe('is', () => {
  it('is(constructor)(x); checks if x\'s direct constructor is constructor', async () => {
    assert.strictEqual(is(Array)({}), false)
    assert.strictEqual(is(Array)([]), true)
    assert.strictEqual(is(Object)({}), true)
    assert.strictEqual(is(Object)([]), false)
    assert.strictEqual(is(Number)(1), true)
    assert.strictEqual(is(Number)('1'), false)
    assert.strictEqual(is(String)(1), false)
    assert.strictEqual(is(String)('1'), true)
    assert.strictEqual(is(Boolean)(true), true)
    assert.strictEqual(is(Boolean)(0), false)
  })
})
