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
    assert.strictEqual(
      find(x => x === 'a')('abc'),
      'a',
    )
  })

  it('returns undefined for no items passing', async () => {
    assert.strictEqual(
      find(x => x > 3)([1, 2, 3]),
      undefined,
    )
    assert.strictEqual(
      await find(async x => x > 3)([1, 2, 3]),
      undefined,
    )
  })

  it('returns undefined for empty array', async () => {
    assert.strictEqual(
      find(x => x > 3)([]),
      undefined,
    )
  })

  it('returns undefined for f ()=>{}', async () => {
    assert.strictEqual(
      find(() => {})([1, 2, 3]),
      undefined,
    )
  })

  it('works with async functions', async () => {
    assert.strictEqual(
      await find(async x => x > 2)([1, 2, 3]),
      3,
    )
    assert.strictEqual(
      await find(async x => x > 0)([1, 2, 3]),
      1,
    )
  })

  it('throws TypeError for find(nonFunction)', async () => {
    assert.throws(
      () => find('hey'),
      new TypeError('find(f); f is not a function'),
    )
  })

  it('find(...)(null); throw TypeError', async () => {
    assert.throws(
      () => find(() => true)(null),
      new TypeError('find(...)(x); x cannot be null'),
    )
  })

  it('find(...)(undefined); throw TypeError', async () => {
    assert.throws(
      () => find(() => true)(undefined),
      new TypeError('find(...)(x); x cannot be undefined'),
    )
  })

  it('find(...)(invalid); throw TypeError', async () => {
    assert.throws(
      () => find(() => true)(1),
      new TypeError('find(...)(x); x invalid'),
    )
  })
})
