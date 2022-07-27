const assert = require('assert')
const isIn = require('./isIn')

describe('isIn', () => {
  describe('isIn(any)(value) -> boolean', () => {
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

  describe('eager isIn(value, any) -> boolean', () => {
    it('checks if in Array element exist', () => {
      assert.strictEqual(isIn(1, [1, 2, 3]), true)
      assert.strictEqual(isIn(4, [1, 2, 3]), false)
    })
    it('checks if in Object element exist', () => {
      assert.strictEqual(isIn(1, { a: 1 }), true)
      assert.strictEqual(isIn(2, { a: 1 }), false)
    })
    it('checks if in Sting substring exist', () => {
      assert.strictEqual(isIn('a', 'abc'), true)
      assert.strictEqual(isIn('ab', 'abc'), true)
      assert.strictEqual(isIn('d', 'abc'), false)
    })
    it('checks if in Set element exist', () => {
      assert.strictEqual(isIn(1, new Set([1, 2, 3])), true)
      assert.strictEqual(isIn(4, new Set([1, 2, 3])), false)
    })
    it('checks if in Map element exist', () => {
      assert.strictEqual(isIn(1, new Map([[1, 1], [2, 2], [3, 3]])), true)
      assert.strictEqual(isIn(4, new Map([[1, 1], [2, 2], [3, 3]])), false)
    })
    it('check if container is null', () => {
      assert.strictEqual(isIn(1, null), false)
    })
  })
})
