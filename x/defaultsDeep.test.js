const assert = require('assert')
const defaultsDeep = require('./defaultsDeep')

describe('defaultsDeep', () => {
  it('deeply assigns defaults', async () => {
    assert.deepEqual(
      defaultsDeep({
        a: 1,
        b: { d: 3 },
        e: [1, 2, { a: 1 }],
      })({
        a: 1,
        b: { c: 2 },
        e: [0, 0, { b: 2 }],
      }),
      {
        a: 1,
        b: { c: 2, d: 3 },
        e: [0, 0, { a: 1, b: 2 }],
      },
    )
  })
  it('accepts array default', async () => {
    assert.deepEqual(
      defaultsDeep([
        1,
        2,
        { a: [3, 4, { b: 5 }] },
      ])([
        0,
        0,
        { a: [3, 4, { e: 6 }] },
      ]),
      [
        0,
        0,
        { a: [3, 4, { b: 5, e: 6 }] },
      ],
    )
  })
  it('accepts custom checking function', async () => {
    assert.deepEqual(
      defaultsDeep({ a: 1, b: { c: 2, d: 3 } })({ a: 0, b: { c: 0, d: 1 } }),
      { a: 0, b: { c: 0, d: 1 } },
    )
    const isTruthy = x => !!x
    assert.deepEqual(
      defaultsDeep({ a: 1, b: { c: 2, d: 3 } }, isTruthy)({ a: 0, b: { c: 0, d: 1 } }),
      { a: 1, b: { c: 2, d: 1 } },
    )
  })
  it('throws TypeError on defaultCollection not Array or Object', async () => {
    assert.throws(
      () => defaultsDeep(0),
      new TypeError('defaultsDeep(defaultCollection); defaultCollection is not an Array or Object'),
    )
  })
})
