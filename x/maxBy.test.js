const assert = require('assert')
const maxBy = require('./maxBy')
const pipe = require('../pipe')
const map = require('../map')

describe('maxBy', () => {
  it('Finds the item that is the max by a property denoted by path', async () => {
    const array = [{ a: 1 }, { a: 2 }, { a: 3 }]
    const maxItem = maxBy(array, 'a')
    assert.deepEqual(maxItem, { a: 3 })
  })

  it('composes in a lazy way', async () => {
    const numbers = [1, 2, 3]
    const maxItem = pipe(numbers, [
      map(number => number ** 2),
      map(number => ({ a: { b: { c: number } } })),
      maxBy('a.b.c'),
    ])
    assert.deepEqual(maxItem, { a: { b: { c: 9 } } })
  })

  it('returns undefined for empty array', async () => {
    assert.strictEqual(maxBy([], 'a'), undefined)
  })
})
