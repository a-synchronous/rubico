const assert = require('assert')
const stream = require('stream')
const path = require('path')
const fs = require('fs')
const r = require('.')

const ase = assert.strictEqual

const ade = assert.deepEqual

const aok = assert.ok

const sleep = ms => new Promise(resolve => { setTimeout(resolve, ms) })

const hi = x => x + 'hi'

const ho = x => x + 'ho'

const isOdd = x => (x % 2 === 1)

const square = x => x ** 2

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
      ase(await r.pipe([hi, ho, asyncHey])('yo'), 'yohihohey')
    })
    it('chains functions in reverse if passed a reducer (very contrived)', async () => {
      ase(await r.pipe([hi, ho, asyncHey])((y, xi) => y + xi), '(y, xi) => y + xiheyhohi')
    })
    it('does something without arguments', async () => {
      ase(await r.pipe([hi, ho, asyncHey])(), 'undefinedhihohey')
    })
    it('chaining one fn is the same as just calling that fn', async () => {
      ase(await r.pipe([asyncHey])('yo'), await asyncHey('yo'))
    })
    it('returns the raw value (no promise required) if all functions are sync', async () => {
      ase(r.pipe([hi, hi, hi])('yo'), 'yohihihi')
    })
    it('returns a promise if any fns async', async () => {
      aok(r.pipe([hi, hi, hi, asyncHey])('yo') instanceof Promise)
    })
    it('throws a TypeError if first argument not an array', async () => {
      assert.throws(
        () => {
          r.pipe(() => 1, undefined, () => 2)
        },
        new TypeError('pipe(x); x is not an array of functions'),
      )
    })
    it('throws a RangeError if passed less than one function', async () => {
      assert.throws(
        () => r.pipe([]),
        new RangeError('pipe(x); x is not an array of at least one function'),
      )
    })
    it('throws a TypeError if any arguments are not a function', async () => {
      assert.throws(
        () => {
          r.pipe([() => 1, undefined, () => 2])
        },
        new TypeError('pipe(x); x[1] is not a function'),
      )
    })
    it('handles sync errors good', async () => {
      assert.throws(
        () => r.pipe([hi, hi, x => { throw new Error(`throwing ${x}`) }])('yo'),
        new Error('throwing yohihi'),
      )
    })
    it('handles async errors good', async () => {
      assert.rejects(
        () => r.pipe([hi, asyncHey, x => { throw new Error(`throwing ${x}`) }])('yo'),
        new Error('throwing yohihey'),
      )
    })
  })

  describe('fork', () => {
    it('maps input to array of sync functions', async () => {
      ade(r.fork([hi, hi, hi])('yo'), ['yohi', 'yohi', 'yohi'])
    })
    it('maps input to object of sync functions', async () => {
      ade(
        r.fork({ a: hi, b: hi, c: hi })('yo'),
        { a: 'yohi', b: 'yohi', c: 'yohi' },
      )
    })
    it('maps input to array of async functions', async () => {
      aok(r.fork([asyncHey, asyncHey, asyncHey])('yo') instanceof Promise)
      ade(
        await r.fork([asyncHey, asyncHey, asyncHey])('yo'),
        ['yohey', 'yohey', 'yohey'],
      )
    })
    it('maps input to object of async functions', async () => {
      aok(r.fork({ a: asyncHey, b: asyncHey, c: asyncHey })('yo') instanceof Promise)
      ade(
        await r.fork({ a: asyncHey, b: asyncHey, c: asyncHey })('yo'),
        { a: 'yohey', b: 'yohey', c: 'yohey' },
      )
    })
    it('any functions async => Promise', async () => {
      aok(r.fork([asyncHey, asyncHey, hi])('yo') instanceof Promise)
      ade(
        await r.fork([asyncHey, asyncHey, hi])('yo'),
        ['yohey', 'yohey', 'yohi'],
      )
    })
    it('throws TypeError for fork([])', async () => {
      assert.throws(
        () => r.fork([]),
        new RangeError('fork(x); x is not an array of at least one function'),
      )
    })
    it('throws TypeError for fork({})', async () => {
      assert.throws(
        () => r.fork({}),
        new RangeError('fork(x); x is not an object of at least one entry'),
      )
    })
    it('throws TypeError for fork([nonFunction])', async () => {
      assert.throws(
        () => r.fork(['hey']),
        new TypeError('fork(x); x[0] is not a function'),
      )
    })
    it('throws TypeError for fork({ a: nonFunction })', async () => {
      assert.throws(
        () => r.fork({ a: 'hey' }),
        new TypeError('fork(x); x[\'a\'] is not a function'),
      )
    })
    it('throws TypeError for String', async () => {
      assert.throws(
        () => r.fork('ayelmao'),
        new TypeError('fork(x); x invalid'),
      )
    })
    it('throws TypeError for Set', async () => {
      assert.throws(
        () => r.fork(new Set([hi])),
        new TypeError('fork(x); x invalid'),
      )
    })
    it('throws TypeError for Map', async () => {
      assert.throws(
        () => r.fork(new Map([['a', hi]])),
        new TypeError('fork(x); x invalid'),
      )
    })
  })

  describe('fork.series', () => {
    it('syncly forks into array of functions', async () => {
      const arr = []
      ade(
        r.fork.series([
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
      const staggeredPush = r.fork.series([
        () => sleep(10).then(() => { arr.push(1); return 'a' }),
        () => sleep(5).then(() => { arr.push(2); return 'b' }),
        () => { arr.push(3); return 'c' },
      ])()
      aok(staggeredPush instanceof Promise)
      ade(await staggeredPush, ['a', 'b', 'c'])
      ade(arr, [1, 2, 3])
      const arr2 = []
      const parallelPush = r.fork([
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
        () => r.fork.series([]),
        new RangeError('fork.series(x); x is not an array of at least one function'),
      )
    })
    it('throws TypeError for fork([nonFunction])', async () => {
      assert.throws(
        () => r.fork.series(['hey']),
        new TypeError('fork.series(x); x[0] is not a function'),
      )
    })
    it('throws TypeError for non array functions', async () => {
      assert.throws(
        () => r.fork.series({}),
        new TypeError('fork.series(x); x invalid'),
      )
    })
  })

  describe('assign', () => {
    it('maps input to object of sync functions then merges', async () => {
      ade(
        r.assign({
          b: x => x.a + 'yo',
          c: x => x.a + 'yaya',
        })({ a: 'a' }),
        { a: 'a', b: 'ayo', c: 'ayaya' },
      )
    })
    it('maps input to object of async functions then merges', async () => {
      aok(r.assign({
        b: async x => x.a + 'yo',
        c: async x => x.a + 'yaya',
      })({ a: 'a' }) instanceof Promise)
      ade(
        await r.assign({
          b: async x => x.a + 'yo',
          c: async x => x.a + 'yaya',
        })({ a: 'a' }),
        { a: 'a', b: 'ayo', c: 'ayaya' },
      )
    })
    it('throws TypeError on assign(nonObject)', async () => {
      assert.throws(
        () => r.assign(new Set(['hey'])),
        new TypeError('assign(x); x is not an object of functions'),
      )
    })
    it('throws TypeError on assign(...)(nonObject)', async () => {
      assert.throws(
        () => r.assign({ a: hi })('hi'),
        new TypeError('assign(...)(x); x is not an object'),
      )
    })
  })

  describe('tap', () => {
    it('calls a provided sync function with input, returning input', async () => {
      ase(r.tap(x => x + 1)(1), 1)
    })
    it('calls a provided async function with input, returning input', async () => {
      aok(r.tap(async x => x + 1)(1) instanceof Promise)
      ase(await r.tap(async x => x + 1)(1), 1)
    })
    it('acts as a tap transducer - taps into a sync reducer pipeline', async () => {
      let strNums = ''
      const tappedSum = r.tap(x => { strNums += `${x}` })((y, xi) => y + xi)
      aok(typeof tappedSum, 'function')
      ase(tappedSum.length, 2)
      ase([1, 2, 3, 4, 5].reduce(tappedSum, 10), 25)
      ase(strNums, '12345')
    })
    it('throws a TypeError if passed a non function', async () => {
      assert.throws(
        () => r.tap('hey'),
        new TypeError('tap(x); x is not a function'),
      )
    })
  })

  describe('tryCatch', () => {
    it('tries a sync function and catches with a sync function', async () => {
      const errProp = (err, x) => { err.x = x; return err }
      const throwError = x => { throw new Error(x) }
      ase(r.tryCatch(x => x + 1, errProp)(1), 2)
      const e1 = r.tryCatch(throwError, errProp)(1)
      aok(e1 instanceof Error)
      ase(e1.name, 'Error')
      ase(e1.message, '1')
      ase(e1.x, 1)
    })
    it('tries an async function and catches with a sync function', async () => {
      const errProp = (err, x) => { err.x = x; return err }
      const asyncThrowError = async x => { throw new Error(x) }
      const reject = x => Promise.reject(new Error(x))
      aok(r.tryCatch(async x => x + 1, errProp)(1) instanceof Promise)
      ase(await r.tryCatch(async x => x + 1, errProp)(1), 2)
      aok(r.tryCatch(asyncThrowError, errProp)(1) instanceof Promise)
      const e1 = await r.tryCatch(asyncThrowError, errProp)(1)
      aok(e1 instanceof Error)
      ase(e1.name, 'Error')
      ase(e1.message, '1')
      ase(e1.x, 1)
      aok(r.tryCatch(reject, errProp)(1) instanceof Promise)
      const e2 = await r.tryCatch(reject, errProp)(1)
      aok(e2 instanceof Error)
      ase(e2.name, 'Error')
      ase(e2.message, '1')
      ase(e2.x, 1)
    })
    it('tries a sync function and catches with an async function', async () => {
      const asyncErrProp = async (err, x) => { err.x = x; return err }
      const throwError = x => { throw new Error(x) }
      ase(r.tryCatch(x => x + 1, asyncErrProp)(1), 2)
      aok(r.tryCatch(throwError, asyncErrProp)(1) instanceof Promise)
      const e1 = await r.tryCatch(throwError, asyncErrProp)(1)
      aok(e1 instanceof Error)
      ase(e1.name, 'Error')
      ase(e1.message, '1')
      ase(e1.x, 1)
    })
    it('tries an async function and catches with an async function', async () => {
      const asyncErrProp = async (err, x) => { err.x = x; return err }
      const asyncThrowError = async x => { throw new Error(x) }
      const reject = x => Promise.reject(new Error(x))
      aok(r.tryCatch(async x => x + 1, asyncErrProp)(1) instanceof Promise)
      ase(await r.tryCatch(async x => x + 1, asyncErrProp)(1), 2)
      aok(r.tryCatch(asyncThrowError, asyncErrProp)(1) instanceof Promise)
      const e1 = await r.tryCatch(asyncThrowError, asyncErrProp)(1)
      aok(e1 instanceof Error)
      ase(e1.name, 'Error')
      ase(e1.message, '1')
      ase(e1.x, 1)
      aok(r.tryCatch(reject, asyncErrProp)(1) instanceof Promise)
      const e2 = await r.tryCatch(reject, asyncErrProp)(1)
      aok(e2 instanceof Error)
      ase(e2.name, 'Error')
      ase(e2.message, '1')
      ase(e2.x, 1)
    })
    it('throws a TypeError if passed a non function tryer', async () => {
      assert.throws(
        () => r.tryCatch('hey', () => {}),
        new TypeError('tryCatch(x, y); x is not a function'),
      )
    })
    it('throws a TypeError if passed a non function catcher', async () => {
      assert.throws(
        () => r.tryCatch(() => {}, Buffer.from('abc')),
        new TypeError('tryCatch(x, y); y is not a function'),
      )
    })
  })

  describe('switchCase', () => {
    it('switches on provided sync functions', async () => {
      ase(
        r.switchCase([
          x => x === 1, () => 'hi',
          x => x === 2, () => 'ho',
          () => 'hey',
        ])(1),
        'hi',
      )
      ase(
        r.switchCase([
          x => x === 1, () => 'hi',
          x => x === 2, () => 'ho',
          () => 'hey',
        ])(2),
        'ho',
      )
      ase(
        r.switchCase([
          x => x === 1, () => 'hi',
          x => x === 2, () => 'ho',
          () => 'hey',
        ])(3),
        'hey',
      )
      ase(
        r.switchCase([
          x => x === 1, async () => 'hi',
          x => x === 2, async () => 'ho',
          () => 'hey',
        ])(3),
        'hey',
      )
    })
    it('switches on provided async functions', async () => {
      aok(
        r.switchCase([
          async x => x === 1, async () => 'hi',
          async x => x === 2, async () => 'ho',
          async () => 'hey',
        ])(1) instanceof Promise,
      )
      aok(
        r.switchCase([
          async x => x === 1, () => 'hi',
          x => x === 2, () => 'ho',
          () => 'hey',
        ])(1) instanceof Promise,
      )
      ase(
        await r.switchCase([
          async x => x === 1, async () => 'hi',
          async x => x === 2, async () => 'ho',
          async () => 'hey',
        ])(1),
        'hi',
      )
      ase(
        await r.switchCase([
          async x => x === 1, async () => 'hi',
          async x => x === 2, async () => 'ho',
          async () => 'hey',
        ])(2),
        'ho',
      )
      ase(
        await r.switchCase([
          async x => x === 1, async () => 'hi',
          async x => x === 2, async () => 'ho',
          async () => 'hey',
        ])(3),
        'hey',
      )
    })
    it('throws a TypeError if passed a non array', async () => {
      assert.throws(
        () => r.switchCase('hey'),
        new TypeError('switchCase(x); x is not an array of functions'),
      )
    })
    it('throws a RangeError if passed less than three functions', async () => {
      assert.throws(
        () => r.switchCase([() => false, () => 'hey']),
        new RangeError('switchCase(x); x is not an array of at least three functions'),
      )
    })
    it('throws a RangeError if passed an even number of functions', async () => {
      assert.throws(
        () => r.switchCase([() => false, () => 'hey', () => true, () => 'ho']),
        new RangeError('switchCase(x); x is not an array of an odd number of functions'),
      )
    })
    it('throws a TypeError if any item is not a function', async () => {
      assert.throws(
        () => r.switchCase([() => false, 'hey', () => true, () => 'ho', () => 'hi']),
        new TypeError('switchCase(x); x[1] is not a function'),
      )
    })
  })

  describe('map', () => {
    it('lazily applies an async function in parallel to all values of an async iterable', async () => {
      aok(!(r.map(async x => x + 1)(makeAsyncNumbers()) instanceof Promise))
      aok(r.map(async x => x + 1)(makeAsyncNumbers())[Symbol.asyncIterator])
      aok(asyncIteratorToArray(
        r.map(async x => x + 1)(makeAsyncNumbers()),
      ) instanceof Promise)
      ade(
        await asyncIteratorToArray(
          r.map(async x => x + 1)(makeAsyncNumbers()),
        ),
        [2, 3, 4, 5, 6]
      )
    })
    it('lazily applies a sync function in parallel to all values of an async iterable', async () => {
      aok(!(r.map(x => x + 1)(makeAsyncNumbers()) instanceof Promise))
      aok(r.map(x => x + 1)(makeAsyncNumbers())[Symbol.asyncIterator])
      aok(asyncIteratorToArray(
        r.map(x => x + 1)(makeAsyncNumbers()),
      ) instanceof Promise)
      ade(
        await asyncIteratorToArray(
          r.map(x => x + 1)(makeAsyncNumbers()),
        ),
        [2, 3, 4, 5, 6]
      )
    })
    it('lazily applies an async function in parallel to all values of a sync generator iterable', async () => {
      aok(!(r.map(async x => x + 1)(makeNumbers()) instanceof Promise))
      aok(r.map(async x => x + 1)(makeNumbers())[Symbol.iterator])
      aok(iteratorToArray(
        r.map(async x => x + 1)(makeNumbers()),
      ) instanceof Promise)
      ade(
        await iteratorToArray(
          r.map(async x => x + 1)(makeNumbers()),
        ),
        [2, 3, 4, 5, 6],
      )
    })
    it('lazily applies a sync function in parallel to all values of a sync generator iterable', async () => {
      aok(r.map(x => x + 1)(makeNumbers())[Symbol.iterator])
      ade(
        iteratorToArray(
          r.map(x => x + 1)(makeNumbers()),
        ),
        [2, 3, 4, 5, 6],
      )
    })
    it('applies an async function in parallel to all elements of an array', async () => {
      aok(r.map(asyncHey)(['yo', 1]) instanceof Promise)
      ade(
        await r.map(asyncHey)(['yo', 1]),
        ['yohey', '1hey'],
      )
    })
    it('applies a sync function to all elements of an array', async () => {
      ade(
        r.map(hi)(['yo', 1]),
        ['yohi', '1hi'],
      )
    })
    it('applies an async function in parallel to all elements of a string', async () => {
      aok(r.map(asyncHey)('abcde') instanceof Promise)
      ade(
        await r.map(asyncHey)('abcde'),
        'aheybheycheydheyehey',
      )
    })
    it('applies a sync function to all elements of a string', async () => {
      ade(
        r.map(hi)(['yo', 1]),
        ['yohi', '1hi'],
      )
    })
    it('applies an async function in parallel to all elements of a number typed array', async () => {
      for (const x of numberTypedArrayConstructors) {
        aok(r.map(async x => x + 1)(new x([1, 2, 3, 4, 5])) instanceof Promise)
        ade(
          await r.map(async x => x + 1)(new x([1, 2, 3, 4, 5])),
          new x([2, 3, 4, 5, 6]),
        )
      }
    })
    it('applies a sync function in parallel to all elements of a number typed array', async () => {
      for (const x of numberTypedArrayConstructors) {
        ade(
          r.map(x => x + 1)(new x([1, 2, 3, 4, 5])),
          new x([2, 3, 4, 5, 6]),
        )
      }
    })
    it('applies an async function in parallel to all elements of a bigint typed array', async () => {
      for (const x of bigIntTypedArrayConstructors) {
        aok(r.map(async x => x + 1n)(new x([1n, 2n, 3n, 4n, 5n])) instanceof Promise)
        ade(
          await r.map(async x => x + 1n)(new x([1n, 2n, 3n, 4n, 5n])),
          new x([2n, 3n, 4n, 5n, 6n]),
        )
      }
    })
    it('applies a sync function in parallel to all elements of a bigint typed array', async () => {
      for (const x of bigIntTypedArrayConstructors) {
        ade(
          r.map(x => x + 1n)(new x([1n, 2n, 3n, 4n, 5n])),
          new x([2n, 3n, 4n, 5n, 6n]),
        )
      }
    })
    it('applies an async function in parallel to all elements of a set', async () => {
      aok(r.map(asyncHey)(new Set(['yo', 1])) instanceof Promise)
      ade(
        await r.map(asyncHey)(new Set(['yo', 1])),
        new Set(['yohey', '1hey']),
      )
    })
    it('applies a sync function to all elements of a set', async () => {
      ade(
        r.map(hi)(new Set(['yo', 1])),
        new Set(['yohi', '1hi']),
      )
    })
    it('applies an async function in parallel to all elements of a map', async () => {
      aok(r.map(
        async ([k, v]) => [k + k, v + v],
      )(new Map([['a', 1], ['b', 2]])) instanceof Promise)
      ade(
        await r.map(async ([k, v]) => [k + k, v + v])(new Map([['a', 1], ['b', 2]])),
        new Map([['aa', 2], ['bb', 4]]),
      )
    })
    it('applies a sync function to all elements of a map', async () => {
      ade(
        r.map(([k, v]) => [k + k, v + v])(new Map([['a', 1], ['b', 2]])),
        new Map([['aa', 2], ['bb', 4]]),
      )
    })
    it('applies an async function in parallel to all values of an object', async () => {
      ade(
        await r.map(asyncHey)({ a: 'yo', b: 1 }),
        { a: 'yohey', b: '1hey' },
      )
    })
    it('applies a sync function to all values of an object', async () => {
      ade(
        r.map(hi)({ a: 'yo', b: 1 }),
        { a: 'yohi', b: '1hi' },
      )
    })
    it('acts as a map transducer: binary function => reducer', async () => {
      const addHiReducer = r.map(hi)((y, xi) => y + xi)
      ase(typeof addHiReducer, 'function')
      ase(addHiReducer.length, 2)
      const addHeyReducer = r.map(asyncHey)(
        (y, xi) => new Promise(resolve => resolve(y + xi)),
      )
      ase(typeof addHeyReducer, 'function')
      ase(addHeyReducer.length, 2)
    })
    it('transducer handles sync transformations', async () => {
      const addHiReducer = r.map(hi)((y, xi) => y + xi)
      ase([1, 2, 3].reduce(addHiReducer), '12hi3hi')
      ase([1, 2, 3].reduce(addHiReducer, ''), '1hi2hi3hi')
    })
    it('transducer handles async transformations', async () => {
      const addHeyReducer = r.map(asyncHey)((y, xi) => y + xi)
      aok(asyncArrayReduce(addHeyReducer)([1, 2, 3]) instanceof Promise)
      ase(await asyncArrayReduce(addHeyReducer)([1, 2, 3]), '12hey3hey')
      ase(await asyncArrayReduce(addHeyReducer, '')([1, 2, 3]), '1hey2hey3hey')
    })
    it('throws a TypeError on map(nonFunction)', async () => {
      assert.throws(
        () => r.map({}),
        new TypeError('map(x); x is not a function'),
      )
    })
    it('throws a TypeError on map(...)(null)', async () => {
      assert.throws(
        () => r.map(hi)(null),
        new TypeError('map(...)(x); x invalid')
      )
    })
    it('handles sync errors good', async () => {
      assert.throws(
        () => r.map(x => { throw new Error(`throwing ${x}`) })(['yo']),
        new Error('throwing yo')
      )
    })
    it('handles async errors good', async () => {
      assert.rejects(
        () => r.map(async x => { throw new Error(`throwing ${x}`) })(['yo']),
        new Error('throwing yo'),
      )
    })
  })

  describe('map.series', () => {
    it('syncly maps into array of functions', async () => {
      const arr = []
      ade(
        r.map.series(x => { arr.push(x); return x })([1, 2, 3]),
        [1, 2, 3],
      )
      ade(arr, [1, 2, 3])
    })
    it('asyncly forks into array of functions, running each function in series', async () => {
      const arr = []
      const invertedSleepPushSeries = r.map.series(
        x => sleep(15 - (x * 5)).then(() => { arr.push(x); return x })
      )([1, 2, 3])
      aok(invertedSleepPushSeries instanceof Promise)
      ade(await invertedSleepPushSeries, [1, 2, 3])
      ade(arr, [1, 2, 3])
      const arr2 = []
      const invertedSleepPush = r.map(
        x => sleep(15 - (x * 5)).then(() => { arr2.push(x); return x })
      )([1, 2, 3])
      aok(invertedSleepPush instanceof Promise)
      ade(await invertedSleepPush, [1, 2, 3])
      ade(arr2, [3, 2, 1])
    })
    it('throws TypeError for non functions', async () => {
      assert.throws(
        () => r.map.series('hey'),
        new TypeError('map.series(x); x is not a function'),
      )
    })
    it('throws TypeError for non array input', async () => {
      assert.throws(
        () => r.map.series(() => 1)('hey'),
        new TypeError('map.series(...)(x); x invalid'),
      )
    })
  })

  describe('filter', () => {
    it('lazily filters values from an async iterable based on an async predicate', async () => {
      aok(!(r.filter(async x => x <= 3)(makeAsyncNumbers()) instanceof Promise))
      aok(r.filter(async x => x <= 3)(makeAsyncNumbers())[Symbol.asyncIterator])
      aok(asyncIteratorToArray(
        r.filter(async x => x <= 3)(makeAsyncNumbers()),
      ) instanceof Promise)
      ade(
        await asyncIteratorToArray(
          r.filter(async x => x <= 3)(makeAsyncNumbers()),
        ),
        [1, 2, 3],
      )
    })
    it('lazily filters values from an async iterable based on a sync predicate', async () => {
      aok(!(r.filter(x => x <= 3)(makeAsyncNumbers()) instanceof Promise))
      aok(r.filter(x => x <= 3)(makeAsyncNumbers())[Symbol.asyncIterator])
      aok(asyncIteratorToArray(
        r.filter(x => x <= 3)(makeAsyncNumbers()),
      ) instanceof Promise)
      ade(
        await asyncIteratorToArray(
          r.filter(x => x <= 3)(makeAsyncNumbers()),
        ),
        [1, 2, 3],
      )
    })
    it('throws TypeError on filter(asyncFunction)(sync generator iterable)', async () => {
      assert.throws(
        () => iteratorToArray(
          r.filter(async x => x <= 3)(makeNumbers()),
        ),
        new TypeError([
          'filter(f)(x); xi is an element of x; ',
          'if x if the resulting iterator of a sync generator, ',
          'f(xi) cannot return a Promise',
        ].join('')),
      )
    })
    it('lazily filters elements of a sync generator iterable based on a sync predicate', async () => {
      aok(r.map(x => x + 1)(makeNumbers())[Symbol.iterator])
      ade(
        iteratorToArray(
          r.filter(x => x <= 3)(makeNumbers()),
        ),
        [1, 2, 3],
      )
    })
    it('filters characters from a string based on an async predicate', async () => {
      aok(r.filter(async x => x !== 'o')('heyoheyohey') instanceof Promise)
      ase(await r.filter(async x => x !== 'o')('heyoheyohey'), 'heyheyhey')
    })
    it('filters characters from a string based on a sync predicate', async () => {
      ase(r.filter(x => x !== 'o')('heyoheyohey'), 'heyheyhey')
    })
    it('filters values from a set based on an async predicate', async () => {
      aok(r.filter(async x => x <= 3)(new Set([1, 2, 3, 4, 5])) instanceof Promise)
      ade(
        await r.filter(async x => x <= 3)(new Set([1, 2, 3, 4, 5])),
        new Set([1, 2, 3]),
      )
    })
    it('filters values from a set based on a sync predicate', async () => {
      ade(
        r.filter(x => x <= 3)(new Set([1, 2, 3, 4, 5])),
        new Set([1, 2, 3]),
      )
    })
    it('filters entries from a map based on an async predicate', async () => {
      const numsMap = new Map([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]])
      aok(r.filter(async ([k, v]) => k <= 3 && v <= 3)(numsMap) instanceof Promise)
      ade(
        await r.filter(async ([k, v]) => k <= 3 && v <= 3)(numsMap),
        new Map([[1, 1], [2, 2], [3, 3]]),
      )
    })
    it('filters entries from a map based on a sync predicate', async () => {
      const numsMap = new Map([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]])
      ade(
        r.filter(([k, v]) => k <= 3 && v <= 3)(numsMap),
        new Map([[1, 1], [2, 2], [3, 3]]),
      )
    })
    it('filters bytes from a number typed array based on an async predicate', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        aok(r.filter(async x => x <= 3)(new constructor([1, 2, 3, 4, 5])) instanceof Promise)
        ade(
          await r.filter(async x => x <= 3)(new constructor([1, 2, 3, 4, 5])),
          new constructor([1, 2, 3]),
        )
      }
    })
    it('filters bytes from a number typed array based on a sync predicate', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        ade(
          r.filter(x => x <= 3)(new constructor([1, 2, 3, 4, 5])),
          new constructor([1, 2, 3]),
        )
      }
    })
    it('filters bytes from a bigint typed array based on an async predicate', async () => {
      for (const constructor of bigIntTypedArrayConstructors) {
        aok(r.filter(async x => x <= 3n)(new constructor([1n, 2n, 3n, 4n, 5n])) instanceof Promise)
        ade(
          await r.filter(async x => x <= 3)(new constructor([1n, 2n, 3n, 4n, 5n])),
          new constructor([1n, 2n, 3n]),
        )
      }
    })
    it('filters bytes from a bigint typed array based on a sync predicate', async () => {
      for (const constructor of bigIntTypedArrayConstructors) {
        ade(
          r.filter(x => x <= 3n)(new constructor([1n, 2n, 3n, 4n, 5n])),
          new constructor([1n, 2n, 3n]),
        )
      }
    })
    it('filters elements from an array with an async predicate', async () => {
      const evens = r.filter(asyncIsEven)([1, 2, 3, 4, 5])
      aok(evens instanceof Promise)
      ade(await evens, [2, 4])
    })
    it('filters elements from an array with a sync predicate', async () => {
      ade(
        r.filter(isOdd)([1, 2, 3, 4, 5]),
        [1, 3, 5],
      )
    })
    it('filters entries from an object with an async predicate', async () => {
      const evens = r.filter(asyncIsEven)({ a: 1, b: 2, c: 3, d: 4, e: 5 })
      aok(evens instanceof Promise)
      ade(await evens, { b: 2, d: 4 })
    })
    it('filters entries from an object with a sync predicate', async () => {
      ade(
        r.filter(isOdd)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
        { a: 1, c: 3, e: 5 },
      )
    })
    it('acts as a filter transducer: binary function => reducer', async () => {
      const addOddsReducer = r.filter(isOdd)((y, xi) => y + xi)
      ase(typeof addOddsReducer, 'function')
      ase(addOddsReducer.length, 2)
      const addEvensReducer = r.filter(asyncIsEven)((y, xi) => y + xi)
      ase(typeof addEvensReducer, 'function')
      ase(addEvensReducer.length, 2)
    })
    it('transducer handles async predicates', async () => {
      const addEvensReducer = r.filter(asyncIsEven)((y, xi) => y + xi)
      ase(await asyncArrayReduce(addEvensReducer, 0)([1, 2, 3, 4, 5, 6], 0), 12)
    })
    it('transducer handles sync predicates', async () => {
      const addOddsReducer = r.filter(isOdd)((y, xi) => y + xi)
      ase([1, 2, 3, 4, 5].reduce(addOddsReducer, 0), 9)
    })
    it('throws a TypeError on filter({})', async () => {
      assert.throws(
        () => r.filter({}),
        new TypeError('filter(x); x is not a function'),
      )
    })
    it('throws a TypeError on filter(...)(string)', async () => {
      assert.throws(
        () => r.filter(hi)(null),
        new TypeError('filter(...)(x); x invalid')
      )
    })
    it('handles sync errors good', async () => {
      assert.throws(
        () => r.filter(x => { throw new Error(`throwing ${x}`) })(['yo']),
        new Error('throwing yo')
      )
    })
    it('handles async errors good', async () => {
      assert.rejects(
        () => r.filter(async x => { throw new Error(`throwing ${x}`) })(['yo']),
        new Error('throwing yo'),
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
        ase(r.reduce((y, xi) => y + xi)(x), 15)
        ase(r.reduce((y, xi) => y + xi, 10)(x), 25)
      }
    })
    it('reduces any iterable with an async reducer', async () => {
      aok(asyncMult(1, 2) instanceof Promise)
      for (const x of iterables) {
        aok(r.reduce(asyncMult)(x) instanceof Promise)
        ase(await r.reduce(asyncMult)(x), 120)
        ase(await r.reduce(asyncMult, 10)(x), 1200)
      }
    })
    it('reduces any async iterable with a sync reducer', async () => {
      for (const x of makeAsyncIterables()) {
        ase(await r.reduce((y, xi) => Number(y) + Number(xi))(x), 15)
      }
      for (const x of makeAsyncIterables()) {
        ase(await r.reduce((y, xi) => Number(y) + Number(xi), 10)(x), 25)
      }
    })
    it('reduces any async iterable with an async reducer', async () => {
      aok(asyncMult(1, 2) instanceof Promise)
      for (const x of makeAsyncIterables()) {
        aok(r.reduce(asyncMult)(x) instanceof Promise)
      }
      for (const x of makeAsyncIterables()) {
        ase(await r.reduce(asyncMult)(x), 120)
      }
      for (const x of makeAsyncIterables()) {
        ase(await r.reduce(asyncMult, 10)(x), 1200)
      }
    })
    it('throws a TypeError on reduce(nonFunction)', async () => {
      assert.throws(
        () => r.reduce({}),
        new TypeError('reduce(x, y); x is not a function'),
      )
    })
    it('throws a TypeError on reduce(...)(number)', async () => {
      assert.throws(
        () => r.reduce((y, xi) => y + xi)(1),
        new TypeError('reduce(...)(x); x invalid'),
      )
    })
    it('throws a TypeError on reduce(...)(emptyIterator)', async () => {
      assert.throws(
        () => r.reduce((y, xi) => y + xi)([]),
        new TypeError('reduce(...)(x); x cannot be empty'),
      )
    })
    it('throws a TypeError on reduce(...)(emptyAsyncIterator)', async () => {
      assert.rejects(
        () => r.reduce((y, xi) => y + xi)((async function* () {})()),
        new TypeError('reduce(...)(x); x cannot be empty'),
      )
    })
  })

  describe('integration: transducers from pipe, map, filter, reduce', () => {
    const concat = (y, xi) => y.concat(xi)
    const add = (y, xi) => y + xi
    it('reduce with sync transduced reducers', async () => {
      const squareOdds = r.pipe([
        r.filter(isOdd),
        r.map(x => x ** 2),
      ])
      ade(
        r.reduce(squareOdds(concat), [])([1, 2, 3, 4, 5]),
        [1, 9, 25],
      )
      ade(
        r.reduce(squareOdds((y, xi) => y.add(xi)), new Set())([1, 2, 3, 4, 5]),
        new Set([1, 9, 25]),
      )
      const appendAlphas = r.pipe([
        r.map(x => x + 'a'),
        r.map(x => x + 'b'),
        r.map(x => x + 'c'),
      ])
      ase(
        r.reduce(appendAlphas(add), '')('123'),
        '1abc2abc3abc',
      )
      ade(
        r.reduce(appendAlphas(concat), [])('123'),
        ['1abc', '2abc', '3abc'],
      )
    })
    it('reduce with an async transduced reducer', async () => {
      const hosWithHey = r.pipe([
        r.filter(async x => x === 'ho'),
        r.map(x => Promise.resolve(x + 'hey')),
      ])
      const hihos = { a: 'hi', b: 'ho', c: 'hi', d: 'ho', e: 'hi', f: 'ho' }
      aok(r.reduce(hosWithHey(add), '')(hihos) instanceof Promise),
      aok(r.reduce(hosWithHey(concat), [])(hihos) instanceof Promise),
      ase(
        await r.reduce(hosWithHey(add), '')(hihos),
        'hoheyhoheyhohey',
      )
      ade(
        await r.reduce(hosWithHey(concat), [])(hihos),
        ['hohey', 'hohey', 'hohey'],
      )
    })
  })

  describe('transform', () => {
    const isBigOdd = x => (x % 2n === 1n)
    const asyncIsBigEven = async x => (x % 2n === 0n)
    const bigSquare = x => x ** 2n
    const squareOdds = r.pipe([r.filter(isOdd), r.map(square)])
    const squareOddsToString = r.pipe([
      r.filter(isOdd),
      r.map(r.pipe([square, x => `${x}`])),
    ])
    const squareBigOdds = r.pipe([r.filter(isBigOdd), r.map(bigSquare)])
    const asyncEvens = r.filter(asyncIsEven)
    const asyncEvensToString = r.pipe([
      r.filter(asyncIsEven),
      r.map(x => `${x}`)
    ])
    const asyncBigEvens = r.filter(asyncIsBigEven)
    const numbers = [1, 2, 3, 4, 5]
    const bigNumbers = [1n, 2n, 3n, 4n, 5n]
    it('sync transforms iterable to null', async () => {
      let y = ''
      ase(r.transform(r.tap(x => { y += x }), null)(numbers), null)
      ase(y, '12345')
    })
    it('async transforms iterable to null', async () => {
      let y = ''
      aok(r.transform(r.tap(async () => {}), null)(numbers) instanceof Promise)
      ase(await r.transform(r.tap(async x => { y += x }), null)(numbers), null)
      ase(y, '12345')
    })
    it('sync transforms iterable to array', async () => {
      ade(r.transform(squareOdds, [])(numbers), [1, 9, 25])
    })
    it('async transforms iterable to array', async () => {
      aok(r.transform(asyncEvens, [99])(numbers) instanceof Promise)
      ade(await r.transform(asyncEvens, [99])(numbers), [99, 2, 4])
    })
    it('sync transforms iterable to string', async () => {
      ase(r.transform(squareOdds, '')(numbers), '1925')
    })
    it('async transforms iterable to string', async () => {
      aok(r.transform(asyncEvens, '99')(numbers) instanceof Promise)
      ase(await r.transform(asyncEvens, '99')(numbers), '9924')
    })
    it('sync transforms iterable to set', async () => {
      ade(r.transform(squareOdds, new Set())(numbers), new Set([1, 9, 25]))
    })
    it('async transforms iterable to set', async () => {
      aok(r.transform(asyncEvens, new Set([99]))(numbers) instanceof Promise)
      ade(
        await r.transform(asyncEvens, new Set([99, 2]))(numbers),
        new Set([99, 2, 4]),
      )
    })
    it('sync transforms iterable to map', async () => {
      ade(
        r.transform(r.map(
          x => [x, x.charCodeAt(0)],
        ), new Map())('abc'),
        new Map([['a', 97], ['b', 98], ['c', 99]]),
      )
    })
    it('async transforms iterable to map', async () => {
      aok(
        r.transform(r.map(
          async x => [x, x.charCodeAt(0)],
        ), new Map())('abc') instanceof Promise
      )
      ade(
        await r.transform(r.map(
          async x => [x, x.charCodeAt(0)],
        ), new Map())('abc'),
        new Map([['a', 97], ['b', 98], ['c', 99]]),
      )
    })
    it('strings are encoded into arrays of character codes for number TypedArrays', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        ade(
          r.transform(squareOddsToString, new constructor(0))(numbers),
          new constructor([49, 57, 50, 53]),
        )
        ase(String.fromCharCode(...(new constructor([49, 57, 50, 53]))), '1925')
      }
    })
    it('sync transforms iterable to a number TypedArray', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        ade(
          r.transform(squareOdds, new constructor(0))(numbers),
          new constructor([1, 9, 25]),
        )
      }
    })
    it('async transforms iterable to number TypedArray', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        const buffer99 = new constructor([9, 9])
        const buffer9924 = r.transform(asyncEvens, buffer99)(numbers)
        aok(buffer9924 instanceof Promise)
        ade(await buffer9924, new constructor([9, 9, 2, 4]))
      }
    })
    it('sync transforms iterable to a bigint TypedArray', async () => {
      for (const constructor of bigIntTypedArrayConstructors) {
        ade(
          r.transform(squareBigOdds, new constructor(0))(bigNumbers),
          new constructor([1n, 9n, 25n]),
        )
      }
    })
    it('async transforms iterable to a bigint TypedArray', async () => {
      for (const constructor of bigIntTypedArrayConstructors) {
        const buffer99 = new constructor([9n, 9n])
        const buffer9924 = r.transform(asyncBigEvens, buffer99)(bigNumbers)
        aok(buffer9924 instanceof Promise)
        ade(await buffer9924, new constructor([9n, 9n, 2n, 4n]))
      }
    })
    it('sync transforms iterable to writeable stream', async () => {
      const tmpWriter = fs.createWriteStream(path.join(__dirname, './tmp'))
      r.transform(squareOddsToString, tmpWriter)(numbers)
      ase(await consumeReadStreamPush(
        fs.createReadStream(path.join(__dirname, './tmp')),
      ), '1925')
      ase(await consumeReadStreamPull(
        fs.createReadStream(path.join(__dirname, './tmp')),
      ), '1925')
      fs.unlinkSync('./tmp')
    })
    it('async transforms iterable to writeable stream', async () => {
      const tmpWriter = fs.createWriteStream(path.join(__dirname, './tmp'))
      tmpWriter.write('99')
      const writeEvens = r.transform(asyncEvensToString, tmpWriter)(numbers)
      aok(writeEvens instanceof Promise)
      await writeEvens
      ase(await consumeReadStreamPush(
        fs.createReadStream(path.join(__dirname, './tmp')),
      ), '9924')
      ase(await consumeReadStreamPull(
        fs.createReadStream(path.join(__dirname, './tmp')),
      ), '9924')
      fs.unlinkSync('./tmp')
    })
    it('throws a TypeError for transform(Object, () => {})', async () => {
      assert.throws(
        () => r.transform(() => {}, {}),
        new TypeError('transform(x, y); x invalid'),
      )
    })
    it('throws a TypeError for non function transducer', async () => {
      assert.throws(
        () => r.transform('yo', 'hey'),
        new TypeError('transform(x, y); y is not a function'),
      )
    })
  })

  describe('get', () => {
    const aaaaa = { a: { a: { a: { a: { a: 1 } } } } }
    const nested = [[[[[1]]]]]
    it('accesses a property of an object by name', async () => {
      ase(r.get('a')({ a: 1 }), 1)
      ase(r.get('b')({ a: 1 }), undefined)
      ase(r.get('b', 0)({ a: 1 }), 0)
      ase(r.get(0)([1]), 1)
      ase(r.get(1)([1]), undefined)
      ase(r.get(1, 0)([1]), 0)
    })
    it('accesses a property of an object by dot notation', async () => {
      ase(r.get('a.a.a.a.a')(aaaaa), 1)
      ase(r.get('a.a.a.a.b')(aaaaa), undefined)
      ase(r.get('a.a.a.a.b', 0)(aaaaa), 0)
      ase(r.get('0.0.0.0.0')(nested), 1)
      ase(r.get('0.0.0.0.1')(nested), undefined)
      ase(r.get('0.0.0.0.1', 0)(nested), 0)
    })
    it('accesses a property of an object by array', async () => {
      ase(r.get(['a', 'a', 'a', 'a', 'a'])(aaaaa), 1)
      ase(r.get(['a', 'a', 'a', 'a', 'b'])(aaaaa), undefined)
      ase(r.get(['a', 'a', 'a', 'a', 'b'], 0)(aaaaa), 0)
      ase(r.get([0, 0, 0, 0, 0])(nested), 1)
      ase(r.get([0, 0, 0, 0, 1])(nested), undefined)
      ase(r.get([0, 0, 0, 0, 1], 0)(nested), 0)
      ase(r.get(['a', 0])({ a: [1] }), 1)
    })
    it('handles null and undefined initial value with default or undefined', async () => {
      ase(r.get('a')(null), undefined)
      ase(r.get('a', 'yo')(null), 'yo')
      ase(r.get('a', 'yo')(undefined), 'yo')
    })
    it('throws a TypeError on invalid path', async () => {
      assert.throws(
        () => r.get({}),
        new TypeError('get(x, y); x invalid'),
      )
    })
  })

  describe('pick', () => {
    const abc = { a: 1, b: 2, c: 3 }
    it('picks properties off an object defined by array', async () => {
      ade(r.pick(['a'])(abc), { a: 1 })
      ade(r.pick(['a', 'd'])(abc), { a: 1 })
      ade(r.pick(['d'])(abc), {})
    })
    it('throws a TypeError on pick(nonArray)', async () => {
      assert.throws(
        () => r.pick('hey'),
        new TypeError('pick(x); x is not an array'),
      )
    })
    it('throws a TypeError on pick(...)(nonObject)', async () => {
      assert.throws(
        () => r.pick(['hey'])(['hey']),
        new TypeError('pick(...)(x); x is not an object'),
      )
    })
  })

  describe('omit', () => {
    const abc = { a: 1, b: 2, c: 3 }
    it('omits properties from an object defined by array', async () => {
      ade(r.omit(['a'])(abc), { b: 2, c: 3 })
      ade(r.omit(['a', 'd'])(abc), { b: 2, c: 3 })
      ade(r.omit(['d'])(abc), { a: 1, b: 2, c: 3 })
    })
    it('throws a TypeError on invalid props', async () => {
      assert.throws(
        () => r.omit('hey'),
        new TypeError('omit(x); x is not an array'),
      )
    })
    it('throws a TypeError on invalid input', async () => {
      assert.throws(
        () => r.omit(['hey'])(['hey']),
        new TypeError('omit(...)(x); x is not an object'),
      )
    })
  })

  describe('any', () => {
    const numbers = [1, 2, 3, 4, 5]
    const numbersObject = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    it('syncly evaluates fn against all items in iterable, true if any evaluation is truthy', async () => {
      ase(r.any(x => x > 5)(numbers), false)
      ase(r.any(x => x > 0)(numbers), true)
      ase(r.any(x => x > 5)(new Set(numbers)), false)
      ase(r.any(x => x > 0)(new Set(numbers)), true)
      ase(r.any(x => x > 5)(numbersObject), false)
      ase(r.any(x => x > 0)(numbersObject), true)
    })
    it('asyncly evaluates fn against all items in iterable, true if any evaluation is truthy', async () => {
      aok(r.any(async x => x > 5)(numbers) instanceof Promise)
      ase(await r.any(async x => x > 5)(numbers), false)
      ase(await r.any(async x => x > 0)(numbers), true)
      ase(await r.any(async x => x > 5)(new Set(numbers)), false)
      ase(await r.any(async x => x > 0)(new Set(numbers)), true)
      ase(await r.any(async x => x > 5)(numbersObject), false)
      ase(await r.any(async x => x > 0)(numbersObject), true)
    })
    it('throws TypeError on non function setup', async () => {
      assert.throws(
        () => r.any('hey'),
        new TypeError('any(x); x is not a function'),
      )
    })
    it('throws TypeError if input not iterable or object', async () => {
      assert.throws(
        () => r.any(x => x)(1),
        new TypeError('any(...)(x); x invalid'),
      )
    })
  })

  describe('all', () => {
    const numbers = [1, 2, 3, 4, 5]
    const numbersObject = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    it('syncly evaluates fn against all items in iterable, true if all evaluations are truthy', async () => {
      ase(r.all(x => x > 5)(numbers), false)
      ase(r.all(x => x > 0)(numbers), true)
      ase(r.all(x => x > 5)(new Set(numbers)), false)
      ase(r.all(x => x > 0)(new Set(numbers)), true)
      ase(r.all(x => x > 5)(numbersObject), false)
      ase(r.all(x => x > 0)(numbersObject), true)
    })
    it('asyncly evaluates fn against all items in iterable, true if all evaluations are truthy', async () => {
      aok(r.all(async x => x > 5)(numbers) instanceof Promise)
      ase(await r.all(async x => x > 5)(numbers), false)
      ase(await r.all(async x => x > 0)(numbers), true)
      ase(await r.all(async x => x > 5)(new Set(numbers)), false)
      ase(await r.all(async x => x > 0)(new Set(numbers)), true)
      ase(await r.all(async x => x > 5)(numbersObject), false)
      ase(await r.all(async x => x > 0)(numbersObject), true)
    })
    it('throws TypeError on all(nonFunction)', async () => {
      assert.throws(
        () => r.all('hey'),
        new TypeError('all(x); x is not a function'),
      )
    })
    it('throws TypeError on all(...)(string)', async () => {
      assert.throws(
        () => r.all(x => x)(1),
        new TypeError('all(...)(x); x invalid'),
      )
    })
  })

  describe('and', () => {
    const isGreaterThan1 = x => x > 1
    it('sync tests input against provided array of functions, true if all evaluations are truthy', async () => {
      ase(r.and([isOdd, isGreaterThan1])(3), true)
      ase(r.and([isOdd, isGreaterThan1])(1), false)
    })
    it('async tests input against provided array of functions, true if all evaluations are truthy', async () => {
      aok(r.and([asyncIsEven, isGreaterThan1])(2) instanceof Promise)
      ase(await r.and([asyncIsEven, isGreaterThan1])(2), true)
      ase(await r.and([asyncIsEven, isGreaterThan1])(0), false)
    })
    it('throws a TypeError if passed a non array', async () => {
      assert.throws(
        () => r.and('hey'),
        new TypeError('and(x); x is not an array of functions'),
      )
    })
    it('throws a RangeError if passed less than one function', async () => {
      assert.throws(
        () => r.and([]),
        new RangeError('and(x); x is not an array of at least one function'),
      )
    })
    it('throws a TypeError if any item is not a function', async () => {
      assert.throws(
        () => r.and([() => false, 'hey', () => 'hi']),
        new TypeError('and(x); x[1] is not a function'),
      )
    })
  })

  describe('or', () => {
    const isGreaterThan1 = x => x > 1
    it('sync tests input against provided array of functions, true if any evaluations are truthy', async () => {
      ase(r.or([isOdd, isGreaterThan1])(3), true)
      ase(r.or([isOdd, isGreaterThan1])(0), false)
    })
    it('async tests input against provided array of functions, true if any evaluations are truthy', async () => {
      aok(r.or([asyncIsEven, isGreaterThan1])(2) instanceof Promise)
      ase(await r.or([asyncIsEven, isGreaterThan1])(2), true)
      ase(await r.or([asyncIsEven, isGreaterThan1])(1), false)
    })
    it('throws a TypeError if passed a non array', async () => {
      assert.throws(
        () => r.or('hey'),
        new TypeError('or(x); x is not an array of functions'),
      )
    })
    it('throws a RangeError if passed less than one function', async () => {
      assert.throws(
        () => r.or([]),
        new RangeError('or(x); x is not an array of at least one function'),
      )
    })
    it('throws a TypeError if any item is not a function', async () => {
      assert.throws(
        () => r.or([() => false, 'hey', () => 'hi']),
        new TypeError('or(x); x[1] is not a function'),
      )
    })
  })

  describe('not', () => {
    it('[sync] not(isOdd)(x) === !isOdd(x)', async () => {
      ase(r.not(isOdd)(2), true)
      ase(r.not(isOdd)(1), false)
    })
    it('[async] not(isEven)(x) === !(await isEven(x))', async () => {
      aok(r.not(asyncIsEven)(2) instanceof Promise)
      ase(await r.not(asyncIsEven)(2), false)
      ase(await r.not(asyncIsEven)(1), true)
    })
    it('throws TypeError on not(nonFunction)', async () => {
      assert.throws(
        () => r.not('hey'),
        new TypeError('not(x); x is not a function'),
      )
    })
  })

  describe('eq', () => {
    it('[sync] eq(f, g)(x) === (f(x) === g(x))', async () => {
      ase(r.eq(x => `${x}`, x => x)('hey'), true)
      ase(r.eq(x => `${x}`, x => x)(1), false)
    })
    it('[async] eq(f, g)(x) === (f(x) === g(x))', async () => {
      aok(r.eq(x => `${x}`, async x => x)('hey') instanceof Promise)
      ase(await r.eq(x => `${x}`, async x => x)('hey'), true)
      ase(await r.eq(x => `${x}`, async x => x)(1), false)
    })
    it('[async] eq(value, g)(x) === (value === g(x))', async () => {
      aok(r.eq('hey', async x => x)('hey') instanceof Promise)
      ase(await r.eq('hey', async x => x)('hey'), true)
      ase(await r.eq('ho', async x => x)(1), false)
    })
    it('[sync] eq(valueA, valueB)(x) === (valueA === valueB)', async () => {
      ase(r.eq('hey', 'hey')('ayylmao'), true)
      ase(r.eq('hey', 'ho')('ayylmao'), false)
    })
    it('throws RangeError on not enough arguments', async () => {
      assert.throws(
        () => r.eq('hey'),
        new RangeError('eq(...arguments); exactly two arguments required'),
      )
    })
    it('throws RangeError on too many arguments', async () => {
      assert.throws(
        () => r.eq('hey', () => {}, 'ho'),
        new RangeError('eq(...arguments); exactly two arguments required'),
      )
    })
  })

  describe('gt', () => {
    it('[sync] gt(f, g)(x) === (f(x) > g(x))', async () => {
      ase(r.gt(x => x + 1, x => x)(1), true)
      ase(r.gt(x => x, x => x)(1), false)
      ase(r.gt(x => x, x => x + 1)(1), false)
    })
    it('[async] gt(f, g)(x) === (f(x) > g(x))', async () => {
      aok(r.gt(x => x + 1, async x => x)(1) instanceof Promise)
      ase(await r.gt(x => x + 1, async x => x)(1), true)
      ase(await r.gt(async x => x, x => x)(1), false)
      ase(await r.gt(async x => x, async x => x + 1)(1), false)
    })
    it('[async] gt(value, g)(x) === (value > g(x))', async () => {
      aok(r.gt(1, async x => x)(2) instanceof Promise)
      ase(await r.gt(1, async x => x)(0), true)
      ase(await r.gt(1, async x => x)(1), false)
      ase(await r.gt(1, async x => x)(2), false)
    })
    it('[sync] gt(valueA, valueB)(x) === (valueA > valueB)', async () => {
      ase(r.gt(1, 0)('ayylmao'), true)
      ase(r.gt(1, 1)('ayylmao'), false)
      ase(r.gt(0, 1)('ayylmao'), false)
    })
    it('throws RangeError on not enough arguments', async () => {
      assert.throws(
        () => r.gt('hey'),
        new RangeError('gt(...arguments); exactly two arguments required'),
      )
    })
    it('throws RangeError on too many arguments', async () => {
      assert.throws(
        () => r.gt('hey', () => {}, 'ho'),
        new RangeError('gt(...arguments); exactly two arguments required'),
      )
    })
  })

  describe('lt', () => {
    it('[sync] lt(f, g)(x) === (f(x) < g(x))', async () => {
      ase(r.lt(x => x + 1, x => x)(1), false)
      ase(r.lt(x => x, x => x)(1), false)
      ase(r.lt(x => x, x => x + 1)(1), true)
    })
    it('[async] lt(f, g)(x) === (f(x) < g(x))', async () => {
      aok(r.lt(x => x + 1, async x => x)(1) instanceof Promise)
      ase(await r.lt(x => x + 1, async x => x)(1), false)
      ase(await r.lt(async x => x, x => x)(1), false)
      ase(await r.lt(async x => x, async x => x + 1)(1), true)
    })
    it('[async] lt(value, g)(x) === (value < g(x))', async () => {
      aok(r.lt(1, async x => x)(2) instanceof Promise)
      ase(await r.lt(1, async x => x)(0), false)
      ase(await r.lt(1, async x => x)(1), false)
      ase(await r.lt(1, async x => x)(2), true)
    })
    it('[sync] lt(valueA, valueB)(x) === (valueA < valueB)', async () => {
      ase(r.lt(1, 0)('ayylmao'), false)
      ase(r.lt(1, 1)('ayylmao'), false)
      ase(r.lt(0, 1)('ayylmao'), true)
    })
    it('throws RangeError on not enough arguments', async () => {
      assert.throws(
        () => r.lt('hey'),
        new RangeError('lt(...arguments); exactly two arguments required'),
      )
    })
    it('throws RangeError on too many arguments', async () => {
      assert.throws(
        () => r.lt('hey', () => {}, 'ho'),
        new RangeError('lt(...arguments); exactly two arguments required'),
      )
    })
  })

  describe('gte', () => {
    it('[sync] gte(f, g)(x) === (f(x) >= g(x))', async () => {
      ase(r.gte(x => x + 1, x => x)(1), true)
      ase(r.gte(x => x, x => x)(1), true)
      ase(r.gte(x => x, x => x + 1)(1), false)
    })
    it('[async] gte(f, g)(x) === (f(x) >= g(x))', async () => {
      aok(r.gte(x => x + 1, async x => x)(1) instanceof Promise)
      ase(await r.gte(x => x + 1, async x => x)(1), true)
      ase(await r.gte(async x => x, x => x)(1), true)
      ase(await r.gte(async x => x, async x => x + 1)(1), false)
    })
    it('[async] gte(value, g)(x) === (value >= g(x))', async () => {
      aok(r.gte(1, async x => x)(2) instanceof Promise)
      ase(await r.gte(1, async x => x)(0), true)
      ase(await r.gte(1, async x => x)(1), true)
      ase(await r.gte(1, async x => x)(2), false)
    })
    it('[sync] gte(valueA, valueB)(x) === (valueA >= valueB)', async () => {
      ase(r.gte(1, 0)('ayylmao'), true)
      ase(r.gte(1, 1)('ayylmao'), true)
      ase(r.gte(0, 1)('ayylmao'), false)
    })
    it('throws RangeError on not enough arguments', async () => {
      assert.throws(
        () => r.gte('hey'),
        new RangeError('gte(...arguments); exactly two arguments required'),
      )
    })
    it('throws RangeError on too many arguments', async () => {
      assert.throws(
        () => r.gte('hey', () => {}, 'ho'),
        new RangeError('gte(...arguments); exactly two arguments required'),
      )
    })
  })

  describe('lte', () => {
    it('[sync] lte(f, g)(x) === (f(x) <= g(x))', async () => {
      ase(r.lte(x => x + 1, x => x)(1), false)
      ase(r.lte(x => x, x => x)(1), true)
      ase(r.lte(x => x, x => x + 1)(1), true)
    })
    it('[async] lte(f, g)(x) === (f(x) <= g(x))', async () => {
      aok(r.lte(x => x + 1, async x => x)(1) instanceof Promise)
      ase(await r.lte(x => x + 1, async x => x)(1), false)
      ase(await r.lte(async x => x, x => x)(1), true)
      ase(await r.lte(async x => x, async x => x + 1)(1), true)
    })
    it('[async] lte(value, g)(x) === (value <= g(x))', async () => {
      aok(r.lte(1, async x => x)(2) instanceof Promise)
      ase(await r.lte(1, async x => x)(0), false)
      ase(await r.lte(1, async x => x)(1), true)
      ase(await r.lte(1, async x => x)(2), true)
    })
    it('[sync] lte(valueA, valueB)(x) === (valueA <= valueB)', async () => {
      ase(r.lte(1, 0)('ayylmao'), false)
      ase(r.lte(1, 1)('ayylmao'), true)
      ase(r.lte(0, 1)('ayylmao'), true)
    })
    it('throws RangeError on not enough arguments', async () => {
      assert.throws(
        () => r.lte('hey'),
        new RangeError('lte(...arguments); exactly two arguments required'),
      )
    })
    it('throws RangeError on too many arguments', async () => {
      assert.throws(
        () => r.lte('hey', () => {}, 'ho'),
        new RangeError('lte(...arguments); exactly two arguments required'),
      )
    })
  })

  it('exports 23 functions', async () => {
    ase(Object.keys(r).length, 23)
  })
})
