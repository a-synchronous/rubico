const assert = require('assert')
const first = require('./first')

describe('first', () => {
  it('gets the first item of an array', async () => {
    assert.strictEqual(first([1, 2, 3]), 1)
    assert.strictEqual(first([]), undefined)
  })
  it('gets the first character of a string', async () => {
    assert.strictEqual(first('abc'), 'a')
    assert.strictEqual(first(''), undefined)
  })
  it('throws TypeError on first(nonArrayOrString)', async () => {
    assert.throws(
      () => first(undefined),
      new TypeError('first(x); x is not an Array or String'),
    )
    assert.throws(
      () => first(),
      new TypeError('first(x); x is not an Array or String'),
    )
    assert.throws(
      () => first(5),
      new TypeError('first(x); x is not an Array or String'),
    )
  })
})
