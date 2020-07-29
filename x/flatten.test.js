const assert = require('assert')
const flatten = require('./flatten')

describe('flatten', () => {
  it('flattens an Array of Iterables', async () => {
    assert.deepEqual(
      flatten([[1], new Set([2]), 3]),
      [1, 2, 3],
    )
  })
  it('flattens a Set of Iterables', async () => {
    assert.deepEqual(
      flatten(new Set([[1], new Set([2]), 3])),
      new Set([1, 2, 3]),
    )
  })
})
