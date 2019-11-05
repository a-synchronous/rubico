const assert = require('assert')
const _ = require('.')

const giveNull = () => null
const giveNullAsync = async () => null
const hi = x => x + 'hi'
const ho = async x => x + 'ho'
const hey = x => new Promise(res => setTimeout(() => res(x + 'hey'), 10))
const add = (a, b) => a + b
const add1 = x => add(1, x)
const delayedAdd1 = x => new Promise(res => setTimeout(() => res(add(1, x)), 10))
const range = (start, end) => {
  const arr = Array(end - start)
  for (let i = start; i < end; i++) arr[i - start] = i
  return arr
}
const traceError = (...args) => err => {
  const name = err && (
    err.name || err.code || err.errCode || (
      err.toString && err.toString()
    )
  )
  console.log(JSON.stringify({
    name,
    message: err && err.message,
    arguments: args,
    stack: new Error().stack,
  }))
  return err
}

describe('rubico', () => {
  describe('_.is', () => {
    it('string -> typeof', async () => {
      assert.strictEqual(_.is('string')('hey'), true)
      assert.strictEqual(_.is('string')(null), false)
      assert.strictEqual(_.is('number')(1), true)
      assert.strictEqual(_.is('number')(NaN), true)
      assert.strictEqual(_.is('number')({}), false)
      assert.strictEqual(_.is('object')({}), true)
    })

    it('function -> instanceof', async () => {
      assert.strictEqual(_.is(Array)([]), true)
      assert.strictEqual(_.is(Array)({}), false)
      assert.strictEqual(_.is(Set)(new Set()), true)
      assert.strictEqual(_.is(Set)({}), false)
      assert.strictEqual(_.is(WeakSet)(new WeakSet()), true)
      assert.strictEqual(_.is(WeakSet)({}), false)
      assert.strictEqual(_.is(Map)(new Map()), true)
      assert.strictEqual(_.is(Map)({}), false)
      assert.strictEqual(_.is(NaN)(NaN), true)
      assert.strictEqual(_.is(NaN)(1), false)
      assert.strictEqual(_.is(NaN)(), false)
    })
  })

  describe('_.get', () => {
    const x = { a: { b: { c: 1 } } }
    const y = [1, 2, [3, [4]]]
    it('safely gets a property', async () => {
      assert.strictEqual(_.get('a')({ a: 1 }), 1)
      assert.strictEqual(_.get('b')({ a: 1 }), undefined)
      assert.strictEqual(_.get('b')({}), undefined)
      assert.strictEqual(_.get('b')(), undefined)
      assert.strictEqual(_.get('a', 'b', 'c')(x), 1)
      assert.strictEqual(_.get('a', 'b', 'd')(x), undefined)
      assert.strictEqual(_.get('a', 'b', 'd')({}), undefined)
      assert.strictEqual(_.get('a', 'b', 'd')(), undefined)
      assert.strictEqual(_.get(0)(y), 1)
      assert.deepEqual(_.get(2)(y), [3, [4]])
      assert.strictEqual(_.get(2, 0)(y), 3)
      assert.strictEqual(_.get(2, 1, 0)(y), 4)
      assert.strictEqual(_.get(3)(y), undefined)
      assert.strictEqual(_.get('a')('hey'), undefined)
      assert.strictEqual(_.get('a')(1), undefined)
    })
  })

  describe('_.parseJSON', () => {
    it('safely parses JSON', async () => {
      assert.deepEqual(_.parseJSON('{"a":1}'), { a: 1 })
      assert.deepEqual(_.parseJSON('{}'), {})
      assert.strictEqual(_.parseJSON('{hey}'), undefined)
      assert.strictEqual(_.parseJSON(''), undefined)
      assert.strictEqual(_.parseJSON(), undefined)
    })
  })

  describe('_.stringifyJSON', () => {
    const circular = {}
    circular.circular = circular
    it('safely stringifies JSON', async () => {
      assert.strictEqual(_.stringifyJSON({ a: 1 }), '{"a":1}')
      assert.strictEqual(_.stringifyJSON({}), '{}')
      assert.strictEqual(_.stringifyJSON(circular), undefined)
      assert.strictEqual(_.stringifyJSON('hey'), undefined)
      assert.strictEqual(_.stringifyJSON(), undefined)
      console.log(_.prettifyJSON(2)({ a: 1 }))
    })
  })

  describe('_.split', () => {
    it('splits a string into an array from given delimiter', async () => {
      assert.deepEqual(_.split('.')('a.b.c'), ['a', 'b', 'c'])
      assert.deepEqual(_.split(1)('a1b'), ['a', 'b'])
      assert.deepEqual(_.split('.')(1), undefined)
      assert.deepEqual(_.split()('a.b.c'), ['a.b.c'])
      assert.deepEqual(_.split('.')(), undefined)
      assert.deepEqual(_.split('.')(1), undefined)
      assert.deepEqual(_.split()(), undefined)
    })
  })

  describe('_.toLowerCase', () => {
    it('lowercases', async () => {
      assert.strictEqual(_.toLowerCase('AAA'), 'aaa')
      assert.strictEqual(_.toLowerCase('Aaa'), 'aaa')
      assert.strictEqual(_.toLowerCase('Aaa '), 'aaa ')
      assert.strictEqual(_.toLowerCase(null), undefined)
      assert.strictEqual(_.toLowerCase(), undefined)
    })
  })

  describe('_.toUpperCase', () => {
    it('uppercases', async () => {
      assert.strictEqual(_.toUpperCase('aaa'), 'AAA')
      assert.strictEqual(_.toUpperCase('Aaa'), 'AAA')
      assert.strictEqual(_.toUpperCase('Aaa '), 'AAA ')
      assert.strictEqual(_.toUpperCase(null), undefined)
      assert.strictEqual(_.toUpperCase(), undefined)
    })
  })

  describe('_.capitalize', () => {
    it('capitalizes', async () => {
      assert.strictEqual(_.capitalize('george'), 'George')
      assert.strictEqual(_.capitalize('george benson'), 'George benson')
      assert.strictEqual(_.capitalize(null), undefined)
      assert.strictEqual(_.capitalize(), undefined)
    })
  })

  describe('_.map', () => {
    it('async a -> b', async () => {
      assert.deepEqual(
        await _.map(delayedAdd1)([1, 2, 3]),
        [2, 3, 4],
      )
      assert.deepEqual(
        await _.map(delayedAdd1)(new Set([1,2,3])),
        new Set([2, 3, 4]),
      )
      assert.deepEqual(
        await _.map(delayedAdd1)(new Map([['a', 1], ['b', 2], ['c', 3]])),
        new Map([['a', 2], ['b', 3], ['c', 4]]),
      )
      assert.deepEqual(
        await _.map(delayedAdd1)({ a: 1, b: 2, c: 3 }),
        { a: 2, b: 3, c: 4 },
      )
    }).timeout(5000)
  })

  describe('_.syncMap', () => {
    it('a -> b', async () => {
      assert.deepEqual(
        _.syncMap(add1)([1, 2, 3]),
        [2, 3, 4],
      )
      assert.deepEqual(
        _.syncMap(add1)(new Set([1,2,3])),
        new Set([2, 3, 4]),
      )
      assert.deepEqual(
        _.syncMap(add1)(new Map([['a', 1], ['b', 2], ['c', 3]])),
        new Map([['a', 2], ['b', 3], ['c', 4]]),
      )
      assert.deepEqual(
        _.syncMap(add1)({ a: 1, b: 2, c: 3 }),
        { a: 2, b: 3, c: 4 },
      )
    }).timeout(5000)
  })

  describe('_.reduce', () => {
    it('can add 1 2 3', async () => {
      assert.strictEqual(await _.reduce(add)()([1, 2, 3]), 6)
    })

    it('can add 1 2 3 starting with 10', async () => {
      assert.strictEqual(await _.reduce(add)(10)([1, 2, 3]), 6 + 10)
    })

    it('=> first element for array length 1', async () => {
      assert.strictEqual(await _.reduce(add)()([1]), 1)
    })

    it('=> memo for []', async () => {
      assert.strictEqual(await _.reduce(add)('yoyoyo')([]), 'yoyoyo')
    })

    it('=> undefined for []', async () => {
      assert.strictEqual(await _.reduce(add)()([]), undefined)
    })

    it('many calls', async () => {
      assert.strictEqual(await _.reduce(add)()(range(0, 10000)), 49995000)
    })
  })

  describe('_.syncReduce', () => {
    it('can add 1 2 3', async () => {
      assert.strictEqual(_.syncReduce(add)()([1, 2, 3]), 6)
    })

    it('can add 1 2 3 starting with 10', async () => {
      assert.strictEqual(_.syncReduce(add)(10)([1, 2, 3]), 6 + 10)
    })
  })

  describe('_.flow', () => {
    it('chains async and regular functions together', async () => {
      assert.strictEqual(await _.flow(hi, ho, hey)('yo'), 'yohihohey')
    })

    it('does something without arguments', async () => {
      assert.strictEqual(await _.flow(hi, ho, hey)(), 'undefinedhihohey')
    })

    it('chaining one fn is the same as just calling that fn', async () => {
      assert.strictEqual(await _.flow(hey)('yo'), await hey('yo'))
    })

    it('chaining no fns is identity', async () => {
      assert.strictEqual(await _.flow()('yo'), 'yo')
    })
  })

  describe('_.syncFlow', () => {
    it('chains regular functions only', async () => {
      assert.strictEqual(_.syncFlow(hi, hi, hi)('hi'), 'hihihihi')
    })
  })

  describe('_.amp', () => {
    it('executes fns in series like fn && fn ...', async () => {
      assert.strictEqual(await _.amp(hi, ho, hey)('yo'), 'yohihohey')
    })

    it('breaks execution on falsy return', async () => {
      assert.strictEqual(await _.amp(hi, ho, () => null, hey)('yo'), null)
    })

    it('multiple arguments => [...args]', async () => {
      assert.deepEqual(await _.amp((...x) => x)('yo', 'hey'), ['yo', 'hey'])
    })

    it('no fns => x', async () => {
      assert.strictEqual(await _.amp()('yo'), 'yo')
    })
  })

  describe('_.alt', () => {
    it('alternates flow paths based on first not null execution', async () => {
      assert.strictEqual(
        await _.alt(giveNullAsync, giveNull, hey, ho, giveNullAsync)('yo'),
        'yohey',
      )
    })

    it('alternating one fn is the same as calling that fn', async () => {
      assert.strictEqual(await _.alt(hey)('yo'), await hey('yo'))
    })

    it('alternating no fns => x', async () => {
      assert.strictEqual(await _.alt()('yo'), 'yo')
    })
  })

  describe('_.parallel', () => {
    it('runs fns in parallel', async () => {
      assert.deepEqual(
        await _.parallel(hi, ho, hey)('yo'),
        ['yohi', 'yoho', 'yohey'],
      )
    })

    it('no fns => []', async () => {
      assert.deepEqual(await _.parallel()('yo'), [])
    })
  })

  describe('_.sideEffect', () => {
    it('executes a function but returns arguments', async () => {
      assert.strictEqual(await _.sideEffect(console.log)('hey'), 'hey')
    })

    it('multiple arguments => [...args]', async () => {
      assert.deepEqual(
        await _.sideEffect(console.log)('yo', 'yo'),
        ['yo', 'yo'],
      )
    })

    it('handles errors with second fn', async () => {
      assert.strictEqual(
        await _.sideEffect(() => { throw new Error() }, x => e => console.log(x, e))('hey'),
        'hey',
      )
    })
  })

  describe('_.trace', () => {
    it('console logs a tag and args', async () => {
      assert.strictEqual(await _.trace('hey')('hey'), 'hey')
    })
  })

  describe('_.benchmark', () => {
    it('times the execution of the given function', async () => {
      assert.strictEqual(
        await _.benchmark(hey)('benchmark for hey')('hey'),
        'heyhey',
      )
    })
  })
})

