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
  it('undefined for undefined', async () => {
    assert.strictEqual(first(undefined), undefined)
  })
  it('undefined for 5', async () => {
    assert.strictEqual(first(5), undefined)
  })
})
