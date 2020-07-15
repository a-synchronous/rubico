const assert = require('assert')
const last = require('./last')

describe('last', () => {
  it('gets the last item of an array', async () => {
    assert.strictEqual(last([1, 2, 3]), 3)
    assert.strictEqual(last([]), undefined)
  })
  it('gets the last character of a string', async () => {
    assert.strictEqual(last('abc'), 'c')
    assert.strictEqual(last(''), undefined)
  })
  it('throws TypeError on last(nonArrayOrString)', async () => {
    assert.throws(
      () => last(undefined),
      new TypeError('last(x); x is not an Array or String'),
    )
    assert.throws(
      () => last(),
      new TypeError('last(x); x is not an Array or String'),
    )
    assert.throws(
      () => last(5),
      new TypeError('last(x); x is not an Array or String'),
    )
  })
})
