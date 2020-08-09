const assert = require('assert')
const flatten = require('./flatten')

describe('flatten', () => {
  it('flattens an Array of Iterables', async () => {
    assert.deepEqual(
      flatten([[1], new Set([2]), 3, 4, { a: 5 }]),
      [1, 2, 3, 4, 5],
    )
  })
  it('flattens a Set of Iterables', async () => {
    assert.deepEqual(
      flatten(new Set([[1], new Set([2]), 3, 4, { a: 5 }])),
      new Set([1, 2, 3, 4, 5]),
    )
  })
  it('flattens Array of undefined', async () => {
    assert.deepEqual(
      flatten([undefined, [undefined], new Set([undefined])]),
      [undefined, undefined, undefined],
    )
  })
  it('flatten(invalid); TypeError', async () => {
    assert.throws(
      () => flatten({ a: 1 }),
      new TypeError('flatten(x); x invalid')
    )
  })
})
