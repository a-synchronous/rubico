const assert = require('assert')
const isEmpty = require('./isEmpty')

describe('isEmpty', () => {
  it('checks if an Array is empty', async () => {
    assert.strictEqual(isEmpty([]), true)
    assert.strictEqual(isEmpty([1, 2, 3]), false)
  })
  it('checks if a Set is empty', async () => {
    assert.strictEqual(isEmpty(new Set([])), true)
    assert.strictEqual(isEmpty(new Set([1, 2, 3])), false)
  })
  it('checks if a Map is empty', async () => {
    assert.strictEqual(isEmpty(new Map([])), true)
    assert.strictEqual(isEmpty(new Map([['a', 1], ['b', 2]])), false)
  })
  it('checks if an Object is empty', async () => {
    assert.strictEqual(isEmpty({}), true)
    assert.strictEqual(isEmpty({ a: 1, b: 2, c: 3 }), false)
  })
  it('throws TypeError on isEmpty(nonStringPrimitive)', async () => {
    assert.throws(
      () => isEmpty(0),
      new TypeError('isEmpty(x); x invalid'),
    )
    assert.throws(
      () => isEmpty('hey'),
      new TypeError('isEmpty(x); x invalid'),
    )
  })
})
