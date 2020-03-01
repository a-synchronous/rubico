const assert = require('assert')
const _ = require('.')

const ase = assert.strictEqual

const ade = assert.deepEqual

const writeStdout = process.stdout.write.bind(process.stdout)

const captureStdout = () => {
  const ret = { output: '' }
  process.stdout.write = (chunk, encoding, cb) => {
    if (typeof chunk === 'string') ret.output += chunk
    return writeStdout(chunk, encoding, cb)
  }
  return ret
}

const releaseStdout = () => {
  process.stdout.write = writeStdout
}

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

describe('rubico', () => {
  describe('_.id', () => {
    it('x => x', async () => {
      ase(_.id(1), 1)
      ase(_.id(1, 2, 3), 1)
    })
  })

  describe('_.noop', () => {
    it('does nothing', async () => {
      ase(_.noop(Infinity), undefined)
    })
  })

  describe('_.spread', () => {
    it('spreads args into fn', async () => {
      ase(
        _.spread((a, b) => a + b)([1, 2]),
        3,
      )
    })
  })

  describe('_.throw', () => {
    it('throws e', async () => {
      assert.throws(
        () => _.throw(new TypeError('hey')),
        new TypeError('hey'),
      )
    })
  })

  describe('_.apply', () => {
    it('applies an array of arguments to fn', async () => {
      const fn = a => b => c => a + b + c
      ase(
        await _.apply(fn)([1, 2, 3]),
        6,
      )
    })
  })

  describe('_.apply', () => {
    it('applies an array of arguments to fn', async () => {
      const fn = a => b => c => a + b + c
      ase(
        _.apply.sync(fn)([1, 2, 3]),
        6,
      )
    })
  })

  describe('_.exists', () => {
    it('=> true if x is not undefined or not null', async () => {
      ase(_.exists(undefined), false)
      ase(_.exists(null), false)
      ase(_.exists(0), true)
      ase(_.exists(''), true)
      ase(_.exists({}), true)
      ase(_.exists([]), true)
    })
  })

  describe('_.dne', () => {
    it('=> true if x is undefined or null', async () => {
      ase(_.dne(undefined), true)
      ase(_.dne(null), true)
      ase(_.dne(0), false)
      ase(_.dne(''), false)
      ase(_.dne({}), false)
      ase(_.dne([]), false)
    })
  })

  describe('_.isFn', () => {
    it('=> true if point is a fn', async () => {
      ase(_.isFn(() => {}), true)
      ase(_.isFn(function () {}), true)
      ase(_.isFn(async x => x.ho + 1), true)
      ase(_.isFn(0), false)
      ase(_.isFn([]), false)
      ase(_.isFn({}), false)
      ase(_.isFn(undefined), false)
      ase(_.isFn(null), false)
    })
  })

  describe('_.isString', () => {
    it('=> true if point is a string', async () => {
      ase(_.isString('hey'), true)
      ase(_.isString(''), true)
      ase(_.isString(() => {}), false)
      ase(_.isString(0), false)
      ase(_.isString([]), false)
      ase(_.isString({}), false)
      ase(_.isString(null), false)
      ase(_.isString(undefined), false)
    })
  })

  describe('_.isNumber', () => {
    it('=> true if point is a number', async () => {
      ase(_.isNumber(1), true)
      ase(_.isNumber(0), true)
      ase(_.isNumber(1.1), true)
      ase(_.isNumber('hey'), false)
      ase(_.isNumber(''), false)
      ase(_.isNumber([]), false)
      ase(_.isNumber({}), false)
      ase(_.isNumber(null), false)
      ase(_.isNumber(undefined), false)
    })
  })

  describe('_.isBoolean', () => {
    it('=> true if point is a bool', async () => {
      ase(_.isBoolean(true), true)
      ase(_.isBoolean(false), true)
      ase(_.isBoolean(0), false)
      ase(_.isBoolean([]), false)
      ase(_.isBoolean({}), false)
      ase(_.isBoolean(null), false)
      ase(_.isBoolean(), false)
      ase(_.isBoolean(undefined), false)
    })
  })

  describe('_.isArray', () => {
    it('=> true if point is an array', async () => {
      ase(_.isArray([1, 2, 3]), true)
      ase(_.isArray([]), true)
      ase(_.isArray({}), false)
      ase(_.isArray(1), false)
      ase(_.isArray('hey'), false)
      ase(_.isArray(() => {}), false)
      ase(_.isArray(null), false)
      ase(_.isArray(undefined), false)
    })
  })

  describe('_.isObject', () => {
    it('=> true if point is an object', async () => {
      ase(_.isObject({ a: 1 }), true)
      ase(_.isObject({}), true)
      ase(_.isObject([]), false)
      ase(_.isObject(new Set()), false)
      ase(_.isObject(new Map()), false)
      ase(_.isObject(Buffer.from('hey')), false)
      ase(_.isObject(() => {}), false)
      ase(_.isObject(function () {}), false)
      ase(_.isObject('hey'), false)
      ase(_.isObject(null), false)
      ase(_.isObject(undefined), false)
    })
  })

  describe('_.isSet', () => {
    it('=> true if point is a set', async () => {
      ase(_.isSet(new Set([1, 2, 3])), true)
      ase(_.isSet(new Set([])), true)
      ase(_.isSet([]), false)
      ase(_.isSet({}), false)
      ase(_.isSet(new Map([['a', 1]])), false)
      ase(_.isSet(null), false)
      ase(_.isSet(undefined), false)
    })
  })

  describe('_.isMap', () => {
    it('=> true if point is a map', async () => {
      ase(_.isMap(new Map([['a', 1]])), true)
      ase(_.isMap(new Map([])), true)
      ase(_.isMap(new Set([])), false)
      ase(_.isMap({}), false)
      ase(_.isMap(null), false)
      ase(_.isMap(undefined), false)
    })
  })

  describe('_.isBuffer', () => {
    it('=> true if point is a buffer', async () => {
      ase(_.isBuffer(Buffer.from('abc')), true)
      ase(_.isBuffer(Buffer.from('')), true)
      ase(_.isBuffer(''), false)
      ase(_.isBuffer([]), false)
      ase(_.isBuffer({}), false)
      ase(_.isBuffer(null), false)
      ase(_.isBuffer(undefined), false)
    })
  })

  describe('_.isSymbol', () => {
    it('=> true if point is a symbol', async () => {
      ase(_.isSymbol(Symbol()), true)
      ase(_.isSymbol(([])[Symbol.iterator]), false)
      ase(_.isSymbol('hey'), false)
      ase(_.isSymbol(''), false)
      ase(_.isSymbol(null), false)
      ase(_.isSymbol(undefined), false)
    })
  })

  describe('_.isPromise', () => {
    it('=> true if point is a promise', async () => {
      ase(_.isPromise(new Promise(res => res('hey'))), true)
      ase(_.isPromise((async x => x)()), true)
      ase(_.isPromise(1), false)
      ase(_.isPromise(''), false)
      ase(_.isPromise([]), false)
      ase(_.isPromise({}), false)
      ase(_.isPromise(null), false)
      ase(_.isPromise(undefined), false)
    })
  })

  describe('_.isRegExp', () => {
    it('=> true if point is a regular expression', async () => {
      ase(_.isRegExp(/hey/), true)
      ase(_.isRegExp('hey'), false)
      ase(_.isRegExp(null), false)
      ase(_.isRegExp(undefined), false)
      ase(_.isRegExp(), false)
    })
  })

  describe('_.new', () => {
    it('=> new default type', async () => {
      ase(_.new('hey'), '')
      ase(_.new(Infinity), 0)
      ade(_.new([1, 2, 3]), [])
      ade(_.new(new Set([1, 2, 3])), new Set())
      ade(_.new(new Map([[1, 1], [2, 2]])), new Map())
      ade(_.new({ a: 1, b: 2 }), {})
      ade(_.new(Buffer.from('hey')), Buffer.from(''))
    })
  })

  describe('_.toFn', () => {
    it('coerces point to fn', async () => {
      ase(_.toFn(() => {})(), undefined)
      ase(await _.toFn(async () => 0)(), 0)
      ase(_.toFn(1)(), 1)
      ase(_.toFn(() => 0)(), 0)
      ase(_.toFn(() => '')(), '')
      ase(_.toFn(() => null)(), null)
      ase(_.toFn(() => undefined)(), undefined)
    })
  })

  describe('_.toString', () => {
    it('coerces point to string', async () => {
      ase(_.toString(x => x), 'x => x')
      ase(_.toString('hey'), 'hey')
      ase(_.toString(null), 'null')
      ase(_.toString(undefined), 'undefined')
      ase(_.toString({}), '[object Object]')
      ase(_.toString([]), '')
      ase(_.toString(1), '1')
    })
  })

  describe('_.toInt', () => {
    it('coerces point to number', async () => {
      ase(_.toInt(1), 1)
      ase(_.toInt('1'), 1)
      ase(_.toInt('1.1'), 1)
      ase(_.toInt(Infinity), Infinity)
      ase(_.toInt(), NaN)
      ase(_.toInt(null), NaN)
      ase(_.toInt([]), NaN)
      ase(_.toInt({}), NaN)
    })
  })

  describe('_.toFloat', () => {
    it('coerces point to number', async () => {
      ase(_.toFloat(1), 1)
      ase(_.toFloat(1.1), 1.1)
      ase(_.toFloat('1'), 1)
      ase(_.toFloat('1.1'), 1.1)
      ase(_.toFloat(Infinity), Infinity)
      ase(_.toFloat(), NaN)
      ase(_.toFloat(null), NaN)
      ase(_.toFloat([]), NaN)
      ase(_.toFloat({}), NaN)
    })
  })

  describe('_.toArray', () => {
    it('coerces point to array', async () => {
      ade(_.toArray(1), [1])
      ade(_.toArray('hey'), ['hey'])
      ade(_.toArray(''), [''])
      ade(_.toArray(), [])
      ade(_.toArray({}), [])
      ade(_.toArray(new Set()), [])
      ade(_.toArray(new Map()), [])
      ade(_.toArray(new Map([])), [])
      ade(_.toArray(null), [])
      ade(_.toArray(undefined), [])
    })
  })

  describe('_.toSet', () => {
    it('coerces point to set', async () => {
      ade(_.toSet([1, 2, 3]), new Set([1, 2, 3]))
      ade(_.toSet([]), new Set())
      ade(_.toSet(), new Set())
      ade(_.toSet(1), new Set([1]))
      ade(_.toSet('hey'), new Set(['hey']))
      ade(_.toSet(null), new Set([]))
      ade(_.toSet(undefined), new Set([]))
    })
  })

  describe('_.toRegExp', () => {
    it('coerces point to a regular expression', async () => {
      ade(_.toRegExp('hey'), /hey/)
      ade(_.toRegExp('(hey+ho)'), /\(hey\+ho\)/)
      ade(_.toRegExp('hey', 'gi'), /hey/gi)
      ade(_.toRegExp(/hey/), /hey/)
      ade(_.toRegExp(/hey/, 'gi'), /hey/gi)
      ade(_.toRegExp(/hey/g, 'gi'), /hey/gi)
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.toRegExp(),
        new TypeError('cannot coerce to RegExp undefined')
      )
    })
  })

  describe('_.flow', () => {
    it('chains async and regular functions together', async () => {
      ase(await _.flow(hi, ho, hey)('yo'), 'yohihohey')
    })

    it('does something without arguments', async () => {
      ase(await _.flow(hi, ho, hey)(), 'undefinedhihohey')
    })

    it('chaining one fn is the same as just calling that fn', async () => {
      ase(await _.flow(hey)('yo'), await hey('yo'))
    })

    it('chaining no fns is identity', async () => {
      ase(await _.flow()('yo'), 'yo')
    })

    it('throw a meaningful error on non functions', async () => {
      assert.throws(
        () => {
          _.flow(() => 1, undefined, () => 2)
        },
        new TypeError('not all fns are fns'),
      )
    })
  })

  describe('_.flow.sync', () => {
    it('chains regular functions only', async () => {
      ase(_.flow.sync(hi, hi, hi)('hi'), 'hihihihi')
    })

    it('throw a meaningful error on non functions', async () => {
      assert.throws(
        () => {
          _.flow.sync(() => 1, undefined, () => 2)
        },
        new TypeError('not all fns are fns'),
      )
    })
  })

  describe('_.series', () => {
    it('supplies arguments to fns in series => [computed results]', async () => {
      ade(
        await _.series(hi, ho, hey)('yo'),
        ['yohi', 'yoho', 'yohey'],
      )
    })

    it('throw a meaningful error on non functions', async () => {
      assert.throws(
        () => _.series(() => 1, undefined, () => 2),
        new TypeError('not all fns are fns'),
      )
    })
  })

  describe('_.series.sync', () => {
    it('supplies arguments to sync fns in series => [computed results]', async () => {
      ade(
        await _.series(hi, ho, hey)('yo'),
        ['yohi', 'yoho', 'yohey'],
      )
    })

    it('throw a meaningful error on non functions', async () => {
      assert.throws(
        () => {
          _.series.sync(() => 1, undefined, () => 2)
        },
        new TypeError('not all fns are fns')
      )
    })
  })

  describe('_.switch, _.switch.sync', () => {
    it('switch case using fn order', async () => {
      ase(
        await _.switch(x => x === 1, 'hey', x => x === 2, 'ho', 'yo')(1),
        'hey',
      )
      ase(
        await _.switch(x => x === 1, 'hey', x => x === 2, 'ho', 'yo')(2),
        'ho',
      )
      ase(
        await _.switch(x => x === 1, 'hey', x => x === 2, 'ho', 'yo')(100),
        'yo',
      )
      ase(
        await _.switch(x => x === 1, 'hey', x => x === 2, 'ho')(100),
        undefined,
      )
      ase(
        _.switch.sync(x => x === 1, 'hey', x => x === 2, 'ho', 'yo')(1),
        'hey',
      )
      ase(
        _.switch.sync(x => x === 1, 'hey', x => x === 2, 'ho', 'yo')(2),
        'ho',
      )
      ase(
        _.switch.sync(x => x === 1, 'hey', x => x === 2, 'ho', 'yo')(100),
        'yo',
      )
      ase(
        _.switch.sync(x => x === 1, 'hey', x => x === 2, 'ho')(100),
        undefined,
      )
    })
  })

  describe('_.effect', () => {
    it('executes fn and returns first argument', async () => {
      ase(await _.effect(x => x + 1)(1), 1)
      assert.rejects(
        async () => await _.effect(() => { throw new Error('hey') })(1),
        new Error('hey'),
      )
    })
  })

  describe('_.effect.sync', () => {
    it('executes fn and returns first argument', async () => {
      ase(_.effect.sync(x => x + 1)(1), 1)
      assert.rejects(
        async () => await _.effect(() => { throw new Error('hey') })(1),
        new Error('hey'),
      )
    })
  })

  describe('_.tryCatch, _.stryCatch', () => {
    it('tries a fn and catches with the other fn', async () => {
      ase(await _.tryCatch(
        x => x + 1,
        () => 10,
      )(1), 2)
      ase(await _.tryCatch(
        () => { throw new Error() },
        () => 10,
      )(1), 10)
      ase(_.stryCatch(
        x => x + 1,
        () => 10,
      )(1), 2)
      ase(_.stryCatch(
        () => { throw new Error() },
        () => 10,
      )(1), 10)
    })
  })

  describe('_.diverge', () => {
    it('diverges flow to provided container', async () => {
      ade(
        await _.diverge([hi, ho, hey])('yo'),
        ['yohi', 'yoho', 'yohey'],
      )
      ade(
        await _.diverge(new Set([hi, ho, hey]))('yo'),
        new Set(['yohi', 'yoho', 'yohey']),
      )
      ade(
        await _.diverge(new Map([['a', hi], ['b', ho], ['c', hey]]))('yo'),
        new Map([['a', 'yohi'], ['b', 'yoho'], ['c', 'yohey']])
      )
      ade(
        await _.diverge({ a: hi, b: ho, c: hey })('yo'),
        ({ a: 'yohi', b: 'yoho', c: 'yohey' }),
      )
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.diverge('ayelmao'),
        new TypeError('cannot diverge ayelmao'),
      )
    })
  })

  describe('_.diverge.sync', () => {
    it('diverges flow to provided container', async () => {
      ade(
        _.diverge.sync([hi, hi, hi])('yo'),
        ['yohi', 'yohi', 'yohi'],
      )
      ade(
        _.diverge.sync(new Set([hi, hi, hi]))('yo'),
        new Set(['yohi', 'yohi', 'yohi']),
      )
      ade(
        _.diverge.sync(new Map([['a', hi], ['b', hi], ['c', hi]]))('yo'),
        new Map([['a', 'yohi'], ['b', 'yohi'], ['c', 'yohi']])
      )
      ade(
        _.diverge.sync({ a: hi, b: hi, c: hi })('yo'),
        ({ a: 'yohi', b: 'yohi', c: 'yohi' }),
      )
    })

    it('throws a TypeError', async () => {
      assert.throws(
        () => _.diverge.sync('ayelmao'),
        new TypeError('cannot diverge ayelmao'),
      )
    })
  })

  describe('_.map', () => {
    it('async a -> b', async () => {
      ade(
        await _.map(delayedAdd1)([1, 2, 3]),
        [2, 3, 4],
      )
      ade(
        await _.map(delayedAdd1)(new Set([1,2,3])),
        new Set([2, 3, 4]),
      )
      ade(
        await _.map(delayedAdd1)(
          new Map([['a', 1], ['b', 2], ['c', 3]])
        ),
        new Map([['a', 2], ['b', 3], ['c', 4]]),
      )
      ade(
        await _.map(delayedAdd1)(
          { a: 1, b: 2, c: 3 }
        ),
        { a: 2, b: 3, c: 4 },
      )
    }).timeout(5000)

    it('calls fn with an implicit index', async () => {
      ade(
        await _.map((x, i) => ({ x, i }))([1, 2, 3]),
        [{ x: 1, i: 0 }, { x: 2, i: 1 }, { x: 3, i: 2 }],
      )
    })

    it('throws TypeError', async () => {
      assert.rejects(
        () => _.map(x => x)(1),
        new TypeError('cannot map 1'),
      )
      assert.rejects(
        () => _.map(x => x)(undefined),
        new TypeError('cannot map undefined'),
      )
      assert.rejects(
        () => _.map(x => x)(null),
        new TypeError('cannot map null'),
      )
    })
  })

  describe('_.map.sync', () => {
    it('a -> b', async () => {
      ade(
        _.map.sync(add1)([1, 2, 3]),
        [2, 3, 4],
      )
      ade(
        _.map.sync(add1)(new Set([1,2,3])),
        new Set([2, 3, 4]),
      )
      ade(
        _.map.sync(add1)(
          new Map([['a', 1], ['b', 2], ['c', 3]])
        ),
        new Map([['a', 2], ['b', 3], ['c', 4]]),
      )
      ade(
        _.map.sync(add1)(
          { a: 1, b: 2, c: 3 }
        ),
        { a: 2, b: 3, c: 4 },
      )
    }).timeout(5000)

    it('calls fn with an implicit index', async () => {
      ade(
        _.map.sync((x, i) => ({ x, i }))([1, 2, 3]),
        [{ x: 1, i: 0 }, { x: 2, i: 1 }, { x: 3, i: 2 }],
      )
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.map.sync(x => x)(1),
        new TypeError('cannot map 1'),
      )
      assert.throws(
        () => _.map.sync(x => x)(undefined),
        new TypeError('cannot map undefined'),
      )
      assert.throws(
        () => _.map.sync(x => x)(null),
        new TypeError('cannot map null'),
      )
    })
  })

  describe('_.serialMap', () => {
    it('async a -> b in sequence', async () => {
      ade(
        await _.serialMap(delayedAdd1)([1, 2, 3]),
        [2, 3, 4],
      )
      ade(
        await _.serialMap(delayedAdd1)(new Set([1,2,3])),
        new Set([2, 3, 4]),
      )
      ade(
        await _.serialMap(delayedAdd1)(
          new Map([['a', 1], ['b', 2], ['c', 3]])
        ),
        new Map([['a', 2], ['b', 3], ['c', 4]]),
      )
      ade(
        await _.serialMap(delayedAdd1)(
          { a: 1, b: 2, c: 3 }
        ),
        { a: 2, b: 3, c: 4 },
      )
    }).timeout(5000)

    it('throws TypeError', async () => {
      assert.rejects(
        () => _.serialMap(x => x)(1),
        new TypeError('cannot serialMap 1'),
      )
      assert.rejects(
        () => _.serialMap(x => x)(undefined),
        new TypeError('cannot serialMap undefined'),
      )
      assert.rejects(
        () => _.serialMap(x => x)(null),
        new TypeError('cannot serialMap null'),
      )
    })
  })

  describe('_.entryMap', () => {
    it('async a -> b entries', async () => {
      ade(
        await _.entryMap(delayedAdd1)([1, 2, 3]),
        [2, 3, 4],
      )
      ade(
        await _.entryMap(delayedAdd1)(new Set([1,2,3])),
        new Set([2, 3, 4]),
      )
      ade(
        await _.entryMap(async ([k, v]) => [k, await delayedAdd1(v)])(
          new Map([['a', 1], ['b', 2], ['c', 3]])
        ),
        new Map([['a', 2], ['b', 3], ['c', 4]]),
      )
      ade(
        await _.entryMap(async ([k, v]) => [k, await delayedAdd1(v)])(
          { a: 1, b: 2, c: 3 }
        ),
        { a: 2, b: 3, c: 4 },
      )
    }).timeout(5000)

    it('throws TypeError', async () => {
      assert.rejects(
        () => _.entryMap(x => x)(1),
        new TypeError('cannot entryMap 1'),
      )
      assert.rejects(
        () => _.entryMap(x => x)(undefined),
        new TypeError('cannot entryMap undefined'),
      )
      assert.rejects(
        () => _.entryMap(x => x)(null),
        new TypeError('cannot entryMap null'),
      )
    })
  })

  describe('_.entryMap.sync', () => {
    it('a -> b entries', async () => {
      ade(
        _.entryMap.sync(add1)([1, 2, 3]),
        [2, 3, 4],
      )
      ade(
        _.entryMap.sync(add1)(new Set([1,2,3])),
        new Set([2, 3, 4]),
      )
      ade(
        _.entryMap.sync(([k, v]) => [k, add1(v)])(
          new Map([['a', 1], ['b', 2], ['c', 3]])
        ),
        new Map([['a', 2], ['b', 3], ['c', 4]]),
      )
      ade(
        _.entryMap.sync(([k, v]) => [`${k}${k}`, add1(v)])(
          { a: 1, b: 2, c: 3 }
        ),
        { aa: 2, bb: 3, cc: 4 },
      )
    }).timeout(5000)

    it('throws TypeError', async () => {
      assert.throws(
        () => _.entryMap.sync(x => x)(1),
        new TypeError('cannot entryMap 1'),
      )
      assert.throws(
        () => _.entryMap.sync(x => x)(undefined),
        new TypeError('cannot entryMap undefined'),
      )
      assert.throws(
        () => _.entryMap.sync(x => x)(null),
        new TypeError('cannot entryMap null'),
      )
    })
  })

  describe('_.filter', () => {
    it('filters x by fn', async () => {
      ade(
        await _.filter(x => x === 1)([1,2,3]),
        [1],
      )
      ade(
        await _.filter(x => x === 1)(new Set([1,2,3])),
        new Set([1]),
      )
      ade(
        await _.filter(x => x === 1)(new Map([['a', 1],['b', 2]])),
        new Map([['a', 1]]),
      )
      ade(
        await _.filter(x => x === 1)({ a: 1, b: 2 }),
        ({ a: 1 }),
      )
    })

    it('throws TypeError', async () => {
      assert.rejects(
        () => _.filter(x => x)(1),
        new TypeError('cannot filter 1'),
      )
      assert.rejects(
        () => _.filter(x => x)(undefined),
        new TypeError('cannot filter undefined'),
      )
      assert.rejects(
        () => _.filter(x => x)(null),
        new TypeError('cannot filter null'),
      )
    })
  })

  describe('_.filter.sync', () => {
    it('filters x by fn', async () => {
      ade(
        _.filter.sync(x => x === 1)([1,2,3]),
        [1],
      )
      ade(
        _.filter.sync(x => x === 1)(new Set([1,2,3])),
        new Set([1]),
      )
      ade(
        _.filter.sync(x => x === 1)(new Map([['a', 1],['b', 2]])),
        new Map([['a', 1]]),
      )
      ade(
        _.filter.sync(x => x === 1)({ a: 1, b: 2 }),
        ({ a: 1 }),
      )
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.filter.sync(x => x)(1),
        new TypeError('cannot filter 1'),
      )
      assert.throws(
        () => _.filter.sync(x => x)(undefined),
        new TypeError('cannot filter undefined'),
      )
      assert.throws(
        () => _.filter.sync(x => x)(null),
        new TypeError('cannot filter null'),
      )
    })
  })

  describe('_.reduce', () => {
    it('can add 1 2 3', async () => {
      ase(await _.reduce(add)([1, 2, 3]), 6)
      ase(await _.reduce(add)(new Set([1, 2, 3])), 6)
      ase(await _.reduce(add)(new Map([[1, 1], [2, 2], [3, 3]])), 6)
      ase(await _.reduce(add)({ a: 1, b: 2, c: 3 }), 6)
    })

    it('can add 1 2 3 starting with 10', async () => {
      ase(await _.reduce(add, 10)([1, 2, 3]), 6 + 10)
      ase(await _.reduce(add, 10)(new Set([1, 2, 3])), 6 + 10)
      ase(await _.reduce(add, 10)(new Map([[1, 1], [2, 2], [3, 3]])), 6 + 10)
      ase(await _.reduce(add, 10)({ a: 1, b: 2, c: 3 }), 6 + 10)
    })

    it('=> first element for array length 1', async () => {
      ase(await _.reduce(add)([1]), 1)
      ase(await _.reduce(add)(new Set([1])), 1)
      ase(await _.reduce(add)(new Map([[1, 1]])), 1)
      ase(await _.reduce(add)({ a: 1 }), 1)
    })

    it('=> memo for []', async () => {
      ase(await _.reduce(add, 'yoyoyo')([]), 'yoyoyo')
      ase(await _.reduce(add, 'yoyoyo')(new Set([])), 'yoyoyo')
      ase(await _.reduce(add, 'yoyoyo')(new Map([])), 'yoyoyo')
      ase(await _.reduce(add, 'yoyoyo')({}), 'yoyoyo')
    })

    it('=> undefined for []', async () => {
      ase(await _.reduce(add)([]), undefined)
      ase(await _.reduce(add)(new Set([])), undefined)
      ase(await _.reduce(add)(new Map([])), undefined)
      ase(await _.reduce(add)({}), undefined)
    })

    it('many calls', async () => {
      ase(await _.reduce(add)(range(0, 10000)), 49995000)
    })

    it('throws TypeError', async () => {
      assert.rejects(
        () => _.reduce(x => x)(1),
        new TypeError('cannot reduce 1'),
      )
      assert.rejects(
        () => _.reduce(x => x)(undefined),
        new TypeError('cannot reduce undefined'),
      )
      assert.rejects(
        () => _.reduce(x => x)(null),
        new TypeError('cannot reduce null'),
      )
    })
  })

  describe('_.reduce.sync', () => {
    it('can add 1 2 3', async () => {
      ase(_.reduce.sync(add)([1, 2, 3]), 6)
      ase(_.reduce.sync(add)(new Set([1, 2, 3])), 6)
      ase(_.reduce.sync(add)(new Map([[1, 1], [2, 2], [3, 3]])), 6)
      ase(_.reduce.sync(add)({ a: 1, b: 2, c: 3 }), 6)
    })

    it('can add 1 2 3 starting with 10', async () => {
      ase(_.reduce.sync(add, 10)([1, 2, 3]), 6 + 10)
      ase(_.reduce.sync(add, 10)(new Set([1, 2, 3])), 6 + 10)
      ase(_.reduce.sync(add, 10)(new Map([[1, 1], [2, 2], [3, 3]])), 6 + 10)
      ase(_.reduce.sync(add, 10)({ a: 1, b: 2, c: 3 }), 6 + 10)
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.reduce.sync(x => x)(1),
        new TypeError('cannot reduce 1'),
      )
      assert.throws(
        () => _.reduce.sync(x => x)(undefined),
        new TypeError('cannot reduce undefined'),
      )
      assert.throws(
        () => _.reduce.sync(x => x)(null),
        new TypeError('cannot reduce null'),
      )
    })
  })

  describe('_.not', () => {
    it('x => !x', async () => {
      ase(await _.not(_.id)(true), false)
      ase(await _.not(_.get('a'))({ a: false }), true)
      ase(_.not.sync(_.id)(true), false)
      ase(_.not.sync(_.get('a'))({ a: false }), true)
      ase(await _.not(true)(Infinity), false)
      ase(_.not.sync(true)(Infinity), false)
    })
  })

  describe('_.any, _.any.sync', () => {
    it('tests if any elements in arr pass fn', async () => {
      ase(await _.any(x => x === 1)([1, 2, 3]), true)
      ase(_.any.sync(x => x === 1)([1, 2, 3]), true)
      ase(await _.any(x => x === 1)([3, 3, 3]), false)
      ase(_.any.sync(x => x === 1)([3, 3, 3]), false)
      ase(_.any.sync(true, () => false)([3, 3, 3]), true)
      ase(_.any.sync(false, () => 0)([3, 3, 3]), false)
    })
  })

  describe('_.every, _.every.sync', () => {
    it('tests is every element in arr pass fn', async () => {
      ase(await _.every(x => x === 1)([1, 1, 1]), true)
      ase(_.every.sync(x => x === 1)([1, 1, 1]), true)
      ase(await _.every(x => x === 1)([1, 2, 3]), false)
      ase(_.every.sync(x => x === 1)([1, 2, 3]), false)
      ase(_.every.sync(true)([1, 2, 3]), true)
      ase(_.every.sync(false)([1, 2, 3]), false)
    })
  })

  describe('_.and, _.and.sync', () => {
    it('=> true if x passes all fns', async () => {
      ase(await _.and(
        x => x.includes(1),
        x => x.includes(2),
      )([1, 2, 3]), true)
      ase(_.and.sync(
        x => x.includes(1),
        x => x.includes(2),
      )([1, 2, 3]), true)
      ase(await _.and(
        x => x.includes(1),
        x => x.includes(2),
      )([1, 3, 3]), false)
      ase(_.and.sync(
        x => x.includes(1),
        x => x.includes(2),
      )([1, 3, 3]), false)
      ase(await _.and(true, () => true)([1, 3, 3]), true)
      ase(await _.and(false, () => true)([1, 3, 3]), false)
      ase(_.and.sync(true, () => true)([1, 3, 3]), true)
      ase(_.and.sync(false, () => true)([1, 3, 3]), false)
    })
  })

  describe('_.or, _.or.sync', () => {
    it('=> true if x passes any fns', async () => {
      ase(await _.or(
        x => x.includes(1),
        x => x.includes(2),
      )([1, 1, 1]), true)
      ase(_.or.sync(
        x => x.includes(1),
        x => x.includes(2),
      )([1, 1, 1]), true)
      ase(await _.or(
        x => x.includes(1),
        x => x.includes(2),
      )([3, 3, 3]), false)
      ase(_.or.sync(
        x => x.includes(1),
        x => x.includes(2),
      )([3, 3, 3]), false)
      ase(await _.or(true, () => false)([3, 3, 3]), true)
      ase(await _.or(false, () => false)([3, 3, 3]), false)
      ase(_.or.sync(true, () => false)([3, 3, 3]), true)
      ase(_.or.sync(false, () => false)([3, 3, 3]), false)
    })
  })

  describe('_.eq, _.eq.sync', () => {
    it('=> true if all fns return ===', async () => {
      ase(await _.eq(
        x => x,
        async x => x + 1 - 1,
        async x => x * 1,
      )(1), true)
      ase(_.eq.sync(
        x => x,
        x => x + 1 - 1,
        x => x * 1,
      )(1), true)
      ase(await _.eq(
        x => x,
        async x => x + 1 - 1,
        async x => x * 2,
      )(1), false)
      ase(_.eq.sync(
        x => x,
        x => x + 1 - 1,
        x => x * 2,
      )(1), false)
    })

    it('works for values', async () => {
      ase(await _.eq(
        x => x,
        async x => x + 1 - 1,
        async x => x * 1,
        1,
      )(1), true)
      ase(await _.eq(
        x => x,
        0,
      )(1), false)
      ase(_.eq.sync(0, 0)(1), true)
    })
  })

  describe('_.lt, _.lt.sync', () => {
    it('=> true if all lefts < rights', async () => {
      ase(await _.lt(
        x => x + 1,
        x => x + 2,
      )(1), true)
      ase(await _.lt(
        x => x + 2,
        x => x + 1,
      )(1), false)
      ase(await _.lt(
        x => x + 1,
        x => x + 1,
      )(1), false)
      ase(await _.lt(1, 2, 3)(Infinity), true)
      ase(await _.lt(3, 2, 1)(Infinity), false)
      ase(_.lt.sync(
        x => x + 1,
        x => x + 2,
      )(1), true)
      ase(_.lt.sync(
        x => x + 2,
        x => x + 1,
      )(1), false)
      ase(_.lt.sync(
        x => x + 1,
        x => x + 1,
      )(1), false)
      ase(_.lt.sync(1, 2, 3)(Infinity), true)
      ase(_.lt.sync(3, 2, 1)(Infinity), false)
    })
  })

  describe('_.lte, _.lte.sync', () => {
    it('=> true if all lefts <= rights', async () => {
      ase(await _.lte(
        x => x + 1,
        x => x + 2,
      )(1), true)
      ase(await _.lte(
        x => x + 2,
        x => x + 1,
      )(1), false)
      ase(await _.lte(
        x => x + 1,
        x => x + 1,
      )(1), true)
      ase(await _.lte(1, 2, 3)(Infinity), true)
      ase(await _.lte(3, 2, 1)(Infinity), false)
      ase(_.lte.sync(
        x => x + 1,
        x => x + 2,
      )(1), true)
      ase(_.lte.sync(
        x => x + 2,
        x => x + 1,
      )(1), false)
      ase(_.lte.sync(
        x => x + 1,
        x => x + 1,
      )(1), true)
      ase(_.lte.sync(1, 2, 3)(Infinity), true)
      ase(_.lte.sync(3, 2, 1)(Infinity), false)
    })
  })

  describe('_.gt, _.gt.sync', () => {
    it('=> true if all lefts > rights', async () => {
      ase(await _.gt(
        x => x + 2,
        x => x + 1,
      )(1), true)
      ase(await _.gt(
        x => x + 1,
        x => x + 2,
      )(1), false)
      ase(await _.gt(
        x => x + 1,
        x => x + 1,
      )(1), false)
      ase(await _.gt(3, 2, 1)(Infinity), true)
      ase(await _.gt(1, 2, 3)(Infinity), false)
      ase(_.gt.sync(
        x => x + 2,
        x => x + 1,
      )(1), true)
      ase(_.gt.sync(
        x => x + 1,
        x => x + 2,
      )(1), false)
      ase(_.gt.sync(
        x => x + 1,
        x => x + 1,
      )(1), false)
      ase(_.gt.sync(3, 2, 1)(Infinity), true)
      ase(_.gt.sync(1, 2, 3)(Infinity), false)
    })
  })

  describe('_.gte, _.gte.sync', () => {
    it('=> true if all lefts >= rights', async () => {
      ase(await _.gte(
        x => x + 2,
        x => x + 1,
      )(1), true)
      ase(await _.gte(
        x => x + 1,
        x => x + 2,
      )(1), false)
      ase(await _.gte(
        x => x + 1,
        x => x + 1,
      )(1), true)
      ase(await _.gte(3, 2, 1)(Infinity), true)
      ase(await _.gte(1, 2, 3)(Infinity), false)
      ase(_.gte.sync(
        x => x + 2,
        x => x + 1,
      )(1), true)
      ase(_.gte.sync(
        x => x + 1,
        x => x + 2,
      )(1), false)
      ase(_.gte.sync(
        x => x + 1,
        x => x + 1,
      )(1), true)
      ase(_.gte.sync(3, 2, 1)(Infinity), true)
      ase(_.gte.sync(1, 2, 3)(Infinity), false)
    })
  })

  describe('_.get', () => {
    const x = { a: { b: { c: 1 } } }
    const y = [1, 2, [3, [4]]]
    it('safely gets a property', async () => {
      ase(_.get('a')({ a: 1 }), 1)
      ase(_.get('a')(new Map([['a', 1]])), 1)
      ase(_.get('b')({ a: 1 }), undefined)
      ase(_.get('b')({}), undefined)
      ase(_.get('b')(), undefined)
      ase(_.get('a.b.c')(x), 1)
      ase(_.get('a.b.d')(x), undefined)
      ase(_.get('a.b.d')({}), undefined)
      ase(_.get('a.b.d')(), undefined)
      ase(_.get(0)(y), 1)
      ade(_.get(2)(y), [3, [4]])
      ase(_.flow.sync(_.get(2), _.get(0))(y), 3)
      ase(_.get('2.0')(y), 3)
      ase(_.flow.sync(_.get(2), _.get(1), _.get(0))(y), 4)
      ase(_.get('2.1.0')(y), 4)
      ase(_.get(3)(y), undefined)
      ase(_.get('a')('hey'), undefined)
      ase(_.get('a')(1), undefined)
    })

    it('works with array keys', async () => {
      ase(_.get(['a'])({ a: 1 }), 1)
      ase(_.get(['a.b'])({ 'a.b': 1 }), 1)
      ase(_.get(['a', 'b', 'c'])(x), 1)
      ase(_.get(['a', 'b', 'd'])(x), undefined)
      ase(_.get('b', 'default')({}), 'default')
    })
  })

  describe('_.lookup', () => {
    const x = { a: { b: { c: 1 } } }
    const y = [1, 2, [3, [4]]]
    it('like _.get but the store is the first argument', async () => {
      ase(_.lookup({ a: 1 })('a'), 1)
      ase(_.lookup(new Map([['a', 1]]))('a'), 1)
      ase(_.lookup({ a: 1 })('b'), undefined)
      ase(_.lookup({})('b'), undefined)
      ase(_.lookup()('b'), undefined)
      ase(_.lookup(x)('a.b.c'), 1)
      ase(_.lookup(x)('a.b.d'), undefined)
      ase(_.lookup({})('a.b.d'), undefined)
      ase(_.lookup()('a.b.d'), undefined)
      ase(_.lookup(y)(0), 1)
      ade(_.lookup(y)(2), [3, [4]])
    })
  })

  describe('_.put', () => {
    it('puts a property on current payload, passing in payload', async () => {
      ade(
        await _.put(
          ['hey', async x => x.ho + 1],
          ['yo', async x => x.ho + 2],
        )({ ho: 1 }),
        ({ hey: 2, ho: 1, yo: 3 }),
      )
      ade(
        _.put.sync(
          ['hey', x => x.ho + 1],
          ['yo', x => x.ho + 2],
        )({ ho: 1 }),
        ({ hey: 2, ho: 1, yo: 3 }),
      )
    })
  })

  describe('_.concat', () => {
    it('concats fn computations to point', async () => {
      ase(await _.concat('c')('ab'), 'abc')
      ase(await _.concat('c', x => x + 'hey')('ab'), 'abcabhey')
      ade(await _.concat([3])([1, 2]), [1, 2, 3])
      ade(await _.concat(3)([1, 2]), [1, 2, 3])
      ade(await _.concat(3, x => [x[0] + 3])([1, 2]), [1, 2, 3, 4])
      ase(_.concat.sync('c')('ab'), 'abc')
      ase(_.concat.sync('c', x => x + 'hey')('ab'), 'abcabhey')
      ade(_.concat.sync([3])([1, 2]), [1, 2, 3])
      ade(_.concat.sync(3)([1, 2]), [1, 2, 3])
      ade(_.concat.sync(3, x => [x[0] + 3])([1, 2]), [1, 2, 3, 4])
    })

    it('throws TypeError', async () => {
      assert.rejects(
        () => _.concat(1)(0),
        new TypeError('cannot concat to 0'),
      )
      assert.rejects(
        () => _.concat(1)(null),
        new TypeError('cannot concat to null'),
      )
      assert.rejects(
        () => _.concat(1)(undefined),
        new TypeError('cannot concat to undefined'),
      )
      assert.throws(
        () => _.concat.sync(1)(0),
        new TypeError('cannot concat to 0'),
      )
      assert.throws(
        () => _.concat.sync(1)(null),
        new TypeError('cannot concat to null'),
      )
      assert.throws(
        () => _.concat.sync(1)(undefined),
        new TypeError('cannot concat to undefined'),
      )
    })
  })

  describe('_.has', () => {
    it('checks for membership', async () => {
      ase(_.has('hey')('heyhey'), true)
      ase(_.has('hey')(Buffer.from('heyhey')), true)
      ase(_.has('hey')('yoyo'), false)
      ase(_.has('hey')(['hey', 1, 2]), true)
      ase(_.has('hey')(['yo', 1, 2]), false)
      ase(_.has('hey')(new Set(['hey', 1, 2])), true)
      ase(_.has('hey')(new Set(['yo', 1, 2])), false)
      ase(_.has('hey')(new Map([['hey', 1]])), true)
      ase(_.has('hey')(new Map([['yo', 1]])), false)
      ase(_.has('hey')({ hey: 1 }), true)
      ase(_.has('hey')({ yo: 1 }), false)
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.has('hey')(1),
        new TypeError('cannot has 1'),
      )
      assert.throws(
        () => _.has('hey')(undefined),
        new TypeError('cannot has undefined'),
      )
      assert.throws(
        () => _.has('hey')(null),
        new TypeError('cannot has null'),
      )
    })
  })

  describe('_.member', () => {
    it('like _.has but arguments flipped', async () => {
      ase(_.member('heyhey')('hey'), true)
      ase(_.member('yoyo')('hey'), false)
      ase(_.member(['hey', 1, 2])('hey'), true)
      ase(_.member(['yo', 1, 2])('hey'), false)
      ase(_.member(new Set(['hey', 1, 2]))('hey'), true)
      ase(_.member(new Set(['yo', 1, 2]))('hey'), false)
      ase(_.member(new Map([['hey', 1]]))('hey'), true)
      ase(_.member(new Map([['yo', 1]]))('hey'), false)
      ase(_.member({ hey: 1 })('hey'), true)
      ase(_.member({ yo: 1 })('hey'), false)
    })
  })

  describe('_.trace', () => {
    it('console logs args', async () => {
      let stdout = captureStdout()
      ase(_.trace('trace'), 'trace')
      ase(stdout.output, '\'trace\'\n')
      releaseStdout()
      stdout = captureStdout()
      ade(_.trace({ a: 1, b: [[[[['hey']]]]] }), { a: 1, b: [[[[['hey']]]]] })
      ase(stdout.output, '{\n  a: 1,\n  b: [\n    [\n      [ [ [ \'hey\' ] ] ]\n    ]\n  ]\n}\n')
      releaseStdout()
    })
  })

  describe('_.tracep', () => {
    it('console logs prop and x.prop, opt tag', async () => {
      let stdout = captureStdout()
      ade(_.tracep('hey')({ hey: 'tracep' }), { hey: 'tracep' })
      ase(stdout.output, '.hey - \'tracep\'\n')
      releaseStdout()
      stdout = captureStdout()
      ade(_.tracep('hey', 'mytag')({ hey: 'tracep' }), { hey: 'tracep' })
      ase(stdout.output, 'mytag .hey - \'tracep\'\n')
      releaseStdout()
    })
  })

  describe('_.tracef, _.tracef.sync', () => {
    it('console logs fn(args)', async () => {
      let stdout = captureStdout()
      ase(await _.tracef(async x => x)('tracef'), 'tracef')
      ase(stdout.output, '\'tracef\'\n')
      releaseStdout()
    })
  })

  describe('_.tracef.sync', async () => {
    it('console logs sync fn(args)', async() => {
      let stdout = captureStdout()
      ase(_.tracef.sync(_.id)('tracef'), 'tracef')
      ase(stdout.output, '\'tracef\'\n')
      releaseStdout()
    })
  })

  describe('_.promisify', () => {
    const cbHey = cb => setTimeout(() => cb(null, 'hey'), 10)
    it('promisifies', async () => {
      ase(await _.promisify(cbHey)(), 'hey')
      try {
        const fn = _.promisify('wut')
        assert(!fn)
      } catch (e) {
        assert(e instanceof TypeError)
      }
    })
  })

  describe('_.callbackify', () => {
    const promiseHey = () => new Promise(res => setTimeout(() => res('hey'), 10))
    it('callbackifies', (done) => {
      _.callbackify(promiseHey)((err, hey) => {
        assert.ifError(err)
        ase(hey, 'hey')
        done()
      })
    })
  })

  describe('_.promisifyAll', () => {
    function cbModule(){}
    cbModule.cbHey = cb => setTimeout(() => cb(null, 'hey'), 10)
    cbModule.hey = 'hey'
    it('promisifies an entire module', async () => {
      ase(await _.promisifyAll(cbModule).cbHey(), 'hey')
      ase(_.promisifyAll(cbModule).hey, 'hey')
    })
  })

  describe('_.callbackifyAll', () => {
    function promiseModule(){}
    promiseModule.promiseHey = () => new Promise(res => setTimeout(() => res('hey'), 10))
    promiseModule.hey = 'hey'
    it('callbackifies an entire module', (done) => {
      ase(_.callbackifyAll(promiseModule).hey, 'hey')
      _.callbackifyAll(promiseModule).promiseHey((err, hey) => {
        assert.ifError(err)
        ase(hey, 'hey')
        done()
      })
    })
  })

  describe('_.pick', () => {
    it('makes a new object using picked properties', async () => {
      ade(_.pick('a', 'b')({ a: 1, b: 2, c: 2 }), { a: 1, b: 2 })
      ade(_.pick('d')({ a: 1, b: 2, c: 2 }), {})
    })

    it('throws a TypeError', async () => {
      assert.throws(
        () => _.pick('a', 'b')('hey'),
        new TypeError('cannot pick hey')
      )
    })
  })

  describe('_.slice', () => {
    it('slices an array from a to b, not including b', async () => {
      ade(_.slice(0)([1, 2, 3]), [1, 2, 3])
      ade(_.slice(0, 0)([1, 2, 3]), [])
      ade(_.slice(0, 1)([1, 2, 3]), [1])
      ade(_.slice(0, -2)([1, 2, 3]), [1])
      ade(_.slice(0, 2)([1, 2, 3]), [1, 2])
      ade(_.slice(0, -1)([1, 2, 3]), [1, 2])
      ade(_.slice(0, 3)([1, 2, 3]), [1, 2, 3])
      ade(_.slice(1)([1, 2, 3]), [2, 3])
      ade(_.slice(1, 0)([1, 2, 3]), [])
      ade(_.slice(1, 1)([1, 2, 3]), [])
      ade(_.slice(1, 2)([1, 2, 3]), [2])
      ade(_.slice(1, -1)([1, 2, 3]), [2])
      ade(_.slice(1, 3)([1, 2, 3]), [2, 3])
      ade(_.slice(-1)([1, 2, 3]), [3])
      ade(_.slice(-1, -1)([1, 2, 3]), [])
      ade(_.slice(-2)([1, 2, 3]), [2, 3])
      ade(_.slice(-2, -1)([1, 2, 3]), [2])
      ade(_.slice(-3)([1, 2, 3]), [1, 2, 3])
      ade(_.slice(-3, -1)([1, 2, 3]), [1, 2])
      ade(_.slice(-3, -2)([1, 2, 3]), [1])
      ade(_.slice(-3, -2)([1, 2, 3]), [1])
      ade(_.slice(0, Infinity)([1, 2, 3]), [1, 2, 3])
      ade(_.slice(-Infinity, Infinity)([1, 2, 3]), [1, 2, 3])
    })
  })

  describe('_.replaceOne', () => {
    it('replaces the first occurence a with b', async () => {
      ase(_.replaceOne('hey', '')('heyheyhey'), 'heyhey')
      ase(_.replaceOne('hey', 1)('heyheyhey'), '1heyhey')
      ase(_.replaceOne('', '')('heyheyhey'), 'heyheyhey')
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.replaceOne('hey', '')(),
        new TypeError('cannot replace for undefined'),
      )
      assert.throws(
        () => ase(_.replaceOne('hey', false)('heyheyhey'), 'falseheyhey'),
        new TypeError('bad replacement false'),
      )
      assert.throws(
        () => _.replaceOne('hey')(),
        new TypeError('no replacement provided'),
      )
    })
  })

  describe('_.replaceAll', () => {
    it('replaces the first occurence a with b', async () => {
      ase(_.replaceAll('hey', '')('heyheyhey'), '')
      ase(_.replaceAll('hey', 1)('heyheyhey'), '111')
      ase(_.replaceAll('', '')('heyheyhey'), 'heyheyhey')
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.replaceAll('hey', '')(),
        new TypeError('cannot replace for undefined'),
      )
      assert.throws(
        () => ase(_.replaceAll('hey', false)('heyheyhey'), 'falseheyhey'),
        new TypeError('bad replacement false'),
      )
      assert.throws(
        () => _.replaceAll('hey')(),
        new TypeError('no replacement provided'),
      )
    })
  })

  describe('_.join', () => {
    it('joins elements of an array on delim', async () => {
      ade(_.join(',')([1, 2, 3]), '1,2,3')
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => ade(_.join()([1, 2, 3]), '1,2,3'),
        new TypeError('no delimiter provided'),
      )
      assert.throws(
        () => ade(_.join(false)([1, 2, 3]), '1,2,3'),
        new TypeError('bad delimiter false'),
      )
    })
  })

  describe('_.split', () => {
    it('splits a string into an array from given delimiter', async () => {
      ade(_.split('.')('a.b.c'), ['a', 'b', 'c'])
      ade(_.split(1)('a1b'), ['a', 'b'])
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => ade(_.split()('a.b.c'), ['a.b.c']),
        new TypeError('no delimiter provided'),
      )
      assert.throws(
        () => ade(_.split('.')(), ['']),
        new TypeError('cannot split undefined'),
      )
      assert.throws(
        () => ade(_.split('.')(1), ['1']),
        new TypeError('cannot split 1'),
      )
      assert.throws(
        () => ade(_.split(false)('hey')),
        new TypeError('bad delimiter false'),
      )
    })
  })

  describe('_.lowercase', () => {
    it('lowercases', async () => {
      ase(_.lowercase('AAA'), 'aaa')
      ase(_.lowercase('Aaa'), 'aaa')
      ase(_.lowercase('Aaa '), 'aaa ')
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.lowercase(null),
        new TypeError('cannot lowercase null'),
      )
      assert.throws(
        () => _.lowercase(),
        new TypeError('cannot lowercase undefined'),
      )
    })
  })

  describe('_.uppercase', () => {
    it('uppercases', async () => {
      ase(_.uppercase('aaa'), 'AAA')
      ase(_.uppercase('Aaa'), 'AAA')
      ase(_.uppercase('Aaa '), 'AAA ')
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.uppercase(null),
        new TypeError('cannot uppercase null'),
      )
      assert.throws(
        () => _.uppercase(),
        new TypeError('cannot uppercase undefined'),
      )
    })
  })

  describe('_.capitalize', () => {
    it('capitalizes', async () => {
      ase(_.capitalize('george'), 'George')
      ase(_.capitalize('george benson'), 'George benson')
      ase(_.capitalize(''), '')
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.capitalize(null),
        new TypeError('cannot capitalize null'),
      )
      assert.throws(
        () => _.capitalize(),
        new TypeError('cannot capitalize undefined'),
      )
    })
  })

  describe('_.braid', () => {
    it('braids two or more arrays into one single array', async () => {
      ade(_.braid(1)([[1]]), [1])
      ade(
        _.braid(1, 2)([
          Array(2).fill('a'),
          Array(4).fill('b'),
        ]),
        ['a', 'b', 'b', 'a', 'b', 'b'],
      )
      ade(
        _.braid(1, 1)([
          _.braid(1, 2)([
            Array(2).fill('a'),
            Array(4).fill('b'),
          ]),
          Array(2).fill('c'),
        ]),
        ['a', 'c', 'b', 'c', 'b', 'a', 'b', 'b'],
      )
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.braid(1, 1)({}),
        new TypeError('point must be an array of arrays'),
      )
      assert.throws(
        () => _.braid(1, 1)([[], [], undefined]),
        new TypeError('point must be an array of arrays'),
      )
    })

    it('throws Error', async () => {
      assert.throws(
        () => _.braid(1, 1, 1)([[], []]),
        new Error('point length must === number of rates'),
      )
    })
  })

  describe('_.unbraid', () => {
    it('unbraids an array into multiple arrays', async () => {
      ade(
        _.unbraid(1, 2)(['a', 'b', 'b', 'a', 'b', 'b']),
        [Array(2).fill('a'), Array(4).fill('b')],
      )
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.unbraid(1, 1)({}),
        new TypeError('point must be an array'),
      )
    })
  })

  describe('_.transpose', () => {
    it('transposes a 2d array', async () => {
      ade(
        _.transpose([
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
        ]), [
          [1, 1, 1],
          [2, 2, 2],
          [3, 3, 3],
        ]
      )
      ade(
        _.transpose([
          [1, 2, 3],
          [1, 2, 3],
        ]), [
          [1, 1],
          [2, 2],
          [3, 3],
        ]
      )
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.transpose('hey'),
        new TypeError('point must be an array'),
      )
    })
  })

  describe('_.flatten', () => {
    it('flattens an array of arrays', async () => {
      ade(
        _.flatten([[1], [2], [3]]),
        [1, 2, 3],
      )
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.flatten('hey'),
        new TypeError('point must be an array'),
      )
    })
  })

  describe('_.flattenAll', () => {
    it('flattens an array of arrays of any depth', async () => {
      ade(
        _.flattenAll([1, [2, [3]]]),
        [1, 2, 3],
      )
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.flattenAll('hey'),
        new TypeError('point must be an array'),
      )
    })
  })

  describe('_.uniq', () => {
    it('uniques an array', async () => {
      ade(
        _.uniq([1, 1, 1, 2, 2, 2, 3, 3, 3]),
        [1, 2, 3],
      )
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.uniq('hey'),
        new TypeError('point must be an array'),
      )
    })
  })

  describe('_.uniqp', () => {
    const a1 = () => ({ a: 1 })
    const a2 = () => ({ a: 2 })
    const a3 = () => ({ a: 3 })
    it('uniques an array based on item property', async () => {
      ade(
        _.uniqp('a')([a1(), a1(), a1(), a2(), a2(), a3(), a3(), a3()]),
        [a1(), a2(), a3()],
      )
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.uniqp('hey')('hey'),
        new TypeError('point must be an array'),
      )
    })
  })

  describe('_.first', () => {
    it('gets the first item', async () => {
      ase(_.first([1, 2, 3]), 1)
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.first('hey'),
        new TypeError('point must be an array'),
      )
    })
  })

  describe('_.last', () => {
    it('gets the first item', async () => {
      ase(_.last([1, 2, 3]), 3)
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.first('hey'),
        new TypeError('point must be an array'),
      )
    })
  })

  describe('_.reverse', () => {
    it('=> reversed array', async () => {
      ade(_.reverse([1, 2, 3]), [3, 2, 1])
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.reverse('hey'),
        new TypeError('point must be an array'),
      )
    })
  })

  describe('_.sort', () => {
    it('sorts an array', async () => {
      ade(_.sort(-1)([2, 1, 3]), [3, 2, 1])
      ade(_.sort(1)([2, 1, 3]), [1, 2, 3])
      ade(_.sort()([2, 1, 3]), [1, 2, 3])
      ade(_.sort(1)(['b', 'a', 'c']), ['a', 'b', 'c'])
      ade(_.sort(-1)(['b', 'a', 'c']), ['c', 'b', 'a'])
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.sort(1)('hey'),
        new TypeError('point must be an array'),
      )
    })
  })

  describe('_.sortBy', () => {
    it('sorts an array of objects by property', async () => {
      ade(
        _.sortBy('a', 1)([{ a: 2 }, { a: 1 }, { a: 3 }]),
        [{ a: 1 }, { a: 2 }, { a: 3 }],
      )
      ade(
        _.sortBy('a', -1)([{ a: 2 }, { a: 1 }, { a: 3 }]),
        [{ a: 3 }, { a: 2 }, { a: 1 }],
      )
      ade(
        _.sortBy('a', 1)([{ a: 'b' }, { a: 'a' }, { a: 'c' }]),
        [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
      )
      ade(
        _.sortBy('a', -1)([{ a: 'b' }, { a: 'a' }, { a: 'c' }]),
        [{ a: 'c' }, { a: 'b' }, { a: 'a' }],
      )
    })

    it('throws TypeError', async () => {
      assert.throws(
        () => _.sortBy('hey', 1)('hey'),
        new TypeError('point must be an array'),
      )
    })
  })

  describe('_.size', () => {
    it('gets the size (length)', async () => {
      ase(_.size('hey'), 3)
      ase(_.size([1, 2, 3]), 3)
      ase(_.size(new Set([1, 2, 3])), 3)
      ase(_.size(new Map([['a', 1]])), 1)
      ase(_.size({ a: 1 }), 1)
      assert.throws(
        () => _.size(undefined),
        new TypeError('cannot size undefined')
      )
    })
  })

  describe('_.isEmpty', () => {
    it('=> true if empty', async () => {
      ase(_.isEmpty(''), true)
      ase(_.isEmpty('a'), false)
      ase(_.isEmpty([]), true)
      ase(_.isEmpty([1]), false)
      ase(_.isEmpty(new Set()), true)
      ase(_.isEmpty(new Set([1])), false)
      ase(_.isEmpty(new Map()), true)
      ase(_.isEmpty(new Map([['a', 1]])), false)
      ase(_.isEmpty({}), true)
      ase(_.isEmpty({ a: 1 }), false)
    })
  })

  describe('_.once', () => {
    it('ensures fn is called once', async () => {
      let i = 0
      const fn = () => i + 1
      const onceFn = _.once(fn)
      ase(onceFn(), 1)
      ase(onceFn(), 1)
      ase(onceFn(), 1)
    })
  })

  describe('_.flip', () => {
    it('flips a value given arr', async () => {
      ase(_.flip(['heads', 'tails'])('heads'), 'tails')
    })
  })

  describe('_.prettifyJSON', () => {
    it('prettifies json', async () => {
      ase(_.prettifyJSON(1), '1')
      ase(_.prettifyJSON('hey'), '"hey"')
      ase(_.prettifyJSON(true), 'true')
      ase(_.prettifyJSON(null), 'null')
      ase(_.prettifyJSON(), undefined)
      ase(_.prettifyJSON([]), '[]')
      ase(_.prettifyJSON({}), '{}')
      ase(_.prettifyJSON(new Set()), '{}')
      ase(_.prettifyJSON(new Map()), '{}')
      ase(_.prettifyJSON([1, 2, 3]), '[\n  1,\n  2,\n  3\n]')
      ase(_.prettifyJSON({ a: 1, b: 2 }), '{\n  "a": 1,\n  "b": 2\n}')
    })
  })
})
