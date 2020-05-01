const assert = require('assert')
const r = require('.')

const ase = assert.strictEqual

const ade = assert.deepEqual

const aok = assert.ok

const hi = x => x + 'hi'

const ho = x => x + 'ho'

const isOdd = x => (x % 2 === 1)

const asyncIsEven = x => new Promise(resolve => {
  setTimeout(() => resolve(x % 2 === 0), 10)
})

const asyncHey = x => new Promise(resolve => {
  setTimeout(() => resolve(x + 'hey'), 10)
})

const asyncArrayReduce = fn => async x => {
  if (x.length < 2) throw new Error('array must have length >= 2')
  let y = await fn(x[0], x[1])
  let i = 2
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
    it('acts as a transducer: binary function => reducer', async () => {
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
    })
    it('transducer handles async transformations', async () => {
      const addHeyReducer = r.map(asyncHey)((y, xi) => y + xi)
      ase(await asyncArrayReduce(addHeyReducer)([1, 2, 3]), '12hey3hey')
    })
    it('transducer handles async step functions', async () => {
      const addHiReducer = r.map(hi)(
        (y, xi) => new Promise(resolve => resolve(y + xi)),
      )
      ase(await asyncArrayReduce(addHiReducer)([1, 2, 3]), '12hi3hi')
      const addHeyReducer = r.map(asyncHey)(
        (y, xi) => new Promise(resolve => resolve(y + xi)),
      )
      ase(await asyncArrayReduce(addHeyReducer)([1, 2, 3]), '12hey3hey')
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
  })

  describe('diverge', () => {
    it('parallelizes input to Array', async () => {
      ade(
        await r.diverge([hi, ho, asyncHey])('yo'),
        ['yohi', 'yoho', 'yohey'],
      )
    })
    it('parallelizes input to Object', async () => {
      ade(
        await r.diverge({ a: hi, b: ho, c: asyncHey })('yo'),
        ({ a: 'yohi', b: 'yoho', c: 'yohey' }),
      )
    })
    it('throws TypeError for String', async () => {
      assert.throws(
        () => r.diverge('ayelmao'),
        new TypeError('cannot diverge from String'),
      )
    })
    it('throws TypeError for Set', async () => {
      assert.throws(
        () => r.diverge(new Set([hi])),
        new TypeError('cannot diverge from Set'),
      )
    })
    it('throws TypeError for Map', async () => {
      assert.throws(
        () => r.diverge(new Map([['a', hi]])),
        new TypeError('cannot diverge from Map'),
      )
    })
  })
})
