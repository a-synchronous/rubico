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
  it('case when defaultCollection is not indexable', async () => {
    assert.deepEqual(
      defaultsDeep({ a: 1 })({ b: { c: ['hey'] } }),
      { a: 1, b: { c: ['hey'] } },
    )
  })
  it('accepts functions as defaults', async () => {
    assert.strictEqual(
      defaultsDeep({ a: () => 'hey' })({}).a(),
      'hey',
    )
  })
  it('accepts functions on inputs', async () => {
    assert.strictEqual(
      defaultsDeep({ b: 'yo' })({ a: () => 'hey' }).a(),
      'hey',
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
  it('does not mutate input parameter', async () => {
    const x = { a: 1 }
    assert.deepEqual(
      defaultsDeep({ b: 'yo' })(x),
      { a: 1, b: 'yo' },
    )
    assert.deepEqual(x, { a: 1 })
  })
  it('identity for non object or array values', async () => {
    assert.strictEqual(defaultsDeep({ b: 'yo' })(1), 1)
  })
})
