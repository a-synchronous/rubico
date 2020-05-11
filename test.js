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
        new TypeError('arguments[0] is not an array of functions'),
      )
    })
    it('throws a RangeError if passed less than one function', async () => {
      assert.throws(
        () => r.pipe([]),
        new RangeError('arguments[0] at least one function required'),
      )
    })
    it('throws a TypeError if any arguments are not a function', async () => {
      assert.throws(
        () => {
          r.pipe([() => 1, undefined, () => 2])
        },
        new TypeError('arguments[0][1] is not a function'),
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
        new RangeError('arguments[0] at least one function required'),
      )
    })
    it('throws TypeError for fork({})', async () => {
      assert.throws(
        () => r.fork({}),
        new RangeError('arguments[0] at least one function required'),
      )
    })
    it('throws TypeError for fork([nonFunction])', async () => {
      assert.throws(
        () => r.fork(['hey']),
        new TypeError('arguments[0][0] is not a function'),
      )
    })
    it('throws TypeError for fork({ a: nonFunction })', async () => {
      assert.throws(
        () => r.fork({ a: 'hey' }),
        new TypeError('arguments[0][\'a\'] is not a function'),
      )
    })
    it('throws TypeError for String', async () => {
      assert.throws(
        () => r.fork('ayelmao'),
        new TypeError('arguments[0] invalid'),
      )
    })
    it('throws TypeError for Set', async () => {
      assert.throws(
        () => r.fork(new Set([hi])),
        new TypeError('arguments[0] invalid'),
      )
    })
    it('throws TypeError for Map', async () => {
      assert.throws(
        () => r.fork(new Map([['a', hi]])),
        new TypeError('arguments[0] invalid'),
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
        new RangeError('arguments[0] at least one function required'),
      )
    })
    it('throws TypeError for fork([nonFunction])', async () => {
      assert.throws(
        () => r.fork.series(['hey']),
        new TypeError('arguments[0][0] is not a function'),
      )
    })
    it('throws TypeError for non array functions', async () => {
      assert.throws(
        () => r.fork.series({}),
        new TypeError('arguments[0] invalid'),
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
        new TypeError('arguments[0] is not an object of functions'),
      )
    })
    it('throws TypeError on assign(...)(nonObject)', async () => {
      assert.throws(
        () => r.assign({ a: hi })('hi'),
        new TypeError('arguments[0] is not an object'),
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
        new TypeError('cannot tap with string'),
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
        new TypeError('cannot try string'),
      )
    })
    it('throws a TypeError if passed a non function catcher', async () => {
      assert.throws(
        () => r.tryCatch(() => {}, Buffer.from('abc')),
        new TypeError('cannot catch with buffer'),
      )
    })
  })

  describe('ternary', () => {
    it('sync x => fn[0](x) ? fn[1](x) : fn[2](x)', async () => {
      const a1IfA1 = r.ternary([
        x => x.a === 1,
        () => 'a1',
        () => '!a1',
      ])
      ase(a1IfA1({ a: 1 }), 'a1')
      ase(a1IfA1({ a: 2 }), '!a1')
    })
    it('async x => fn[0](x) ? fn[1](x) : fn[2](x)', async () => {
      const a1IfA1Async = r.ternary([
        async x => x.a === 1,
        () => 'a1',
        async () => '!a1',
      ])
      aok(a1IfA1Async({ a: 1 }) instanceof Promise)
      ase(await a1IfA1Async({ a: 1 }), 'a1')
      ase(await a1IfA1Async({ a: 2 }), '!a1')
    })
    it('throws a TypeError if passed a non array', async () => {
      assert.throws(
        () => r.ternary('hey'),
        new TypeError('first argument must be an array of functions'),
      )
    })
    it('throws a RangeError if passed less than three functions', async () => {
      assert.throws(
        () => r.ternary([() => false, () => 'hey']),
        new RangeError('exactly 3 functions required'),
      )
    })
    it('throws a TypeError if any item is not a function', async () => {
      assert.throws(
        () => r.ternary([() => false, 'hey', () => 'hi']),
        new TypeError('string (functions[1]) is not a function'),
      )
    })
  })

  describe('map', () => {
    it('applies an async function in parallel to all elements of an array', async () => {
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
    it('throws a TypeError if passed a non function', async () => {
      assert.throws(
        () => r.map({}),
        new TypeError('object is not a function'),
      )
    })
    it('throws a TypeError if input is not an array or object', async () => {
      assert.throws(
        () => r.map(hi)('yo'),
        new TypeError('cannot map from string')
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
        new TypeError('string is not a function'),
      )
    })
    it('throws TypeError for non array input', async () => {
      assert.throws(
        () => r.map.series(() => 1)('hey'),
        new TypeError('cannot map.series from string')
      )
    })
  })

  describe('filter', () => {
    it('filters elements from an array with a sync predicate', async () => {
      ade(
        r.filter(isOdd)([1, 2, 3, 4, 5]),
        [1, 3, 5],
      )
    })
    it('filters elements from an array with an async predicate', async () => {
      const evens = r.filter(asyncIsEven)([1, 2, 3, 4, 5])
      aok(evens instanceof Promise)
      ade(await evens, [2, 4])
    })
    it('filters entries from an object with a sync predicate', async () => {
      ade(
        r.filter(isOdd)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
        { a: 1, c: 3, e: 5 },
      )
    })
    it('filters entries from an object with an async predicate', async () => {
      const evens = r.filter(asyncIsEven)({ a: 1, b: 2, c: 3, d: 4, e: 5 })
      aok(evens instanceof Promise)
      ade(await evens, { b: 2, d: 4 })
    })
    it('acts as a filter transducer: binary function => reducer', async () => {
      const addOddsReducer = r.filter(isOdd)((y, xi) => y + xi)
      ase(typeof addOddsReducer, 'function')
      ase(addOddsReducer.length, 2)
      const addEvensReducer = r.filter(asyncIsEven)((y, xi) => y + xi)
      ase(typeof addEvensReducer, 'function')
      ase(addEvensReducer.length, 2)
    })
    it('transducer handles sync predicates', async () => {
      const addOddsReducer = r.filter(isOdd)((y, xi) => y + xi)
      ase([1, 2, 3, 4, 5].reduce(addOddsReducer, 0), 9)
    })
    it('transducer handles async predicates', async () => {
      const addEvensReducer = r.filter(asyncIsEven)((y, xi) => y + xi)
      ase(await asyncArrayReduce(addEvensReducer, 0)([1, 2, 3, 4, 5, 6], 0), 12)
    })
    it('throws a TypeError if passed a non function', async () => {
      assert.throws(
        () => r.filter({}),
        new TypeError('object is not a function'),
      )
    })
    it('throws a TypeError if input is not an array or object', async () => {
      assert.throws(
        () => r.filter(hi)('yo'),
        new TypeError('cannot filter from string')
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
    it('throws a TypeError if passed a non function', async () => {
      assert.throws(
        () => r.reduce({}),
        new TypeError('object is not a function'),
      )
    })
    it('throws a TypeError if passed a non iterable', async () => {
      assert.throws(
        () => r.reduce((y, xi) => y + xi)(1),
        new TypeError('cannot reduce number'),
      )
    })
    it('throws an Error on empty iterator', async () => {
      assert.throws(
        () => r.reduce((y, xi) => y + xi)([]),
        new TypeError('cannot reduce empty iterator'),
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
        // r.transform('', appendAlphas)('123'),
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
    it('sync transforms iterable to array', async () => {
      ade(r.transform([], squareOdds)(numbers), [1, 9, 25])
    })
    it('async transforms iterable to array', async () => {
      aok(r.transform([99], asyncEvens)(numbers) instanceof Promise)
      ade(await r.transform([99], asyncEvens)(numbers), [99, 2, 4])
    })
    it('sync transforms iterable to string', async () => {
      ase(r.transform('', squareOdds)(numbers), '1925')
    })
    it('async transforms iterable to string', async () => {
      aok(r.transform('99', asyncEvens)(numbers) instanceof Promise)
      ase(await r.transform('99', asyncEvens)(numbers), '9924')
    })
    it('sync transforms iterable to set', async () => {
      ade(r.transform(new Set(), squareOdds)(numbers), new Set([1, 9, 25]))
    })
    it('async transforms iterable to set', async () => {
      aok(r.transform(new Set([99]), asyncEvens)(numbers) instanceof Promise)
      ade(
        await r.transform(new Set([99, 2]), asyncEvens)(numbers),
        new Set([99, 2, 4]),
      )
    })
    it('strings are encoded into arrays of character codes for number TypedArrays', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        ade(
          r.transform(new constructor(0), squareOddsToString)(numbers),
          new constructor([49, 57, 50, 53]),
        )
        ase(String.fromCharCode(...(new constructor([49, 57, 50, 53]))), '1925')
      }
    })
    it('sync transforms iterable to a number TypedArray', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        ade(
          r.transform(new constructor(0), squareOdds)(numbers),
          new constructor([1, 9, 25]),
        )
      }
    })
    it('async transforms iterable to number TypedArray', async () => {
      for (const constructor of numberTypedArrayConstructors) {
        const buffer99 = new constructor([9, 9])
        const buffer9924 = r.transform(buffer99, asyncEvens)(numbers)
        aok(buffer9924 instanceof Promise)
        ade(await buffer9924, new constructor([9, 9, 2, 4]))
      }
    })
    it('sync transforms iterable to a bigint TypedArray', async () => {
      for (const constructor of bigIntTypedArrayConstructors) {
        ade(
          r.transform(new constructor(0), squareBigOdds)(bigNumbers),
          new constructor([1n, 9n, 25n]),
        )
      }
    })
    it('async transforms iterable to a bigint TypedArray', async () => {
      for (const constructor of bigIntTypedArrayConstructors) {
        const buffer99 = new constructor([9n, 9n])
        const buffer9924 = r.transform(buffer99, asyncBigEvens)(bigNumbers)
        aok(buffer9924 instanceof Promise)
        ade(await buffer9924, new constructor([9n, 9n, 2n, 4n]))
      }
    })
    it('sync transforms iterable to writeable stream', async () => {
      const tmpWriter = fs.createWriteStream(path.join(__dirname, './tmp'))
      r.transform(tmpWriter, squareOddsToString)(numbers)
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
      const writeEvens = r.transform(tmpWriter, asyncEvensToString)(numbers)
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
    it('throws a TypeError for invalid initial value', async () => {
      assert.throws(
        () => r.transform({}, () => {}),
        new TypeError('cannot transform object'),
      )
    })
    it('throws a TypeError for non function transducer', async () => {
      assert.throws(
        () => r.transform('hey', 'yo'),
        new TypeError('string is not a function'),
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
    it('throws a TypeError on invalid path', async () => {
      assert.throws(
        () => r.get({}),
        new TypeError('cannot get with object path'),
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
    it('throws a TypeError on invalid props', async () => {
      assert.throws(
        () => r.pick('hey'),
        new TypeError('cannot pick with string; array of props required'),
      )
    })
    it('throws a TypeError on invalid input', async () => {
      assert.throws(
        () => r.pick(['hey'])(['hey']),
        new TypeError('cannot pick from array'),
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
        new TypeError('cannot omit with string; array of props required'),
      )
    })
    it('throws a TypeError on invalid input', async () => {
      assert.throws(
        () => r.omit(['hey'])(['hey']),
        new TypeError('cannot omit from array'),
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
        new TypeError('string is not a function'),
      )
    })
    it('throws TypeError if input not iterable or object', async () => {
      assert.throws(
        () => r.any(x => x)(1),
        new TypeError('cannot any number'),
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
    it('throws TypeError on non function setup', async () => {
      assert.throws(
        () => r.all('hey'),
        new TypeError('string is not a function'),
      )
    })
    it('throws TypeError if input not iterable or object', async () => {
      assert.throws(
        () => r.all(x => x)(1),
        new TypeError('cannot all number'),
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
        new TypeError('first argument must be an array of functions'),
      )
    })
    it('throws a RangeError if passed less than one function', async () => {
      assert.throws(
        () => r.and([]),
        new RangeError('at least one function required'),
      )
    })
    it('throws a TypeError if any item is not a function', async () => {
      assert.throws(
        () => r.and([() => false, 'hey', () => 'hi']),
        new TypeError('string (functions[1]) is not a function'),
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
        new TypeError('first argument must be an array of functions'),
      )
    })
    it('throws a RangeError if passed less than one function', async () => {
      assert.throws(
        () => r.or([]),
        new RangeError('at least one function required'),
      )
    })
    it('throws a TypeError if any item is not a function', async () => {
      assert.throws(
        () => r.or([() => false, 'hey', () => 'hi']),
        new TypeError('string (functions[1]) is not a function'),
      )
    })
  })
})
