const assert = require('assert')
const unionWith = require('./unionWith')

describe('unionWith', () => {
  it('create a flattened unique array with uniques given by a binary predicate', async () => {
    assert.deepEqual(
      unionWith((a, b) => a.a === b.a)([
        [{ a: 1 }, { a: 2 }],
        [{ a: 2 }, { a: 3 }],
        [{ b: 5 }, { a: 5 }],
      ]),
      [{ a: 1 }, { a: 2 }, { a: 3 }, { b: 5 }, { a: 5 }]
    )
  })
  it('binary predicate can be async', async () => {
    assert.deepEqual(
      await unionWith(async (a, b) => a.a === b.a)([
        [{ a: 1 }, { a: 2 }],
        [{ a: 2 }, { a: 3 }],
        [{ b: 5 }, { a: 5 }],
      ]),
      [{ a: 1 }, { a: 2 }, { a: 3 }, { b: 5 }, { a: 5 }]
    )
  })
  it('empty', async () => {
    assert.deepEqual(
      unionWith((a, b) => a === b)([]),
      [],
    )
  })
  it('behavior on varying types', async () => {
    assert.deepEqual(
      unionWith((a, b) => a.a === b.a)([
        [{ a: 1 }, { a: 2 }],
        [{ a: 2 }, { a: 3 }],
        [5, 6],
      ]),
      [{ a: 1 }, { a: 2 }, { a: 3 }, 5, 6]
    )
  })
  it('throws TypeError on unionWith(nonFunction)', async () => {
    assert.throws(
      () => unionWith('hey'),
      new TypeError('unionWith(f); f is not a binary predicate function')
    )
  })
  it('throws TypeError on unionWith(notBinaryFunction)', async () => {
    assert.throws(
      () => unionWith(a => a),
      new TypeError('unionWith(f); f is not a binary predicate function')
    )
  })
  it('throws TypeError on unionWith(...)(nonArray)', async () => {
    assert.throws(
      () => unionWith((a, b) => true)({}),
      new TypeError('unionWith(...)(x); x is not an Array')
    )
  })
})
