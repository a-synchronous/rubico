const assert = require('assert')
const isDeepEqual = require('./isDeepEqual')

describe('isDeepEqual', () => {
  it('checks for deep equality', async () => {
    assert.strictEqual(isDeepEqual(
      [1, 2, 3],
      [1, 2, 3],
    ), true)
    assert.strictEqual(isDeepEqual(
      [1, 2, 3],
      [1, 2, 3, 4],
    ), false)
    assert.strictEqual(isDeepEqual(
      [1, 2, 3, 4],
      [1, 2, 3],
    ), false)
    assert.strictEqual(isDeepEqual(
      { a: 1, b: 2, c: 3 },
      { a: 1, b: 2, c: 3 },
    ), true)
    assert.strictEqual(isDeepEqual(
      { a: 1, b: 2, c: 3 },
      { a: 1 },
    ), false)
    assert.strictEqual(isDeepEqual(
      { a: 1, b: [1, 2, 3] },
      { a: 1, b: [1, 2, 3] },
    ), true)
    assert.strictEqual(isDeepEqual(
      { a: 1, b: [1, 2, 3] },
      { a: 1, b: [1, 2] },
    ), false)
    assert.strictEqual(isDeepEqual(
      { a: 1, b: new Set([]) },
      { a: 1, b: new Set([1, 2, 3]) },
    ), false)
    assert.strictEqual(isDeepEqual(
      { a: 1, b: new Set([1, 2, 3]) },
      { a: 1, b: new Set([1, 2, 3]) },
    ), true)
    assert.strictEqual(isDeepEqual(
      { a: 1, b: new Set([1, 2, { a: 1 }]) },
      { a: 1, b: new Set([1, 2, { b: 2 }]) },
    ), false)
    assert.strictEqual(isDeepEqual(
      new Map([['a', 1]]),
      new Map([['a', 1]]),
    ), true)
    assert.strictEqual(isDeepEqual(
      { a: 1, b: new Map([['a', 1], ['b', { a: 1 }]]) },
      { a: 1, b: new Map([['a', 1], ['b', { a: 1 }]]) },
    ), true)
    assert.strictEqual(isDeepEqual(
      { a: 1, b: new Map([['a', 1], ['b', { a: 1 }]]) },
      { a: 1, b: new Map([['a', 1], ['b', { b: 2 }]]) },
    ), false)
  })
  it('treats nullish (null and undefined) differently', async () => {
    assert.strictEqual(isDeepEqual(null, null), true)
    assert.strictEqual(isDeepEqual(null, undefined), false)
    assert.strictEqual(isDeepEqual(undefined, undefined), true)
  })
  it('checks values by SameValueZero', async () => {
    assert.strictEqual(isDeepEqual(NaN, NaN), true)
    assert.strictEqual(isDeepEqual(+0, -0), true)
    assert.strictEqual(isDeepEqual(1, 1), true)
    assert.strictEqual(isDeepEqual(0, 0), true)
    assert.strictEqual(isDeepEqual(false, false), true)
    assert.strictEqual(isDeepEqual(true, false), false)
    assert.strictEqual(isDeepEqual(1, '1'), false)
    assert.strictEqual(isDeepEqual('1', '1'), true)
  })
  it('checks empty deep equality', async () => {
    assert.strictEqual(isDeepEqual({}, {}), true)
    assert.strictEqual(isDeepEqual({}, []), false)
    assert.strictEqual(isDeepEqual([], []), true)
  })
})
