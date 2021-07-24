const assert = require('assert')
const uniq = require('./uniq')

describe('uniq', () => {
  it('basic usage', async () => {
    assert.deepEqual(uniq([1, 2, 2, 3]), [1, 2, 3])
  })

  it('undefined input', () => {
    assert.throws(() => uniq(), new Error('uniq(arr): arr is not an array'))
  })
})
