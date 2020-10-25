const assert = require('assert')
const flatten = require('./flatten')

describe('flatten', () => {
  it('flattens an Array of Iterables', async () => {
    assert.deepEqual(
      flatten([[1], new Set([2]), 3, 4, [5]]),
      [1, 2, 3, 4, 5],
    )
    assert.deepEqual(
      await flatten([[1], new Set([2]), 3, 4, [5], Promise.resolve(6)]),
      [1, 2, 3, 4, 5, 6],
    )
  })
  it('flattens a Set of Iterables', async () => {
    assert.deepEqual(
      flatten(new Set([[1], new Set([2]), 3, 4, [5]])),
      new Set([1, 2, 3, 4, 5]),
    )
  })
  it('flattens Array of undefined', async () => {
    assert.deepEqual(
      flatten([undefined, [undefined], new Set([undefined])]),
      [undefined, undefined, undefined],
    )
  })
  it('flatten(object); Iterator<object>', async () => {
    const object = flatten({ _: { a: 1 }, __: { b: 2, c: 3 } })
    assert.deepEqual(object, { a: 1, b: 2, c: 3 })
  })
  it('flatten(null)', async () => {
    assert.strictEqual(flatten(null), null)
  })
  it('flatten(undefined)', async () => {
    assert.strictEqual(flatten(undefined), undefined)
  })
  it('flatteningReducer', async () => {
    const add = (a, b) => a + b
    const flatteningAdd = flatten(add)
    assert.strictEqual(
      [[1], [2], [3], [4], [5]].reduce(flatteningAdd, 0),
      15,
    )
  })
})
