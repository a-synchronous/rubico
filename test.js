const assert = require('assert')
const r = require('.')

const ase = assert.strictEqual

const ade = assert.deepEqual

const aok = assert.ok

const hi = x => x + 'hi'

const ho = x => x + 'ho'

const isOdd = x => (x % 2 === 1)

const asyncIsEven = x => new Promise(resolve => {
  setImmediate(() => resolve(x % 2 === 0))
})

const asyncHey = x => new Promise(resolve => {
  setImmediate(() => resolve(x + 'hey'))
})

const asyncMult = (y, xi) => new Promise(resolve => {
  setImmediate(() => resolve(y * xi))
})

const asyncArrayReduce = (fn, y0) => async x => {
  if (x.length < 2) throw new Error('array must have length >= 2')
  let y, i
  if (y0 === undefined || y0 === null) {
    y = await fn(x[0], x[1])
    i = 2
  } else {
    y = await fn(y0, x[0])
    i = 1
  }
  while (i < x.length) { y = await fn(y, x[i]); i += 1 }
  return y
}

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
    it('chaining no fns is identity', async () => {
      ase(await r.pipe([])('yo'), 'yo')
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
        new TypeError('first argument must be an array of functions'),
      )
    })
    it('throws a TypeError if any arguments are not a function', async () => {
      assert.throws(
        () => {
          r.pipe([() => 1, undefined, () => 2])
        },
        new TypeError('undefined (functions[1]) is not a function'),
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
    it('throws TypeError for String', async () => {
      assert.throws(
        () => r.fork('ayelmao'),
        new TypeError('cannot fork into String'),
      )
    })
    it('throws TypeError for Set', async () => {
      assert.throws(
        () => r.fork(new Set([hi])),
        new TypeError('cannot fork into Set'),
      )
    })
    it('throws TypeError for Map', async () => {
      assert.throws(
        () => r.fork(new Map([['a', hi]])),
        new TypeError('cannot fork into Map'),
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
    it('throws TypeError on non object functions', async () => {
      assert.throws(
        () => r.assign(new Set(['hey'])),
        new TypeError('cannot assign from Set'),
      )
    })
    it('throws TypeError on non object input', async () => {
      assert.throws(
        () => r.assign({ a: hi })('hi'),
        new TypeError('cannot assign into String'),
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
    it('throws a TypeError if passed a non function', async () => {
      assert.throws(
        () => r.tap('hey'),
        new TypeError('cannot tap with String'),
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
        new TypeError('cannot try String'),
      )
    })
    it('throws a TypeError if passed a non function catcher', async () => {
      assert.throws(
        () => r.tryCatch(() => {}, Buffer.from('abc')),
        new TypeError('cannot catch with Buffer'),
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
        new TypeError('Object is not a function'),
      )
    })
    it('throws a TypeError if input is not an array or object', async () => {
      assert.throws(
        () => r.map(hi)('yo'),
        new TypeError('cannot map from String')
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
        new TypeError('Object is not a function'),
      )
    })
    it('throws a TypeError if input is not an array or object', async () => {
      assert.throws(
        () => r.filter(hi)('yo'),
        new TypeError('cannot filter from String')
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
    it('reduces any iterable with sync reducer', async () => {
      for (const x of iterables) {
        ase(r.reduce((y, xi) => y + xi)(x), 15)
        ase(r.reduce((y, xi) => y + xi, 10)(x), 25)
      }
    })
    it('reduces any iterable with async reducer', async () => {
      aok(asyncMult(1, 2) instanceof Promise)
      for (const x of iterables) {
        aok(r.reduce(asyncMult)(x) instanceof Promise)
        ase(await r.reduce(asyncMult)(x), 120)
        ase(await r.reduce(asyncMult, 10)(x), 1200)
      }
    })
    it('throws a TypeError if passed a non function', async () => {
      assert.throws(
        () => r.reduce({}),
        new TypeError('Object is not a function'),
      )
    })
    it('throws a TypeError if passed a non iterable', async () => {
      assert.throws(
        () => r.reduce((y, xi) => y + xi)(1),
        new TypeError('cannot get iterator from Number'),
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
})
