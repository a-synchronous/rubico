const assert = require('assert')
const stream = require('stream')
const path = require('path')
const fs = require('fs')
const rubico = require('.')

const {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
} = rubico

const ase = assert.strictEqual

const ade = assert.deepEqual

const aok = assert.ok

const sleep = ms => new Promise(resolve => { setTimeout(resolve, ms) })

const hi = x => x + 'hi'

const ho = x => x + 'ho'

const isOdd = x => (x % 2 === 1)

const square = x => x ** 2

const arrayOf = (getter, length) => Array.from(
  { length },
  typeof getter === 'function' ? getter : () => getter,
)

const asyncIsEven = x => new Promise(resolve => {
  setImmediate(() => resolve(x % 2 === 0))
})

const asyncHey = x => new Promise(resolve => {
  setImmediate(() => resolve(x + 'hey'))
})

const asyncMult = (y, xi) => new Promise(resolve => {
  setImmediate(() => resolve(y * xi))
})

const asyncArrayReduce = (fn, x0) => async x => {
  if (x.length < 2) throw new Error('array must have length >= 2')
  let y, i
  if (x0 === undefined || x0 === null) {
    y = await fn(x[0], x[1])
    i = 2
  } else {
    y = await fn(x0, x[0])
    i = 1
  }
  while (i < x.length) { y = await fn(y, x[i]); i += 1 }
  return y
}

const constructReadStream = iterable => {
  const y = new stream.Readable({ objectMode: true })
  y._read = () => {}
  for (const x of iterable) y.push(x)
  y.push(null)
  return y
}

const consumeReadStreamPush = s => new Promise((resolve, reject) => {
  let y = ''
  s.on('data', chunk => { y += chunk })
  s.on('end', () => resolve(y))
  s.on('error', err => reject(err))
})

const consumeReadStreamPull = s => new Promise((resolve, reject) => {
  let y = ''
  s.on('readable', () => {
    let chunk
    while (chunk = s.read()) y += `${chunk}`
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

describe('rubico', () => {
  describe('pipe', () => {
    it('chains async and regular functions together', async () => {
      ase(await pipe([hi, ho, asyncHey])('yo'), 'yohihohey')
    })
    it('chains functions in reverse if passed a reducer (very contrived)', async () => {
      ase(await pipe([hi, ho, asyncHey])((y, xi) => y + xi), '(y, xi) => y + xiheyhohi')
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
    it('throws a TypeError if first argument not an array', async () => {
      assert.throws(
        () => {
          pipe(() => 1, undefined, () => 2)
        },
        new TypeError('pipe(fns); fns is not an array of functions'),
      )
    })
    it('throws a RangeError if passed less than one function', async () => {
      assert.throws(
        () => pipe([]),
        new RangeError('pipe(fns); fns is not an array of at least one function'),
      )
    })
    it('throws a TypeError if any arguments are not a function', async () => {
      assert.throws(
        () => {
          pipe([() => 1, undefined, () => 2])
        },
        new TypeError('pipe(fns); fns[1] is not a function'),
      )
    })
    it('handles sync errors good', async () => {
      assert.throws(
        () => pipe([hi, hi, x => { throw new Error(`throwing ${x}`) }])('yo'),
        new Error('throwing yohihi'),
      )
    })
    it('handles async errors good', async () => {
      assert.rejects(
        () => pipe([hi, asyncHey, x => { throw new Error(`throwing ${x}`) }])('yo'),
        new Error('throwing yohihey'),
      )
    })
  })

  describe('fork', () => {
    it('maps input to array of sync functions', async () => {
      ade(fork([hi, hi, hi])('yo'), ['yohi', 'yohi', 'yohi'])
    })
    it('maps input to object of sync functions', async () => {
      ade(
        fork({ a: hi, b: hi, c: hi })('yo'),
        { a: 'yohi', b: 'yohi', c: 'yohi' },
      )
    })
    it('maps input to array of async functions', async () => {
      aok(fork([asyncHey, asyncHey, asyncHey])('yo') instanceof Promise)
      ade(
        await fork([asyncHey, asyncHey, asyncHey])('yo'),
        ['yohey', 'yohey', 'yohey'],
      )
    })
    it('maps input to object of async functions', async () => {
      aok(fork({ a: asyncHey, b: asyncHey, c: asyncHey })('yo') instanceof Promise)
      ade(
        await fork({ a: asyncHey, b: asyncHey, c: asyncHey })('yo'),
        { a: 'yohey', b: 'yohey', c: 'yohey' },
      )
    })
    it('any functions async => Promise', async () => {
      aok(fork([asyncHey, asyncHey, hi])('yo') instanceof Promise)
      ade(
        await fork([asyncHey, asyncHey, hi])('yo'),
        ['yohey', 'yohey', 'yohi'],
      )
    })
    it('throws TypeError for fork([])', async () => {
      assert.throws(
        () => fork([]),
        new RangeError('fork(x); x is not an array of at least one function'),
      )
    })
    it('throws TypeError for fork({})', async () => {
      assert.throws(
        () => fork({}),
        new RangeError('fork(x); x is not an object of at least one entry'),
      )
    })
    it('throws TypeError for fork([nonFunction])', async () => {
      assert.throws(
        () => fork(['hey']),
        new TypeError('fork(x); x[0] is not a function'),
      )
    })
    it('throws TypeError for fork({ a: nonFunction })', async () => {
      assert.throws(
        () => fork({ a: 'hey' }),
        new TypeError('fork(x); x[\'a\'] is not a function'),
      )
    })
    it('throws TypeError for String', async () => {
      assert.throws(
        () => fork('ayelmao'),
        new TypeError('fork(x); x invalid'),
      )
    })
    it('throws TypeError for Set', async () => {
      assert.throws(
        () => fork(new Set([hi])),
        new TypeError('fork(x); x invalid'),
      )
    })
    it('throws TypeError for Map', async () => {
      assert.throws(
        () => fork(new Map([['a', hi]])),
        new TypeError('fork(x); x invalid'),
      )
    })
  })

  describe('fork.series', () => {
    it('syncly forks into array of functions', async () => {
      const arr = []
      ade(
        fork.series([
          () => { arr.push(1); return 'a' },
          () => { arr.push(2); return 'b' },
          () => { arr.push(3); return 'c' },
        ])(),
        ['a', 'b', 'c']
      )
      ade(arr, [1, 2, 3])
    })
    it('asyncly forks into array of functions, running each function in series', async () => {
      const arr = []
      const staggeredPush = fork.series([
        () => sleep(10).then(() => { arr.push(1); return 'a' }),
        () => sleep(5).then(() => { arr.push(2); return 'b' }),
        () => { arr.push(3); return 'c' },
      ])()
      aok(staggeredPush instanceof Promise)
      ade(await staggeredPush, ['a', 'b', 'c'])
      ade(arr, [1, 2, 3])
      const arr2 = []
      const parallelPush = fork([
        () => sleep(10).then(() => { arr2.push(1); return 'a' }),
        () => sleep(5).then(() => { arr2.push(2); return 'b' }),
        () => { arr2.push(3); return 'c' },
      ])()
      aok(parallelPush instanceof Promise)
      ade(await parallelPush, ['a', 'b', 'c'])
      ade(arr2, [3, 2, 1])
    })
    it('throws TypeError for fork([])', async () => {
      assert.throws(
        () => fork.series([]),
        new RangeError('fork.series(x); x is not an array of at least one function'),
      )
    })
    it('throws TypeError for fork([nonFunction])', async () => {
      assert.throws(
        () => fork.series(['hey']),
        new TypeError('fork.series(x); x[0] is not a function'),
      )
    })
    it('throws TypeError for non array functions', async () => {
      assert.throws(
        () => fork.series({}),
        new TypeError('fork.series(x); x invalid'),
      )
    })
  })

  describe('assign', () => {
    it('maps input to object of sync functions then merges', async () => {
      ade(
        assign({
          b: x => x.a + 'yo',
          c: x => x.a + 'yaya',
        })({ a: 'a' }),
        { a: 'a', b: 'ayo', c: 'ayaya' },
      )
    })
    it('maps input to object of async functions then merges', async () => {
      aok(assign({
        b: async x => x.a + 'yo',
        c: async x => x.a + 'yaya',
      })({ a: 'a' }) instanceof Promise)
      ade(
        await assign({
          b: async x => x.a + 'yo',
          c: async x => x.a + 'yaya',
        })({ a: 'a' }),
        { a: 'a', b: 'ayo', c: 'ayaya' },
      )
    })
    it('throws TypeError on assign(nonObject)', async () => {
      assert.throws(
        () => assign(new Set(['hey'])),
        new TypeError('assign(funcs); funcs is not an object of functions'),
      )
    })
    it('throws TypeError on assign(...)(nonObject)', async () => {
      assert.throws(
        () => assign({ a: hi })('hi'),
        new TypeError('assign(...)(x); x is not an object'),
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
    it('throws a TypeError if passed a non function', async () => {
      assert.throws(
        () => tap('hey'),
        new TypeError('tap(f); f is not a function'),
      )
    })
  })

  describe('tap.if', () => {
    xit('[sync] tap.if(condition, f); conditional tap; only calls fn on truthy condition', async () => {
      const isOdd = x => x % 2 === 1
      const oddNumbers = []
      ade(
        tap.if(isOdd, number => oddNumbers.push(number))([1, 2, 3, 4, 5]),
        [1, 2, 3, 4, 5],
      )
      ade(oddNumbers, [1, 3, 5])
    })
    xit('[async] tap.if(condition, f); conditional tap; only calls fn on truthy condition')
    xit('throws TypeError on tap.if(nonFunction, f)')
    xit('throws TypeError on tap.if(condition, nonFunction)')
    xit('handles errors thrown from condition of tap.if(condition, f)')
    xit('handles errors thrown from f of tap.if(condition, f)')
  })

  describe('tryCatch', () => {
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
      assert.throws(
        () => tryCatch('hey', () => {}),
        new TypeError('tryCatch(x, y); x is not a function'),
      )
    })
    it('throws a TypeError if passed a non function catcher', async () => {
      assert.throws(
        () => tryCatch(() => {}, Buffer.from('abc')),
        new TypeError('tryCatch(x, y); y is not a function'),
      )
    })
  })

  describe('switchCase', () => {
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
    it('switches on provided async functions', async () => {
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
    it('throws a TypeError if passed a non array', async () => {
      assert.throws(
        () => switchCase('hey'),
        new TypeError('switchCase(fns); fns is not an array of functions'),
      )
    })
    it('throws a RangeError if passed less than three functions', async () => {
      assert.throws(
        () => switchCase([() => false, () => 'hey']),
        new RangeError('switchCase(fns); fns is not an array of at least three functions'),
      )
    })
    it('throws a RangeError if passed an even number of functions', async () => {
      assert.throws(
        () => switchCase([() => false, () => 'hey', () => true, () => 'ho']),
        new RangeError('switchCase(fns); fns is not an array of an odd number of functions'),
      )
    })
    it('throws a TypeError if any item is not a function', async () => {
      assert.throws(
        () => switchCase([() => false, 'hey', () => true, () => 'ho', () => 'hi']),
        new TypeError('switchCase(fns); fns[1] is not a function'),
      )
    })
  })

  describe('map', () => {
    it('lazily applies an async function in parallel to all values of an async iterable', async () => {
      aok(!(map(async x => x + 1)(makeAsyncNumbers()) instanceof Promise))
      aok(map(async x => x + 1)(makeAsyncNumbers())[Symbol.asyncIterator])
      aok(asyncIteratorToArray(
        map(async x => x + 1)(makeAsyncNumbers()),
      ) instanceof Promise)
      ade(
        await asyncIteratorToArray(
          map(async x => x + 1)(makeAsyncNumbers()),
        ),
        [2, 3, 4, 5, 6]
      )
    })
    it('lazily applies a sync function in parallel to all values of an async iterable', async () => {
      aok(!(map(x => x + 1)(makeAsyncNumbers()) instanceof Promise))
      aok(map(x => x + 1)(makeAsyncNumbers())[Symbol.asyncIterator])
      aok(asyncIteratorToArray(
        map(x => x + 1)(makeAsyncNumbers()),
      ) instanceof Promise)
      ade(
        await asyncIteratorToArray(
          map(x => x + 1)(makeAsyncNumbers()),
        ),
        [2, 3, 4, 5, 6]
      )
    })
    it('lazily applies an async function in parallel to all values of a sync generator iterable', async () => {
      aok(!(map(async x => x + 1)(makeNumbers()) instanceof Promise))
      aok(map(async x => x + 1)(makeNumbers())[Symbol.iterator])
      aok(iteratorToArray(
        map(async x => x + 1)(makeNumbers()),
      ) instanceof Promise)
      ade(
        await iteratorToArray(
          map(async x => x + 1)(makeNumbers()),
        ),
        [2, 3, 4, 5, 6],
      )
    })
    it('lazily applies a sync function in parallel to all values of a sync generator iterable', async () => {
      aok(map(x => x + 1)(makeNumbers())[Symbol.iterator])
      ade(
        iteratorToArray(
          map(x => x + 1)(makeNumbers()),
        ),
        [2, 3, 4, 5, 6],
      )
    })
    it('applies an async function in parallel to all elements of an array', async () => {
      aok(map(asyncHey)(['yo', 1]) instanceof Promise)
      ade(
        await map(asyncHey)(['yo', 1]),
        ['yohey', '1hey'],
      )
    })
    it('applies a sync function to all elements of an array', async () => {
      ade(
        map(hi)(['yo', 1]),
        ['yohi', '1hi'],
      )
    })
    it('applies an async function in parallel to all elements of a string', async () => {
      aok(map(async x => x + 'hey')('abcde') instanceof Promise)
      ade(
        await map(async x => x + 'hey')('abcde'),
        'aheybheycheydheyehey',
      )
    })
    it('applies a sync function to all elements of a string', async () => {
      ade(
        map(x => x + 'hi')('abcde'),
        'ahibhichidhiehi',
      )
    })
    it('applies an async function in parallel to all elements of a number typed array', async () => {
      for (const x of numberTypedArrayConstructors) {
        aok(map(async x => x + 1)(new x([1, 2, 3, 4, 5])) instanceof Promise)
        ade(
          await map(async x => x + 1)(new x([1, 2, 3, 4, 5])),
          new x([2, 3, 4, 5, 6]),
        )
      }
    })
    it('applies a sync function in parallel to all elements of a number typed array', async () => {
      for (const x of numberTypedArrayConstructors) {
        ade(
          map(x => x + 1)(new x([1, 2, 3, 4, 5])),
          new x([2, 3, 4, 5, 6]),
        )
      }
    })
    it('applies an async function in parallel to all elements of a bigint typed array', async () => {
      for (const x of bigIntTypedArrayConstructors) {
        aok(map(async x => x + 1n)(new x([1n, 2n, 3n, 4n, 5n])) instanceof Promise)
        ade(
          await map(async x => x + 1n)(new x([1n, 2n, 3n, 4n, 5n])),
          new x([2n, 3n, 4n, 5n, 6n]),
        )
      }
    })
    it('applies a sync function in parallel to all elements of a bigint typed array', async () => {
      for (const x of bigIntTypedArrayConstructors) {
        ade(
          map(x => x + 1n)(new x([1n, 2n, 3n, 4n, 5n])),
          new x([2n, 3n, 4n, 5n, 6n]),
        )
      }
    })
    it('applies an async function in parallel to all elements of a set', async () => {
      aok(map(asyncHey)(new Set(['yo', 1])) instanceof Promise)
      ade(
        await map(asyncHey)(new Set(['yo', 1])),
        new Set(['yohey', '1hey']),
      )
    })
    it('applies a sync function to all elements of a set', async () => {
      ade(
        map(hi)(new Set(['yo', 1])),
        new Set(['yohi', '1hi']),
      )
    })
    it('applies an async function in parallel to all elements of a map', async () => {
      aok(map(
        async ([k, v]) => [k + k, v + v],
      )(new Map([['a', 1], ['b', 2]])) instanceof Promise)
      ade(
        await map(async ([k, v]) => [k + k, v + v])(new Map([['a', 1], ['b', 2]])),
        new Map([['aa', 2], ['bb', 4]]),
      )
    })
    it('applies a sync function to all elements of a map', async () => {
      ade(
        map(([k, v]) => [k + k, v + v])(new Map([['a', 1], ['b', 2]])),
        new Map([['aa', 2], ['bb', 4]]),
      )
    })
    it('applies an async function in parallel to all values of an object', async () => {
      ade(
        await map(asyncHey)({ a: 'yo', b: 1 }),
        { a: 'yohey', b: '1hey' },
      )
    })
    it('applies a sync function to all values of an object', async () => {
      ade(
        map(hi)({ a: 'yo', b: 1 }),
        { a: 'yohi', b: '1hi' },
      )
    })
    it('acts as a map transducer: binary function => reducer', async () => {
      const addHiReducer = map(hi)((y, xi) => y + xi)
      ase(typeof addHiReducer, 'function')
      ase(addHiReducer.length, 2)
      const addHeyReducer = map(asyncHey)(
        (y, xi) => new Promise(resolve => resolve(y + xi)),
      )
      ase(typeof addHeyReducer, 'function')
      ase(addHeyReducer.length, 2)
    })
    it('transducer handles sync transformations', async () => {
      const addHiReducer = map(hi)((y, xi) => y + xi)
      ase([1, 2, 3].reduce(addHiReducer), '12hi3hi')
      ase([1, 2, 3].reduce(addHiReducer, ''), '1hi2hi3hi')
    })
    it('transducer handles async transformations', async () => {
      const addHeyReducer = map(asyncHey)((y, xi) => y + xi)
      aok(asyncArrayReduce(addHeyReducer)([1, 2, 3]) instanceof Promise)
      ase(await asyncArrayReduce(addHeyReducer)([1, 2, 3]), '12hey3hey')
      ase(await asyncArrayReduce(addHeyReducer, '')([1, 2, 3]), '1hey2hey3hey')
    })
    it('throws a TypeError on map(nonFunction)', async () => {
      assert.throws(
        () => map({}),
        new TypeError('map(f); f is not a function'),
      )
    })
    it('throws a TypeError on map(...)(null)', async () => {
      assert.throws(
        () => map(hi)(null),
        new TypeError('map(...)(x); x invalid')
      )
    })
    it('handles sync errors good', async () => {
      assert.throws(
        () => map(x => { throw new Error(`throwing ${x}`) })(['yo']),
        new Error('throwing yo')
      )
    })
    it('handles async errors good', async () => {
      assert.rejects(
        () => map(async x => { throw new Error(`throwing ${x}`) })(['yo']),
        new Error('throwing yo'),
      )
    })
  })

  describe('map.series', () => {
    it('syncly maps into array of functions', async () => {
      const arr = []
      ade(
        map.series(x => { arr.push(x); return x })([1, 2, 3]),
        [1, 2, 3],
      )
      ade(arr, [1, 2, 3])
    })
    it('asyncly forks into array of functions, running each function in series', async () => {
      const arr = []
      const invertedSleepPushSeries = map.series(
        x => sleep(15 - (x * 5)).then(() => { arr.push(x); return x })
      )([1, 2, 3])
      aok(invertedSleepPushSeries instanceof Promise)
      ade(await invertedSleepPushSeries, [1, 2, 3])
      ade(arr, [1, 2, 3])
      const arr2 = []
      const invertedSleepPush = map(
        x => sleep(15 - (x * 5)).then(() => { arr2.push(x); return x })
      )([1, 2, 3])
      aok(invertedSleepPush instanceof Promise)
      ade(await invertedSleepPush, [1, 2, 3])
      ade(arr2, [3, 2, 1])
    })
    it('throws TypeError for non functions', async () => {
      assert.throws(
        () => map.series('hey'),
        new TypeError('map.series(f); f is not a function'),
      )
    })
    it('throws TypeError for non array input', async () => {
      assert.throws(
        () => map.series(() => 1)('hey'),
        new TypeError('map.series(...)(x); x invalid'),
      )
    })
  })

  describe('map.pool', () => {
    const square = x => x ** 2
    const asyncSquare = async x => x ** 2
    it('maps with asynchronous limit for Arrays', async () => {
      aok(map.pool(1, square)([1, 2, 3, 4, 5]) instanceof Promise)
      ade(await map.pool(1, square)([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25])
      ade(await map.pool(9, square)([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25])
      ade(await map.pool(100, square)([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25])
      ade(await map.pool(1, asyncSquare)([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25])
      ade(await map.pool(9, asyncSquare)([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25])
    })
    it('=> [] for empty array', async () => {
      aok(map.pool(1, square)([]) instanceof Promise)
      ade(await map.pool(1, square)([]), [])
    })
    it('works for arrays of undefined values', async () => {
      ade(await map.pool(1, x => x)([,,,,,]), Array(5).fill(undefined))
      ade(await map.pool(1, x => x)(Array(5)), Array(5).fill(undefined))
      ade(await map.pool(1, x => x)(Array(5).fill(null)), Array(5).fill(null))
    })
    it('maps with asynchronous limit for Sets', async () => {
      const numbersSet = new Set([1, 2, 3, 4, 5])
      const squaresSet = new Set([1, 4, 9, 16, 25])
      aok(map.pool(1, square)(numbersSet) instanceof Promise)
      ade(await map.pool(1, square)(numbersSet), squaresSet)
      ade(await map.pool(9, square)(numbersSet), squaresSet)
      ade(await map.pool(100, square)(numbersSet), squaresSet)
      ade(await map.pool(1, asyncSquare)(numbersSet), squaresSet)
      ade(await map.pool(9, asyncSquare)(numbersSet), squaresSet)
    })
    it('maps with asynchronous limit for Maps', async () => {
      const squareEntry = entry => entry.map(square)
      const asyncSquareEntry = async entry => entry.map(square)
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
      let i = 0, maxi = 0, period = 10
      const plusSleepMinus = n => (async () => {
        i += 1
        maxi = Math.max(maxi, i)
      })().then(() => sleep(period)).then(() => {
        i -=1
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
      const x = await map.pool(2, plusSleepMinus)(new Set([1, 2, 3, 4, 5, 6]))
      assert.strictEqual(maxi, 2)
      assert.strictEqual(i, 0)
      maxi = 0
      await map.pool(3, plusSleepMinus)(new Set([1, 2, 3, 4, 5, 6]))
      assert.strictEqual(maxi, 3)
    }).timeout(20000)
    it('throws TypeError on map.pool(NaN)', async () => {
      assert.throws(
        () => map.pool(NaN),
        new TypeError('map.pool(size, f); invalid size NaN'),
      )
    })
    it('throws RangeError on map.pool(lessThan1)', async () => {
      assert.throws(
        () => map.pool(0),
        new RangeError('map.pool(size, f); size must be 1 or more'),
      )
    })
    it('throws TypeError on map.pool(lessThan1)', async () => {
      assert.throws(
        () => map.pool(1, 'hey'),
        new TypeError('map.pool(size, f); f is not a function'),
      )
    })
    it('throws TypeError on map.pool(lessThan1)', async () => {
      assert.throws(
        () => map.pool(1, () => {})('yo'),
        new TypeError('map.pool(...)(x); x invalid'),
      )
    })
    it('handles sync errors good', async () => {
      assert.rejects(
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

  describe('map.withIndex', () => {
    it('[sync] applies a function to each item of array with index and reference to array', async () => {
      const numbers = [100, 100, 100, 100, 100]
      ade(
        map.withIndex((xi, i, x) => xi + i - x[i])(numbers),
        [0, 1, 2, 3, 4],
      )
    })
    it('[async] applies a function to each item of array with index and reference to array', async () => {
      const numbers = [100, 100, 100, 100, 100]
      aok(map.withIndex(async (xi, i, x) => xi + i - x[i])(numbers) instanceof Promise)
      ade(
        await map.withIndex(async (xi, i, x) => xi + i - x[i])(numbers),
        [0, 1, 2, 3, 4],
      )
    })
    it('[sync] applies a function to each character of a string with index and value of string', async () => {
      ase(
        map.withIndex((xi, i, x) => xi + i + x[i])('abc'),
        'a0ab1bc2c',
      )
    })
    it('[async] applies a function to each character of a string with index and value of string', async () => {
      aok(
        map.withIndex(async (xi, i, x) => xi + i + x[i])('abc') instanceof Promise
      )
      ase(
        await map.withIndex(async (xi, i, x) => xi + i + x[i])('abc'),
        'a0ab1bc2c',
      )
    })
    it('throws a TypeError on map.withIndex(nonFunction)', async () => {
      assert.throws(
        () => map.withIndex({}),
        new TypeError('map.withIndex(x); x is not a function'),
      )
    })
    it('throws a TypeError on map.withIndex(...)(null)', async () => {
      assert.throws(
        () => map.withIndex(() => 'hi')(null),
        new TypeError('map.withIndex(...)(x); x invalid')
      )
    })
  })

  describe('filter', () => {
    it('lazily filters values from an async iterable based on an async predicate', async () => {
      aok(!(filter(async x => x <= 3)(makeAsyncNumbers()) instanceof Promise))
      aok(filter(async x => x <= 3)(makeAsyncNumbers())[Symbol.asyncIterator])
      aok(asyncIteratorToArray(
        filter(async x => x <= 3)(makeAsyncNumbers()),
      ) instanceof Promise)
      ade(
        await asyncIteratorToArray(
          filter(async x => x <= 3)(makeAsyncNumbers()),
        ),
        [1, 2, 3],
      )
    })
    it('lazily filters values from an async iterable based on a sync predicate', async () => {
      aok(!(filter(x => x <= 3)(makeAsyncNumbers()) instanceof Promise))
      aok(filter(x => x <= 3)(makeAsyncNumbers())[Symbol.asyncIterator])
      aok(asyncIteratorToArray(
        filter(x => x <= 3)(makeAsyncNumbers()),
      ) instanceof Promise)
      ade(
        await asyncIteratorToArray(
          filter(x => x <= 3)(makeAsyncNumbers()),
        ),
        [1, 2, 3],
      )
    })
    it('throws TypeError on filter(asyncFunction)(sync generator iterable)', async () => {
      assert.throws(
        () => iteratorToArray(
          filter(async x => x <= 3)(makeNumbers()),
        ),
        new TypeError([
          'filter(f)(x); xi is an element of x; ',
          'if x if the resulting iterator of a sync generator, ',
          'f(xi) cannot return a Promise',
        ].join('')),
      )
    })
    it('lazily filters elements of a sync generator iterable based on a sync predicate', async () => {
      aok(map(x => x + 1)(makeNumbers())[Symbol.iterator])
      ade(
        iteratorToArray(
          filter(x => x <= 3)(makeNumbers()),
        ),
        [1, 2, 3],
      )
    })
    it('filters characters from a string based on an async predicate', async () => {
      aok(filter(async x => x !== 'o')('heyoheyohey') instanceof Promise)
      ase(await filter(async x => x !== 'o')('heyoheyohey'), 'heyheyhey')
    })
    it('filters characters from a string based on a sync predicate', async () => {
      ase(filter(x => x !== 'o')('heyoheyohey'), 'heyheyhey')
    })
    it('filters values from a set based on an async predicate', async () => {
      aok(filter(async x => x <= 3)(new Set([1, 2, 3, 4, 5])) instanceof Promise)
      ade(
        await filter(async x => x <= 3)(new Set([1, 2, 3, 4, 5])),
        new Set([1, 2, 3]),
      )
    })
    it('filters values from a set based on a sync predicate', async () => {
      ade(
        filter(x => x <= 3)(new Set([1, 2, 3, 4, 5])),
        new Set([1, 2, 3]),
      )
    })
    it('filters entries from a map based on an async predicate', async () => {
      const numsMap = new Map([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]])
      aok(filter(async ([k, v]) => k <= 3 && v <= 3)(numsMap) instanceof Promise)
      ade(
        await filter(async ([k, v]) => k <= 3 && v <= 3)(numsMap),
        new Map([[1, 1], [2, 2], [3, 3]]),
      )
    })
    it('filters entries from a map based on a sync predicate', async () => {
      const numsMap = new Map([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]])
      ade(
        filter(([k, v]) => k <= 3 && v <= 3)(numsMap),
        new Map([[1, 1], [2, 2], [3, 3]]),
      )
    })
    it('filters bytes from a number typed array based on an async predicate', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        aok(filter(async x => x <= 3)(new constructor([1, 2, 3, 4, 5])) instanceof Promise)
        ade(
          await filter(async x => x <= 3)(new constructor([1, 2, 3, 4, 5])),
          new constructor([1, 2, 3]),
        )
      }
    })
    it('filters bytes from a number typed array based on a sync predicate', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        ade(
          filter(x => x <= 3)(new constructor([1, 2, 3, 4, 5])),
          new constructor([1, 2, 3]),
        )
      }
    })
    it('filters bytes from a bigint typed array based on an async predicate', async () => {
      for (const constructor of bigIntTypedArrayConstructors) {
        aok(filter(async x => x <= 3n)(new constructor([1n, 2n, 3n, 4n, 5n])) instanceof Promise)
        ade(
          await filter(async x => x <= 3)(new constructor([1n, 2n, 3n, 4n, 5n])),
          new constructor([1n, 2n, 3n]),
        )
      }
    })
    it('filters bytes from a bigint typed array based on a sync predicate', async () => {
      for (const constructor of bigIntTypedArrayConstructors) {
        ade(
          filter(x => x <= 3n)(new constructor([1n, 2n, 3n, 4n, 5n])),
          new constructor([1n, 2n, 3n]),
        )
      }
    })
    it('filters elements from an array with an async predicate', async () => {
      const evens = filter(asyncIsEven)([1, 2, 3, 4, 5])
      aok(evens instanceof Promise)
      ade(await evens, [2, 4])
    })
    it('filters elements from an array with a sync predicate', async () => {
      ade(
        filter(isOdd)([1, 2, 3, 4, 5]),
        [1, 3, 5],
      )
    })
    it('filters entries from an object with an async predicate', async () => {
      const evens = filter(asyncIsEven)({ a: 1, b: 2, c: 3, d: 4, e: 5 })
      aok(evens instanceof Promise)
      ade(await evens, { b: 2, d: 4 })
    })
    it('filters entries from an object with a sync predicate', async () => {
      ade(
        filter(isOdd)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
        { a: 1, c: 3, e: 5 },
      )
    })
    it('acts as a filter transducer: binary function => reducer', async () => {
      const addOddsReducer = filter(isOdd)((y, xi) => y + xi)
      ase(typeof addOddsReducer, 'function')
      ase(addOddsReducer.length, 2)
      const addEvensReducer = filter(asyncIsEven)((y, xi) => y + xi)
      ase(typeof addEvensReducer, 'function')
      ase(addEvensReducer.length, 2)
    })
    it('transducer handles async predicates', async () => {
      const addEvensReducer = filter(asyncIsEven)((y, xi) => y + xi)
      ase(await asyncArrayReduce(addEvensReducer, 0)([1, 2, 3, 4, 5, 6], 0), 12)
    })
    it('transducer handles sync predicates', async () => {
      const addOddsReducer = filter(isOdd)((y, xi) => y + xi)
      ase([1, 2, 3, 4, 5].reduce(addOddsReducer, 0), 9)
    })
    it('throws a TypeError on filter({})', async () => {
      assert.throws(
        () => filter({}),
        new TypeError('filter(predicate); predicate is not a function'),
      )
    })
    it('throws a TypeError on filter(...)(string)', async () => {
      assert.throws(
        () => filter(hi)(null),
        new TypeError('filter(...)(x); x invalid')
      )
    })
    it('handles sync errors good', async () => {
      assert.throws(
        () => filter(x => { throw new Error(`throwing ${x}`) })(['yo']),
        new Error('throwing yo')
      )
    })
    it('handles async errors good', async () => {
      assert.rejects(
        () => filter(async x => { throw new Error(`throwing ${x}`) })(['yo']),
        new Error('throwing yo'),
      )
    })
  })

  describe('filter.withIndex', () => {
    it('filters characters from a string based on an async predicate', async () => {
      aok(filter.withIndex(async (x, i) => x !== `${i}`)('01234555') instanceof Promise)
      ase(await filter.withIndex(async (x, i) => x !== `${i}`)('01234555'), '55')
    })
    it('filters characters from a string based on a sync predicate', async () => {
      ase(filter.withIndex((x, i) => x !== `${i}`)('01234555'), '55')
    })
    it('filters characters from an array based on an async predicate', async () => {
      aok(filter.withIndex(async (x, i) => x !== i)([0, 1, 2, 3, 4, 5, 5, 5]) instanceof Promise)
      ade(await filter.withIndex(async (x, i) => x !== i)([0, 1, 2, 3, 4, 5, 5, 5]), [5, 5])
    })
    it('filters characters from an array based on a sync predicate', async () => {
      ade(filter.withIndex((x, i) => x !== i)([0, 1, 2, 3, 4, 5, 5, 5]), [5, 5])
    })
    it('throws TypeError on filter.withIndex(nonFunction)', async () => {
      assert.throws(
        () => filter.withIndex('yo'),
        new TypeError('filter.withIndex(f); f is not a function'),
      )
    })
    it('throws TypeError on filter.withIndex(...)(invalid)', async () => {
      assert.throws(
        () => filter.withIndex(x => x)(0),
        new TypeError('filter.withIndex(...)(x); x invalid'),
      )
    })
  })

  describe('reduce', () => {
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
    it('returns a cancellable Promise for async iterables', async () => {
      const infiniteAsyncIterable = async function*() {
        await Promise.race([]),
        yield 'unreachable'
      }
      const add = (a, b) => a + b
      const p = reduce(add, 0)(infiniteAsyncIterable())
      aok(p instanceof Promise)
      p.cancel()
      assert.rejects(p, new Error('cancelled'))
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
    it('throws a TypeError on reduce(nonFunction)', async () => {
      assert.throws(
        () => reduce({}),
        new TypeError('reduce(x, y); x is not a function'),
      )
    })
    it('throws a TypeError on reduce(...)(number)', async () => {
      assert.throws(
        () => reduce((y, xi) => y + xi)(1),
        new TypeError('reduce(...)(x); x invalid'),
      )
    })
    it('throws a TypeError on reduce(...)(emptyIterator)', async () => {
      assert.throws(
        () => reduce((y, xi) => y + xi)([]),
        new TypeError('reduce(...)(x); x cannot be empty'),
      )
    })
    it('throws a TypeError on reduce(...)(emptyAsyncIterator)', async () => {
      assert.rejects(
        () => reduce((y, xi) => y + xi)((async function* () {})()),
        new TypeError('reduce(...)(x); x cannot be empty'),
      )
    })
  })

  describe('integration: transducers from pipe, map, filter, reduce', () => {
    const concat = (y, xi) => y.concat(xi)
    const add = (y, xi) => y + xi
    it('reduce with sync transduced reducers', async () => {
      const squareOdds = pipe([
        filter(isOdd),
        map(x => x ** 2),
      ])
      ade(
        reduce(squareOdds(concat), [])([1, 2, 3, 4, 5]),
        [1, 9, 25],
      )
      ade(
        reduce(squareOdds((y, xi) => y.add(xi)), new Set())([1, 2, 3, 4, 5]),
        new Set([1, 9, 25]),
      )
      const appendAlphas = pipe([
        map(x => x + 'a'),
        map(x => x + 'b'),
        map(x => x + 'c'),
      ])
      ase(
        reduce(appendAlphas(add), '')('123'),
        '1abc2abc3abc',
      )
      ade(
        reduce(appendAlphas(concat), [])('123'),
        ['1abc', '2abc', '3abc'],
      )
    })
    it('reduce with an async transduced reducer', async () => {
      const hosWithHey = pipe([
        filter(async x => x === 'ho'),
        map(x => Promise.resolve(x + 'hey')),
      ])
      const hihos = { a: 'hi', b: 'ho', c: 'hi', d: 'ho', e: 'hi', f: 'ho' }
      aok(reduce(hosWithHey(add), '')(hihos) instanceof Promise),
      aok(reduce(hosWithHey(concat), [])(hihos) instanceof Promise),
      ase(
        await reduce(hosWithHey(add), '')(hihos),
        'hoheyhoheyhohey',
      )
      ade(
        await reduce(hosWithHey(concat), [])(hihos),
        ['hohey', 'hohey', 'hohey'],
      )
    })
  })

  describe('transform', () => {
    const isBigOdd = x => (x % 2n === 1n)
    const asyncIsBigEven = async x => (x % 2n === 0n)
    const bigSquare = x => x ** 2n
    const squareOdds = pipe([filter(isOdd), map(square)])
    const squareOddsToString = pipe([
      filter(isOdd),
      map(pipe([square, x => `${x}`])),
    ])
    const squareBigOdds = pipe([filter(isBigOdd), map(bigSquare)])
    const asyncEvens = filter(asyncIsEven)
    const asyncEvensToString = pipe([
      filter(asyncIsEven),
      map(x => `${x}`)
    ])
    const asyncBigEvens = filter(asyncIsBigEven)
    const bigNumbers = [1n, 2n, 3n, 4n, 5n]
    it('sync transforms iterable to null', async () => {
      let y = ''
      ase(transform(map(tap(x => { y += x })), null)([1, 2, 3, 4, 5]), null)
      ase(y, '12345')
    })
    it('async transforms iterable to null', async () => {
      let y = ''
      aok(transform(map(tap(async () => {})), null)([1, 2, 3, 4, 5]) instanceof Promise)
      ase(await transform(map(tap(async x => { y += x })), null)([1, 2, 3, 4, 5]), null)
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
    it('sync transforms iterable to map', async () => {
      ade(
        transform(map(
          x => [x, x.charCodeAt(0)],
        ), new Map())('abc'),
        new Map([['a', 97], ['b', 98], ['c', 99]]),
      )
    })
    it('async transforms iterable to map', async () => {
      aok(
        transform(map(
          async x => [x, x.charCodeAt(0)],
        ), new Map())('abc') instanceof Promise
      )
      ade(
        await transform(map(
          async x => [x, x.charCodeAt(0)],
        ), new Map())('abc'),
        new Map([['a', 97], ['b', 98], ['c', 99]]),
      )
    })
    it('strings are encoded into arrays of character codes for number TypedArrays', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        ade(
          transform(squareOddsToString, new constructor(0))([1, 2, 3, 4, 5]),
          new constructor([49, 57, 50, 53]),
        )
        ase(String.fromCharCode(...(new constructor([49, 57, 50, 53]))), '1925')
      }
    })
    it('throws TypeError for uncoercible items', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        assert.throws(
          () => transform(map(x => x), new constructor(0))([true, false, false]),
          new TypeError('toTypedArray(typedArray, y); cannot convert y to typedArray'),
        )
      }
    })
    it('throws TypeError for uncoercible items', async () => {
      for (const constructor of bigIntTypedArrayConstructors) {
        assert.throws(
          () => transform(map(x => x), new constructor(0))([true, false, false]),
          new TypeError('toTypedArray(typedArray, y); cannot convert y to typedArray'),
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
      for (const constructor of bigIntTypedArrayConstructors) {
        ade(
          transform(squareBigOdds, new constructor(0))(bigNumbers),
          new constructor([1n, 9n, 25n]),
        )
      }
    })
    it('async transforms iterable to a bigint TypedArray', async () => {
      for (const constructor of bigIntTypedArrayConstructors) {
        const buffer99 = new constructor([9n, 9n])
        const buffer9924 = transform(asyncBigEvens, buffer99)(bigNumbers)
        aok(buffer9924 instanceof Promise)
        ade(await buffer9924, new constructor([9n, 9n, 2n, 4n]))
      }
    })
    it('sync transforms iterable to writeable stream', async () => {
      const tmpWriter = fs.createWriteStream(path.join(__dirname, './tmp'))
      transform(squareOddsToString, tmpWriter)([1, 2, 3, 4, 5])
      ase(await consumeReadStreamPush(
        fs.createReadStream(path.join(__dirname, './tmp')),
      ), '1925')
      ase(await consumeReadStreamPull(
        fs.createReadStream(path.join(__dirname, './tmp')),
      ), '1925')
      await fs.promises.unlink('./tmp')
    })
    it('async transforms iterable to writeable stream', async () => {
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
        transform(map(n => [n, n]), {})([1, 2, 3, 4, 5]),
        { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
      )
      ade(
        transform(map(n => ({ [n]: n })), {})([1, 2, 3, 4, 5]),
        { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
      )
    })
    it('async transforms an iterable to an object', async () => {
      aok(
        transform(map(async n => [n, n]), {})([1, 2, 3, 4, 5]) instanceof Promise,
      )
      aok(
        transform(map(async n => ({ [n]: n })), {})([1, 2, 3, 4, 5]) instanceof Promise,
      )
      ade(
        await transform(map(async n => [n, n]), {})([1, 2, 3, 4, 5]),
        { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
      )
      ade(
        await transform(map(async n => ({ [n]: n })), {})([1, 2, 3, 4, 5]),
        { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
      )
    })
    it('initial value can be a function', async () => {
      const square = x => x ** 2
      ade(
        transform(map(square), () => [])([1, 2, 3]),
        [1, 4, 9],
      )
    })
    it('initial value can be an async function', async () => {
      const square = x => x ** 2
      aok(
        transform(map(square), async () => [])([1, 2, 3]) instanceof Promise,
      )
      ade(
        await transform(map(square), async () => [])([1, 2, 3]),
        [1, 4, 9],
      )
    })
    it('referential initial values are unsafe', async () => {
      const square = x => x ** 2
      const unsafeSquareAllTransform = transform(map(square), [])
      ade(
        unsafeSquareAllTransform([1, 2, 3]),
        [1, 4, 9],
      )
      ade(
        unsafeSquareAllTransform([1, 2, 3]),
        [1, 4, 9, 1, 4, 9],
      )
      const safeSquareAllTransform = transform(map(square), () => [])
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
        transform(map(square), () => [])([]),
        [],
      )
      const emptyAsyncIterator = (async function*(){})()
      ade(
        await transform(map(square), () => [])(emptyAsyncIterator),
        [],
      )
    })
    it('throws a TypeError for transform(Object, () => {})', async () => {
      assert.throws(
        () => transform(() => {}, undefined)('hey'),
        new TypeError('transform(x, y); x invalid'),
      )
    })
    it('throws a TypeError for non function transducer', async () => {
      assert.throws(
        () => transform('yo', 'hey'),
        new TypeError('transform(x, y); y is not a function'),
      )
    })
  })

  describe('flatMap', () => {
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
    it('does not flatten objects', async () => {
      const createObject = () => ({ a: 1, b: 2, c: 3 })
      ade(
        flatMap(x => x)(arrayOf(createObject, 3)),
        arrayOf(createObject, 3),
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
    it('does not flatten objects', async () => {
      ade(
        flatMap(x => ({ square: x ** 2, cube: x ** 3 }))(new Set([1, 2, 3])),
        new Set([
          { square: 1, cube: 1 },
          { square: 4, cube: 8 },
          { square: 9, cube: 27 },
        ]),
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
          flatMap(powers),
          [],
        )([1, 2, 3]),
        [1, 1, 4, 8, 9, 27],
      )
    })
    it('[async] maps then flattens a reducer function', async () => {
      const powers = async x => [x ** 2, x ** 3]
      aok(
        transform(
          flatMap(powers),
          [],
        )([1, 2, 3]) instanceof Promise
      )
      ade(
        await transform(
          flatMap(powers),
          [],
        )([1, 2, 3]),
        [1, 1, 4, 8, 9, 27],
      )
    })
    it('throws TypeError on non iterable elements [1, 2, 3]', async () => {
      // TODO: better error message here
      const square = x => x ** 2
      assert.throws(
        () => transform(
          flatMap(square),
          [],
        )([1, 2, 3]),
        new TypeError('reduce(...)(x); x invalid'),
      )
      assert.rejects(
        () => transform(
          flatMap(async x => square(x)),
          [],
        )([1, 2, 3]),
        new TypeError('reduce(...)(x); x invalid'),
      )
    })
    it('throws a TypeError on flatMap(nonFunction)', async () => {
      assert.throws(
        () => flatMap({}),
        new TypeError('flatMap(func); func is not a function'),
      )
    })
    it('throws a TypeError on flatMap(...)(null)', async () => {
      assert.throws(
        () => flatMap(() => 'hi')(null),
        new TypeError('flatMap(...)(value); invalid value null')
      )
    })
  })

  describe('get', () => {
    const aaaaa = { a: { a: { a: { a: { a: 1 } } } } }
    const nested = [[[[[1]]]]]
    it('accesses a property of an object by name', async () => {
      ase(get('a')({ a: 1 }), 1)
      ase(get('b')({ a: 1 }), undefined)
      ase(get('b', 0)({ a: 1 }), 0)
      ase(get(0)([1]), 1)
      ase(get(1)([1]), undefined)
      ase(get(1, 0)([1]), 0)
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
    it('throws a TypeError on invalid path', async () => {
      assert.throws(
        () => get({}),
        new TypeError('get(path); invalid path [object Object]'),
      )
    })
  })

  describe('pick', () => {
    const abc = { a: 1, b: 2, c: 3 }
    it('picks properties off an object defined by array', async () => {
      ade(pick(['a'])(abc), { a: 1 })
      ade(pick(['a', 'd'])(abc), { a: 1 })
      ade(pick(['d'])(abc), {})
    })
    it('throws a TypeError on pick(nonArray)', async () => {
      assert.throws(
        () => pick('hey'),
        new TypeError('pick(x); x is not an array'),
      )
    })
    it('throws a TypeError on pick(...)(nonObject)', async () => {
      assert.throws(
        () => pick(['hey'])(['hey']),
        new TypeError('pick(...)(x); x is not an object'),
      )
    })
  })

  describe('omit', () => {
    const abc = { a: 1, b: 2, c: 3 }
    it('omits properties from an object defined by array', async () => {
      ade(omit(['a'])(abc), { b: 2, c: 3 })
      ade(omit(['a', 'd'])(abc), { b: 2, c: 3 })
      ade(omit(['d'])(abc), { a: 1, b: 2, c: 3 })
    })
    it('throws a TypeError on invalid props', async () => {
      assert.throws(
        () => omit('hey'),
        new TypeError('omit(x); x is not an array'),
      )
    })
    it('throws a TypeError on invalid input', async () => {
      assert.throws(
        () => omit(['hey'])(['hey']),
        new TypeError('omit(...)(x); x is not an object'),
      )
    })
  })

  describe('any', () => {
    const numbers = [1, 2, 3, 4, 5]
    const numbersObject = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    it('[sync] tests fn against all items of iterable, true if any evaluation is truthy', async () => {
      ase(any(x => x > 5)(numbers), false)
      ase(any(x => x > 0)(numbers), true)
      ase(any(x => x > 5)(new Set(numbers)), false)
      ase(any(x => x > 0)(new Set(numbers)), true)
      ase(any(x => x > 5)(numbersObject), false)
      ase(any(x => x > 0)(numbersObject), true)
    })
    it('[async] tests fn against all items of iterable, true if any evaluation is truthy', async () => {
      aok(any(async x => x > 5)(numbers) instanceof Promise)
      ase(await any(async x => x > 5)(numbers), false)
      ase(await any(async x => x > 0)(numbers), true)
      ase(await any(async x => x > 5)(new Set(numbers)), false)
      ase(await any(async x => x > 0)(new Set(numbers)), true)
      ase(await any(async x => x > 5)(numbersObject), false)
      ase(await any(async x => x > 0)(numbersObject), true)
    })
    it('tests a variadic async function', async () => {
      ase(
        await any(x => x < 2 ? Promise.resolve(false) : true)([1, 2, 3, 4, 5]),
        true,
      )
    })
    it('throws TypeError on non function setup', async () => {
      assert.throws(
        () => any('hey'),
        new TypeError('any(x); x is not a function'),
      )
    })
    it('throws TypeError if input not iterable or object', async () => {
      assert.throws(
        () => any(x => x)(1),
        new TypeError('any(...)(x); x invalid'),
      )
    })
  })

  describe('all', () => {
    const numbers = [1, 2, 3, 4, 5]
    const numbersObject = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    it('syncly evaluates fn against all items in iterable, true if all evaluations are truthy', async () => {
      ase(all(x => x > 5)(numbers), false)
      ase(all(x => x > 0)(numbers), true)
      ase(all(x => x > 5)(new Set(numbers)), false)
      ase(all(x => x > 0)(new Set(numbers)), true)
      ase(all(x => x > 5)(numbersObject), false)
      ase(all(x => x > 0)(numbersObject), true)
    })
    it('asyncly evaluates fn against all items in iterable, true if all evaluations are truthy', async () => {
      aok(all(async x => x > 5)(numbers) instanceof Promise)
      ase(await all(async x => x > 5)(numbers), false)
      ase(await all(async x => x > 0)(numbers), true)
      ase(await all(async x => x > 5)(new Set(numbers)), false)
      ase(await all(async x => x > 0)(new Set(numbers)), true)
      ase(await all(async x => x > 5)(numbersObject), false)
      ase(await all(async x => x > 0)(numbersObject), true)
    })
    it('tests a variadic async function', async () => {
      ase(
        await all(x => x < 2 ? Promise.resolve(true) : false)([1, 2, 3, 4, 5]),
        false,
      )
    })
    it('throws TypeError on all(nonFunction)', async () => {
      assert.throws(
        () => all('hey'),
        new TypeError('all(x); x is not a function'),
      )
    })
    it('throws TypeError on all(...)(string)', async () => {
      assert.throws(
        () => all(x => x)(1),
        new TypeError('all(...)(x); x invalid'),
      )
    })
  })

  describe('and', () => {
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
    it('throws a TypeError if passed a non array', async () => {
      assert.throws(
        () => and('hey'),
        new TypeError('and(x); x is not an array of functions'),
      )
    })
    it('throws a RangeError if passed less than one function', async () => {
      assert.throws(
        () => and([]),
        new RangeError('and(x); x is not an array of at least one function'),
      )
    })
    it('throws a TypeError if any item is not a function', async () => {
      assert.throws(
        () => and([() => false, 'hey', () => 'hi']),
        new TypeError('and(x); x[1] is not a function'),
      )
    })
  })

  describe('or', () => {
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
    it('throws a TypeError if passed a non array', async () => {
      assert.throws(
        () => or('hey'),
        new TypeError('or(fns); fns is not an array of functions'),
      )
    })
    it('throws a RangeError if passed less than one function', async () => {
      assert.throws(
        () => or([]),
        new RangeError('or(fns); fns is not an array of at least one function'),
      )
    })
    it('throws a TypeError if any item is not a function', async () => {
      assert.throws(
        () => or([() => false, 'hey', () => 'hi']),
        new TypeError('or(fns); fns[1] is not a function'),
      )
    })
  })

  describe('not', () => {
    it('[sync] not(isOdd)(x) === !isOdd(x)', async () => {
      ase(not(isOdd)(2), true)
      ase(not(isOdd)(1), false)
    })
    it('[async] not(isEven)(x) === !(await isEven(x))', async () => {
      aok(not(asyncIsEven)(2) instanceof Promise)
      ase(await not(asyncIsEven)(2), false)
      ase(await not(asyncIsEven)(1), true)
    })
    it('throws TypeError on not(nonFunction)', async () => {
      assert.throws(
        () => not('hey'),
        new TypeError('not(x); x is not a function'),
      )
    })
  })

  describe('eq', () => {
    it('[sync] eq(f, g)(x) === (f(x) === g(x))', async () => {
      ase(eq(x => `${x}`, x => x)('hey'), true)
      ase(eq(x => `${x}`, x => x)(1), false)
    })
    it('[async] eq(f, g)(x) === (f(x) === g(x))', async () => {
      aok(eq(x => `${x}`, async x => x)('hey') instanceof Promise)
      ase(await eq(async x => `${x}`, async x => x)('hey'), true)
      ase(await eq(async x => `${x}`, async x => x)(1), false)
    })
    it('[sync] eq(f, value)(x) === (valueA === valueB)', async () => {
      ase(eq(() => 'hey', 'hey')('ayylmao'), true)
      ase(eq(() => 'hey', 'ho')('ayylmao'), false)
    })
    it('[async] eq(f, value)(x) === (valueA === valueB)', async () => {
      ase(await eq(async () => 'hey', 'hey')('ayylmao'), true)
      ase(await eq('hey', async () => 'ho')('ayylmao'), false)
    })
    it('[sync] eq(value, g)(x) === (valueA === valueB)', async () => {
      ase(eq('hey', () => 'hey')('ayylmao'), true)
      ase(eq('hey', () => 'ho')('ayylmao'), false)
    })
    it('[async] eq(value, g)(x) === (value === g(x))', async () => {
      aok(eq('hey', async x => x)('hey') instanceof Promise)
      ase(await eq('hey', async x => x)('hey'), true)
      ase(await eq('ho', async x => x)(1), false)
    })
    it('[sync] eq(valueA, valueB)(x) === (valueA === valueB)', async () => {
      ase(eq('hey', 'hey')('ayylmao'), true)
      ase(eq('hey', 'ho')('ayylmao'), false)
    })
    it('false for eq(string,)', async () => {
      assert.strictEqual(eq('hey',)(), false)
    })
    it('false for too many arguments', async () => {
      assert.strictEqual(eq('hey', () => {}, 'ho')(), false)
    })
  })

  describe('gt', () => {
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
      ase(gt(() => 1, 0)('ayylmao'), true)
      ase(gt(() => 1, 1)('ayylmao'), false)
      ase(gt(() => 0, 1)('ayylmao'), false)
    })
    it('[sync] gt(value, g)(x) === (valueA > valueB)', async () => {
      ase(gt(1, () => 0)('ayylmao'), true)
      ase(gt(1, () => 1)('ayylmao'), false)
      ase(gt(0, () => 1)('ayylmao'), false)
    })
    it('[async] gt(value, g)(x) === (value > g(x))', async () => {
      aok(gt(1, async x => x)(2) instanceof Promise)
      ase(await gt(1, async x => x)(0), true)
      ase(await gt(1, async x => x)(1), false)
      ase(await gt(1, async x => x)(2), false)
    })
    it('[sync] gt(valueA, valueB)(x) === (valueA > valueB)', async () => {
      ase(gt(1, 0)('ayylmao'), true)
      ase(gt(1, 1)('ayylmao'), false)
      ase(gt(0, 1)('ayylmao'), false)
    })
    it('throws RangeError on not enough arguments', async () => {
      assert.strictEqual(gt('hey')(), false)
    })
    it('throws RangeError on too many arguments', async () => {
      assert.strictEqual(gt('hey', () => {}, 'ho')(), false)
    })
  })

  describe('lt', () => {
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
      ase(lt(() => 1, 0)('ayylmao'), false)
      ase(lt(() => 1, 1)('ayylmao'), false)
      ase(lt(() => 0, 1)('ayylmao'), true)
    })
    it('[sync] lt(value, g)(x) === (valueA < valueB)', async () => {
      ase(lt(1, () => 0)('ayylmao'), false)
      ase(lt(1, () => 1)('ayylmao'), false)
      ase(lt(0, () => 1)('ayylmao'), true)
    })
    it('[async] lt(value, g)(x) === (value < g(x))', async () => {
      aok(lt(1, async x => x)(2) instanceof Promise)
      ase(await lt(1, async x => x)(0), false)
      ase(await lt(1, async x => x)(1), false)
      ase(await lt(1, async x => x)(2), true)
    })
    it('[sync] lt(valueA, valueB)(x) === (valueA < valueB)', async () => {
      ase(lt(1, 0)('ayylmao'), false)
      ase(lt(1, 1)('ayylmao'), false)
      ase(lt(0, 1)('ayylmao'), true)
    })
    it('throws RangeError on not enough arguments', async () => {
      assert.strictEqual(lt('hey')(), false)
    })
    it('throws RangeError on too many arguments', async () => {
      assert.strictEqual(lt('hey', () => {}, 'ho')(), false)
    })
  })

  describe('gte', () => {
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
      ase(gte(() => 1, 0)('ayylmao'), true)
      ase(gte(() => 1, 1)('ayylmao'), true)
      ase(gte(() => 0, 1)('ayylmao'), false)
    })
    it('[sync] gte(value, g)(x) === (valueA >= valueB)', async () => {
      ase(gte(1, () => 0)('ayylmao'), true)
      ase(gte(1, () => 1)('ayylmao'), true)
      ase(gte(0, () => 1)('ayylmao'), false)
    })
    it('[async] gte(value, g)(x) === (value >= g(x))', async () => {
      aok(gte(1, async x => x)(2) instanceof Promise)
      ase(await gte(1, async x => x)(0), true)
      ase(await gte(1, async x => x)(1), true)
      ase(await gte(1, async x => x)(2), false)
    })
    it('[sync] gte(valueA, valueB)(x) === (valueA >= valueB)', async () => {
      ase(gte(1, 0)('ayylmao'), true)
      ase(gte(1, 1)('ayylmao'), true)
      ase(gte(0, 1)('ayylmao'), false)
    })
    it('throws RangeError on not enough arguments', async () => {
      assert.strictEqual(gte('hey')(), false)
    })
    it('throws RangeError on too many arguments', async () => {
      assert.strictEqual(gte('hey', () => {}, 'ho')(), false)
    })
  })

  describe('lte', () => {
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
      ase(lte(() => 1, 0)('ayylmao'), false)
      ase(lte(() => 1, 1)('ayylmao'), true)
      ase(lte(() => 0, 1)('ayylmao'), true)
    })
    it('[sync] lte(value, g)(x) === (valueA <= valueB)', async () => {
      ase(lte(1, () => 0)('ayylmao'), false)
      ase(lte(1, () => 1)('ayylmao'), true)
      ase(lte(0, () => 1)('ayylmao'), true)
    })
    it('[async] lte(value, g)(x) === (value <= g(x))', async () => {
      aok(lte(1, async x => x)(2) instanceof Promise)
      ase(await lte(1, async x => x)(0), false)
      ase(await lte(1, async x => x)(1), true)
      ase(await lte(1, async x => x)(2), true)
    })
    it('[sync] lte(valueA, valueB)(x) === (valueA <= valueB)', async () => {
      ase(lte(1, 0)('ayylmao'), false)
      ase(lte(1, 1)('ayylmao'), true)
      ase(lte(0, 1)('ayylmao'), true)
    })
    it('throws RangeError on not enough arguments', async () => {
      assert.strictEqual(lte('hey')(), false)
    })
    it('throws RangeError on too many arguments', async () => {
      assert.strictEqual(lte('hey', () => {}, 'ho')(), false)
    })
  })

  it('exports 24 functions', async () => {
    ase(Object.keys(rubico).length, 24)
  })
})
