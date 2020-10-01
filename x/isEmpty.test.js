const assert = require('assert')
const isEmpty = require('./isEmpty')

describe('isEmpty', () => {
  it('checks if an Array is empty', async () => {
    assert.strictEqual(isEmpty([]), true)
    assert.strictEqual(isEmpty([1, 2, 3]), false)
  })
  it('checks if an Object is empty', async () => {
    assert.strictEqual(isEmpty({}), true)
    assert.strictEqual(isEmpty({ a: 1, b: 2, c: 3 }), false)
  })
  it('checks if a String is empty', async () => {
    assert.strictEqual(isEmpty('hey'), false)
    assert.strictEqual(isEmpty(''), true)
  })
  it('false for everything else', async () => {
    assert.strictEqual(isEmpty(0), false)
  })
  it('new Set()', async () => {
    assert.strictEqual(isEmpty(new Set()), true)
  })
  it('new Map()', async () => {
    assert.strictEqual(isEmpty(new Map()), true)
  })
  it('null', async () => {
    assert.strictEqual(isEmpty(null), true)
  })
  it('undefined', async () => {
    assert.strictEqual(isEmpty(undefined), true)
  })
})
