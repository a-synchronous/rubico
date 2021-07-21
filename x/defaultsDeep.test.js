const assert = require('assert')
const defaultsDeep = require('./defaultsDeep')

describe('defaultsDeep', () => {
  it('default array', async () => {
    assert.deepEqual(
      defaultsDeep([1, 2, 3])([3]),
      [3, 2, 3],
    )
    assert.deepEqual(
      defaultsDeep([[1], 2, 3])([[]]),
      [[1], 2, 3],
    )
  })
  it('null', async () => {
    assert.strictEqual(defaultsDeep([[1], 2, 3])(null), null)
  })
  it('undefined', async () => {
    assert.strictEqual(defaultsDeep([[1], 2, 3])(undefined), undefined)
  })
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
  it('retains extra elements from original if not found on default', async () => {
    const array = [{ a: 1 }, 0, 0]
    assert.deepEqual(
      defaultsDeep([{ a: 1, b: 2, c: 3 }])(array),
      [{ a: 1, b: 2, c: 3 }, 0, 0],
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
  it('{ obj: undefined } <-> object', async () => {
    const x = { obj: { a: '1' } }
    assert.deepEqual(
      defaultsDeep({ obj: undefined })(x),
      { obj: { a: '1' } },
    )
  })
  it('nullish default item should use current item', async () => {
    assert.deepEqual(
      defaultsDeep([null, 1, 2, 3, 4])([0, 1, 2]),
      [0, 1, 2, 3, 4],
    )

    const x = { obj: { a: '1' } }
    assert.deepEqual(
      defaultsDeep({ obj: undefined })(x),
      { obj: { a: '1' } },
    )
  })
  it('undefined <-> object', async () => {
    const b = { obj: { a: '1' } }
    assert.deepEqual(
      defaultsDeep(undefined)(b),
     b,
    )
  })
})
