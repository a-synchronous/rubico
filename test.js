const Test = require('thunk-test')
const assert = require('assert')
const stream = require('stream')
const path = require('path')
const fs = require('fs')
const { Readable, Writable } = require('stream')
const util = require('util')
const Transducer = require('./Transducer')
const rubico = require('./rubico')
const isDeepEqual = require('./x/isDeepEqual')
const mapFrom = require('./_internal/mapFrom')
const sha256 = require('./_internal/sha256')

const {
  pipe, compose, tap,
  tryCatch, switchCase,
  all, assign, get, set, pick, omit,
  map, filter, flatMap, forEach, reduce, transform,
  some, every, and, or, not,
  eq, gt, lt, gte, lte,
  thunkify, always,
  curry, __,
} = rubico

const objectProto = Object.prototype

const symbolAsyncIterator = Symbol.asyncIterator

const nativeObjectToString = objectProto.toString

const objectToString = x => nativeObjectToString.call(x)

const ase = assert.strictEqual

const ade = assert.deepEqual

const aok = assert.ok

const sleep = ms => new Promise(resolve => { setTimeout(resolve, ms) })

const hi = x => `${x}hi`

const ho = x => `${x}ho`

const isOdd = x => (x % 2 === 1)

const square = x => x ** 2

const arrayOf = (getter, length) => Array.from(
  { length },
  typeof getter === 'function' ? getter : () => getter,
)

const async = func => async function asyncFunc(...args) {
  return func(...args)
}

const delay = (func, ms) => async function delayed(...args) {
  await new Promise(resolve => setTimeout(resolve, ms))
  return func(...args)
}

const asyncIsEven = x => new Promise(resolve => {
  setImmediate(() => resolve(x % 2 === 0))
})

const asyncHey = x => new Promise(resolve => {
  setImmediate(() => resolve(`${x}hey`))
})

const asyncMult = (y, xi) => new Promise(resolve => {
  setImmediate(() => resolve(y * xi))
})

const constructReadStream = iterable => {
  const y = new stream.Readable({ objectMode: true })
  y._read = () => {}
  for (const x of iterable) y.push(x)
  y.push(null)
  return y
}

const readStreamToArray = readStream => new Promise((resolve, reject) => {
  let result = ''
  readStream.on('data', chunk => (result += chunk))
  readStream.on('end', () => resolve(result))
  readStream.on('error', reject)
})

const consumeReadStreamPush = s => new Promise((resolve, reject) => {
  let y = ''
  s.on('data', chunk => { y += chunk })
  s.on('end', () => resolve(y))
  s.on('error', err => reject(err))
})

const consumeReadStreamPull = s => new Promise((resolve, reject) => {
  let y = ''
  s.on('readable', () => {
    let chunk = s.read()
    while (chunk != null) {
      y += `${chunk}`
      chunk = s.read()
    }
  })
  s.on('end', () => resolve(y))
  s.on('error', err => reject(err))
})

const makeNumbers = function*() {
  for (let i = 0; i < 5; i++) yield i + 1
}

const makeAsyncNumbers = async function*() {
  for (let i = 0; i < 5; i++) yield i + 1
}

const iteratorToArray = x => {
  let isAsync = false
  const y = []
  for (const xi of x) {
    if (xi instanceof Promise) isAsync = true
    y.push(xi)
  }
  return isAsync ? Promise.all(y) : y
}

const asyncIteratorToArray = async x => {
  const y = []
  for await (const xi of x) y.push(xi)
  return y
}

const typedArrayConstructors = [
  Uint8ClampedArray,
  Uint8Array, Int8Array,
  Uint16Array, Int16Array,
  Uint32Array, Int32Array,
  Float32Array, Float64Array,
  BigUint64Array, BigInt64Array,
]

const numberTypedArrayConstructors = [
  Uint8ClampedArray,
  Uint8Array, Int8Array,
  Uint16Array, Int16Array,
  Uint32Array, Int32Array,
  Float32Array, Float64Array,
]

const bigIntTypedArrayConstructors = [
  BigUint64Array, BigInt64Array,
]

const AssertionError = function (message) {
  this.message = message
  this.stack = new Error().stack
}

/* Assertion.test(reduce(add, 0), {
  args: { 0: [1, 2, 3, 4, 5] },
  result: 15,
}) */

const prettify = value => JSON.stringify(value, null, 2)

const Assertion = (func, result, ...args) => async function test() {
  const evaluatedResult = await func(...args)
  if (isDeepEqual(result, evaluatedResult)) {
    return undefined
  }
  throw new AssertionError(`
${func.toString()}

args - ${prettify(args)}

expected - ${prettify(result)}

actual - ${prettify(evaluatedResult)}
`)
}

const binaryToReadableStream = function (binary) {
  return new Readable({
    read() {
      this.push(binary)
      this.push(null)
    },
  })
}

const arrayToObjectReadableStream = function (array) {
  return new Readable({
    objectMode: true,
    read() {
      for (const item of array) {
        this.push(item)
      }
      this.push(null)
    },
  })
}

const MockWritable = function (array = []) {
  Writable.call(this)
  this.array = array
  this.handlers = new Map()
}

MockWritable.prototype = {
  write(chunk, encoding, callback) {
    this.array.push(chunk)
  },
  on(eventName, handler) {
    if (this.handlers.has(eventName)) {
      this.handlers.get(eventName).push(handler)
    } else {
      this.handlers.set(eventName, [handler])
    }
  },
  once(eventName, handler) {
    this.handlers.set(eventName, [handler])
  },
  emit(eventName, ...args) {
    if (!this.handlers.has(eventName)) {
      return undefined
    }
    return this.handlers.get(eventName).map(handler => handler(...args))
  }
}

const MockDuplexStream = function (values) {
  MockWritable.call(this)
  this.values = [...values]
}

MockDuplexStream.prototype = {
  ...MockWritable.prototype,
  async* [symbolAsyncIterator]() {
    for (const item of this.values) {
      yield item
    }
  },
}

const AsyncMockFoldable = function (values) {
  this.values = values
}

AsyncMockFoldable.prototype = {
  async reduce(reducer, init) {
    return this.values.reduce(reducer, init)
  },
}

const MockFoldable = function (values) {
  this.values = values
}

MockFoldable.prototype = {
  reduce(reducer, init) {
    return this.values.reduce(reducer, init)
  },
}

describe('rubico', () => {
  describe('pipe', () => {
    it('behaves eagerly when passed any amount of arguments before the array of functions', async () => {
      const array = pipe(1, 2, 3, [
        Array.of,
        numbers => numbers.map(number => number * 3),
      ])
      assert.deepEqual(array, [3, 6, 9])
    })
    it('behaves eagerly and resolves any amount of Promise arguments before the array of functions', async () => {
      const array = await pipe(Promise.resolve(1), 2, Promise.resolve(3), [
        Array.of,
        numbers => numbers.map(number => number * 3),
      ])
      assert.deepEqual(array, [3, 6, 9])
    })
    it('chains async and regular functions together', async () => {
      ase(await pipe([hi, ho, asyncHey])('yo'), 'yohihohey')
    })
    it('does something without arguments', async () => {
      ase(await pipe([hi, ho, asyncHey])(), 'undefinedhihohey')
    })
    it('chaining one fn is the same as just calling that fn', async () => {
      ase(await pipe([asyncHey])('yo'), await asyncHey('yo'))
    })
    it('returns the raw value (no promise required) if all functions are sync', async () => {
      ase(pipe([hi, hi, hi])('yo'), 'yohihihi')
    })
    it('returns a promise if any fns async', async () => {
      aok(pipe([hi, hi, hi, asyncHey])('yo') instanceof Promise)
    })
    it('pipe(Array<GeneratorFunction>)(Generator)', async () => {
      const numbersGen = function* () {
        yield 1; yield 2; yield 3; yield 4; yield 5
      }
      const isOddGen = function* (iter) {
        for (const item of iter) {
          if (item % 2 == 1) yield item
        }
      }
      const squareGen = function* (iter) {
        for (const item of iter) {
          yield item ** 2
        }
      }
      const iter = pipe([isOddGen, squareGen])(numbersGen())
      const arr = [...iter]
      assert.deepEqual(arr, [1, 9, 25])
    })
    it('pipe(Array<AsyncGeneratorFunction>)(AsyncGenerator)', async () => {
      const asyncNumbersGen = async function* () {
        yield 1; yield 2; yield 3; yield 4; yield 5
      }
      const isOddGen = async function* (iter) {
        for await (const item of iter) {
          if (item % 2 == 1) yield item
        }
      }
      const squareGen = async function* (iter) {
        for await (const item of iter) {
          yield item ** 2
        }
      }
      const iter = pipe([isOddGen, squareGen])(asyncNumbersGen())
      const arr = []
      for await (const item of iter) arr.push(item)
      assert.deepEqual(arr, [1, 9, 25])
    })
    it('throws a TypeError if first argument not an array', async () => {
      assert.throws(
        () => {
          pipe(() => 1, undefined, () => 2)()
        },
        new TypeError('funcs.reduce is not a function')
      )
    })
    it('throws a TypeError if passed less than one function', async () => {
      assert.throws(
        () => pipe([])(),
        new TypeError('Reduce of empty array with no initial value'),
      )
    })
    it('throws a TypeError if any arguments are not a function', async () => {
      assert.throws(
        () => {
          pipe([() => 1, undefined, () => 2])()
        },
        new TypeError('funcB is not a function'),
      )
    })
    it('handles sync errors', async () => {
      assert.throws(
        () => pipe([hi, hi, x => { throw new Error(`throwing ${x}`) }])('yo'),
        new Error('throwing yohihi'),
      )
    })
    it('handles async errors', async () => {
      assert.rejects(
        () => pipe([hi, asyncHey, x => { throw new Error(`throwing ${x}`) }])('yo'),
        new Error('throwing yohihey'),
      )
    })
  })

  describe('compose', () => {
    it('chains functions in reverse', async () => {
      ade(
        compose([1, 2, 3, 4, 5], [
          map(number => number ** 2),
          map(number => number + 2),
          filter(number => number % 2 == 1)
        ]),
        [9, 25, 49],
      )

      ade(
        compose([
          map(number => number ** 2),
          map(number => number + 2),
          filter(number => number % 2 == 1)
        ])([1, 2, 3, 4, 5]),
        [9, 25, 49],
      )

      ade(
        await compose([
          map(async number => number ** 2),
          map(number => number + 2),
          filter(async number => number % 2 == 1)
        ])([1, 2, 3, 4, 5]),
        [9, 25, 49],
      )

      ade(
        await compose(Promise.resolve([1, 2, 3, 4, 5]), [
          map(number => number ** 2),
          map(number => number + 2),
          filter(number => number % 2 == 1)
        ]),
        [9, 25, 49],
      )
    })
  })

  describe('all', () => {
    it('API coverage', async () => {
      ade(
        all(1, 2, 3, [
          Array.of,
          Array.of,
          Array.of,
        ]),
        [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
        ],
      )

      ade(
        all([
          Array.of,
          Array.of,
          Array.of,
        ])(1, 2, 3),
        [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
        ],
      )

      ade(
        await all(Promise.resolve(1), 2, Promise.resolve(3), [
          Array.of,
          Array.of,
          Array.of,
        ]),
        [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
        ],
      )

      ade(
        all(1, 2, 3, {
          a: Array.of,
          b: Array.of,
          c: Array.of,
        }),
        {
          a: [1, 2, 3],
          b: [1, 2, 3],
          c: [1, 2, 3],
        },
      )

      ade(
        all({
          a: Array.of,
          b: Array.of,
          c: Array.of,
        })(1, 2, 3),
        {
          a: [1, 2, 3],
          b: [1, 2, 3],
          c: [1, 2, 3],
        },
      )

      ade(
        await all(Promise.resolve(1), 2, Promise.resolve(3), {
          a: Array.of,
          b: Array.of,
          c: Array.of,
        }),
        {
          a: [1, 2, 3],
          b: [1, 2, 3],
          c: [1, 2, 3],
        },
      )
    })
    it('maps input to array of sync functions', async () => {
      ade(all([hi, hi, hi])('yo'), ['yohi', 'yohi', 'yohi'])
    })
    it('maps input to object of sync functions', async () => {
      ade(
        all({ a: hi, b: hi, c: hi })('yo'),
        { a: 'yohi', b: 'yohi', c: 'yohi' },
      )
    })
    it('maps input to array of async functions', async () => {
      aok(all([asyncHey, asyncHey, asyncHey])('yo') instanceof Promise)
      ade(
        await all([asyncHey, asyncHey, asyncHey])('yo'),
        ['yohey', 'yohey', 'yohey'],
      )
    })
    it('maps input to object of async functions', async () => {
      aok(all({ a: asyncHey, b: asyncHey, c: asyncHey })('yo') instanceof Promise)
      ade(
        await all({ a: asyncHey, b: asyncHey, c: asyncHey })('yo'),
        { a: 'yohey', b: 'yohey', c: 'yohey' },
      )
    })
    it('any functions async => Promise', async () => {
      aok(all([asyncHey, asyncHey, hi])('yo') instanceof Promise)
      ade(
        await all([asyncHey, asyncHey, hi])('yo'),
        ['yohey', 'yohey', 'yohi'],
      )
    })
    it('all([])() -> []', async () => {
      ade(all([])(), [])
      ade(all([])('hey'), [])
    })
    it('all({})() -> {}', async () => {
      ade(all({})(), {})
      ade(all({})('hey'), {})
    })
    it('TypeError for all([\'hey\'])()', async () => {
      assert.throws(
        () => all(['hey'])(),
        new TypeError('funcs[funcsIndex] is not a function'),
      )
    })
    it('throws TypeError for all({ a: nonFunction })', async () => {
      assert.throws(
        () => all({ a: 'hey' })(),
        new TypeError('funcs[key] is not a function'),
      )
    })
    it('throws TypeError for String', async () => {
      assert.throws(
        () => all('ayelmao')(),
        new TypeError('funcs[key] is not a function'),
      )
    })
    it('{} for Set<[func]>; no functions exposed via in', async () => {
      assert.deepEqual(all(new Set([() => 'yo']))('hey'), {})
    })
    it('{} for Map<[[1, func]]>', async () => {
      assert.deepEqual(all(new Map([[1, () => 'yo']]))('hey'), {})
    })
  })

  describe('all.series', () => {
    it('API coverage', async () => {
      ade(
        all.series(1, 2, 3, [
          Array.of,
          Array.of,
          Array.of,
        ]),
        [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
        ],
      )

      ade(
        all.series([
          Array.of,
          Array.of,
          Array.of,
        ])(1, 2, 3),
        [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
        ],
      )

      ade(
        await all.series(Promise.resolve(1), 2, Promise.resolve(3), [
          Array.of,
          Array.of,
          Array.of,
        ]),
        [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
        ],
      )
    })

    it('evaluates input against array of functions in series (sync)', async () => {
      const arr = []
      ade(
        all.series([
          () => { arr.push(1); return 'a' },
          () => { arr.push(2); return 'b' },
          () => { arr.push(3); return 'c' },
        ])(),
        ['a', 'b', 'c']
      )
      ade(arr, [1, 2, 3])
    })
    it('evaluates input against array of functions in series (async)', async () => {
      const arr = []
      const staggeredPush = all.series([
        () => sleep(10).then(() => { arr.push(1); return 'a' }),
        () => sleep(5).then(() => { arr.push(2); return 'b' }),
        () => { arr.push(3); return 'c' },
      ])()
      aok(staggeredPush instanceof Promise)
      ade(await staggeredPush, ['a', 'b', 'c'])
      ade(arr, [1, 2, 3])
      const arr2 = []
      const parallelPush = all([
        () => sleep(10).then(() => { arr2.push(1); return 'a' }),
        () => sleep(5).then(() => { arr2.push(2); return 'b' }),
        () => { arr2.push(3); return 'c' },
      ])()
      aok(parallelPush instanceof Promise)
      ade(await parallelPush, ['a', 'b', 'c'])
      ade(arr2, [3, 2, 1])
    })
    it('throws TypeError for all([])', async () => {
      assert.deepEqual(all.series([])(), [])
    })
    it('throws TypeError for all([nonFunction])', async () => {
      assert.throws(
        () => all.series(['hey'])(),
        new TypeError('funcs[funcsIndex] is not a function')
      )
    })
  })

  describe('assign', () => {
    it('API coverage', async () => {
      ade(assign({}, {
        a: () => 1,
        b: () => 2,
        c: () => 3,
      }), { a: 1, b: 2, c: 3 })

      ade(assign({
        a: () => 1,
        b: () => 2,
        c: () => 3,
      })({}), { a: 1, b: 2, c: 3 })

      ade(await assign(Promise.resolve({}), {
        a: () => 1,
        b: () => 2,
        c: () => 3,
      }), { a: 1, b: 2, c: 3 })
    })
    it('maps input to object of sync functions then merges', async () => {
      ade(
        assign({
          b: x => `${x.a}yo`,
          c: x => `${x.a}yaya`,
        })({ a: 'a' }),
        { a: 'a', b: 'ayo', c: 'ayaya' },
      )
    })
    it('maps input to object of async functions then merges', async () => {
      aok(assign({
        b: async x => `${x.a}yo`,
        c: async x => `${x.a}yaya`,
      })({ a: 'a' }) instanceof Promise)
      ade(
        await assign({
          b: async x => `${x.a}yo`,
          c: async x => `${x.a}yaya`,
        })({ a: 'a' }),
        { a: 'a', b: 'ayo', c: 'ayaya' },
      )
    })
    it('assign(Set)(nonObject) -> {}', async () => {
      assert.deepEqual(assign(new Set(['hey']))(), {})
    })
    it('assign(...)(string) -> { 0: s, 1: t, ... }', async () => {
      assert.deepEqual(
        assign({ a: value => value })('hi'),
        { '0': 'h', '1': 'i', a: 'hi' },
      )
    })
  })

  describe('tap', () => {
    it('[sync] calls a provided function with input, returning input', async () => {
      ase(tap(x => x + 1)(1), 1)
    })
    it('[async] calls a provided function with input, returning input', async () => {
      aok(tap(async x => x + 1)(1) instanceof Promise)
      ase(await tap(async x => x + 1)(1), 1)
    })
    it('multiple arguments', async () => {
      const array = []
      const point = tap((...args) => (array.push(...args)))(1, 2, 3, 4, 5)
      assert.strictEqual(point, 1)
      assert.deepEqual(array, [1, 2, 3, 4, 5])
    })
    it('throws a TypeError if passed a non function', async () => {
      assert.throws(
        () => tap('hey')(),
        new TypeError('func is not a function'),
      )
    })
  })

  describe('tap.if', () => {
    describe('tap.if(condition, f); conditional tap; only calls fn on truthy condition', () => {
      it('sync', async () => {
        const isOdd = x => x % 2 === 1
        const oddNumbers = []
        const pushOddNumbers = number => oddNumbers.push(number)
        const numbers = [1, 2, 3, 4, 5]
        numbers.forEach(number => {
          assert.strictEqual(tap.if(isOdd, pushOddNumbers)(number), number)
        })
        assert.deepEqual(oddNumbers, [1, 3, 5])
      })
      it('async', async () => {
        const isOdd = x => x % 2 === 1
        const oddNumbers = []
        const pushOddNumbers = number => oddNumbers.push(number)
        const numbers = [1, 2, 3, 4, 5]
        for (const number of numbers) {
          assert.strictEqual(await tap.if(async(isOdd), pushOddNumbers)(number), number)
        }
        assert.deepEqual(oddNumbers, [1, 3, 5])
        for (const number of numbers) {
          assert.strictEqual(await tap.if(isOdd, delay(pushOddNumbers, 10))(number), number)
        }
        assert.deepEqual(oddNumbers, [1, 3, 5, 1, 3, 5])
      })
    })
  })

  describe('tryCatch', () => {
    it('behaves eagerly when supplied any amount of arguments before the tryer and catcher', async () => {
      const add = (a, b) => a + b

      let sum = null

      tryCatch(1, 2, 3, function throwSum(...numbers) {
        const sum = numbers.reduce(add)
        throw new Error(`${sum}`)
      }, function logErrorMessage(error) {
        sum = Number(error.message)
      })

      assert.equal(sum, 6)
    })

    it('behaves eagerly when supplied any amount of Promise arguments before the tryer and catcher', async () => {
      const add = (a, b) => a + b

      let sum = null

      await tryCatch(Promise.resolve(1), 2, Promise.resolve(3), function throwSum(...numbers) {
        const sum = numbers.reduce(add)
        throw new Error(`${sum}`)
      }, function logErrorMessage(error) {
        sum = Number(error.message)
      })

      assert.equal(sum, 6)
    })

    it('async eager tryCatch', async () => {
      const add = (a, b) => a + b

      let sum = null

      await tryCatch(1, 2, 3, async function throwSum(...numbers) {
        const sum = numbers.reduce(add)
        throw new Error(`${sum}`)
      }, async function logErrorMessage(error) {
        sum = Number(error.message)
      })

      assert.equal(sum, 6)
    })

    it('tries a sync function and catches with a sync function', async () => {
      const errProp = (err, x) => { err.x = x; return err }
      const throwError = x => { throw new Error(x) }
      ase(tryCatch(x => x + 1, errProp)(1), 2)
      const e1 = tryCatch(throwError, errProp)(1)
      aok(e1 instanceof Error)
      ase(e1.name, 'Error')
      ase(e1.message, '1')
      ase(e1.x, 1)
    })

    it('tries an async function and catches with a sync function', async () => {
      const errProp = (err, x) => { err.x = x; return err }
      const asyncThrowError = async x => { throw new Error(x) }
      const reject = x => Promise.reject(new Error(x))
      aok(tryCatch(async x => x + 1, errProp)(1) instanceof Promise)
      ase(await tryCatch(async x => x + 1, errProp)(1), 2)
      aok(tryCatch(asyncThrowError, errProp)(1) instanceof Promise)
      const e1 = await tryCatch(asyncThrowError, errProp)(1)
      aok(e1 instanceof Error)
      ase(e1.name, 'Error')
      ase(e1.message, '1')
      ase(e1.x, 1)
      aok(tryCatch(reject, errProp)(1) instanceof Promise)
      const e2 = await tryCatch(reject, errProp)(1)
      aok(e2 instanceof Error)
      ase(e2.name, 'Error')
      ase(e2.message, '1')
      ase(e2.x, 1)
    })
    it('tries a sync function and catches with an async function', async () => {
      const asyncErrProp = async (err, x) => { err.x = x; return err }
      const throwError = x => { throw new Error(x) }
      ase(tryCatch(x => x + 1, asyncErrProp)(1), 2)
      aok(tryCatch(throwError, asyncErrProp)(1) instanceof Promise)
      const e1 = await tryCatch(throwError, asyncErrProp)(1)
      aok(e1 instanceof Error)
      ase(e1.name, 'Error')
      ase(e1.message, '1')
      ase(e1.x, 1)
    })
    it('tries an async function and catches with an async function', async () => {
      const asyncErrProp = async (err, x) => { err.x = x; return err }
      const asyncThrowError = async x => { throw new Error(x) }
      const reject = x => Promise.reject(new Error(x))
      aok(tryCatch(async x => x + 1, asyncErrProp)(1) instanceof Promise)
      ase(await tryCatch(async x => x + 1, asyncErrProp)(1), 2)
      aok(tryCatch(asyncThrowError, asyncErrProp)(1) instanceof Promise)
      const e1 = await tryCatch(asyncThrowError, asyncErrProp)(1)
      aok(e1 instanceof Error)
      ase(e1.name, 'Error')
      ase(e1.message, '1')
      ase(e1.x, 1)
      aok(tryCatch(reject, asyncErrProp)(1) instanceof Promise)
      const e2 = await tryCatch(reject, asyncErrProp)(1)
      aok(e2 instanceof Error)
      ase(e2.name, 'Error')
      ase(e2.message, '1')
      ase(e2.x, 1)
    })
    it('throws a TypeError if passed a non function tryer', async () => {
      assert.deepEqual(
        tryCatch('hey', (...args) => args)('sup'),
        [new TypeError('tryer is not a function'), 'sup'],
      )
    })
    it('won\'t enforce the catcher function typecheck', async () => {
      assert.deepEqual(
        tryCatch(() => 'ayo', Buffer.from('abc'))('hey'),
        'ayo',
      )
    })
  })

  describe('switchCase', () => {
    it('API coverage', async () => {
      ase(
        switchCase(1, [
          x => x === 1, () => 'hi',
          x => x === 2, () => 'ho',
          () => 'hey',
        ]),
        'hi',
      )

      ase(
        await switchCase(Promise.resolve(1), [
          x => x === 1, () => 'hi',
          x => x === 2, () => 'ho',
          () => 'hey',
        ]),
        'hi',
      )
    })
    it('switches on values (including Promises), evaluating eagerly', async () => {
      ase(switchCase([true, 'hey', 'ho']), 'hey')
      ase(await switchCase([
        Promise.resolve(true),
        Promise.resolve('hey'),
        'ho',
      ]), 'hey')
      ase(await switchCase([
        true,
        Promise.resolve('hey'),
        'ho',
      ]), 'hey')
      ase(await switchCase([
        false,
        Promise.resolve('hey'),
        'ho',
      ]), 'ho')
      ase(await switchCase([
        false,
        Promise.resolve('hey'),
        Promise.resolve('ho'),
      ]), 'ho')
      ase(switchCase([false, 'hey', false, 'ho', 'default']), 'default')
      ase(switchCase([false, 'hey', false, 'hey', true, 'ho']), 'ho')
      ase(switchCase([false, 'hey', false, 'hey', false, 'ho']), undefined)
    })
    it('defaults with undefined for an even number of cases', async () => {
      ase(switchCase([false, 'hey', false, 'hey', false, 'hey']), undefined)
    })
    it('switches on provided sync functions', async () => {
      ase(
        switchCase([
          x => x === 1, () => 'hi',
          x => x === 2, () => 'ho',
          () => 'hey',
        ])(1),
        'hi',
      )
      ase(
        switchCase([
          x => x === 1, () => 'hi',
          x => x === 2, () => 'ho',
          () => 'hey',
        ])(2),
        'ho',
      )
      ase(
        switchCase([
          x => x === 1, () => 'hi',
          x => x === 2, () => 'ho',
          () => 'hey',
        ])(3),
        'hey',
      )
      ase(
        switchCase([
          x => x === 1, async () => 'hi',
          x => x === 2, async () => 'ho',
          () => 'hey',
        ])(3),
        'hey',
      )
    })
    it('switches on provided async functions or values', async () => {
      aok(
        switchCase([
          async x => x === 1, async () => 'hi',
          async x => x === 2, async () => 'ho',
          async () => 'hey',
        ])(1) instanceof Promise,
      )
      aok(
        switchCase([
          async x => x === 1, () => 'hi',
          x => x === 2, () => 'ho',
          () => 'hey',
        ])(1) instanceof Promise,
      )
      ase(
        await switchCase([
          async x => x === 1, async () => 'hi',
          async x => x === 2, async () => 'ho',
          async () => 'hey',
        ])(1),
        'hi',
      )
      ase(
        await switchCase([
          async x => x === 1, 'hi',
          async x => x === 2, async () => 'ho',
          async () => 'hey',
        ])(1),
        'hi',
      )
      ase(
        await switchCase([
          async x => x === 1, async () => 'hi',
          async x => x === 2, async () => 'ho',
          async () => 'hey',
        ])(2),
        'ho',
      )
      ase(
        await switchCase([
          async x => x === 1, async () => 'hi',
          async x => x === 2, async () => 'ho',
          async () => 'hey',
        ])(3),
        'hey',
      )
    })
    it('undefined for empty array', async () => {
      ase(switchCase([]), undefined)
    })
    it('acts as identity for a single case', async () => {
      assert.strictEqual(switchCase([() => false])(), false)
    })
    it('even number of array items default returns undefined', async () => {
      assert.strictEqual(switchCase([() => true, () => 'hey'])(), 'hey')
      assert.strictEqual(switchCase([() => false, () => 'hey'])(), undefined)
      assert.strictEqual(switchCase([
        () => false, 'hey',
        false, 'hey',
        false, 'hey',
      ])(), undefined)
    })
  })

  describe('map', () => {
    it('API coverage', async () => {
      const myArray = [1, 2, 3]
      assert.deepEqual(
        map(myArray, number => number ** 2),
        [1, 4, 9]
      )
      assert.deepEqual(
        await map(Promise.resolve(myArray), number => number ** 2),
        [1, 4, 9]
      )
    })

    it('Test', Test('map', map(number => number ** 2))
      .case(Promise.resolve(1), 1)
      .case(Promise.resolve(2), 4)
      .case(Promise.resolve(3), 9)
    )

    describe('map(func A=>Promise|B)(Array<A>) -> Promise|Array<B>', () => {
      it('func A=>B; B', async () => {
        assert.deepEqual(
          map(number => number ** 2)([1, 2, 3, 4, 5]),
          [1, 4, 9, 16, 25],
        )
      })
      it('func A=>Promise<B>; Promise<B>', async () => {
        assert.deepEqual(
          await map(async number => number ** 2)([1, 2, 3, 4, 5]),
          [1, 4, 9, 16, 25],
        )
      })
    })

    describe('map(func A=>Promise|B)(Set<A>) -> Promise|Set<B>', () => {
      it('func A=>B; B', async () => {
        assert.deepEqual(
          map(number => number ** 2)(new Set([1, 2, 3, 4, 5])),
          new Set([1, 4, 9, 16, 25]),
        )
      })
      it('func A=>Promise<B>; Promise<B>', async () => {
        assert.deepEqual(
          await map(async number => number ** 2)(new Set([1, 2, 3, 4, 5])),
          new Set([1, 4, 9, 16, 25]),
        )
      })
    })

    describe('map(func A=>Promise|B)(Map<any, A>) -> Promise|Map<any, B>', () => {
      it('func A=>B; B', async () => {
        assert.deepEqual(
          map(number => number ** 2)(new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])),
          new Map([['a', 1], ['b', 4], ['c', 9], ['d', 16], ['e', 25]]),
        )
      })
      it('func A=>Promise<B>; Promise<B>', async () => {
        assert.deepEqual(
          await map(async number => number ** 2)(new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])),
          new Map([['a', 1], ['b', 4], ['c', 9], ['d', 16], ['e', 25]]),
        )
      })
    })

    describe('map(func A=>Promise|B)(String<A>) -> Promise|String<B>', () => {
      it('func A=>B; B', async () => {
        assert.deepEqual(
          map(number => number ** 2)('12345'),
          '1491625',
        )
      })
      it('func A=>Promise<B>; Promise<B>', async () => {
        assert.deepEqual(
          await map(async number => number ** 2)('12345'),
          '1491625',
        )
      })
    })

    describe('map(func A=>Promise|B)(Object<A>) -> Promise|Object<B>', () => {
      it('func A=>B; B', async () => {
        assert.deepEqual(
          map(number => number ** 2)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
          { a: 1, b: 4, c: 9, d: 16, e: 25 },
        )
      })
      it('func A=>Promise<B>; Promise<B>', async () => {
        assert.deepEqual(
          await map(async number => number ** 2)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
          { a: 1, b: 4, c: 9, d: 16, e: 25 },
        )
        assert.deepEqual(
          await map(
            number => number % 2 == 1 ? Promise.resolve(number ** 2) : number ** 2,
          )({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
          { a: 1, b: 4, c: 9, d: 16, e: 25 },
        )
      })
    })

    describe('map(func A=>B)(Iterator<A>) -> Iterator<B>', () => {
      it('func A=>B; B', async () => {
        const numbers = function* () { let i = 0; while (++i < 6) yield i }
        const squaresIterator = map(number => number ** 2)(numbers())
        assert.strictEqual(`${squaresIterator}`, '[object MappingIterator]')
        assert.equal(objectToString(squaresIterator), '[object Object]')
        assert.deepEqual([...squaresIterator], [1, 4, 9, 16, 25])
      })
    })

    describe('map(func A=>Promise|B)(AsyncIterator<A>) -> AsyncIterator<B>', () => {
      it('func A=>B; AsyncIterator<B>', async () => {
        const asyncNumbers = async function* () { let i = 0; while (++i < 6) yield i }
        const asyncSquaresGenerator = map(number => number ** 2)(asyncNumbers())
        assert.equal(objectToString(asyncSquaresGenerator), '[object Object]')
        const squaresArray = []
        for await (const number of asyncSquaresGenerator) squaresArray.push(number)
        assert.deepEqual(squaresArray, [1, 4, 9, 16, 25])
      })
      it('func A=>Promise<B>; AsyncIterator<B>', async () => {
        const asyncNumbers = async function* () { let i = 0; while (++i < 6) yield i }
        const asyncSquaresGenerator = map(async number => number ** 2)(asyncNumbers())
        assert.equal(objectToString(asyncSquaresGenerator), '[object Object]')
        const squaresArray = []
        for await (const number of asyncSquaresGenerator) squaresArray.push(number)
        assert.deepEqual(squaresArray, [1, 4, 9, 16, 25])
      })
    })

    describe('map(func A=>Promise|B)(Reducer<A>) -> Reducer<B>', () => {
      it('func A=>B; Reducer<B>', async () => {
        const add = (a, b) => a + b
        assert.strictEqual(
          [1, 2, 3, 4, 5].reduce(Transducer.map(number => number ** 2)(add), 0),
          55,
        )
      })
      it('func A=>B; async Reducer<A>; Reducer<B>', async () => {
        const asyncAdd = async (a, b) => a + b
        const asyncReducer = Transducer.map(number => number ** 2)(asyncAdd)
        let total = 0
        for (const number of [1, 2, 3, 4, 5]) {
          total = await asyncReducer(total, number)
        }
        assert.strictEqual(total, 55)
      })
      it('func A=>Promise<B>; Reducer<B>', async () => {
        const add = (a, b) => a + b
        const asyncReducer = Transducer.map(async number => number ** 2)(add)
        let total = 0
        for (const number of [1, 2, 3, 4, 5]) {
          total = await asyncReducer(total, number)
        }
        assert.strictEqual(total, 55)
      })
    })

    describe('map(func A=>B)(Mappable<A>) -> Mappable<B>', () => {
      it('func A=>B; B', async () => {
        const Mappable = function (value) {
          this.value = value
        }
        Mappable.prototype.map = function (func) {
          return new Mappable(func(this.value))
        }
        assert.deepEqual(
          map(value => value ** 2)(new Mappable(3)),
          new Mappable(9),
        )
      })
    })

    describe('map(func A=>Promise|B)(A) -> Promise|B', () => {
      it('func A=>B; B', async () => {
        assert.strictEqual(map(value => value)(1), 1)
      })
      it('func A=>Promise<B>; Promise<B>', async () => {
        assert.strictEqual(await map(async value => value)(1), 1)
      })
    })

    it('undefined; undefined', async () => {
      assert.strictEqual(map(value => value)(undefined), undefined)
    })

    it('null; null', async () => {
      assert.strictEqual(map(value => value)(null), null)
    })
  })

  describe('map.entries', () => {
    it('is like map but over entries rather than values',
      Test(map.entries)
        .case(([key, value]) => [key, value], mappingEntries => {
          assert.deepEqual(mappingEntries({ a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 })
          assert.deepEqual(mappingEntries(mapFrom({ a: 1, b: 2, c: 3 })), mapFrom({ a: 1, b: 2, c: 3 }))
          assert.throws(() => mappingEntries([]), new TypeError('value is not an Object or Map'))
          assert.throws(() => mappingEntries(null), new TypeError('value is not an Object or Map'))
          assert.throws(() => mappingEntries(), new TypeError('value is not an Object or Map'))
        })
        .case(async ([key, value]) => [key, value], async mappingEntries => {
          assert.deepEqual(await mappingEntries({ a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 })
          assert.deepEqual(await mappingEntries(mapFrom({ a: 1, b: 2, c: 3 })), mapFrom({ a: 1, b: 2, c: 3 }))
          assert.throws(() => mappingEntries([]), new TypeError('value is not an Object or Map'))
          assert.throws(() => mappingEntries(null), new TypeError('value is not an Object or Map'))
          assert.throws(() => mappingEntries(), new TypeError('value is not an Object or Map'))
        })
        .case(([key, value]) => value % 2 == 1 ? Promise.resolve([key, value]) : [key, value], async mappingEntries => {
          assert.deepEqual(await mappingEntries({ a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 })
          assert.deepEqual(await mappingEntries(mapFrom({ a: 1, b: 2, c: 3 })), mapFrom({ a: 1, b: 2, c: 3 }))
          assert.throws(() => mappingEntries([]), new TypeError('value is not an Object or Map'))
          assert.throws(() => mappingEntries(null), new TypeError('value is not an Object or Map'))
          assert.throws(() => mappingEntries(), new TypeError('value is not an Object or Map'))
        })
    )
  })

  describe('map.series', () => {
    describe('map.series(func A=>Promise|B)(Array<A>) -> Promise|Array<B>', () => {
      it('func A=>Promise<B>', async () => {
        const createNumbersPromises = () => [
          sleep(15).then(() => 1),
          sleep(10).then(() => 2),
          sleep(5).then(() => 3),
        ]
        {
          const arr = []
          await map(
            p => p.then(number => arr.push(number))
          )(createNumbersPromises())
          assert.deepEqual(arr, [3, 2, 1])
        }
        {
          const arr = []
          await map.series(
            p => p.then(number => arr.push(number))
          )(createNumbersPromises())
          assert.deepEqual(arr, [1, 2, 3])
        }
      })
      it('func A=>B', async () => {
        const square = number => number ** 2
        assert.deepEqual(
          map.series(square)([1, 2, 3, 4, 5]),
          [1, 4, 9, 16, 25],
        )
      })
      it('func A=>B', async () => {
        const variadicAsyncSquare = number => number % 2 == 1 ? number ** 2 : Promise.resolve(number ** 2)
        const variadicAsyncSquare2 = number => number % 2 == 0 ? number ** 2 : Promise.resolve(number ** 2)
        assert.deepEqual(
          await map.series(variadicAsyncSquare)([1, 2, 3, 4, 5]),
          [1, 4, 9, 16, 25],
        )
        assert.deepEqual(
          await map.series(variadicAsyncSquare2)([1, 2, 3, 4, 5]),
          [1, 4, 9, 16, 25],
        )
      })
    })
    it('syncly maps into array of functions', async () => {
      const arr = []
      ade(
        map.series(x => { arr.push(x); return x })([1, 2, 3]),
        [1, 2, 3],
      )
      ade(arr, [1, 2, 3])
    })
    it('throws TypeError for non functions', async () => {
      assert.throws(
        () => map.series('hey')([1]),
        new TypeError('mapper is not a function'),
      )
    })
    it('throws TypeError for non functions', async () => {
      assert.throws(
        () => map.series('hey')(),
        new TypeError('undefined is not an Array'),
      )
    })
    it('throws TypeError for non array input', async () => {
      assert.throws(
        () => map.series(() => 1)('hey'),
        new TypeError('hey is not an Array'),
      )
    })
  })

  describe('map.pool', () => {
    const asyncSquare = async x => x ** 2
    const possiblyAsyncSquare = x => x % 2 == 1 ? Promise.resolve(x ** 2) : x ** 2
    it('maps with asynchronous limit for Arrays', async () => {
      aok(map.pool(1, asyncSquare)([1, 2, 3, 4, 5]) instanceof Promise)
      ade(await map.pool(1, asyncSquare)([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25])
      ade(await map.pool(9, asyncSquare)([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25])
      ade(await map.pool(100, asyncSquare)([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25])
      ade(await map.pool(1, asyncSquare)([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25])
      ade(await map.pool(9, asyncSquare)([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25])
    })
    it('alternating Promises', async () => {
      ade(await map.pool(1, possiblyAsyncSquare)([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25])
      ade(await map.pool(9, possiblyAsyncSquare)([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25])
    })
    it('=> [] for empty array', async () => {
      assert.deepEqual(map.pool(1, asyncSquare)([]), [])
    })
    it('works for arrays of undefined values', async () => {
      ade(await map.pool(1, x => x)(Array(5)), Array(5).fill(undefined))
      ade(await map.pool(1, x => x)(Array(5).fill(null)), Array(5).fill(null))
    })
    xit('maps with asynchronous limit for Sets', async () => {
      const numbersSet = new Set([1, 2, 3, 4, 5])
      const squaresSet = new Set([1, 4, 9, 16, 25])
      aok(map.pool(1, asyncSquare)(numbersSet) instanceof Promise)
      ade(await map.pool(1, asyncSquare)(numbersSet), squaresSet)
      ade(await map.pool(9, asyncSquare)(numbersSet), squaresSet)
      ade(await map.pool(100, asyncSquare)(numbersSet), squaresSet)
      ade(await map.pool(1, asyncSquare)(numbersSet), squaresSet)
      ade(await map.pool(9, asyncSquare)(numbersSet), squaresSet)
    })
    xit('maps with asynchronous limit for Maps', async () => {
      const squareEntry = entry => entry.map(asyncSquare)
      const asyncSquareEntry = async entry => entry.map(asyncSquare)
      const numbersMap = new Map([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]])
      const squaresMap = new Map([[1, 1], [4, 4], [9, 9], [16, 16], [25, 25]])
      aok(map.pool(1, squareEntry)(numbersMap) instanceof Promise)
      ade(await map.pool(1, squareEntry)(numbersMap), squaresMap)
      ade(await map.pool(9, squareEntry)(numbersMap), squaresMap)
      ade(await map.pool(100, squareEntry)(numbersMap), squaresMap)
      ade(await map.pool(1, asyncSquareEntry)(numbersMap), squaresMap)
      ade(await map.pool(9, asyncSquareEntry)(numbersMap), squaresMap)
    })
    it('abides by asynchronous limit for arrays and sets', async () => {
      const numbers = [1, 2, 3, 4, 5, 6]
      const period = 10
      let i = 0
      let maxi = 0
      const plusSleepMinus = n => (async () => {
        i += 1
        maxi = Math.max(maxi, i)
      })().then(() => sleep(period)).
then(() => {
        i -= 1
        return n
      })
      ade(await map.pool(2, plusSleepMinus)(numbers), numbers)
      assert.strictEqual(maxi, 2)
      assert.strictEqual(i, 0)
      maxi = 0
      ade(await map.pool(3, plusSleepMinus)([1, 2, 3, 4, 5, 6]), numbers)
      assert.strictEqual(maxi, 3)
      assert.strictEqual(i, 0)
      maxi = 0
    }).timeout(20000)
    it('throws TypeError on map.pool(NaN)', async () => {
      assert.throws(
        () => map.pool(NaN)(NaN),
        new TypeError('NaN is not an Array'),
      )
    })
    it('throws TypeError on map.pool(lessThan1)', async () => {
      assert.throws(
        () => map.pool(1, () => {})('yo'),
        new TypeError('yo is not an Array'),
      )
    })
    it('handles sync errors good', async () => {
      assert.throws(
        () => map.pool(1, x => { throw new Error(`throwing ${x}`) })(['yo']),
        new Error('throwing yo')
      )
    })
    it('handles async errors good', async () => {
      assert.rejects(
        () => map.pool(1, async x => { throw new Error(`throwing ${x}`) })(['yo']),
        new Error('throwing yo'),
      )
    })
  })

  describe('filter', () => {
    it('eager', async () => {
      const numbers = [1, 2, 3]
      const odds = filter(numbers, number => number % 2 == 1)
      assert.deepEqual(odds, [1, 3])
    })

    describe('filter(predicate T=>Promise|boolean)(Array<T>) -> Promise|Array<T>', () => {
      it('predicate T=>boolean', async () => {
        const isOdd = number => number % 2 == 1
        assert.deepEqual(
          filter(isOdd)([1, 2, 3, 4, 5]),
          [1, 3, 5],
        )
      })
      it('predicate T=>Promise<boolean>', async () => {
        const asyncIsOdd = async number => number % 2 == 1
        assert.deepEqual(
          await filter(asyncIsOdd)([1, 2, 3, 4, 5]),
          [1, 3, 5],
        )
      })
      it('predicate T=>Promise|boolean', async () => {
        const variadicAsyncIsOdd = number => number % 2 == 1 ? Promise.resolve(true) : false
        assert.deepEqual(
          await filter(variadicAsyncIsOdd)([1, 2, 3, 4, 5]),
          [1, 3, 5],
        )
        assert.deepEqual(
          await filter(variadicAsyncIsOdd)([2, 3, 4, 5, 6]),
          [3, 5],
        )
      })
    })

    describe('filter(predicate T=>Promise|boolean)(Set<T>) -> Promise|Set<T>', () => {
      it('predicate T=>Promise|boolean', async () => {
        const isOdd = number => number % 2 == 1
        const variadicAsyncIsOdd = number => number % 2 == 1 ? Promise.resolve(true) : false
        assert.deepEqual(
          filter(isOdd)(new Set([1, 2, 3, 4, 5])),
          new Set([1, 3, 5]),
        )
        assert.deepEqual(
          await filter(async(isOdd))(new Set([1, 2, 3, 4, 5])),
          new Set([1, 3, 5]),
        )
        assert.deepEqual(
          await filter(variadicAsyncIsOdd)(new Set([1, 2, 3, 4, 5])),
          new Set([1, 3, 5]),
        )
      })
    })

    describe('filter(predicate T=>Promise|boolean)(Map<any=>T>) -> Promise|Map<any=>T>', () => {
      it('predicate T=>Promise|boolean', async () => {
        const isOdd = number => number % 2 == 1
        const variadicAsyncIsOdd = number => number % 2 == 1 ? Promise.resolve(true) : false
        const numbersMap = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
        const oddNumbersMap = new Map([['a', 1], ['c', 3], ['e', 5]])
        assert.deepEqual(
          filter(isOdd)(numbersMap),
          oddNumbersMap,
        )
        assert.deepEqual(
          await filter(async(isOdd))(numbersMap),
          oddNumbersMap,
        )
        assert.deepEqual(
          await filter(variadicAsyncIsOdd)(numbersMap),
          oddNumbersMap,
        )
      })
    })

    describe('filter(predicate T=>Promise|boolean)({ filter: function }) -> Promise|any', () => {
      it('predicate T=>Promise|boolean', async () => {
        const myFilterable = { filter: () => 'hey' }
        assert.strictEqual(filter(isOdd)(myFilterable), 'hey')
      })
    })

    describe('filter(predicate T=>Promise|boolean)(number) -> number', () => {
      it('id', async () => {
        assert.strictEqual(filter(isOdd)(1), 1)
      })
    })

    describe('filter(predicate T=>Promise|boolean)(String<T>) -> Promise|String<T>', () => {
      it('predicate T=>Promise|boolean', async () => {
        const isOdd = number => Number(number) % 2 == 1
        const variadicAsyncIsOdd = number => Number(number) % 2 == 1 ? Promise.resolve(true) : false
        assert.deepEqual(
          filter(isOdd)('12345'),
          '135',
        )
        assert.deepEqual(
          await filter(async(isOdd))('12345'),
          '135',
        )
        assert.deepEqual(
          await filter(variadicAsyncIsOdd)('12345'),
          '135',
        )
      })

      it('predicate T=>Promise|boolean', async () => {
        const isOdd = number => number % 2 == 1
        const variadicAsyncIsOdd = number => number % 2 == 1 ? Promise.resolve(true) : false
        const numbersMap = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
        const oddNumbersMap = new Map([['a', 1], ['c', 3], ['e', 5]])
        assert.deepEqual(
          filter(isOdd)(numbersMap),
          oddNumbersMap,
        )
        assert.deepEqual(
          await filter(async(isOdd))(numbersMap),
          oddNumbersMap,
        )
        assert.deepEqual(
          await filter(variadicAsyncIsOdd)(numbersMap),
          oddNumbersMap,
        )
      })
    })

    describe('filter(predicate T=>Promise|boolean)(Object<T>) -> Promise|Object<T>', () => {
      it('predicate T=>boolean', async () => {
        const isOdd = number => number % 2 == 1
        assert.deepEqual(
          filter(isOdd)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
          { a: 1, c: 3, e: 5 },
        )
      })
      it('predicate T=>Promise<boolean>', async () => {
        const asyncIsOdd = async number => number % 2 == 1
        assert.deepEqual(
          await filter(asyncIsOdd)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
          { a: 1, c: 3, e: 5 },
        )
      })
      it('predicate T=>Promise|boolean', async () => {
        const variadicAsyncIsOdd = number => number % 2 == 1 ? Promise.resolve(true) : false
        assert.deepEqual(
          await filter(variadicAsyncIsOdd)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
          { a: 1, c: 3, e: 5 },
        )
        assert.deepEqual(
          await filter(variadicAsyncIsOdd)({ b: 2, c: 3, d: 4, e: 5, f: 6 }),
          { c: 3, e: 5 },
        )
      })
    })
    describe('filter(predicate T=>boolean)(Iterator<T>) -> Iterator<T>', () => {
      it('predicate T=>boolean', async () => {
        const numbers = function* () { let i = 0; while (++i < 6) yield i }
        const isOdd = number => number % 2 == 1
        const oddNumbersIterator = filter(isOdd)(numbers())
        assert.equal(objectToString(oddNumbersIterator), '[object Object]')
        assert.deepEqual([...oddNumbersIterator], [1, 3, 5])
      })
    })
    describe('filter(predicate T=>Promise|boolean)(AsyncIterator<T>) -> AsyncIterator<T>', () => {
      const asyncNumbers = async function* () { let i = 0; while (++i < 6) yield i }
      it('predicate T=>boolean', async () => {
        const isOdd = number => number % 2 == 1
        const asyncOddNumbersIterator = filter(isOdd)(asyncNumbers())
        assert.equal(objectToString(asyncOddNumbersIterator), '[object Object]')
        const oddNumbersArray = []
        for await (const number of asyncOddNumbersIterator) oddNumbersArray.push(number)
        assert.deepEqual(oddNumbersArray, [1, 3, 5])
      })
    })
    describe('filter(predicate T=>Promise|boolean)(Reducer<T>) -> Reducer<T>', () => {
      const concat = (array, values) => array.concat(values)
      it('predicate T=>boolean', async () => {
        const isOdd = number => number % 2 == 1
        const concatOdds = Transducer.filter(isOdd)(concat)
        assert.deepEqual([1, 2, 3, 4, 5].reduce(concatOdds, []), [1, 3, 5])
      })
      it('predicate T=>Promise<boolean>', async () => {
        const asyncIsOdd = async number => number % 2 == 1
        const concatOdds = Transducer.filter(asyncIsOdd)(concat)
        let oddNumbers = []
        for (const number of [1, 2, 3, 4, 5]) {
          oddNumbers = await concatOdds(oddNumbers, number)
        }
        assert.deepEqual(oddNumbers, [1, 3, 5])
      })
      it('predicate T=>Promise|boolean', async () => {
        const variadicAsyncIsOdd = number => number % 2 == 1 ? Promise.resolve(true) : false
        const concatOdds = Transducer.filter(variadicAsyncIsOdd)(concat)
        let oddNumbers = []
        for (const number of [1, 2, 3, 4, 5]) {
          oddNumbers = await concatOdds(oddNumbers, number)
        }
        assert.deepEqual(oddNumbers, [1, 3, 5])
      })
    })
    describe('filter(predicate T=>boolean)(Filterable<T>) -> Filterable<T>', () => {
      it('predicate T=>boolean', async () => {
        const isOdd = number => number % 2 == 1
        const Filterable = function (value) {
          this.value = value
        }
        Filterable.prototype.filter = function (func) {
          return new Filterable(this.value.filter(func))
        }
        assert.deepEqual(
          filter(isOdd)(new Filterable([1, 2, 3, 4, 5])),
          new Filterable([1, 3, 5]),
        )
      })
    })
    describe('filter(predicate T=>boolean)(null) -> null', () => {
      it('predicate T=>boolean', async () => {
        assert.strictEqual(filter(() => true)(null), null)
      })
    })
    describe('filter(predicate T=>boolean)(undefined) -> undefined', () => {
      it('predicate T=>boolean', async () => {
        assert.strictEqual(filter(() => true)(undefined), undefined)
      })
    })
  })

  describe('reduce', () => {
    it('eager', async () => {
      const numbers = [1, 2, 3, 4, 5]
      const sum1 = reduce(numbers, (a, b) => a + b)
      const sum2 = reduce(numbers, (a, b) => a + b, 0)
      const sum3 = reduce(numbers, (a, b) => a + b, () => 0)
      const sum4 = await reduce(numbers, (a, b) => a + b, async () => 0)
      const sum5 = await reduce(numbers, (a, b) => a + b, Promise.resolve(0))
      assert.equal(sum1, 15)
      assert.equal(sum2, 15)
      assert.equal(sum3, 15)
      assert.equal(sum4, 15)
      assert.equal(sum5, 15)
    })

    it('eager Promise arguments', async () => {
      const numbers = Promise.resolve([1, 2, 3, 4, 5])
      const sum1 = await reduce(numbers, (a, b) => a + b)
      const sum2 = await reduce(numbers, (a, b) => a + b, 0)
      const sum3 = await reduce(numbers, (a, b) => a + b, () => 0)
      const sum4 = await reduce(numbers, (a, b) => a + b, async () => 0)
      const sum5 = await reduce(numbers, (a, b) => a + b, Promise.resolve(0))
      assert.equal(sum1, 15)
      assert.equal(sum2, 15)
      assert.equal(sum3, 15)
      assert.equal(sum4, 15)
      assert.equal(sum5, 15)
    })

    describe(`
Reducer<T> (any, T)=>Promise|any

Reducible<T> {
  reduce: (reducer Reducer<T>, init any)=>(result any),
}

reduce(
  reducer Reducer,
  init undefined|function|any,
) -> ...any=>function|Promise|any

reduce(
  reducer Reducer<T>,
  init undefined
    |((collection, ...restArgs)=>Promise|any)
    |any,
)(
  collection Iterable<T>|Iterator<T>
    |AsyncIterable<T>|AsyncIterator<T>
    |Reducible<T>|Object<T>,
  restArgs ...any,
) -> Promise|any

reduce(
  reducer Reducer<T>,
  init undefined
    |((collectionFactory, ...restArgs)=>Promise|any)
    |any,
)(
  collectionFactory (...any=>Iterator<T>)
    |(...any=>AsyncIterator<T>)
    |Reducer<T>,
  restArgs ...any,
) -> reducingFunction ...any=>Promise|any
`, () => {
  describe('reducer (any, T)=>Promise|any', () => {
    const add = (a, b) => a + b
    const asyncAdd = async (a, b) => a + b
    const variadicAsyncAdd = (a, b) => b % 2 == 1 ? Promise.resolve(a + b) : a + b
    xit('collection Promise<Array<number>>', async () => {
      assert.strictEqual(
        reduce(add, 0)(Promise.resolve([1, 2, 3, 4, 5])), 15)
      assert.strictEqual(
        await reduce(asyncAdd, 0)(Promise.resolve([1, 2, 3, 4, 5])), 15)
      assert.strictEqual(
        await reduce(variadicAsyncAdd, 0)(Promise.resolve([1, 2, 3, 4, 5])), 15)
    })
    it('collection Array<number>', async () => {
      assert.strictEqual(
        reduce(add, 0)([1, 2, 3, 4, 5]), 15)
      assert.strictEqual(
        await reduce(asyncAdd, 0)([1, 2, 3, 4, 5]), 15)
      assert.strictEqual(
        await reduce(variadicAsyncAdd, 0)([1, 2, 3, 4, 5]), 15)
    })
    it('collection Array<>', async () => {
      assert.strictEqual(
        reduce(add, 0)([]), 0)
      assert.strictEqual(
        reduce(asyncAdd, 0)([]), 0)
      assert.strictEqual(
        reduce(variadicAsyncAdd, 0)([]), 0)
    })
    it('collection { chain: function }', async () => {
      const Max = function (number) {
        this.number = number
      }
      Max.prototype.chain = function (flatMapper) {
        const monad = flatMapper(this.number)
        if (monad.constructor == Max) {
          return new Max(monad.number > this.number ? monad.number : this.number)
        }
        return monad
      }
      assert.strictEqual(reduce(add, 0)(new Max(5)), 5)
      assert.strictEqual(await reduce(asyncAdd, 0)(new Max(5)), 5)
      assert.strictEqual(await reduce(variadicAsyncAdd, 0)(new Max(5)), 5)
    })
    it('collection { chain: function }', async () => {
      const AsyncMax = function (number) {
        this.number = number
      }
      AsyncMax.prototype.chain = async function (flatMapper) {
        const monad = await flatMapper(this.number)
        if (monad.constructor == AsyncMax) {
          return new AsyncMax(monad.number > this.number ? monad.number : this.number)
        }
        return monad
      }
      assert.strictEqual(await reduce(add, 0)(new AsyncMax(5)), 5)
      assert.strictEqual(await reduce(asyncAdd, 0)(new AsyncMax(5)), 5)
      assert.strictEqual(await reduce(variadicAsyncAdd, 0)(new AsyncMax(5)), 5)
    })
    it('collection { flatMap: function }', async () => {
      const Max = function (number) {
        this.number = number
      }
      Max.prototype.flatMap = function (flatMapper) {
        const monad = flatMapper(this.number)
        if (monad.constructor == Max) {
          return new Max(monad.number > this.number ? monad.number : this.number)
        }
        return monad
      }
      assert.strictEqual(reduce(add, 0)(new Max(5)), 5)
      assert.strictEqual(await reduce(asyncAdd, 0)(new Max(5)), 5)
      assert.strictEqual(await reduce(variadicAsyncAdd, 0)(new Max(5)), 5)
    })
    it('collection Generator<number>', async () => {
      const numbers = function* () { yield 1; yield 2; yield 3; yield 4; yield 5 }
      assert.strictEqual(
        reduce(add, 0)(numbers()), 15)
      assert.strictEqual(
        await reduce(asyncAdd, 0)(numbers()), 15)
      assert.strictEqual(
        await reduce(variadicAsyncAdd, 0)(numbers()), 15)
    })
    it('collection Generator<>', async () => {
      const numbers = function* () {}
      assert.strictEqual(
        reduce(add, 0)(numbers()), 0)
      assert.strictEqual(
        await reduce(asyncAdd, 0)(numbers()), 0)
      assert.strictEqual(
        await reduce(variadicAsyncAdd, 0)(numbers()), 0)
    })
    it('collection AsyncGenerator<number>', async () => {
      const numbers = async function* () { yield 1; yield 2; yield 3; yield 4; yield 5 }
      assert.strictEqual(
        await reduce(add, 0)(numbers()), 15)
      assert.strictEqual(
        await reduce(asyncAdd, 0)(numbers()), 15)
      assert.strictEqual(
        await reduce(variadicAsyncAdd, 0)(numbers()), 15)
    })
    it('collection AsyncGenerator<>', async () => {
      const numbers = async function* () {}
      assert.equal(typeof reduce(add, 0)(numbers()).then, 'function')
      assert.strictEqual(
        await reduce(add, 0)(numbers()), 0)
      assert.strictEqual(
        await reduce(asyncAdd, 0)(numbers()), 0)
      assert.strictEqual(
        await reduce(variadicAsyncAdd, 0)(numbers()), 0)
    })
    it('collection Reducible<number>', async () => {
      const reducible = {
        reduce(reducer, init) {
          return [1, 2, 3, 4, 5].reduce(reducer, init)
        },
      }
      assert.strictEqual(
        reduce(add, 0)(reducible), 15)
    })
    it('collection Object<number>', async () => {
      const numbers = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      assert.strictEqual(
        reduce(add, 0)(numbers), 15)
      assert.strictEqual(
        reduce(add, () => 0)(numbers), 15)
      assert.strictEqual(
        reduce(add)(numbers), 15)
      assert.strictEqual(
        await reduce(asyncAdd, 0)(numbers), 15)
      assert.strictEqual(
        await reduce(variadicAsyncAdd, 0)(numbers), 15)
    })
    it('collection Object<>', async () => {
      const numbers = {}
      assert.strictEqual(
        reduce(add, 0)(numbers), 0)
      assert.strictEqual(
        reduce(add, () => 0)(numbers), 0)
      assert.strictEqual(
        await reduce(asyncAdd, 0)(numbers), 0)
      assert.strictEqual(
        await reduce(variadicAsyncAdd, 0)(numbers), 0)
    })
    it('collection Map<[string, number]>', async () => {
      const StringNumberMap = function (size) {
        const result = new Map()
        let index = -1
        while (++index < size) {
          result.set(sha256(String(index)), index)
        }
        return result
      }
      const stringNumberMap5 = StringNumberMap(5)
      assert.equal(reduce(add, 0)(stringNumberMap5), 10)
      assert.equal(reduce(add, () => 0)(stringNumberMap5), 10)
      assert.equal(await reduce(add, async () => 0)(stringNumberMap5), 10)
      assert.equal(await reduce(asyncAdd, async () => 0)(stringNumberMap5), 10)
      assert.equal(reduce(add)(stringNumberMap5), 10)
    })
    it('collection atomic', async () => {
      assert.strictEqual(
        reduce((a, b) => a + b, 0)(10),
        10,
      )
      assert.strictEqual(
        reduce((a, b) => a + b)(10)(5),
        15,
      )
      assert.strictEqual(
        reduce((a, b) => a + b, 0)(10),
        10,
      )
    })
    it('collection null', async () => {
      assert.strictEqual(
        reduce(value => value, 'hey')(null),
        'hey',
      )
    })
    it('collection undefined', async () => {
      assert.strictEqual(
        reduce(value => value, () => 'hey')(undefined),
        'hey',
      )
      assert.strictEqual(
        await reduce(value => value, async () => 'hey')(undefined),
        'hey',
      )
      assert.strictEqual(
        reduce(value => value, 'hey')(),
        'hey',
      )
      assert.equal(
        typeof reduce(value => value, undefined)(undefined),
        'function'
      )
    })
  })
})
  })

  describe('reduce - v1.5.10 regression', () => {
    const iterables = [
      [1, 2, 3, 4, 5],
      { a: 1, b: 2, c: 3, d: 4, e: 5 },
      new Set([1, 2, 3, 4, 5]),
      {
        [Symbol.iterator]: function* () {
          for (let i = 1; i < 6; i++) yield i
        },
      },
    ]
    const makeAsyncIterables = () => [
      stream.Readable.from([1, 2, 3, 4, 5]),
      stream.Readable.from((async function* () {
        for (let i = 1; i < 6; i++) yield i
      })()),
      constructReadStream([1, 2, 3, 4, 5]),
      {
        [Symbol.asyncIterator]: async function* () {
          await sleep(1)
          for (let i = 1; i < 6; i++) yield i
        },
      },
    ]
    it('reduces any iterable with a sync reducer', async () => {
      for (const x of iterables) {
        ase(reduce((y, xi) => y + xi)(x), 15)
        ase(reduce((y, xi) => y + xi, 10)(x), 25)
      }
    })
    it('reduces any iterable with an async reducer', async () => {
      aok(asyncMult(1, 2) instanceof Promise)
      for (const x of iterables) {
        aok(reduce(asyncMult)(x) instanceof Promise)
        ase(await reduce(asyncMult)(x), 120)
        ase(await reduce(asyncMult, 10)(x), 1200)
      }
    })
    it('reduces any async iterable with a sync reducer', async () => {
      for (const x of makeAsyncIterables()) {
        ase(await reduce((y, xi) => Number(y) + Number(xi))(x), 15)
      }
      for (const x of makeAsyncIterables()) {
        ase(await reduce((y, xi) => Number(y) + Number(xi), 10)(x), 25)
      }
    })
    it('reduces any async iterable with an async reducer', async () => {
      aok(asyncMult(1, 2) instanceof Promise)
      for (const x of makeAsyncIterables()) {
        aok(reduce(asyncMult)(x) instanceof Promise)
      }
      for (const x of makeAsyncIterables()) {
        ase(await reduce(asyncMult)(x), 120)
      }
      for (const x of makeAsyncIterables()) {
        ase(await reduce(asyncMult, 10)(x), 1200)
      }
    })
    it('reduces an iterable with variadic sync/async reducer', async () => {
      ade(
        await reduce(
          (a, b) => b === 1 ? a + b : Promise.resolve(a + b),
          0,
        )([1, 2, 3, 4, 5]),
        15,
      )
    })
    it('initial value can be a function', async () => {
      ade(
        reduce((a, b) => a + b, () => 0)([1, 2, 3, 4, 5]),
        15,
      )
      const asyncNumbers = async function*() {
        for (let i = 1; i <= 5; i++) yield i
      }
      ade(
        await reduce((a, b) => a + b, () => 0)(asyncNumbers()),
        15,
      )
      ade(
        await reduce((a, b) => a + b, () => 0)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
        15,
      )
    })
    it('initial value can be an async function', async () => {
      ade(
        await reduce((a, b) => a + b, async () => 0)([1, 2, 3, 4, 5]),
        15,
      )
      const asyncNumbers = async function*() {
        for (let i = 1; i <= 5; i++) yield i
      }
      ade(
        await reduce((a, b) => a + b, async () => 0)(asyncNumbers()),
        15,
      )
      ade(
        await reduce((a, b) => a + b, async () => 0)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
        15,
      )
    })
    it('referential initial values are unsafe', async () => {
      const square = x => x ** 2
      const unsafeSquareAll = reduce((a, b) => { a.push(square(b)); return a }, [])
      ade(
        unsafeSquareAll([1, 2, 3]),
        [1, 4, 9],
      )
      ade(
        unsafeSquareAll([1, 2, 3]),
        [1, 4, 9, 1, 4, 9],
      )
      const safeSquareAll = reduce((a, b) => { a.push(square(b)); return a }, () => [])
      ade(
        safeSquareAll([1, 2, 3]),
        [1, 4, 9],
      )
      ade(
        safeSquareAll([1, 2, 3]),
        [1, 4, 9],
      )
    })
    it('=> [] for initial () => [] and input []', async () => {
      const square = x => x ** 2
      ade(
        reduce(map(square)((a, b) => (a.push(b), a)), () => [])([]),
        [],
      )
      const emptyAsyncIterator = (async function*(){})()
      ade(
        await reduce(map(square)((a, b) => (a.push(b), a)), () => [])(emptyAsyncIterator),
        [],
      )
    })
  })

  describe('transform', () => {
    describe(`
transform(
  transducer function,
  init function|any,
)(...any) -> Promise|any

Reducer<T> = (any, T)=>Promise|any

Transducer = Reducer=>Reducer

Semigroup = Array|string|Set|TypedArray
  |{ concat: function }|{ write: function }|Object

transform(
  transducer Transducer,
  init ((collection, ...restArgs)=>Promise|Semigroup|any)
    |Semigroup
    |any,
)(
  collection Iterable|Iterator
    |AsyncIterable|AsyncIterator
    |{ reduce: function }|Object|any,
  restArgs ...any
) -> Semigroup Promise|any

transform(
  transducer Transducer,
  init (...args=>Promise|Semigroup|any)
    |Semigroup
    |any,
)(
  generatorFunction (...args=>Generator)|(...args=>AsyncGenerator),
) -> reducingFunction (args ...any)=>Promise|Semigroup|any

transform(
  transducer Transducer,
  init (...args=>Promise|Semigroup|any)
    |Semigroup
    |any,
)(
  anotherReducer Reducer, moreReducers ...Reducer
) -> chainedReducingFunction (args ...any)=>Promise|any
    `, () => {
      describe('collection x init', () => {
        const square = number => number ** 2
        it('API coverage', async () => {
          assert.deepEqual(
            transform([1, 2, 3, 4, 5], Transducer.map(square), []),
            [1, 4, 9, 16, 25],
          )
          assert.deepEqual(
            transform([1, 2, 3, 4, 5], Transducer.map(square), () => []),
            [1, 4, 9, 16, 25],
          )
          assert.deepEqual(
            await transform([1, 2, 3, 4, 5], Transducer.map(square), async () => []),
            [1, 4, 9, 16, 25],
          )
          assert.deepEqual(
            await transform([1, 2, 3, 4, 5], Transducer.map(square), Promise.resolve([])),
            [1, 4, 9, 16, 25],
          )
          assert.deepEqual(
            await transform(Promise.resolve([1, 2, 3, 4, 5]), Transducer.map(square), []),
            [1, 4, 9, 16, 25],
          )
        })
        it('init []|() => []', async () => {
          assert.deepEqual(
            transform(Transducer.map(square), [])([1, 2, 3, 4, 5]),
            [1, 4, 9, 16, 25],
          )
          assert.deepEqual(
            await transform(Transducer.map(square), Promise.resolve([]))([1, 2, 3, 4, 5]),
            [1, 4, 9, 16, 25],
          )
          assert.deepEqual(
            transform(Transducer.map(square), () => [])([1, 2, 3, 4, 5]),
            [1, 4, 9, 16, 25],
          )
          assert.deepEqual(
            await transform(Transducer.map(square), async () => [])([1, 2, 3, 4, 5]),
            [1, 4, 9, 16, 25],
          )
          assert.deepEqual(
            transform(Transducer.map(square), [])([1, 2, 3, 4, 5][Symbol.iterator]()),
            [1, 4, 9, 16, 25],
          )
          const duplicate = item => [item, item]
          assert.deepEqual(
            transform(Transducer.map(duplicate), [])([1, 2, 3, 4, 5]),
            [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
          )
          assert.deepEqual(
            transform(Transducer.map(duplicate), () => [])([1, 2, 3, 4, 5]),
            [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
          )
          assert.deepEqual(
            await transform(Transducer.map(async number => duplicate(number)), async () => [])([1, 2, 3, 4, 5]),
            [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
          )
        })
        it('init \'\'|(()=>\'\')', async () => {
          assert.strictEqual(
            transform(Transducer.map(square), '')([1, 2, 3, 4, 5]),
            '1491625',
          )
          assert.strictEqual(
            transform(Transducer.map(square), () => '')([1, 2, 3, 4, 5]),
            '1491625',
          )
          assert.strictEqual(
            await transform(Transducer.map(async number => number ** 2), async () => '')([1, 2, 3, 4, 5]),
            '1491625',
          )
        })
        it('init Set|()=>Set', async () => {
          assert.deepEqual(
            transform(Transducer.map(square), new Set())([1, 2, 3, 4, 5]),
            new Set([1, 4, 9, 16, 25]),
          )
          assert.deepEqual(
            transform(Transducer.map(square), () => new Set())([1, 2, 3, 4, 5]),
            new Set([1, 4, 9, 16, 25]),
          )
          assert.deepEqual(
            await transform(Transducer.map(square), async () => new Set())([1, 2, 3, 4, 5]),
            new Set([1, 4, 9, 16, 25]),
          )
          const SetWithSquare = number => new Set([number, number ** 2])
          assert.deepEqual(
            transform(Transducer.map(SetWithSquare), new Set())([1, 2, 3, 4, 5]),
            new Set([1, 2, 4, 3, 9, 4, 16, 5, 25]),
          )
          assert.deepEqual(
            transform(Transducer.map(SetWithSquare), () => new Set())([1, 2, 3, 4, 5]),
            new Set([1, 2, 4, 3, 9, 4, 16, 5, 25]),
          )
          assert.deepEqual(
            await transform(Transducer.map(async number => SetWithSquare(number)), async () => new Set())([1, 2, 3, 4, 5]),
            new Set([1, 2, 4, 3, 9, 4, 16, 5, 25]),
          )
        })
        it('init TypedArray|()=>TypedArray', async () => {
          for (const constructor of numberTypedArrayConstructors) {
            assert.deepEqual(
              transform(Transducer.map(square), new constructor())([1, 2, 3, 4, 5]),
              new constructor([1, 4, 9, 16, 25])
            )
            assert.deepEqual(
              transform(Transducer.map(square), () => new constructor())([1, 2, 3, 4, 5]),
              new constructor([1, 4, 9, 16, 25])
            )
            assert.deepEqual(
              await transform(Transducer.map(async number => number ** 2), async () => new constructor())([1, 2, 3, 4, 5]),
              new constructor([1, 4, 9, 16, 25])
            )
            assert.deepEqual(
              transform(Transducer.map(number => new constructor([number ** 2])), () => new constructor())([1, 2, 3, 4, 5]),
              new constructor([1, 4, 9, 16, 25])
            )
            assert.deepEqual(
              await transform(Transducer.map(async number => new constructor([number ** 2])), async () => new constructor())([1, 2, 3, 4, 5]),
              new constructor([1, 4, 9, 16, 25])
            )
          }
          for (const constructor of bigIntTypedArrayConstructors) {
            assert.deepEqual(
              transform(Transducer.map(number => number ** 2n), new constructor())([1n, 2n, 3n, 4n, 5n]),
              new constructor([1n, 4n, 9n, 16n, 25n])
            )
            assert.deepEqual(
              transform(Transducer.map(number => number ** 2n), () => new constructor())([1n, 2n, 3n, 4n, 5n]),
              new constructor([1n, 4n, 9n, 16n, 25n])
            )
            assert.deepEqual(
              await transform(Transducer.map(async number => number ** 2n), async () => new constructor())([1n, 2n, 3n, 4n, 5n]),
              new constructor([1n, 4n, 9n, 16n, 25n])
            )
            assert.deepEqual(
              transform(Transducer.map(number => new constructor([number ** 2n])), () => new constructor())([1n, 2n, 3n, 4n, 5n]),
              new constructor([1n, 4n, 9n, 16n, 25n])
            )
            assert.deepEqual(
              await transform(Transducer.map(async number => new constructor([number ** 2n])), async () => new constructor())([1n, 2n, 3n, 4n, 5n]),
              new constructor([1n, 4n, 9n, 16n, 25n])
            )
          }
        })
        it('init { concat: function }|()=>({ concat: function })', async () => {
          const Max = function (number) {
            this.number = number
          }
          Max.prototype.concat = function (otherMax) {
            return new Max(otherMax.constructor == Max
              ? Math.max(this.number, otherMax.number)
              : Math.max(this.number, otherMax))
          }
          assert.deepEqual(
            transform(Transducer.map(number => number ** 2), new Max(-Infinity))([1, 2, 3, 4, 5]),
            new Max(25),
          )
          assert.deepEqual(
            transform(Transducer.map(number => number ** 2), () => new Max(-Infinity))([1, 2, 3, 4, 5]),
            new Max(25),
          )
          assert.deepEqual(
            await transform(Transducer.map(async number => number ** 2), async () => new Max(-Infinity))([1, 2, 3, 4, 5]),
            new Max(25),
          )
        })
        it('init { write: function }|()=>({ write: function })', async () => {
          assert.deepEqual(
            transform(Transducer.map(number => number ** 2), new MockWritable([]))([1, 2, 3, 4, 5]),
            new MockWritable([1, 4, 9, 16, 25]),
          )
          assert.deepEqual(
            transform(Transducer.map(number => number ** 2), () => new MockWritable([]))([1, 2, 3, 4, 5]),
            new MockWritable([1, 4, 9, 16, 25]),
          )
          assert.deepEqual(
            await transform(Transducer.map(async number => number ** 2), async () => new MockWritable([]))([1, 2, 3, 4, 5]),
            new MockWritable([1, 4, 9, 16, 25]),
          )
          const numberToSquaredReadable = number => binaryToReadableStream(Buffer.from([number ** 2]))
          assert.deepEqual(
            await transform(Transducer.map(numberToSquaredReadable), new MockWritable([]))([1, 2, 3, 4, 5]),
            new MockWritable([1, 4, 9, 16, 25].map(number => new Uint8Array([number]))),
          )
          const numberToNumberObjectReadable = number => arrayToObjectReadableStream([{ number }])
          assert.deepEqual(
            await transform(Transducer.map(numberToNumberObjectReadable), new MockWritable([]))([1, 2, 3, 4, 5]),
            new MockWritable([
              { number: 1 },
              { number: 2 },
              { number: 3 },
              { number: 4 },
              { number: 5 },
            ]),
          )
          const numberToDuplicateString = number => `${number}${number}`
          assert.deepEqual(
            await transform(Transducer.map(numberToDuplicateString), new MockWritable([]))([1, 2, 3, 4, 5]),
            new MockWritable(['11', '22', '33', '44', '55']),
          )
          const numberToDuplicateUint8Array = number => new Uint8Array([number, number])
          assert.deepEqual(
            transform(Transducer.map(numberToDuplicateUint8Array), new MockWritable([]))([1, 2, 3, 4, 5]),
            new MockWritable([
              new Uint8Array([1, 1]),
              new Uint8Array([2, 2]),
              new Uint8Array([3, 3]),
              new Uint8Array([4, 4]),
              new Uint8Array([5, 5]),
            ]),
          )
          const numberToObjectNumber = number => ({ number })
          assert.deepEqual(
            transform(Transducer.map(numberToObjectNumber), new MockWritable([]))([1, 2, 3, 4, 5]),
            new MockWritable([
              { number: 1 },
              { number: 2 },
              { number: 3 },
              { number: 4 },
              { number: 5 },
            ]),
          )
          const toNull = () => null
          assert.deepEqual(
            transform(Transducer.map(toNull), new MockWritable([]))([1, 2, 3, 4, 5]),
            new MockWritable([null, null, null, null, null]),
          )
          const getEmptyReadable = () => binaryToReadableStream(Buffer.from([]))
          assert.deepEqual(
            await transform(Transducer.map(getEmptyReadable), new MockWritable([]))([1, 2, 3, 4, 5]),
            new MockWritable([]),
          )
          assert.throws(
            () => transform(Transducer.map(function () {
              throw new Error('hey')
            }), new MockWritable([]))([1, 2, 3, 4, 5]),
            new Error('hey'),
          )
        })
        it('init 3', async () => {
          assert.strictEqual(
            transform(Transducer.map(square), 3)([1, 2, 3, 4, 5]),
            3,
          )
        })
        it('init null|undefined', async () => {
          assert.strictEqual(
            transform(Transducer.map(square), null)([1, 2, 3, 4, 5]),
            null,
          )
          assert.strictEqual(
            transform(Transducer.map(square), undefined)([1, 2, 3, 4, 5]),
            undefined,
          )
          assert.strictEqual(
            transform(Transducer.map(square))([1, 2, 3, 4, 5]),
            undefined,
          )
        })
      })
    })
  })

  describe('transform - misc', () => {
    const squareOdds = compose([Transducer.filter(isOdd), Transducer.map(square)])
    const asyncEvens = Transducer.filter(asyncIsEven)
    const bigNumbers = [1n, 2n, 3n, 4n, 5n]
    const squareOddsToString = compose([
      Transducer.filter(isOdd),
      Transducer.map(pipe([square, x => `${x}`])),
    ])
    it('sync transforms iterable to null', async () => {
      let y = ''
      ase(transform(Transducer.map(tap(x => { y += x })), null)([1, 2, 3, 4, 5]), null)
      ase(y, '12345')
    })
    it('async transforms iterable to null', async () => {
      let y = ''
      aok(transform(Transducer.map(tap(async () => {})), null)([1, 2, 3, 4, 5]) instanceof Promise)
      ase(await transform(Transducer.map(tap(async x => { y += x })), null)([1, 2, 3, 4, 5]), null)
      ase(y, '12345')
    })
    it('sync transforms iterable to array', async () => {
      ade(transform(squareOdds, [])([1, 2, 3, 4, 5]), [1, 9, 25])
    })
    it('async transforms iterable to array', async () => {
      aok(transform(asyncEvens, [99])([1, 2, 3, 4, 5]) instanceof Promise)
      ade(await transform(asyncEvens, [99])([1, 2, 3, 4, 5]), [99, 2, 4])
    })
    it('sync transforms iterable to string', async () => {
      ase(transform(squareOdds, '')([1, 2, 3, 4, 5]), '1925')
    })
    it('async transforms iterable to string', async () => {
      aok(transform(asyncEvens, '99')([1, 2, 3, 4, 5]) instanceof Promise)
      ase(await transform(asyncEvens, '99')([1, 2, 3, 4, 5]), '9924')
    })
    it('sync transforms iterable to set', async () => {
      ade(transform(squareOdds, new Set())([1, 2, 3, 4, 5]), new Set([1, 9, 25]))
    })
    it('async transforms iterable to set', async () => {
      aok(transform(asyncEvens, new Set([99]))([1, 2, 3, 4, 5]) instanceof Promise)
      ade(
        await transform(asyncEvens, new Set([99, 2]))([1, 2, 3, 4, 5]),
        new Set([99, 2, 4]),
      )
    })
    it('strings are converted to numbers', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        ade(
          transform(squareOddsToString, new constructor(0))([1, 2, 3, 4, 5]),
          new constructor([1, 9, 2, 5]),
        )
      }
      ade(
        transform(squareOddsToString, Buffer.alloc(0))([1, 2, 3, 4, 5]),
        Buffer.from([1, 9, 2, 5]),
      )
    })
    it('coerces booleans to 0 and 1', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        assert.deepEqual(
          transform(Transducer.map(x => x), new constructor(0))([true, false, false]),
          new constructor([1, 0, 0])
        )
      }
      for (const constructor of bigIntTypedArrayConstructors) {
        assert.deepEqual(
          transform(Transducer.map(x => x), new constructor(0))([true, false, false]),
          new constructor([1n, 0n, 0n])
        )
      }
    })
    it('async transforms iterable to number TypedArray', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        const buffer99 = new constructor([9, 9])
        const buffer9924 = transform(asyncEvens, buffer99)([1, 2, 3, 4, 5])
        aok(buffer9924 instanceof Promise)
        ade(await buffer9924, new constructor([9, 9, 2, 4]))
      }
    })
    it('sync transforms iterable to a bigint TypedArray', async () => {
      const isBigOdd = x => (x % 2n === 1n)
      const bigSquare = x => x ** 2n
      const squareBigOdds = compose([Transducer.filter(isBigOdd), Transducer.map(bigSquare)])
      for (const constructor of bigIntTypedArrayConstructors) {
        ade(
          transform(squareBigOdds, new constructor(0))(bigNumbers),
          new constructor([1n, 9n, 25n]),
        )
      }
    })
    it('async transforms iterable to a bigint TypedArray', async () => {
      const asyncIsBigEven = async x => (x % 2n === 0n)
      const asyncBigEvens = Transducer.filter(asyncIsBigEven)
      for (const constructor of bigIntTypedArrayConstructors) {
        const buffer99 = new constructor([9n, 9n])
        const buffer9924 = transform(asyncBigEvens, buffer99)(bigNumbers)
        aok(buffer9924 instanceof Promise)
        ade(await buffer9924, new constructor([9n, 9n, 2n, 4n]))
      }
    })
    it('sync transforms iterable to writeable stream', async () => {
      const tmpWriter = fs.createWriteStream(path.join(__dirname, './tmp'))
      await transform(squareOddsToString, tmpWriter)([1, 2, 3, 4, 5])
      ase(await consumeReadStreamPush(
        fs.createReadStream(path.join(__dirname, './tmp')),
      ), '1925')
      ase(await consumeReadStreamPull(
        fs.createReadStream(path.join(__dirname, './tmp')),
      ), '1925')
      await fs.promises.unlink('./tmp')
    })
    it('async transforms iterable to writeable stream', async () => {
      const asyncEvensToString = compose([
        Transducer.filter(asyncIsEven),
        Transducer.map(x => `${x}`)
      ])
      const tmpWriter = fs.createWriteStream(path.join(__dirname, './tmp'))
      tmpWriter.write('99')
      const writeEvens = transform(asyncEvensToString, tmpWriter)([1, 2, 3, 4, 5])
      aok(writeEvens instanceof Promise)
      await writeEvens
      ase(await consumeReadStreamPush(
        fs.createReadStream(path.join(__dirname, './tmp')),
      ), '9924')
      ase(await consumeReadStreamPull(
        fs.createReadStream(path.join(__dirname, './tmp')),
      ), '9924')
      await fs.promises.unlink('./tmp')
    })
    it('sync transforms an iterable to an object', async () => {
      ade(
        transform(Transducer.map(n => ({ [n]: n })), {})([1, 2, 3, 4, 5]),
        { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
      )
    })
    it('async transforms an iterable to an object', async () => {
      aok(
        transform(Transducer.map(async n => [n, n]), {})([1, 2, 3, 4, 5]) instanceof Promise,
      )
      aok(
        transform(Transducer.map(async n => ({ [n]: n })), {})([1, 2, 3, 4, 5]) instanceof Promise,
      )
      ade(
        await transform(Transducer.map(async n => ({ [n]: n })), {})([1, 2, 3, 4, 5]),
        { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
      )
    })
    it('initial value can be a function', async () => {
      const square = x => x ** 2
      ade(
        transform(Transducer.map(square), () => [])([1, 2, 3]),
        [1, 4, 9],
      )
    })
    it('initial value can be an async function', async () => {
      const square = x => x ** 2
      aok(
        transform(Transducer.map(square), async () => [])([1, 2, 3]) instanceof Promise,
      )
      ade(
        await transform(Transducer.map(square), async () => [])([1, 2, 3]),
        [1, 4, 9],
      )
    })
    it('nonfunction initial values can be unsafe', async () => {
      const square = x => x ** 2
      const unsafeSquareAllTransform = transform(Transducer.map(square), [])
      ade(
        unsafeSquareAllTransform([1, 2, 3]),
        [1, 4, 9],
      )
      ade(
        unsafeSquareAllTransform([1, 2, 3]),
        [1, 4, 9, 1, 4, 9],
      )
      const safeSquareAllTransform = transform(Transducer.map(square), () => [])
      ade(
        safeSquareAllTransform([1, 2, 3]),
        [1, 4, 9],
      )
      ade(
        safeSquareAllTransform([1, 2, 3]),
        [1, 4, 9],
      )
    })
    it('=> [] for initial () => [] and input []', async () => {
      const square = x => x ** 2
      ade(
        transform(Transducer.map(square), () => [])([]),
        [],
      )
      const emptyAsyncIterator = (async function*(){})()
      ade(
        await transform(Transducer.map(square), () => [])(emptyAsyncIterator),
        [],
      )
    })
  })

  describe('flatMap', () => {
    describe(`
type FlatMappable = Array|String|Set|Iterator|AsyncIterator
type Iterable = Iterable|AsyncIterable|Object<value any>

flatMap(
  value FlatMappable,
  flatMapper (item any)=>Promise|Iterable,
) -> result Promise|FlatMappable

flatMap(
  flatMapper (item any)=>Promise|Iterable,
)(value FlatMappable) -> result Promise|FlatMappable
    `, () => {

      it('API coverage', async () => {
        assert.deepEqual(
          flatMap([1, 2, 3, 4, 5], number => isOdd(number) ? [number] : []),
          [1, 3, 5],
        )
        assert.deepEqual(
          flatMap(number => isOdd(number) ? [number] : [])([1, 2, 3, 4, 5]),
          [1, 3, 5],
        )
        assert.deepEqual(
          await flatMap(Promise.resolve([1, 2, 3, 4, 5]), number => isOdd(number) ? [number] : []),
          [1, 3, 5],
        )
      })

      const async = func => async function asyncFunc(...args) {
        return func(...args)
      }

      const numbersArray = [1, 2, 3, 4, 5]
      const numbersDuplicates = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
      const numbersObject = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      const numbersUint8Array = new Uint8Array([1, 2, 3, 4, 5])
      const numbersUint8ArrayDuplicates = new Uint8Array([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
      const numbersInt8Array = new Int8Array([1, 2, 3, 4, 5])
      const numbersInt8ArrayDuplicates = new Int8Array([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
      const numbersUint16Array = new Uint16Array([1, 2, 3, 4, 5])
      const numbersUint16ArrayDuplicates = new Uint16Array([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
      const numbersInt16Array = new Int16Array([1, 2, 3, 4, 5])
      const numbersInt16ArrayDuplicates = new Int16Array([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
      const numbersUint32Array = new Uint32Array([1, 2, 3, 4, 5])
      const numbersUint32ArrayDuplicates = new Uint32Array([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
      const numbersInt32Array = new Int32Array([1, 2, 3, 4, 5])
      const numbersInt32ArrayDuplicates = new Int32Array([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
      const numbersFloat32Array = new Float32Array([1, 2, 3, 4, 5])
      const numbersFloat32ArrayDuplicates = new Float32Array([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
      const numbersFloat64Array = new Float64Array([1, 2, 3, 4, 5])
      const numbersFloat64ArrayDuplicates = new Float64Array([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
      const numbersBigUint64Array = new BigUint64Array([1n, 2n, 3n, 4n, 5n])
      const numbersBigUint64ArrayDuplicates = new BigUint64Array([1n, 1n, 2n, 2n, 3n, 3n, 4n, 4n, 5n, 5n])
      const numbersBigInt64Array = new BigInt64Array([1n, 2n, 3n, 4n, 5n])
      const numbersBigInt64ArrayDuplicates = new BigInt64Array([1n, 1n, 2n, 2n, 3n, 3n, 4n, 4n, 5n, 5n])
      const bigIntsArray = [1n, 2n, 3n, 4n, 5n]
      const bigIntsDuplicates = [1n, 1n, 2n, 2n, 3n, 3n, 4n, 4n, 5n, 5n]
      const numbersSet = new Set([1, 2, 3, 4, 5])
      const bigIntsSet = new Set([1n, 2n, 3n, 4n, 5n])
      const numbersSetWithAyo = new Set([1, 2, 3, 4, 5, 'ayo'])
      const alphabetString = 'abcde'
      const numbersDuplexStream = new MockDuplexStream([1, 2, 3, 4, 5])
      const numbersGeneratorFunction = function* () { for (let i = 1; i < 6; i++) yield i }
      const asyncNumbersGeneratorFunction = async function* () { for (let i = 1; i < 6; i++) yield i }

      const identity = value => value
      const duplicateArray = value => [value, value]
      const duplicateObject = value => ({ [value * 10]: value, [value * 100]: value })
      const duplicateObjectString = value => ({ [value]: value, [`${value}${value}`]: value })
      const duplicateObjectBigInt = value => ({ [value * 10n]: value, [value * 100n]: value })
      const nestedObject = value => ({ a: { a: value }, b: { b: value } })
      const duplicateString = value => `${value}${value}`
      const setWithAyo = value => new Set([value, 'ayo'])
      const duplicateUint8ClampedArray = value => new Uint8ClampedArray([value, value])
      const duplicateUint8Array = value => new Uint8Array([value, value])
      const duplicateArrayOfUint8Array = value => [new Uint8Array([value]), new Uint8Array([value])]
      const duplicateInt8Array = value => new Int8Array([value, value])
      const duplicateUint16Array = value => new Uint16Array([value, value])
      const duplicateInt16Array = value => new Int16Array([value, value])
      const duplicateUint32Array = value => new Uint32Array([value, value])
      const duplicateInt32Array = value => new Int32Array([value, value])
      const duplicateFloat32Array = value => new Float32Array([value, value])
      const duplicateFloat64Array = value => new Float64Array([value, value])
      const duplicateBigUint64Array = value => new BigUint64Array([value, value])
      const duplicateBigInt64Array = value => new BigInt64Array([value, value])
      const duplicateReadableStream = value => binaryToReadableStream(Buffer.from([value, value]))
      const duplicateBuffer = value => Buffer.from([value, value])
      const duplicateMockFoldable = value => new MockFoldable([value, value])
      const duplicateAsyncMockFoldable = value => new AsyncMockFoldable([value, value])
      const duplicateMockFoldableObjects = value => new MockFoldable([{ [value * 10]: value }, { [value * 100]: value }])

      const DuplicateArray = function (value) {
        this.value = value
      }
      DuplicateArray.prototype = {
        chain(flatMapper) {
          return flatMapper([this.value, this.value])
        },
      }
      DuplicateArray.of = value => new DuplicateArray(value)

      const AsyncDuplicateArray = value => ({
        async chain(flatMapper) {
          return flatMapper([value, value])
        },
      })
      const AsyncDuplicateArrayFlatMap = value => ({
        async flatMap(flatMapper) {
          return flatMapper([value, value])
        },
      })

      const DuplicateObject = function (value) {
        this.value = value
      }
      DuplicateObject.prototype = {
        chain(flatMapper) {
          const value = this.value
          return flatMapper({ [value * 10]: value, [value * 100]: value })
        },
      }
      DuplicateObject.of = value => new DuplicateObject(value)

      const AsyncDuplicateObject = value => ({
        async chain(flatMapper) {
          return flatMapper({ [value * 10]: value, [value * 100]: value })
        }
      })
      const AsyncDuplicateObjectFlatMap = value => ({
        async flatMap(flatMapper) {
          return flatMapper({ [value * 10]: value, [value * 100]: value })
        }
      })

      const Identity = function (value) {
        this.value = value
      }
      Identity.prototype = {
        flatMap(flatMapper) {
          return flatMapper(this.value)
        },
      }
      Identity.of = value => new Identity(value)

      const assertions = [
        [Promise.resolve(1), identity, 1],
        [numbersArray, () => null, [null, null, null, null, null]],
        [numbersArray, () => [null, null], [null, null, null, null, null, null, null, null, null, null]],
        [numbersArray, () => undefined, [undefined, undefined, undefined, undefined, undefined]],
        [numbersArray, identity, numbersArray],
        [numbersArray, Promise.resolve.bind(Promise), numbersArray],
        [numbersArray, duplicateArray, numbersDuplicates],
        [numbersArray, async(duplicateArray), numbersDuplicates],
        [numbersArray, DuplicateArray.of, numbersArray.map(duplicateArray)], // calling .chain is 1 flat
        [numbersArray, async(DuplicateArray.of), numbersArray.map(duplicateArray)],
        [numbersArray, AsyncDuplicateArray, numbersArray.map(duplicateArray)], // calling .chain is 1 flat
        [numbersArray, async(AsyncDuplicateArray), numbersArray.map(duplicateArray)],
        [numbersArray, AsyncDuplicateArrayFlatMap, numbersArray.map(duplicateArray)], // calling .chain is 1 flat
        [numbersArray, async(AsyncDuplicateArrayFlatMap), numbersArray.map(duplicateArray)],
        [numbersArray, Identity.of, numbersArray],
        [numbersArray, async(Identity.of), numbersArray],
        [numbersArray, duplicateMockFoldable, numbersDuplicates],
        [numbersArray, async(duplicateMockFoldable), numbersDuplicates],
        [numbersArray, duplicateAsyncMockFoldable, numbersDuplicates],
        [numbersArray, async(duplicateAsyncMockFoldable), numbersDuplicates],
        [numbersArray, duplicateObject, numbersDuplicates],
        [numbersArray, async(duplicateObject), numbersDuplicates],
        [numbersArray, duplicateString, ['1', '1', '2', '2', '3', '3', '4', '4', '5', '5']],
        [numbersArray, async(duplicateString), ['1', '1', '2', '2', '3', '3', '4', '4', '5', '5']],
        [numbersArray, setWithAyo, [1, 'ayo', 2, 'ayo', 3, 'ayo', 4, 'ayo', 5, 'ayo']],
        [numbersArray, async(setWithAyo), [1, 'ayo', 2, 'ayo', 3, 'ayo', 4, 'ayo', 5, 'ayo']],
        [numbersArray, duplicateUint8ClampedArray, numbersDuplicates],
        [numbersArray, async(duplicateUint8ClampedArray), numbersDuplicates],
        [numbersArray, duplicateUint8Array, numbersDuplicates],
        [numbersArray, async(duplicateUint8Array), numbersDuplicates],
        [numbersArray, duplicateInt8Array, numbersDuplicates],
        [numbersArray, async(duplicateInt8Array), numbersDuplicates],
        [numbersArray, duplicateUint16Array, numbersDuplicates],
        [numbersArray, async(duplicateUint16Array), numbersDuplicates],
        [numbersArray, duplicateInt16Array, numbersDuplicates],
        [numbersArray, async(duplicateInt16Array), numbersDuplicates],
        [numbersArray, duplicateUint32Array, numbersDuplicates],
        [numbersArray, async(duplicateUint32Array), numbersDuplicates],
        [numbersArray, duplicateInt32Array, numbersDuplicates],
        [numbersArray, async(duplicateInt32Array), numbersDuplicates],
        [numbersArray, duplicateFloat32Array, numbersDuplicates],
        [numbersArray, async(duplicateFloat32Array), numbersDuplicates],
        [numbersArray, duplicateFloat64Array, numbersDuplicates],
        [numbersArray, async(duplicateFloat64Array), numbersDuplicates],
        [numbersArray, duplicateReadableStream, numbersArray.map(duplicateBuffer)], // 1 flat removes the stream
        [numbersArray, async(duplicateReadableStream), numbersArray.map(duplicateBuffer)],
        [bigIntsArray, identity, bigIntsArray],
        [bigIntsArray, duplicateBigUint64Array, bigIntsDuplicates],
        [bigIntsArray, async(duplicateBigUint64Array), bigIntsDuplicates],
        [bigIntsArray, duplicateBigInt64Array, bigIntsDuplicates],
        [bigIntsArray, async(duplicateBigInt64Array), bigIntsDuplicates],

        [alphabetString, identity, alphabetString],
        [alphabetString, duplicateArray, 'aabbccddee'],
        [alphabetString, async(duplicateArray), 'aabbccddee'],
        [alphabetString, DuplicateArray.of, 'a,ab,bc,cd,de,e'], // calling .chain is 1 flat
        [alphabetString, async(DuplicateArray.of), 'a,ab,bc,cd,de,e'],
        [alphabetString, Identity.of, alphabetString],
        [alphabetString, async(Identity.of), alphabetString],
        [alphabetString, duplicateMockFoldable, 'aabbccddee'],
        [alphabetString, async(duplicateMockFoldable), 'aabbccddee'],
        [alphabetString, duplicateAsyncMockFoldable, 'aabbccddee'],
        [alphabetString, async(duplicateAsyncMockFoldable), 'aabbccddee'],
        [alphabetString, duplicateObjectString, 'aabbccddee'],
        [alphabetString, async(duplicateObjectString), 'aabbccddee'],
        [alphabetString, duplicateString, 'aabbccddee'],
        [alphabetString, async(duplicateString), 'aabbccddee'],
        [alphabetString, setWithAyo, 'aayobayocayodayoeayo'],
        [alphabetString, async(setWithAyo), 'aayobayocayodayoeayo'],

        [numbersSet, identity, numbersSet],
        [numbersSet, () => null, new Set([null])],
        [numbersSet, duplicateArray, numbersSet],
        [numbersSet, async(duplicateArray), numbersSet],
        [numbersSet, DuplicateArray.of, new Set([...numbersSet].map(duplicateArray))],
        [numbersSet, async(DuplicateArray.of), new Set([...numbersSet].map(duplicateArray))],
        [numbersSet, Identity.of, numbersSet],
        [numbersSet, async(Identity.of), numbersSet],
        [numbersSet, duplicateMockFoldable, numbersSet],
        [numbersSet, async(duplicateMockFoldable), numbersSet],
        [numbersSet, duplicateAsyncMockFoldable, numbersSet],
        [numbersSet, async(duplicateAsyncMockFoldable), numbersSet],
        [numbersSet, duplicateObject, numbersSet],
        [numbersSet, async(duplicateObject), numbersSet],
        [numbersSet, setWithAyo, new Set([1, 2, 3, 4, 5, 'ayo'])],
        [numbersSet, async(setWithAyo), new Set([1, 2, 3, 4, 5, 'ayo'])],
        [numbersSet, duplicateString, new Set(['1', '2', '3', '4', '5'])],
        [numbersSet, async(duplicateString), new Set(['1', '2', '3', '4', '5'])],
        [numbersSet, duplicateUint8Array, numbersSet],
        [numbersSet, async(duplicateUint8Array), numbersSet],
        [numbersSet, duplicateInt8Array, numbersSet],
        [numbersSet, async(duplicateInt8Array), numbersSet],
        [numbersSet, duplicateUint16Array, numbersSet],
        [numbersSet, async(duplicateUint16Array), numbersSet],
        [numbersSet, duplicateInt16Array, numbersSet],
        [numbersSet, async(duplicateInt16Array), numbersSet],
        [numbersSet, duplicateUint32Array, numbersSet],
        [numbersSet, async(duplicateUint32Array), numbersSet],
        [numbersSet, duplicateInt32Array, numbersSet],
        [numbersSet, async(duplicateInt32Array), numbersSet],
        [numbersSet, duplicateFloat32Array, numbersSet],
        [numbersSet, async(duplicateFloat32Array), numbersSet],
        [numbersSet, duplicateFloat64Array, numbersSet],
        [numbersSet, async(duplicateFloat64Array), numbersSet],
        [numbersSet, duplicateReadableStream, new Set(numbersArray.map(duplicateBuffer))],
        [numbersSet, async(duplicateReadableStream), new Set(numbersArray.map(duplicateBuffer))],

        [numbersGeneratorFunction(), identity, numbersArray, function (expected, actual) {
          assert.deepEqual([...actual], expected)
        }],
        [numbersGeneratorFunction(), duplicateArray, numbersDuplicates, function (expected, actual) {
          assert.deepEqual([...actual], expected)
        }],
        [numbersGeneratorFunction(), async(duplicateArray), numbersArray.map(duplicateArray), async function (expected, actual) {
          assert.deepEqual(await Promise.all(actual), expected) // flatten will only see promises, so async does not get flattened
        }],
        [numbersGeneratorFunction(), DuplicateArray.of, numbersArray.map(duplicateArray), function (expected, actual) {
          assert.deepEqual([...actual], expected)
        }],
        [numbersGeneratorFunction(), async(DuplicateArray.of), numbersArray.map(DuplicateArray.of), async function (expected, actual) {
          assert.deepEqual(await Promise.all(actual), expected) // flatten will only see promises, so async does not get flattened
        }],
        [numbersGeneratorFunction(), Identity.of, numbersArray, function (expected, actual) {
          const actualArray = [...actual]
          assert.deepEqual(actualArray, expected)
        }],
        [numbersGeneratorFunction(), async(Identity.of), numbersArray.map(Identity.of), async function (expected, actual) {
          assert.deepEqual(await Promise.all(actual), expected) // flatten will only see promises, so async does not get flattened
        }],
        [numbersGeneratorFunction(), duplicateMockFoldable, numbersDuplicates, function (expected, actual) {
          assert.deepEqual([...actual], expected)
        }],
        [numbersGeneratorFunction(), async(duplicateMockFoldable), numbersArray.map(duplicateMockFoldable), async function (expected, actual) {
          assert.deepEqual(await Promise.all(actual), expected) // flatten will only see promises, so async does not get flattened
        }],
        [numbersGeneratorFunction(), duplicateObject, numbersDuplicates, function (expected, actual) {
          assert.deepEqual([...actual], expected)
        }],
        [numbersGeneratorFunction(), async(duplicateObject), numbersArray.map(duplicateObject), async function (expected, actual) {
          assert.deepEqual(await Promise.all(actual), expected) // flatten will only see promises, so async does not get flattened
        }],

        [asyncNumbersGeneratorFunction(), identity, numbersArray, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), duplicateArray, numbersDuplicates, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), async(duplicateArray), numbersDuplicates, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],

        [asyncNumbersGeneratorFunction(), DuplicateArray.of, numbersArray.map(duplicateArray), async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],

        [asyncNumbersGeneratorFunction(), async(DuplicateArray.of), numbersArray.map(duplicateArray), async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), duplicateMockFoldable, numbersDuplicates, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), async(duplicateMockFoldable), numbersDuplicates, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), duplicateObject, numbersDuplicates, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), async(duplicateObject), numbersDuplicates, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), duplicateString, numbersDuplicates, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), async(duplicateString), numbersDuplicates, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), duplicateBuffer, numbersDuplicates, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), async(duplicateBuffer), numbersDuplicates, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), duplicateUint8Array, numbersDuplicates, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), async(duplicateUint8Array), numbersDuplicates, async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), duplicateReadableStream, numbersArray.map(duplicateBuffer), async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],
        [asyncNumbersGeneratorFunction(), async(duplicateReadableStream), numbersArray.map(duplicateBuffer), async function (expected, actual) {
          const actualArray = []
          for await (const item of actual) actualArray.push(item)
          assert.deepEqual(actualArray, expected)
        }],

        [numbersObject, identity, {}],
        [numbersObject, async(identity), {}],
        [numbersObject, duplicateArray, {}],
        [numbersObject, async(duplicateArray), {}],
        [numbersObject, number => [{ [number]: number }, { [number]: number }], { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }],
        [numbersObject, number => null, {}],
        [numbersObject, number => [{ [number]: null }, { [number]: null }], { 1: null, 2: null, 3: null, 4: null, 5: null }],
        [numbersObject, duplicateObject, {
          '10': 1, '100': 1, '20': 2, '200': 2, '30': 3, '300': 3, '40': 4, '400': 4, '50': 5, '500': 5,
        }],
        [numbersObject, async(duplicateObject), {
          '10': 1, '100': 1, '20': 2, '200': 2, '30': 3, '300': 3, '40': 4, '400': 4, '50': 5, '500': 5,
        }],
        [numbersObject, duplicateReadableStream, { 0: 5, 1: 5 }],
        [numbersObject, async(duplicateReadableStream), { 0: 5, 1: 5 }],
        [numbersObject, duplicateObjectString, { 1: 1, 11: 1, 2: 2, 22: 2, 3: 3, 33: 3, 4: 4, 44: 4, 5: 5, 55: 5 }],
        [numbersObject, async(duplicateObjectString), { 1: 1, 11: 1, 2: 2, 22: 2, 3: 3, 33: 3, 4: 4, 44: 4, 5: 5, 55: 5 }],
        [numbersObject, duplicateMockFoldable, {}],
        [numbersObject, duplicateAsyncMockFoldable, {}],
        [numbersObject, async(duplicateMockFoldable), {}],
        [numbersObject, duplicateMockFoldableObjects, { 10: 1, 100: 1, 20: 2, 200: 2, 30: 3, 300: 3, 40: 4, 400: 4, 50: 5, 500: 5 }],
        [numbersObject, async(duplicateMockFoldableObjects), { 10: 1, 100: 1, 20: 2, 200: 2, 30: 3, 300: 3, 40: 4, 400: 4, 50: 5, 500: 5 }],
        [numbersObject, DuplicateObject.of, { 10: 1, 100: 1, 20: 2, 200: 2, 30: 3, 300: 3, 40: 4, 400: 4, 50: 5, 500: 5 }],
        [numbersObject, async(DuplicateObject.of), { 10: 1, 100: 1, 20: 2, 200: 2, 30: 3, 300: 3, 40: 4, 400: 4, 50: 5, 500: 5 }],
        [numbersObject, AsyncDuplicateObject, { 10: 1, 100: 1, 20: 2, 200: 2, 30: 3, 300: 3, 40: 4, 400: 4, 50: 5, 500: 5 }],
        [numbersObject, async(AsyncDuplicateObject), { 10: 1, 100: 1, 20: 2, 200: 2, 30: 3, 300: 3, 40: 4, 400: 4, 50: 5, 500: 5 }],
        [numbersObject, AsyncDuplicateObjectFlatMap, { 10: 1, 100: 1, 20: 2, 200: 2, 30: 3, 300: 3, 40: 4, 400: 4, 50: 5, 500: 5 }],
        [numbersObject, async(AsyncDuplicateObjectFlatMap), { 10: 1, 100: 1, 20: 2, 200: 2, 30: 3, 300: 3, 40: 4, 400: 4, 50: 5, 500: 5 }],
        [numbersObject, Identity.of, {}],
        [numbersObject, async(Identity.of), {}],
        [{ a: { a: 1 }, b: { b: 2 }, c: { c: 3 }, d: { d: 4 }, e: { e: 5 } }, Identity.of, numbersObject],
        [{ a: { a: 1 }, b: { b: 2 }, c: { c: 3 }, d: { d: 4 }, e: { e: 5 } }, async(Identity.of), numbersObject],

        [{ chain: flatMapper => flatMapper('ayo') }, duplicateArray, ['ayo', 'ayo']],
        [{ chain: flatMapper => flatMapper('ayo') }, async(duplicateArray), ['ayo', 'ayo']],
        [DuplicateArray.of('ayo'), DuplicateArray.of, DuplicateArray.of(['ayo', 'ayo'])],
        [DuplicateArray.of('ayo'), async(DuplicateArray.of), DuplicateArray.of(['ayo', 'ayo'])],
        [Identity.of('ayo'), Identity.of, Identity.of('ayo')],
        [Identity.of('ayo'), async(Identity.of), Identity.of('ayo')],

      ]

      const arrayOfLast = (array, n = 1) => array.slice(array.length - n, array.length)

      assertions.forEach(function ([value, flatMapper, result, asserter = assert.deepEqual]) {
        it(`flatMap(${flatMapper.name})(${value.constructor.name}<${value}>) - ${result}`, async () => {
          await asserter(
            result,
            await flatMap(flatMapper)(value),
          )
        })
      })

      it('value undefined', async () => {
        assert.strictEqual(flatMap(() => 'hey')(undefined), 'hey')
        assert.strictEqual(flatMap(() => 'hey')(), 'hey')
      })
      it('value null', async () => {
        assert.strictEqual(flatMap(() => 'hey')(null), 'hey')
      })

      it('value number', async () => {
        assert.deepEqual(flatMap(duplicateArray)(1), [1, 1])
        assert.deepEqual(flatMap(1, duplicateArray), [1, 1])
      })
    })

    describe('FlatMappingAsyncIterator', () => {
      const asyncNumbers = async function* () {
        yield 1; yield 2; yield 3; yield 4; yield 5
      }
      const flatMappingAsyncIterator = flatMap(value => value)(asyncNumbers())
      it('[object FlatMappingAsyncIterator]', async () => {
        assert.strictEqual(flatMappingAsyncIterator.toString(), '[object FlatMappingAsyncIterator]')
      })
    })
  })

  describe('flatMap - misc', () => {
    it('maps then flattens an array, async + parallel', async () => {
      const asyncPowers = async x => [x ** 2, x ** 3]
      aok(flatMap(asyncPowers)([1, 2, 3, 4, 5]) instanceof Promise)
      ade(
        await flatMap(asyncPowers)([1, 2, 3, 4, 5]),
        [1, 1, 4, 8, 9, 27, 16, 64, 25, 125],
      )
    })
    it('maps then flattens an array, sync', async () => {
      const powers = x => [x ** 2, x ** 3]
      ade(
        flatMap(powers)([1, 2, 3, 4, 5]),
        [1, 1, 4, 8, 9, 27, 16, 64, 25, 125],
      )
      ade(
        flatMap(powers)([1, 2, 3, 4, 5]),
        [1, 1, 4, 8, 9, 27, 16, 64, 25, 125],
      )
      ade(
        flatMap(x => new Set([x ** 2]))([1, 2, 3, 4, 5]),
        [1, 4, 9, 16, 25],
      )
      ade(
        flatMap(
          x => x,
        )(
          flatMap(x => new Map([[x, x ** 2]]))([1, 2, 3, 4, 5]),
        ),
        [1, 1, 2, 4, 3, 9, 4, 16, 5, 25],
      )
      ade(
        flatMap(x => x)([1, 2, [3, 4], 5]),
        [1, 2, 3, 4, 5],
      )
    })
    it('maps then flattens objects', async () => {
      const createObject = () => ({ a: 1, b: 2, c: 3 })
      ade(
        flatMap(x => x)(arrayOf(createObject, 3)),
        [1, 2, 3, 1, 2, 3, 1, 2, 3],
      )
    })
    it('maps then flattens a Set', async () => {
      const powers = x => [x ** 2, x ** 3]
      ade(
        flatMap(
          powers,
        )(new Set([1, 2, 3])),
        new Set([1, 4, 8, 9, 27]),
      )
      ade(
        flatMap(
          x => new Set(powers(x)),
        )(new Set([1, 2, 3])),
        new Set([1, 4, 8, 9, 27]),
      )
    })
    it('maps then flattens objects', async () => {
      ade(
        flatMap(x => ({ square: x ** 2, cube: x ** 3 }))(new Set([1, 2, 3])),
        new Set([1, 4, 8, 9, 27])
      )
    })
    it('[async] maps then flattens a Set', async () => {
      const powers = async x => [x ** 2, x ** 3]
      aok(
        flatMap(
          powers,
        )(new Set([1, 2, 3])) instanceof Promise
      )
      ade(
        await flatMap(
          powers,
        )(new Set([1, 2, 3])),
        new Set([1, 4, 8, 9, 27]),
      )
      aok(
        flatMap(
          x => powers(x).then(x => new Set(x))
        )(new Set([1, 2, 3])) instanceof Promise
      )
      ade(
        await flatMap(
          x => powers(x).then(x => new Set(x))
        )(new Set([1, 2, 3])),
        new Set([1, 4, 8, 9, 27]),
      )
    })
    it('maps then flattens a reducer function', async () => {
      const powers = x => [x ** 2, x ** 3]
      ade(
        transform(
          Transducer.flatMap(powers),
          [],
        )([1, 2, 3]),
        [1, 1, 4, 8, 9, 27],
      )
    })
    it('[async] maps then flattens a reducer function', async () => {
      const powers = async x => [x ** 2, x ** 3]
      aok(
        transform(
          Transducer.flatMap(powers),
          [],
        )([1, 2, 3]) instanceof Promise
      )
      ade(
        await transform(
          Transducer.flatMap(powers),
          [],
        )([1, 2, 3]),
        [1, 1, 4, 8, 9, 27],
      )
    })
  })

  describe('forEach', () => {
    describe(`
     Reducer<T> = (any, T)=>Promise|any

     var T any,
       callback T=>(),
       collection Iterable<T>|AsyncIterable<T>{ forEach: callback=>() }|Object<T>
       
     forEach(callback)(collection) -> ()
    `,
    () => {
      it('API coverage', async () => {
        let sum1 = 0
        forEach([1, 2, 3, 4, 5], number => {
          sum1 += number
        })
        assert.equal(sum1, 15)

        let sum2 = 0
        await forEach(Promise.resolve([1, 2, 3, 4, 5]), number => {
          sum2 += number
        })
        assert.equal(sum2, 15)
      })
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

      it('execute a function for each item of a collection, returning the collection', async () => {
        let total = 0
        assert.deepEqual(
          forEach(number => total += number)([1, 2, 3]),
          [1, 2, 3],
        )
        assert.strictEqual(total, 6)
      })
    })
  })

  describe('get', () => {
    const aaaaa = { a: { a: { a: { a: { a: 1 } } } } }
    const nested = [[[[[1]]]]]
    it('API coverage', async () => {
      ase(get({ a: 1 }, 'a'), 1)
      ase(await get(Promise.resolve({ a: 1 }), 'a'), 1)
      ase(get('a')({ a: 1 }), 1)
    })
    it('accesses a property of an object by name', async () => {
      ase(get('a')({ a: 1 }), 1)
      ase(get('b')({ a: 1 }), undefined)
      ase(get('b', 0)({ a: 1 }), 0)
      ase(get(0)([1]), 1)
      ase(get(1)([1]), undefined)
      ase(get(1, 0)([1]), 0)
    })
    it('accesses a property by array[index]', async () => {
      ase(get('[0][0][0][0][0]')(nested), 1)
      ase(get('[0][0][0][0][0')(nested), 1)
      ase(get('0][0][0][0][0]')(nested), 1)
      ase(get('0][0][0][0][0')(nested), 1)
    })
    it('accesses a property of an object by dot notation', async () => {
      ase(get('a.a.a.a.a')(aaaaa), 1)
      ase(get('a.a.a.a.b')(aaaaa), undefined)
      ase(get('a.a.a.a.b', 0)(aaaaa), 0)
      ase(get('0.0.0.0.0')(nested), 1)
      ase(get('0.0.0.0.1')(nested), undefined)
      ase(get('0.0.0.0.1', 0)(nested), 0)
    })
    it('accesses a property of an object by array', async () => {
      ase(get(['a', 'a', 'a', 'a', 'a'])(aaaaa), 1)
      ase(get(['a', 'a', 'a', 'a', 'b'])(aaaaa), undefined)
      ase(get(['a', 'a', 'a', 'a', 'b'], 0)(aaaaa), 0)
      ase(get([0, 0, 0, 0, 0])(nested), 1)
      ase(get([0, 0, 0, 0, 1])(nested), undefined)
      ase(get([0, 0, 0, 0, 1], 0)(nested), 0)
      ase(get(['a', 0])({ a: [1] }), 1)
    })
    it('handles null and undefined initial value with default or undefined', async () => {
      ase(get('a')(null), undefined)
      ase(get('a', () => 'yo')(null), 'yo')
      ase(get('a', 'yo')(null), 'yo')
      ase(get('a', 'yo')(undefined), 'yo')
    })
    it('defaultValue can be a function', async () => {
      ase(get('a', obj => obj.b)({ b: 1 }), 1)
      ase(get('a', obj => obj.b)({}), undefined)
    })
    it('clears cache at size 500', async () => {
    })
  })

  describe('set', () => {
    it('set a property of an object', async () => {
      ade(set('a', 1)(null), null)
      ade(set('a', 1)(undefined), undefined)
      ade(set('a', 1)('yo'), 'yo')
      ade(set('a', 1)({ b: 2 }), { a: 1, b: 2 })
      ade(await set('a', Promise.resolve(1))({ b: 2 }), { a: 1, b: 2 })
      ade(set('a.b', 1)({ a: { c: 2 } }), { a: { b: 1, c: 2 } })
      ade(set('a.b', 1)({ a: 1 }), { a: { b: 1 } })
      ade(set(['a', 'b'], 1)({ a: { c: 2 } }), { a: { b: 1, c: 2 } })
      ade(set('a[0].b.c', 4)({ 'a': [{ 'b': { 'c': 3 } }] }), { 'a': [{ 'b': { 'c': 4 } }] })
      ade(set('a.b.c.d', 1)({}), { a: { b: { c: { d: 1 } } } })
    })

    it('eagerly set a property of an object', async () => {
      ade(set(null, 'a', 1), null)
      ade(set(undefined, 'a', 1), undefined)
      ade(set('yo', 'a', 1), 'yo')
      ade(set({ b: 2 }, 'a', 1), { a: 1, b: 2 })
      ade(set({ a: { c: 2 } }, 'a.b', 1), { a: { b: 1, c: 2 } })
      ade(set({ a: 1 }, 'a.b', 1), { a: { b: 1 } })
      ade(set({ a: { c: 2 } }, ['a', 'b'], 1), { a: { b: 1, c: 2 } })
      ade(await set(Promise.resolve({ 'a': [{ 'b': { 'c': 3 } }] }), 'a[0].b.c', 4), { 'a': [{ 'b': { 'c': 4 } }] })
      ade(await set({ 'a': [{ 'b': { 'c': 3 } }] }, 'a[0].b.c', Promise.resolve(4)), { 'a': [{ 'b': { 'c': 4 } }] })
      ade(await set(Promise.resolve({}), 'a.b.c.d', 1), { a: { b: { c: { d: 1 } } } })
      ade(await set({}, 'a.b.c.d', Promise.resolve(1)), { a: { b: { c: { d: 1 } } } })
    })

    it('the property value may be a resolver', async () => {
      { // sync
        const myObj = { a: 1 }
        const myNewObj = set('b', obj => obj.a + 2)(myObj)
        assert.deepEqual(myNewObj, { a: 1, b: 3 })
      }

      { // async
        const myObj = { a: 1 }
        const myNewObj = await set('b', async obj => obj.a + 2)(myObj)
        assert.deepEqual(myNewObj, { a: 1, b: 3 })
      }
    })
  })

  describe('pick', () => {
    const abc = { a: 1, b: 2, c: 3 }
    const nested = { a: { b: { c: { d: 1, e: [2, 3] } } } }

    it('API coverage', async () => {
      ade(pick(abc, ['a']), { a: 1 })
      ade(pick(abc, ['a', 'd']), { a: 1 })
      ade(pick(abc, ['d']), {})
      ade(await pick(Promise.resolve(abc), ['a']), { a: 1 })
      ade(await pick(Promise.resolve(abc), ['a', 'd']), { a: 1 })
      ade(await pick(Promise.resolve(abc), ['d']), {})
    })
    it('picks properties off an object defined by array', async () => {
      ade(pick(['a'])(abc), { a: 1 })
      ade(pick(['a', 'd'])(abc), { a: 1 })
      ade(pick(['d'])(abc), {})
      ade(pick(['d'])(null), null)
      ade(pick(['d'])(undefined), undefined)
      ade(pick(['d'])(), undefined)
    })
    it('picks nested properties', async () => {
      assert.deepEqual(pick(['a.b.c.d'])(nested), { a: { b: { c: { d: 1 } } } })
      // assert.deepEqual(pick(['a.b.f.g'])(nested), nested)
      // assert.deepEqual(pick(['a.b.c.d', 'a.b.c.e[0]'])(nested), { a: { b: { c: { e: [, 3] } } } })
      // assert.deepEqual(pick(['a[0][0].d'])({ a: [[{ b: 1, c: 2, d: 3 }]] }), { a: [[{ b: 1, c: 2 }]] })
      // assert.deepEqual(pick(['a[0][0].d'])({ a: [[{ b: 1, c: 2, d: null }]] }), { a: [[{ b: 1, c: 2 }]] })
    })
  })

  describe('omit', () => {
    const abc = { a: 1, b: 2, c: 3 }
    const nested = { a: { b: { c: { d: 1, e: [2, 3] } } } }

    it('API coverage', async () => {
      ade(omit(nested, []), nested)
      ade(await omit(Promise.resolve(nested), []), nested)
      ade(omit([1, 2, 3], []), [1, 2, 3])
      ade(await omit(Promise.resolve([1, 2, 3]), []), [1, 2, 3])
      ade(omit(abc, ['a']), { b: 2, c: 3 })
      ade(omit(abc, ['a', 'd']), { b: 2, c: 3 })
      ade(omit(abc, ['d']), { a: 1, b: 2, c: 3 })
    })
    it('omits properties from an object defined by array', async () => {
      assert(omit([])(nested) !== nested)
      ade(omit([])(nested), nested)
      ade(omit([])([1, 2, 3]), [1, 2, 3])
      ade(omit(['a'])(abc), { b: 2, c: 3 })
      ade(omit(['a', 'd'])(abc), { b: 2, c: 3 })
      ade(omit(['d'])(abc), { a: 1, b: 2, c: 3 })
      ade(omit(['d'])({ d: null }), {})
      ase(omit(['d'])(null), null)
      ase(omit(['d'])(undefined), undefined)
      ase(omit(['d'])(), undefined)
      ase(omit([])(null), null)
      ase(omit([])(1), 1)
    })
    it('omits nested properties', async () => {
      assert.deepEqual(omit(['a.b.c.d'])(nested), { a: { b: { c: { e: [2, 3] } } } })
      assert.deepEqual(omit(['a.b.f.g'])(nested), nested)
      assert.deepEqual(omit(['a.b.c.d', 'a.b.c.e[0]'])(nested), { a: { b: { c: { e: [, 3] } } } })
      assert.deepEqual(omit(['a[0][0].d'])({ a: [[{ b: 1, c: 2, d: 3 }]] }), { a: [[{ b: 1, c: 2 }]] })
      assert.deepEqual(omit(['a[0][0].d'])({ a: [[{ b: 1, c: 2, d: null }]] }), { a: [[{ b: 1, c: 2 }]] })
    })
    it('more nested',
      Test(
        'omit nested',
        omit(['a.b.c.e[0]']))
        .case({
          a: {
            b: {
              c: {
                d: 1,
                e: [2, 3],
              },
            }
          },
        }, {
          a: {
            b: {
              c: {
                d: 1,
                e: [, 3],
              },
            }
          },
        })
    .case(null, null)
    .case({}, {})
    .case([], []))
  })

  describe('some', () => {
    it('API coverage', async () => {
      ase(
        some([1, 2, 3, 4, 5], number => number > 3),
        true,
      )

      ase(
        await some(Promise.resolve([1, 2, 3, 4, 5]), number => number > 3),
        true,
      )
    })

    const numbersArray = [1, 2, 3, 4, 5]
    const evenNumbersArray = [2, 4, 6, 8, 10]
    const numbersGenerator = function* () {
      yield 1; yield 2; yield 3; yield 4; yield 5
    }
    const evenNumbersGenerator = function* () {
      yield 2; yield 4; yield 6; yield 8; yield 10
    }
    const asyncNumbersGenerator = async function* () {
      yield 1; yield 2; yield 3; yield 4; yield 5
    }
    const asyncEvenNumbersGenerator = async function* () {
      yield 2; yield 4; yield 6; yield 8; yield 10
    }
    const isOdd = number => number % 2 == 1
    const variadicAsyncIsOdd = number => number % 2 == 1 ? Promise.resolve(true) : false
    const variadicAsyncIsEven = number => number % 2 == 0 ? Promise.resolve(true) : false

    const cases = [
      [isOdd, [2, 3, 4], true],
      [async(isOdd), [2, 3, 4], true],
      [isOdd, new MockFoldable([2, 3, 4]), true],
      [isOdd, numbersArray, true],
      [isOdd, evenNumbersArray, false],
      [isOdd, new MockFoldable(numbersArray), true],
      [isOdd, new MockFoldable(evenNumbersArray), false],
      [isOdd, new AsyncMockFoldable(numbersArray), true],
      [isOdd, new AsyncMockFoldable(evenNumbersArray), false],
      [async(isOdd), new MockFoldable(numbersArray), true],
      [async(isOdd), new MockFoldable(evenNumbersArray), false],
      [async(isOdd), new AsyncMockFoldable(numbersArray), true],
      [async(isOdd), new AsyncMockFoldable(evenNumbersArray), false],
      [variadicAsyncIsOdd, numbersArray, true],
      [variadicAsyncIsOdd, evenNumbersArray, false],
      [async(isOdd), numbersArray, true],
      [async(isOdd), evenNumbersArray, false],
      [isOdd, numbersGenerator(), true],
      [isOdd, evenNumbersGenerator(), false],
      [async(isOdd), numbersGenerator(), true],
      [async(isOdd), evenNumbersGenerator(), false],
      [isOdd, asyncNumbersGenerator(), true],
      [isOdd, asyncEvenNumbersGenerator(), false],
      [async(isOdd), asyncNumbersGenerator(), true],
      [async(isOdd), asyncEvenNumbersGenerator(), false],
      [variadicAsyncIsOdd, asyncNumbersGenerator(), true],
      [variadicAsyncIsOdd, asyncEvenNumbersGenerator(), false],
      [isOdd, asyncNumbersGenerator(), true],
      [isOdd, asyncEvenNumbersGenerator(), false],
      [async(isOdd), asyncNumbersGenerator(), true],
      [async(isOdd), asyncEvenNumbersGenerator(), false],
      [variadicAsyncIsOdd, asyncNumbersGenerator(), true],
      [variadicAsyncIsOdd, asyncEvenNumbersGenerator(), false],
    ]

    cases.forEach(([func, value, result, asserter = assert.strictEqual]) => {
      it(`${func.name}(${JSON.stringify(value)}) -> ${result}`, async () => {
        asserter(await some(func)(value), result)
      })
    })

    it('max concurrency 20', async () => {
      const asyncRange = async function* (to) {
        for (let index = 1; index < to; index++) {
          yield index
        }
      }
      let concurrencyCount = 0,
        maxConcurrencyCount = 0
      assert.strictEqual(await some(async number => {
        concurrencyCount += 1
        maxConcurrencyCount = Math.max(maxConcurrencyCount, concurrencyCount)
        await sleep(10)
        concurrencyCount -= 1
        return false
      })(asyncRange(40)), false)
      assert.strictEqual(concurrencyCount, 0)
      assert.strictEqual(maxConcurrencyCount, 20)
      assert.strictEqual(await some(async number => {
        maxConcurrencyCount = Math.max(maxConcurrencyCount, concurrencyCount)
        await sleep(10)
        if (number == 19) {
          return true
        }
        return false
      })(asyncRange(40)), true)
    })

    it('1', async () => {
      assert.strictEqual(some(() => true)(1), true)
    })
    it('null', async () => {
      assert.strictEqual(some(() => true)(null), true)
    })
    it('undefined', async () => {
      assert.strictEqual(some(() => true)(undefined), true)
      assert.strictEqual(some(() => true)(), true)
    })
  })

  describe('some - v1.5.15 regression', () => {
    const numbers = [1, 2, 3, 4, 5]
    const numbersObject = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    it('[sync] tests fn against all items of iterable, true if any evaluation is truthy', async () => {
      ase(some(x => x > 5)(numbers), false)
      ase(some(x => x > 0)(numbers), true)
      ase(some(x => x > 5)(new Set(numbers)), false)
      ase(some(x => x > 0)(new Set(numbers)), true)
      ase(some(x => x > 5)(numbersObject), false)
      ase(some(x => x > 0)(numbersObject), true)
    })
    it('[async] tests fn against all items of iterable, true if any evaluation is truthy', async () => {
      aok(some(async x => x > 5)(numbers) instanceof Promise)
      ase(await some(async x => x > 5)(numbers), false)
      ase(await some(async x => x > 0)(numbers), true)
      ase(await some(async x => x > 5)(new Set(numbers)), false)
      ase(await some(async x => x > 0)(new Set(numbers)), true)
      ase(await some(async x => x > 5)(numbersObject), false)
      ase(await some(async x => x > 0)(numbersObject), true)
    })
    it('tests a variadic async function', async () => {
      ase(
        await some(x => x < 2 ? Promise.resolve(false) : true)([1, 2, 3, 4, 5]),
        true,
      )
    })
  })

  describe('every', () => {
    it('API coverage', async () => {
      ase(
        every([1, 2, 3, 4, 5], number => number > 0),
        true,
      )

      ase(
        await every(Promise.resolve([1, 2, 3, 4, 5]), number => number > 0),
        true,
      )
    })

    const numbersArray = [1, 2, 3, 4, 5]
    const evenNumbersArray = [2, 4, 6, 8, 10]
    const numbersGenerator = function* () {
      yield 1; yield 2; yield 3; yield 4; yield 5
    }
    const evenNumbersGenerator = function* () {
      yield 2; yield 4; yield 6; yield 8; yield 10
    }
    const asyncNumbersGenerator = async function* () {
      yield 1; yield 2; yield 3; yield 4; yield 5
    }
    const asyncEvenNumbersGenerator = async function* () {
      yield 2; yield 4; yield 6; yield 8; yield 10
    }
    const isOdd = number => number % 2 == 1
    const isEven = number => number % 2 == 0
    const variadicAsyncIsOdd = number => number % 2 == 1 ? Promise.resolve(true) : false
    const variadicAsyncIsEven = number => number % 2 == 0 ? Promise.resolve(true) : false

    const cases = [
      [isEven, numbersArray, false],
      [async(isEven), numbersArray, false],
      [isEven, evenNumbersArray, true],
      [isEven, new MockFoldable(numbersArray), false],
      [isEven, new MockFoldable(evenNumbersArray), true],
      [async(isEven), new MockFoldable(numbersArray), false],
      [async(isEven), new MockFoldable(evenNumbersArray), true],
      [async(isEven), evenNumbersArray, true],
      [variadicAsyncIsEven, numbersArray, false],
      [variadicAsyncIsEven, evenNumbersArray, true],
      [isEven, numbersGenerator(), false],
      [isEven, evenNumbersGenerator(), true],
      [async(isEven), numbersGenerator(), false],
      [async(isEven), evenNumbersGenerator(), true],
      [isEven, asyncNumbersGenerator(), false],
      [isEven, asyncEvenNumbersGenerator(), true],
      [async(isEven), asyncNumbersGenerator(), false],
      [async(isEven), asyncEvenNumbersGenerator(), true],
      [variadicAsyncIsEven, asyncNumbersGenerator(), false],
      [variadicAsyncIsEven, asyncEvenNumbersGenerator(), true],
      [isEven, asyncNumbersGenerator(), false],
      [isEven, asyncEvenNumbersGenerator(), true],
      [async(isEven), asyncNumbersGenerator(), false],
      [async(isEven), asyncEvenNumbersGenerator(), true],
      [variadicAsyncIsEven, asyncNumbersGenerator(), false],
      [variadicAsyncIsEven, asyncEvenNumbersGenerator(), true],
    ]

    cases.forEach(([func, value, result, asserter = assert.strictEqual]) => {
      it(`${func.name}(${JSON.stringify(value)}) -> ${result}`, async () => {
        asserter(await every(func)(value), result)
      })
    })

    it('max concurrency 20', async () => {
      const asyncRange = async function* (to) {
        for (let index = 1; index < to; index++) {
          yield index
        }
      }
      let concurrencyCount = 0,
        maxConcurrencyCount = 0
      assert.strictEqual(await every(async number => {
        concurrencyCount += 1
        maxConcurrencyCount = Math.max(maxConcurrencyCount, concurrencyCount)
        await sleep(10)
        concurrencyCount -= 1
        return true
      })(asyncRange(40)), true)
      assert.strictEqual(concurrencyCount, 0)
      assert.strictEqual(maxConcurrencyCount, 20)
      assert.strictEqual(await every(async number => {
        maxConcurrencyCount = Math.max(maxConcurrencyCount, concurrencyCount)
        await sleep(10)
        if (number == 19) {
          return false
        }
        return true
      })(asyncRange(40)), false)
    })

    it('1', async () => {
      assert.strictEqual(every(() => true)(1), true)
    })
    it('null', async () => {
      assert.strictEqual(every(() => true)(null), true)
    })
    it('undefined', async () => {
      assert.strictEqual(every(() => true)(undefined), true)
      assert.strictEqual(every(() => true)(), true)
    })
  })

  describe('every - v1.5.15 regression', () => {
    const numbers = [1, 2, 3, 4, 5]
    const numbersObject = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    it('syncly evaluates fn against all items in iterable, true if all evaluations are truthy', async () => {
      ase(every(x => x > 5)(numbers), false)
      ase(every(x => x > 0)(numbers), true)
      ase(every(x => x > 5)(new Set(numbers)), false)
      ase(every(x => x > 0)(new Set(numbers)), true)
      ase(every(x => x > 5)(numbersObject), false)
      ase(every(x => x > 0)(numbersObject), true)
    })
    it('asyncly evaluates fn against all items in iterable, true if all evaluations are truthy', async () => {
      aok(every(async x => x > 5)(numbers) instanceof Promise)
      ase(await every(async x => x > 5)(numbers), false)
      ase(await every(async x => x > 0)(numbers), true)
      ase(await every(async x => x > 5)(new Set(numbers)), false)
      ase(await every(async x => x > 0)(new Set(numbers)), true)
      ase(await every(async x => x > 5)(numbersObject), false)
      ase(await every(async x => x > 0)(numbersObject), true)
    })
    it('tests a variadic async function', async () => {
      ase(
        await every(x => x < 2 ? Promise.resolve(true) : false)([1, 2, 3, 4, 5]),
        false,
      )
    })
  })

  describe('not', () => {
    it('API coverage', async () => {
      ase(
        not(1, 2, 3, (...numbers) => (
          numbers.every(num => typeof num == 'number')
        )),
        false,
      )

      ase(
        await not(Promise.resolve(1), 2, Promise.resolve(3), (...numbers) => (
          numbers.every(num => typeof num == 'number')
        )),
        false,
      )
    })
    it('not(someValue) -> !someValue', async () => {
      assert.strictEqual(not(false), true)
      assert.strictEqual(not(null), true)
      assert.strictEqual(not(1), false)
      assert.strictEqual(not(0), true)
    })
    it('[sync] not(isOdd)(x) === !isOdd(x)', async () => {
      ase(not(isOdd)(2), true)
      ase(not(isOdd)(1), false)
    })
    it('[async] not(isEven)(x) === !(await isEven(x))', async () => {
      aok(not(asyncIsEven)(2) instanceof Promise)
      ase(await not(asyncIsEven)(2), false)
      ase(await not(asyncIsEven)(1), true)
    })
  })

  describe('and', () => {
    it('API coverage', async () => {
      aok(
        and(1, 2, 3, [
          (...numbers) => numbers.every(num => typeof num == 'number'),
          (...numbers) => numbers.every(num => num < 5),
          (...numbers) => numbers.every(num => num > 0),
        ])
      )

      aok(
        await and(Promise.resolve(1), 2, Promise.resolve(3), [
          (...numbers) => numbers.every(num => typeof num == 'number'),
          (...numbers) => numbers.every(num => num < 5),
          (...numbers) => numbers.every(num => num > 0),
        ])
      )
    })

    it('all nonfunctions', async () => {
      assert.strictEqual(and([true, true, true]), true)
      assert.strictEqual(and([true, true, false]), false)
      assert.strictEqual(and([false, true, true]), false)
      assert.strictEqual(await and([Promise.resolve(true), true, true]), true)
      assert.strictEqual(await and([true, true, Promise.resolve(false)]), false)
      assert.strictEqual(await and([Promise.resolve(false), true, true]), false)
    })

    it('predicates', async () => {
      const isOdd = number => number % 2 == 1
      const isEven = number => number % 2 == 0
      const variadicAsyncIsOdd = number => number % 2 == 1 ? Promise.resolve(true) : false
      assert.strictEqual(and([isOdd, isOdd, isOdd, true])(3), true)
      assert.strictEqual(and([isOdd, isOdd, isOdd])(2), false)
      assert.strictEqual(and([isEven, isEven, isOdd])(2), false)
      assert.strictEqual(await and([async(isOdd), isOdd, isOdd, true])(3), true)
      assert.strictEqual(await and([isOdd, async(isOdd), isOdd])(3), true)
      assert.strictEqual(await and([isOdd, isOdd, async(isOdd)])(3), true)
      assert.strictEqual(await and([async(isOdd), async(isOdd), async(isOdd)])(3), true)
      assert.strictEqual(await and([variadicAsyncIsOdd, variadicAsyncIsOdd, variadicAsyncIsOdd])(3), true)
    })

    it('0 predicates true', async () => {
      assert.strictEqual(and([]), true)
    })

    it('null', async () => {
      assert.strictEqual(and([isOdd, isOdd, isOdd])(null), false)
    })

    it('undefined', async () => {
      assert.strictEqual(and([isOdd, isOdd, isOdd])(undefined), false)
      assert.strictEqual(and([isOdd, isOdd, isOdd])(), false)
    })

    const isGreaterThan1 = x => x > 1
    it('sync tests input against provided array of functions, true if all evaluations are truthy', async () => {
      ase(and([isOdd, isGreaterThan1])(3), true)
      ase(and([isOdd, isGreaterThan1])(1), false)
    })

    it('async tests input against provided array of functions, true if all evaluations are truthy', async () => {
      aok(and([asyncIsEven, isGreaterThan1])(2) instanceof Promise)
      ase(await and([asyncIsEven, isGreaterThan1])(2), true)
      ase(await and([asyncIsEven, isGreaterThan1])(0), false)
    })
  })

  describe('or', () => {
    it('API coverage', async () => {
      aok(
        or(1, 2, 3, [
          (...numbers) => numbers.every(num => typeof num == 'number'),
          false,
          false,
        ])
      )

      aok(
        await or(Promise.resolve(1), 2, Promise.resolve(3), [
          (...numbers) => numbers.every(num => typeof num == 'number'),
          false,
          false,
        ])
      )
    })

    it('all nonfunctions', async () => {
      assert.strictEqual(or([true, true, true]), true)
      assert.strictEqual(or([false, false, false]), false)
      assert.strictEqual(or([false, false, true]), true)
      assert.strictEqual(await or([true, true, Promise.resolve(true)]), true)
      assert.strictEqual(await or([Promise.resolve(false), false, false]), false)
      assert.strictEqual(await or([false, false, Promise.resolve(true)]), true)
    })

    const isOdd = number => number % 2 == 1
    const isEven = number => number % 2 == 0
    const variadicAsyncIsOdd = number => number % 2 == 1 ? Promise.resolve(true) : false
    it('predicates', async () => {
      assert.strictEqual(or([isOdd, isEven, true])(0), true)
      assert.strictEqual(or([isOdd, isOdd, isOdd])(0), false)
      assert.strictEqual(or([isOdd, isOdd, isOdd])(1), true)
      assert.strictEqual(or([isOdd, isOdd, isOdd, false])(3955), true)
      assert.strictEqual(await or([isOdd, isEven])(0), true)
      assert.strictEqual(await or([isOdd, async(isOdd), false, async(isEven)])(0), true)
      assert.strictEqual(await or([false, variadicAsyncIsOdd, variadicAsyncIsOdd, variadicAsyncIsOdd])(3955), true)
      assert.strictEqual(await or([variadicAsyncIsOdd, () => false, () => false])(3955), true)
      assert.strictEqual(await or([variadicAsyncIsOdd, () => false, () => false])(3956), false)
      assert.strictEqual(await or([() => false, variadicAsyncIsOdd, () => false])(3955), true)
      assert.strictEqual(await or([() => false, variadicAsyncIsOdd, () => false])(3956), false)
      assert.strictEqual(await or([async(isOdd), isEven])(0), true)
      assert.strictEqual(await or([async(isOdd), isOdd, isOdd])(0), false)
    })
  })

  describe('or - v1.5.15 regression', () => {
    const isGreaterThan1 = x => x > 1
    it('sync tests input against provided array of functions, true if any evaluations are truthy', async () => {
      ase(or([isOdd, isGreaterThan1])(3), true)
      ase(or([isOdd, isGreaterThan1])(0), false)
    })
    it('async tests input against provided array of functions, true if any evaluations are truthy', async () => {
      aok(or([asyncIsEven, isGreaterThan1])(2) instanceof Promise)
      ase(await or([asyncIsEven, isGreaterThan1])(2), true)
      ase(await or([asyncIsEven, isGreaterThan1])(1), false)
    })
  })

  describe('eq', () => {
    it('API coverage', async () => {
      aok(eq(2, 2))
      aok(await eq(Promise.resolve(2), 2))
      aok(await eq(2, Promise.resolve(2)))
      aok(await eq(Promise.resolve(2), Promise.resolve(2)))
      aok(
        eq(2, number => number * 2, number => number + 2)
      )
      aok(
        eq(number => number * 2, number => number + 2)(2)
      )
      aok(
        await eq(Promise.resolve(2), number => number * 2, number => number + 2)
      )
      aok(eq(2, number => number * 2, 4))
      aok(await eq(Promise.resolve(2), number => number * 2, 4))
      aok(eq(2, 4, number => number ** 2))
      aok(await eq(Promise.resolve(2), 4, number => number ** 2))
    })

    it('[sync] eq(f, g)(x) == (f(x) == g(x))', async () => {
      ase(eq(x => `${x}`, x => x)('hey'), true)
      ase(eq(x => `${x}`, x => x)(1), true)
    })
    it('[async] eq(f, g)(x) == (f(x) == g(x))', async () => {
      aok(eq(x => `${x}`, async x => x)('hey') instanceof Promise)
      ase(await eq(async x => `${x}`, async x => x)('hey'), true)
      ase(await eq(async x => `${x}`, async x => x)(1), true)
    })
    it('[sync] eq(f, value)(x) == (valueA == valueB)', async () => {
      ase(eq(() => 'hey', 'hey')('abc'), true)
      ase(eq(() => 'hey', 'ho')('abc'), false)
    })
    it('[async] eq(f, value)(x) == (valueA == valueB)', async () => {
      ase(await eq(async () => 'hey', 'hey')('abc'), true)
      ase(await eq('hey', async () => 'ho')('abc'), false)
    })
    it('[sync] eq(value, g)(x) == (valueA == valueB)', async () => {
      ase(eq('hey', () => 'hey')('abc'), true)
      ase(eq('hey', () => 'ho')('abc'), false)
    })
    it('[async] eq(value, g)(x) == (value == g(x))', async () => {
      aok(eq('hey', async x => x)('hey') instanceof Promise)
      ase(await eq('hey', async x => x)('hey'), true)
      ase(await eq(async x => x, 'hey')('hey'), true)
      ase(await eq('ho', async x => x)(1), false)
    })
    it('[sync] eq(valueA, valueB) == (valueA == valueB)', () => {
      ase(eq('hey', 'hey'), true)
      ase(eq('hey', 'ho'), false)
    })
    it('false for eq(string,)', () => {
      assert.strictEqual(eq('hey',), false)
    })
  })

  describe('gt', () => {
    it('API coverage', async () => {
      aok(
        gt(1, number => number, number => number * 0)
      )
      aok(
        await gt(Promise.resolve(1), number => number, number => number * 0)
      )
      aok(gt(1, number => number, 0))
      aok(await gt(Promise.resolve(1), number => number, 0))
      aok(gt(1, 3, number => number * 0))
      aok(await gt(Promise.resolve(1), 3, number => number * 0))
    })
    it('[sync] gt(f, g)(x) === (f(x) > g(x))', async () => {
      ase(gt(x => x + 1, x => x)(1), true)
      ase(gt(x => x, x => x)(1), false)
      ase(gt(x => x, x => x + 1)(1), false)
    })
    it('[async] gt(f, g)(x) === (f(x) > g(x))', async () => {
      aok(gt(x => x + 1, async x => x)(1) instanceof Promise)
      ase(await gt(x => x + 1, async x => x)(1), true)
      ase(await gt(async x => x, x => x)(1), false)
      ase(await gt(async x => x, async x => x + 1)(1), false)
    })
    it('[sync] gt(f, value)(x) === (valueA > valueB)', async () => {
      ase(gt(() => 1, 0)('abc'), true)
      ase(gt(() => 1, 1)('abc'), false)
      ase(gt(() => 0, 1)('abc'), false)
    })
    it('[sync] gt(value, g)(x) === (valueA > valueB)', async () => {
      ase(gt(1, () => 0)('abc'), true)
      ase(gt(1, () => 1)('abc'), false)
      ase(gt(0, () => 1)('abc'), false)
    })
    it('[async] gt(value, g)(x) === (value > g(x))', async () => {
      aok(gt(1, async x => x)(2) instanceof Promise)
      ase(await gt(1, async x => x)(0), true)
      ase(await gt(1, async x => x)(1), false)
      ase(await gt(1, async x => x)(2), false)
      ase(await gt(async x => x, 0)(1), true)
      ase(await gt(async x => x, 1)(1), false)
      ase(await gt(async x => x, 2)(1), false)
    })
    it('[sync] gt(valueA, valueB) === (valueA > valueB)', () => {
      ase(gt(1, 0), true)
      ase(gt(1, 1), false)
      ase(gt(0, 1), false)
    })
    it('throws RangeError on not enough arguments', async () => {
      assert.strictEqual(gt('hey'), false)
    })
  })

  describe('lt', () => {
    it('API coverage', async () => {
      aok(
        lt(5, number => number - 3, number => number + 3)
      )
      aok(
        await lt(Promise.resolve(5), number => number - 3, number => number + 3)
      )
      aok(lt(5, 2, number => number + 3))
      aok(await lt(Promise.resolve(5), 2, number => number + 3))
      aok(lt(5, number => number - 3, 5))
      aok(await lt(Promise.resolve(5), number => number - 3, 5))
    })
    it('[sync] lt(f, g)(x) === (f(x) < g(x))', async () => {
      ase(lt(x => x + 1, x => x)(1), false)
      ase(lt(x => x, x => x)(1), false)
      ase(lt(x => x, x => x + 1)(1), true)
    })
    it('[async] lt(f, g)(x) === (f(x) < g(x))', async () => {
      aok(lt(x => x + 1, async x => x)(1) instanceof Promise)
      ase(await lt(x => x + 1, async x => x)(1), false)
      ase(await lt(async x => x, x => x)(1), false)
      ase(await lt(async x => x, async x => x + 1)(1), true)
    })
    it('[sync] lt(f, value)(x) === (valueA < valueB)', async () => {
      ase(lt(() => 1, 0)('abc'), false)
      ase(lt(() => 1, 1)('abc'), false)
      ase(lt(() => 0, 1)('abc'), true)
    })
    it('[sync] lt(value, g)(x) === (valueA < valueB)', async () => {
      ase(lt(1, () => 0)('abc'), false)
      ase(lt(1, () => 1)('abc'), false)
      ase(lt(0, () => 1)('abc'), true)
    })
    it('[async] lt(value, g)(x) === (value < g(x))', async () => {
      aok(lt(1, async x => x)(2) instanceof Promise)
      ase(await lt(1, async x => x)(0), false)
      ase(await lt(1, async x => x)(1), false)
      ase(await lt(1, async x => x)(2), true)
      ase(await lt(async x => x, 0)(1), false)
      ase(await lt(async x => x, 1)(1), false)
      ase(await lt(async x => x, 2)(1), true)
    })
    it('[sync] lt(valueA, valueB) === (valueA < valueB)', () => {
      ase(lt(1, 0), false)
      ase(lt(1, 1), false)
      ase(lt(0, 1), true)
    })
    it('throws RangeError on not enough arguments', () => {
      assert.strictEqual(lt('hey'), false)
    })
  })

  describe('gte', () => {
    it('API coverage', async () => {
      aok(
        gte(5, number => number + 3, number => number + 3)
      )
      aok(
        await gte(Promise.resolve(5), number => number + 3, number => number + 3)
      )
      aok(gte(5, 10, number => number + 3))
      aok(await gte(Promise.resolve(5), 10, number => number + 3))
      aok(gte(5, number => number + 3, 5))
      aok(await gte(Promise.resolve(5), number => number + 3, 5))
    })
    it('[sync] gte(f, g)(x) === (f(x) >= g(x))', async () => {
      ase(gte(x => x + 1, x => x)(1), true)
      ase(gte(x => x, x => x)(1), true)
      ase(gte(x => x, x => x + 1)(1), false)
    })
    it('[async] gte(f, g)(x) === (f(x) >= g(x))', async () => {
      aok(gte(x => x + 1, async x => x)(1) instanceof Promise)
      ase(await gte(x => x + 1, async x => x)(1), true)
      ase(await gte(async x => x, x => x)(1), true)
      ase(await gte(async x => x, async x => x + 1)(1), false)
    })
    it('[sync] gte(f, value)(x) === (valueA >= valueB)', async () => {
      ase(gte(() => 1, 0)('abc'), true)
      ase(gte(() => 1, 1)('abc'), true)
      ase(gte(() => 0, 1)('abc'), false)
    })
    it('[sync] gte(value, g)(x) === (valueA >= valueB)', async () => {
      ase(gte(1, () => 0)('abc'), true)
      ase(gte(1, () => 1)('abc'), true)
      ase(gte(0, () => 1)('abc'), false)
    })
    it('[async] gte(value, g)(x) === (value >= g(x))', async () => {
      aok(gte(1, async x => x)(2) instanceof Promise)
      ase(await gte(1, async x => x)(0), true)
      ase(await gte(1, async x => x)(1), true)
      ase(await gte(1, async x => x)(2), false)
      ase(await gte(async x => x, 0)(1), true)
      ase(await gte(async x => x, 1)(1), true)
      ase(await gte(async x => x, 2)(1), false)
    })
    it('[sync] gte(valueA, valueB)(x) === (valueA >= valueB)', () => {
      ase(gte(1, 0), true)
      ase(gte(1, 1), true)
      ase(gte(0, 1), false)
    })
    it('throws RangeError on not enough arguments', () => {
      assert.strictEqual(gte('hey'), false)
    })
  })

  describe('lte', () => {
    it('API coverage', async () => {
      aok(
        lte(5, number => number + 3, number => number + 3)
      )
      aok(
        await lte(Promise.resolve(5), number => number + 3, number => number + 3)
      )
      aok(lte(5, 0, number => number + 3))
      aok(await lte(Promise.resolve(5), 0, number => number + 3))
      aok(lte(5, number => number + 3, 10))
      aok(await lte(Promise.resolve(5), number => number + 3, 10))
    })
    it('[sync] lte(f, g)(x) === (f(x) <= g(x))', async () => {
      ase(lte(x => x + 1, x => x)(1), false)
      ase(lte(x => x, x => x)(1), true)
      ase(lte(x => x, x => x + 1)(1), true)
    })
    it('[async] lte(f, g)(x) === (f(x) <= g(x))', async () => {
      aok(lte(x => x + 1, async x => x)(1) instanceof Promise)
      ase(await lte(x => x + 1, async x => x)(1), false)
      ase(await lte(async x => x, x => x)(1), true)
      ase(await lte(async x => x, async x => x + 1)(1), true)
    })
    it('[sync] lte(f, value)(x) === (valueA <= valueB)', async () => {
      ase(lte(() => 1, 0)('abc'), false)
      ase(lte(() => 1, 1)('abc'), true)
      ase(lte(() => 0, 1)('abc'), true)
    })
    it('[sync] lte(value, g)(x) === (valueA <= valueB)', async () => {
      ase(lte(1, () => 0)('abc'), false)
      ase(lte(1, () => 1)('abc'), true)
      ase(lte(0, () => 1)('abc'), true)
    })
    it('[async] lte(value, g)(x) === (value <= g(x))', async () => {
      aok(lte(1, async x => x)(2) instanceof Promise)
      ase(await lte(1, async x => x)(0), false)
      ase(await lte(1, async x => x)(1), true)
      ase(await lte(1, async x => x)(2), true)
      ase(await lte(async x => x, 0)(1), false)
      ase(await lte(async x => x, 1)(1), true)
      ase(await lte(async x => x, 2)(1), true)
    })
    it('[sync] lte(valueA, valueB)(x) === (valueA <= valueB)', () => {
      ase(lte(1, 0), false)
      ase(lte(1, 1), true)
      ase(lte(0, 1), true)
    })
    it('throws RangeError on not enough arguments', () => {
      assert.strictEqual(lte('hey'), false)
    })
  })

  describe('thunkify', () => {
    const add2 = (a, b) => a + b
    const thunkAdd212 = thunkify(add2, 1, 2)
    it('creates a thunk', async () => {
      assert.strictEqual(thunkAdd212.length, 0)
      assert.strictEqual(thunkAdd212(), 3)
    })

    const asyncThunkAdd212 = thunkify(add2, Promise.resolve(1), 2)
    it('creates a thunk that resolves any promise arguments', async () => {
      assert.strictEqual(asyncThunkAdd212.length, 0)
      assert.strictEqual(await asyncThunkAdd212(), 3)
    })
  })

  describe('always', () => {
    it('always returns a value', async () => {
      assert.strictEqual(always(1)(), 1)
      assert.strictEqual(always(null)(), null)
      assert.strictEqual(always(NaN)(), NaN)
    })
  })

  describe('curry', () => {
    const add3 = (a, b, c) => a + b + c
    const curriedAdd3 = curry(add3)
    it('round robin', async () => {
      assert.strictEqual(curry(add3, 'a', 'b', 'c'), 'abc')
      assert.strictEqual(curry(add3)('a', 'b', 'c'), 'abc')
      assert.strictEqual(curry(add3, 'a')('b', 'c'), 'abc')
      assert.strictEqual(curry(add3, 'a', 'b')('c'), 'abc')
      assert.strictEqual(curry(add3)('a', 'b')('c'), 'abc')
      assert.strictEqual(curry(add3)('a')('b', 'c'), 'abc')
      assert.strictEqual(curry(add3)('a')('b')('c'), 'abc')
    })

    it('with placeholder __', async () => {
      assert.strictEqual(curry(add3, __, 'b', 'c')('a'), 'abc')
      assert.strictEqual(curry(add3, 'a', __, 'c')('b'), 'abc')
      assert.strictEqual(curry(add3, 'a', 'b', __)('c'), 'abc')
      assert.strictEqual(curry(add3, 'a', __, __)('b', 'c'), 'abc')
      assert.strictEqual(curry(add3, __, 'b', __)('a', 'c'), 'abc')
      assert.strictEqual(curry(add3, __, __, 'c')('a', 'b'), 'abc')
      assert.strictEqual(curry(add3, __, __, __)('a', 'b', 'c'), 'abc')
      assert.strictEqual(curry(add3, __, __, __)(__, __, __)('a', 'b', 'c'), 'abc')
      assert.strictEqual(curry(add3, __, __, __)(__, 'b', 'c')('a'), 'abc')
      assert.strictEqual(curry(add3, __, __, __)('a', __, 'c')('b'), 'abc')
      assert.strictEqual(curry(add3, __, __, __)('a', 'b', __)('c'), 'abc')
      assert.strictEqual(curry(add3)(__, __)(__)('a', 'b', __)('c'), 'abc')
      assert.strictEqual(curry(add3)(__)(__, __)('a')('b')(__)('c'), 'abc')
      assert.strictEqual(curry(add3)(__)(__)(__)('a', 'b', __)('c'), 'abc')
      assert.strictEqual(curry(add3)(__)(__)(__)('a')('b')(__)('c'), 'abc')
    })
  })

  describe('curry.arity', () => {
    const add3 = (a, b, c) => a + b + c
    const curriedAdd3 = curry.arity(3, add3)
    it('round robin', async () => {
      assert.strictEqual(curry.arity(3, add3, 'a', 'b', 'c'), 'abc')
      assert.strictEqual(curry.arity(3, add3)('a', 'b', 'c'), 'abc')
      assert.strictEqual(curry.arity(3, add3, 'a')('b', 'c'), 'abc')
      assert.strictEqual(curry.arity(3, add3, 'a', 'b')('c'), 'abc')
      assert.strictEqual(curry.arity(3, add3)('a', 'b')('c'), 'abc')
      assert.strictEqual(curry.arity(3, add3)('a')('b', 'c'), 'abc')
      assert.strictEqual(curry.arity(3, add3)('a')('b')('c'), 'abc')
    })

    it('with placeholder __', async () => {
      assert.strictEqual(curry.arity(3, add3, __, 'b', 'c')('a'), 'abc')
      assert.strictEqual(curry.arity(3, add3, 'a', __, 'c')('b'), 'abc')
      assert.strictEqual(curry.arity(3, add3, 'a', 'b', __)('c'), 'abc')
      assert.strictEqual(curry.arity(3, add3, 'a', __, __)('b', 'c'), 'abc')
      assert.strictEqual(curry.arity(3, add3, __, 'b', __)('a', 'c'), 'abc')
      assert.strictEqual(curry.arity(3, add3, __, __, 'c')('a', 'b'), 'abc')
      assert.strictEqual(curry.arity(3, add3, __, __, __)('a', 'b', 'c'), 'abc')
      assert.strictEqual(curry.arity(3, add3, __, __, __)(__, __, __)('a', 'b', 'c'), 'abc')
      assert.strictEqual(curry.arity(3, add3, __, __, __)(__, 'b', 'c')('a'), 'abc')
      assert.strictEqual(curry.arity(3, add3, __, __, __)('a', __, 'c')('b'), 'abc')
      assert.strictEqual(curry.arity(3, add3, __, __, __)('a', 'b', __)('c'), 'abc')
      assert.strictEqual(curry.arity(3, add3)(__, __)(__)('a', 'b', __)('c'), 'abc')
      assert.strictEqual(curry.arity(3, add3)(__)(__, __)('a')('b')(__)('c'), 'abc')
      assert.strictEqual(curry.arity(3, add3)(__)(__)(__)('a', 'b', __)('c'), 'abc')
      assert.strictEqual(curry.arity(3, add3)(__)(__)(__)('a', 'b', __)('c'), 'abc')
      assert.strictEqual(curry.arity(3, add3)(__)(__)(__)('a')('b')(__)('c'), 'abc')
    })
  })

  describe('__', () => {
    it('is Symbol(placeholder)', async () => {
      assert.strictEqual(typeof __, 'symbol')
    })
  })

  it('exports 31 functions', async () => {
    ase(Object.keys(rubico).length, 31)
  })
})
