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

  const is3 = number => number == 3
  const async = func => async function asyncFunc(...args) {
    return func(...args)
  }
  const variadicAsyncIs3 = number => number == 3 ? Promise.resolve(true) : false
  const variadicAsyncIs3_ = number => number == 3 ? true : Promise.resolve(false)
  it('Array<T>', async () => {
    assert.strictEqual(find(is3)([1, 2, 3, 4, 5]), 3)
    assert.strictEqual(await find(async(is3))([1, 2, 3, 4, 5]), 3)
    assert.strictEqual(await find(variadicAsyncIs3)([1, 2, 3, 4, 5]), 3)
    assert.strictEqual(await find(variadicAsyncIs3_)([1, 2, 3, 4, 5]), 3)
  })
  it('Iterator<T>', async () => {
    const NumbersGenerator = function* () { for (let i = 1; i <= 5; i++) yield i }
    assert.strictEqual(find(is3)(NumbersGenerator()), 3)
    assert.strictEqual(await find(async(is3))(NumbersGenerator()), 3)
  })
  it('AsyncIterator<T>', async () => {
    const AsyncNumbersGenerator = async function* () { for (let i = 1; i <= 5; i++) yield i }
    const emptyAsyncGenerator = async function* () {}
    assert.strictEqual(await find(is3)(AsyncNumbersGenerator()), 3)
    assert.strictEqual(await find(async(is3))(AsyncNumbersGenerator()), 3)
    assert.strictEqual(await find(is3)(emptyAsyncGenerator()), undefined)
    assert.strictEqual(await find(async(is3))(emptyAsyncGenerator()), undefined)
  })
  it('{ find: function }', async () => {
    const implementsFind = { find: () => 'hey' }
    assert.strictEqual(find(is3)(implementsFind), 'hey')
  })
  it('Object<T>', async () => {
    const numbersObject = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    assert.strictEqual(find(is3)(numbersObject), 3)
    assert.strictEqual(await find(async(is3))(numbersObject), 3)
  })
  it('null', async () => {
    assert.strictEqual(find(is3)(null), undefined)
  })
  it('undefined', async () => {
    assert.strictEqual(find(is3)(undefined), undefined)
  })
  it('1', async () => {
    assert.strictEqual(find(is3)(1), undefined)
  })
})
