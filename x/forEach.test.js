const assert = require('assert')
const util = require('util')
const funcConcatSync = require('../_internal/funcConcatSync')
const async = require('../_internal/async')
const asyncIteratorToArray = require('../_internal/asyncIteratorToArray')
const genericReduce = require('../_internal/genericReduce')
const forEach = require('./forEach')

describe('forEach', () => {
  describe(`
   Reducer<T> = (any, T)=>Promise|any

   var T any,
     callback T=>(),
     collection Iterable<T>|AsyncIterable<T>{ forEach: callback=>() }|Object<T>
     
   forEach(callback)(collection) -> ()
  `,
  () => {
    it('collection Array testing promises', async () => {
      let total = 0
      const addTotal = number => (total += number),
        variadicAsyncAddTotal = number => number % 2 == 1 ? (total += number) : Promise.resolve(total += number)
      forEach(addTotal)([1, 2, 3, 4, 5])
      assert.strictEqual(total, 15)
      total = 0
      const operation = forEach(async(addTotal))([1, 2, 3, 4, 5])
      assert(typeof operation.then == 'function')
      await operation
      assert.strictEqual(total, 15)
    })

    let total = 0
    const addTotal = number => (total += number),
      variadicAsyncAddTotal = number => number % 2 == 1 ? (total += number) : Promise.resolve(total += number)

    const ThunkAssertion = (
      func, value, asserter,
    ) => function thunkAssertion() {
      it(`${func.name}(${util.inspect(value)}) - ${asserter}`, async () => {
        await asserter(await func(value))
      })
    }

    const numbersGenerator = function* () {
      yield 1; yield 2; yield 3; yield 4; yield 5
    }
    const numbersAsyncGenerator = async function* () {
      yield 1; yield 2; yield 3; yield 4; yield 5
    }

    const thunkAssertions = [
      ThunkAssertion(forEach(addTotal), [1, 2, 3, 4, 5], result => {
        assert.deepEqual(result, [1, 2, 3, 4, 5])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(async(addTotal)), [1, 2, 3, 4, 5], result => {
        assert.deepEqual(result, [1, 2, 3, 4, 5])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(variadicAsyncAddTotal), [1, 2, 3, 4, 5], result => {
        assert.deepEqual(result, [1, 2, 3, 4, 5])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(addTotal), numbersGenerator(), result => {
        assert.deepEqual([...result], [])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(async(addTotal)), numbersGenerator(), result => {
        assert.deepEqual([...result], [])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(variadicAsyncAddTotal), numbersGenerator(), result => {
        assert.deepEqual([...result], [])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(addTotal), numbersAsyncGenerator(), async result => {
        assert.deepEqual(await asyncIteratorToArray(result), [])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(async(addTotal)), numbersAsyncGenerator(), async result => {
        assert.deepEqual(await asyncIteratorToArray(result), [])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(variadicAsyncAddTotal), numbersAsyncGenerator(), async result => {
        assert.deepEqual(await asyncIteratorToArray(result), [])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(addTotal), numbersGenerator, result => {
        assert.deepEqual([...result()], [])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(async(addTotal)), numbersGenerator, result => {
        assert.deepEqual([...result()], [])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(variadicAsyncAddTotal), numbersGenerator, result => {
        assert.deepEqual([...result()], [])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(addTotal), numbersAsyncGenerator, async result => {
        assert.deepEqual(await asyncIteratorToArray(result()), [])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(async(addTotal)), numbersAsyncGenerator, async result => {
        assert.deepEqual(await asyncIteratorToArray(result()), [])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(variadicAsyncAddTotal), numbersAsyncGenerator, async result => {
        assert.deepEqual(await asyncIteratorToArray(result()), [])
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(addTotal), { a: 1, b: 2, c: 3, d: 4, e: 5 }, result => {
        assert.deepEqual(result, { a: 1, b: 2, c: 3, d: 4, e: 5 })
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(async(addTotal)), { a: 1, b: 2, c: 3, d: 4, e: 5 }, result => {
        assert.deepEqual(result, { a: 1, b: 2, c: 3, d: 4, e: 5 })
        assert.strictEqual(total, 15)
        total = 0
      }),
      ThunkAssertion(forEach(variadicAsyncAddTotal), { a: 1, b: 2, c: 3, d: 4, e: 5 }, result => {
        assert.deepEqual(result, { a: 1, b: 2, c: 3, d: 4, e: 5 })
        assert.strictEqual(total, 15)
        total = 0
      }),
    ]

    thunkAssertions.forEach(thunk => thunk())

    it('forEach(noop)({ forEach: function })', async () => {
      const forEachable = {
        forEach() {
          return 1
        },
      }
      assert.strictEqual(forEach(noop)(forEachable), 1)
    })

    it('reduce(forEach(func)(reducer))', async () => {
      let total = 0
      const add = (a, b) => a + b
      const numbers = [1, 2, 3, 4, 5]
      assert.strictEqual(
        numbers.reduce(forEach(number => (total += number))(add), 0),
        15)
      assert.strictEqual(total, 15)
    })
    it('reduce(forEach(asyncFunc)(reducer))', async () => {
      let total = 0
      const add = (a, b) => a + b
      const numbers = [1, 2, 3, 4, 5]
      assert.strictEqual(
        await genericReduce([numbers], forEach(async number => (total += number))(add), 0),
        15)
      assert.strictEqual(total, 15)
    })

    const noop = function () {}
    it('forEach(noop)(1)', async () => {
      assert.strictEqual(forEach(noop)(1), 1)
    })
    it('forEach(noop)(null)', async () => {
      assert.strictEqual(forEach(noop)(null), null)
    })
    it('forEach(noop)(undefined)', async () => {
      assert.strictEqual(forEach(noop)(undefined), undefined)
    })
    it('forEach(noop)()', async () => {
      assert.strictEqual(forEach(noop)(), undefined)
    })
  })

  describe('v1.5 regression', () => {
    it('execute a function for each item of a collection, returning the collection', async () => {
      let total = 0
      assert.deepEqual(
        forEach(number => total += number)([1, 2, 3]),
        [1, 2, 3],
      )
      assert.strictEqual(total, 6)
    })
    it('works in transducer position', async () => {
      let total = 0
      assert.deepEqual(
        [1, 2, 3].reduce(
          forEach(number => total += number)((a, b) => a.concat([b])),
          [],
        ),
        [1, 2, 3],
      )
      assert.strictEqual(total, 6)
      assert.deepEqual(
        [1, 2, 3].reduce(
          forEach(console.log)((a, b) => a + b),
          0,
        ),
        6,
      )
    })
  })
})
