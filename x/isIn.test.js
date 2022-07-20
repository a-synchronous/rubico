const assert = require('assert')
const isIn = require('./isIn')

describe('isIn', () => {
  it('checks if in Array element exist', () => {
    assert.strictEqual(isIn([1, 2, 3])(1), true)
    assert.strictEqual(isIn([1, 2, 3])(4), false)
  })
  it('checks if in Object element exist', () => {
    assert.strictEqual(isIn({ a: 1 })(1), true)
    assert.strictEqual(isIn({ a: 1 })(2), false)
  })
  it('checks if in Sting substring exist', () => {
    assert.strictEqual(isIn('abc')('a'), true)
    assert.strictEqual(isIn('abc')('ab'), true)
    assert.strictEqual(isIn('abc')('d'), false)
  })
  it('checks if in Set element exist', () => {
    assert.strictEqual(isIn(new Set([1, 2, 3]))(1), true)
    assert.strictEqual(isIn(new Set([1, 2, 3]))(4), false)
  })
  it('checks if in Map element exist', () => {
    assert.strictEqual(isIn(new Map([[1, 1], [2, 2], [3, 3]]))(1), true)
    assert.strictEqual(isIn(new Map([[1, 1], [2, 2], [3, 3]]))(4), false)
  })
})
