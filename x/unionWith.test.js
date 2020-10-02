const Mux = require('../monad/Mux')
const assert = require('assert')
const unionWith = require('./unionWith')

const { isSequence } = Mux

describe('unionWith', () => {
  describe('<T any>unionWith(predicate (T, T)=>Promise<boolean>|boolean)(values Array<Sequence<T>|T>|T) -> result Promise<Array<T>>|Array<T>', () => {
    const variadicAsyncPluckStrictEqual = (a, b) => a.a === b.a ? Promise.resolve(true) : false
    const variadicAsyncPluckStrictEqual2 = (a, b) => a.a === b.a ? true : Promise.resolve(false)
    it('create a flattened unique array with uniques given by a binary predicate', async () => {
      assert.deepEqual(
        unionWith((a, b) => a.a === b.a)([
          [{ a: 1 }, { a: 2 }],
          [{ a: 2 }, { a: 3 }],
          [{ b: 5 }, { a: 5 }],
        ]),
        [{ a: 1 }, { a: 2 }, { a: 3 }, { b: 5 }, { a: 5 }]
      )
      assert.deepEqual(
        unionWith((a, b) => a.a === b.a)([
          [{ a: 1 }, { a: 1 }],
          [{ a: 1 }, { a: 1 }],
          [{ a: 1 }, { a: 2 }],
        ]),
        [{ a: 1 }, { a: 2 }]
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
      assert.deepEqual(
        await unionWith(variadicAsyncPluckStrictEqual)([
          [{ a: 1 }, { a: 2 }],
          [{ a: 2 }, { a: 3 }],
          [{ b: 5 }, { a: 5 }],
        ]),
        [{ a: 1 }, { a: 2 }, { a: 3 }, { b: 5 }, { a: 5 }]
      )
      assert.deepEqual(
        await unionWith(variadicAsyncPluckStrictEqual2)([
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
          [5, 6], // 6.a === undefined === 5.a
        ]),
        [{ a: 1 }, { a: 2 }, { a: 3 }, 5]
      )
    })
    it('throws TypeError on unionWith(nonFunction)', async () => {
      assert.throws(
        () => unionWith('hey')([1, 2, 3]),
        new TypeError('comparator is not a function')
      )
    })
    it('throws TypeError on unionWith(...)(nonArray)', async () => {
      assert.throws(
        () => unionWith(() => {})(new Set([1, 2, 3])),
        new TypeError('[object Set] is not an Array')
      )
    })
  })

  describe.skip('<T any>unionWith(predicate (T, T)=>Promise<boolean>|boolean)(values Set<Sequence<T>|T>|T) -> result Promise<Set<T>>|Set<T>', () => {
    it('predicate () => false; values Set<[1, 2, 3]>; result Set<[1, 2, 3]>', async () => {
      assert.deepEqual(
        unionWith(() => false)(new Set([1, 2, 3])),
        new Set([1, 2, 3]),
      )
    })
    it('predicate () => true; values Set<[1, 2, 3]>; result Set<[1]>', async () => {
      assert.deepEqual(
        unionWith(() => true)(new Set([1, 2, 3])),
        new Set([1]),
      )
    })
    it('predicate async () => false; values Set<[1, 2, 3]>; result Promise<Set<[1, 2, 3]>>', async () => {
      const p = unionWith(async () => false)(new Set([1, 2, 3]))
      assert(p instanceof Promise)
      const result = await p
      assert.deepEqual(result, new Set([1, 2, 3]))
    })
    it('predicate item => item.name; values Set<[{...}, {...}, {...}]>; result Promise|<Set<[{...}, {...}]>>', async () => {
      const people = new Set([{ name: 'George' }, { name: 'George' }, { name: 'Jim' }])
      const result = unionWith((personA, personB) => personA.name === personB.name)(people)
      assert.deepEqual(result, new Set([{ name: 'George' }, { name: 'Jim' }]))
      {
        const p = unionWith(async (personA, personB) => personA.name === personB.name)(people)
        assert(p instanceof Promise)
        const result = await p
        assert.deepEqual(result, new Set([{ name: 'George' }, { name: 'Jim' }]))
      }
    })
    it('predicate () => false; values Set<[[1], 2, [3]]>; result Set<[1, 2, 3]>', async () => {
      assert.deepEqual(
        unionWith(() => false)(new Set([[1], 2, [3]])),
        new Set([1, 2, 3]),
      )
    })
    it('predicate () => false; values Set<[1, [2], 3]>; result Set<[1, 2, 3]>', async () => {
      assert.deepEqual(
        unionWith(() => false)(new Set([1, [2], 3])),
        new Set([1, 2, 3]),
      )
    })
    xit('predicate () => false; values Set<[asyncGeneratorFunc, asyncGeneratorFunc, asyncGeneratorFunc]>; result Set<[1, 2, 3, 1, 2, 3, 1, 2, 3]>', async () => {
      const asyncNumbers = async function*(){ yield 1; yield 2; yield 3 }
      assert(
        unionWith(() => false)([asyncNumbers, asyncNumbers, asyncNumbers]) instanceof Promise
      )
      assert.deepEqual(
        await unionWith(() => false)([asyncNumbers, asyncNumbers, asyncNumbers]),
        [1, 2, 3, 1, 2, 3, 1, 2, 3],
      )
      assert.deepEqual(
        await unionWith(() => false)(new Set([asyncNumbers, asyncNumbers, asyncNumbers])),
        new Set([1, 2, 3]),
      )
    })
  })

  describe.skip('<T any>unionWith(predicate (T, T)=>boolean)(values SyncSequence<SyncSequence<T>|T>|T) -> result Iterator<T>', () => {
    it('predicate () => false; values [GeneratorFunction, GeneratorFunction, 5, 5, 5]; result [1, 2, 3, 1, 2, 3, 5, 5, 5]', async () => {
      const numbersGeneratorFunc = function*() { yield 1; yield 2; yield 3 }
      const subject = unionWith(() => false)([numbersGeneratorFunc, numbersGeneratorFunc, 5, 5, 5])
      assert.deepEqual(subject, [1, 2, 3, 1, 2, 3, 5, 5, 5])
    })
    it('predicate () => false; values GeneratorFunction<>; result Iterator<>', async () => {
      const numbersGeneratorFunc = function*() { yield 1; yield 2; yield 3 }
      const subject = unionWith(() => false)(function*(){})
      const arr = [...subject]
      assert.deepEqual(arr, [])
    })
    it('predicate () => false; values GeneratorFunction<[1, 2, 3]>; result Iterator<[1, 2, 3]>', async () => {
      const oneGeneratorFunc = function*() { yield 1; yield 1; yield 1 }
      const subject = unionWith((a, b) => a == b)(oneGeneratorFunc)
      const arr = [...subject]
      assert.deepEqual(arr, [1])
    })
    it('predicate () => false; values GeneratorFunction<[GeneratorFunction, GeneratorFunction, 5, 5, 5]>; result [1, 2, 3, 1, 2, 3, 5, 5, 5]', async () => {
      const numbersGeneratorFunc = function*() { yield 1; yield 2; yield 3 }
      const gen = function*() { yield numbersGeneratorFunc; yield numbersGeneratorFunc; yield* [5, 5, 5] }
      const subject = unionWith(() => false)(gen)
      assert(isSequence(subject))
      const arr = [...subject]
      assert.deepEqual(arr, [1, 2, 3, 1, 2, 3, 5, 5, 5])
    })
  })

  describe.skip('<T any>unionWith(predicate (T, T)=>Promise<boolean>|boolean)(values Sequence<Sequence<T>|T>|T) -> result AsyncIterator<T>', () => {
    it('predicate () => false; values [AsyncGeneratorFunction, GeneratorFunction, 5, 5, 5]; result Promise<[1, 2, 3, 1, 2, 3, 5, 5, 5]>', async () => {
      const numbersGeneratorFunc = function*() { yield 1; yield 2; yield 3 }
      const numbersAsyncGeneratorFunc = async function*() { yield 1; yield 2; yield 3 }
      const gen = async function*() { yield numbersAsyncGeneratorFunc; yield numbersGeneratorFunc; yield* [5, 5, 5] }
      {
        const p = unionWith(() => false)([numbersAsyncGeneratorFunc, numbersGeneratorFunc, 5, [5, 5]])
        assert(p instanceof Promise)
        const subject = await p
        const arr = [...subject]
        assert.deepEqual(arr, [1, 2, 3, 1, 2, 3, 5, 5, 5])
      }
      {
        const p = unionWith(() => Promise.resolve(false))([numbersAsyncGeneratorFunc, numbersGeneratorFunc, 5, [5, 5]])
        assert(p instanceof Promise)
        const subject = await p
        const arr = [...subject]
        assert.deepEqual(arr, [1, 2, 3, 1, 2, 3, 5, 5, 5])
      }
      {
        const subject = unionWith(() => Promise.resolve(false))(gen)
        const arr = []
        for await (const item of subject) arr.push(item)
        assert.deepEqual(arr, [1, 2, 3, 1, 2, 3, 5, 5, 5])
      }
      {
        const p = unionWith(() => Promise.resolve(false))([async function*(){}])
        assert(p instanceof Promise)
        const subject = await p
        assert.deepEqual(subject, [])
      }
    })
    it('predicate () => false; values AsyncGeneratorFunction<[AsyncGeneratorFunction, GeneratorFunction, 5, 5, 5]>; result AsyncIterator<[1, 2, 3, 1, 2, 3, 5, 5, 5]>', async () => {
      const numbersGeneratorFunc = function*() { yield 1; yield 2; yield 3 }
      const numbersAsyncGeneratorFunc = async function*() { yield 1; yield 2; yield 3 }
      const gen = async function*() { yield numbersAsyncGeneratorFunc; yield numbersGeneratorFunc; yield* [5, 5, 5] }
      const subject = unionWith(() => false)(gen)
      const arr = []
      for await (const item of subject) arr.push(item)
      assert.deepEqual(arr, [1, 2, 3, 1, 2, 3, 5, 5, 5])
      {
        const subject = unionWith(async () => true)(gen)
        const arr = []
        for await (const item of subject) arr.push(item)
        assert.deepEqual(arr, [1])
      }
    })
    it('unionWith(() => false)(emptyAsyncIterator)', async () => {
      const gen = async function*() {}
      const subject = unionWith(() => false)(gen)
      const arr = []
      for await (const item of subject) arr.push(item)
      assert.deepEqual(arr, [])
    })
  })

  describe.skip('misc', () => {
    it('unionWith(NaN)', async () => {
      assert(typeof unionWith(NaN) == 'function')
    })
    it('unionWith([])', async () => {
      assert(typeof unionWith([]) == 'function')
    })
    it('unionWith({})', async () => {
      assert(typeof unionWith({}) == 'function')
    })
    it('unionWith(undefined)', async () => {
      assert(typeof unionWith(undefined) == 'function')
    })
    it('unionWith(null)', async () => {
      assert(typeof unionWith(null) == 'function')
    })
    it('unionWith(predicate)(NaN)', async () => {
      const subject = unionWith(() => true)(NaN)
      assert(isSequence(subject))
      const arr = [...subject]
      assert.equal(arr.length, 1)
      assert(isNaN(arr[0]))
    })
    it('unionWith(predicate)([]); []', async () => {
      const subject = unionWith(() => true)([])
      assert.deepEqual(subject, [])
    })
    it('unionWith(predicate)({}); Iterator<{}>', async () => {
      const subject = unionWith(() => true)({})
      assert(isSequence(subject))
      const arr = [...subject]
      assert.deepEqual(arr, [{}])
    })
    it('unionWith(predicate)(undefined); []', async () => {
      const subject = unionWith(() => true)(undefined)
      assert(isSequence(subject))
      const arr = [...subject]
      assert.deepEqual(arr, [])
    })
    it('unionWith(predicate)(null); []', async () => {
      const subject = unionWith(() => true)(null)
      assert(isSequence(subject))
      const arr = [...subject]
      assert.deepEqual(arr, [])
    })
    xit('unionWith(asyncPredicate)([emptyAsyncGeneratorFunction])', async () => {
      const p = unionWith(() => Promise.resolve(false))([async function*(){}])
      assert(p instanceof Promise)
      const subject = await p
      assert.deepEqual(subject, [])
    })
  })
})
