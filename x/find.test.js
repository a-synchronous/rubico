const assert = require('assert')
const find = require('./find')

describe('find', () => {
  it('gets the first item that passes test', async () => {
    assert.strictEqual(
      find(x => x > 2)([1, 2, 3]),
      3,
    )
    assert.strictEqual(
      find(x => x > 2)(new Set([1, 2, 3])),
      3,
    )
    assert.deepEqual(
      find(([k, v]) => v > 2)(new Map([['a', 1], ['b', 2], ['c', 3]])),
      ['c', 3],
    )
    assert.strictEqual(
      find(x => x > 2)({ a: 1, b: 2, c: 3 }),
      3,
    )
    assert.strictEqual(
      find(x => x > 3)([1, 2, 3]),
      undefined,
    )
    assert.strictEqual(
      find(x => x === 1)([1, 2, 3]),
      1,
    )
  })
  it('works with async functions', async () => {
    assert.strictEqual(
      await find(async x => x > 2)([1, 2, 3]),
      3,
    )
  })
  it('throws TypeError for find(nonFunction)', async () => {
    assert.throws(
      () => find('hey'),
      new TypeError('find(f); f is not a function'),
    )
  })
})
