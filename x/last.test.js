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
  it('last(undefined)', async () => {
    assert.strictEqual(last(undefined), undefined)
  })
  it('last(5)', async () => {
    assert.strictEqual(last(5), undefined)
  })
})
