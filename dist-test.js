const ThunkTest = require('thunk-test')
const rubico = require('./rubico')
const assert = require('assert')
const funcConcatSync = require('./_internal/funcConcatSync')
const thunkify1 = require('./_internal/thunkify1')

const {
  pipe, tap,
  switchCase, tryCatch,
  fork, assign, get, pick, omit,
  map, filter, reduce, transform, flatMap,
  and, or, not, any, all,
  eq, gt, lt, gte, lte,
  thunkify, always,
  curry, __,
} = rubico

const mapFromObject = function (object) {
  const result = new Map()
  for (const key in object) {
    result.set(key, object[key])
  }
  return result
}

const TestsMap = new Map()

TestsMap.set('pipe', pipe => [
  ThunkTest(
    'pipe: awesome username generator',
    pipe([
      (arg0, arg1) => arg1 == null ? arg0 : arg0 + arg1,
      string => string.toUpperCase(),
      string => `x${string}x`,
      string => `X${string}X`,
      string => `x${string}x`,
    ]))
    .case('deimos', 'xXxDEIMOSxXx')
    .case('aa', 'bb', 'xXxAABBxXx')
    .case('|', result => assert.equal(result, 'xXx|xXx'))
    .case('?', async result => assert.equal(result, 'xXx?xXx'))
    .throws(1, new TypeError('string.toUpperCase is not a function'))
    .throws(2, async (err, arg0) => {
      assert.strictEqual(arg0, 2)
      assert.strictEqual(err.name, 'TypeError')
      assert.strictEqual(err.message, 'string.toUpperCase is not a function')
    }),

  ThunkTest(
    'pipe: object transducer',
    pipe([
      map(obj => Object.assign(obj, { a: 1 })),
      map(obj => Object.assign(obj, { b: 2 })),
      map(obj => Object.assign(obj, { c: 3 })),
    ]))
    .case([{}], [{ a: 1, b: 2, c: 3 }])
    .case(function add(a, b) {
      return a + b
    }, reducer => {
      assert.strictEqual([1, 2, 3, 4, 5].reduce(reducer, 0), 15)
    }),
])

TestsMap.set('pipe.sync', pipeSync => [
  ThunkTest(
    'pipe.sync',
    pipeSync([
      value => Promise.resolve(value),
      promise => promise.then(res => res ** 2)
    ]))
    .case(1, 1)
    .case(2, 4)
    .case(3, 9)
    .case(null, 0)
])

TestsMap.set('tap', tap => [
  ThunkTest(
    'tap syncTapper',
    tap(function noop() {}))
    .case(1, 1)
    .case('hey', 'hey')
    .case(null, null)
    .case({}, {})
    .case({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })
    .case({ a: 1, b: 2, c: 3, d: ['ayo'] }, { a: 1, b: 2, c: 3, d: ['ayo'] }),

  ThunkTest(
    'tap asyncTapper',
    tap(async function asyncNoop() {}))
    .case(1, 1)
    .case('hey', 'hey')
    .case(null, null)
    .case({}, {})
    .case({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })
    .case({ a: 1, b: 2, c: 3, d: ['ayo'] }, { a: 1, b: 2, c: 3, d: ['ayo'] }),
])

TestsMap.set('tap.sync', tapSync => [
  ThunkTest(
    'tap.sync syncTapper',
    tapSync(function noop() {}))
    .case(1, 1)
    .case('hey', 'hey')
    .case(null, null)
    .case({}, {})
    .case({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })
    .case({ a: 1, b: 2, c: 3, d: ['ayo'] }, { a: 1, b: 2, c: 3, d: ['ayo'] }),

  ThunkTest(
    'tap.sync asyncTapper',
    tapSync(async function asyncNoop() {}))
    .case(1, 1)
    .case('hey', 'hey')
    .case(null, null)
    .case({}, {})
    .case({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })
    .case({ a: 1, b: 2, c: 3, d: ['ayo'] }, { a: 1, b: 2, c: 3, d: ['ayo'] }),
])

TestsMap.set('tap.if', tapIf => [
  ThunkTest(
    'tap.if',
    tapIf(number => number % 2 == 1, function noop() {}))
    .case(1, 1)
    .case(2, 2),
])

TestsMap.set('fork', fork => [
  ThunkTest(
    'fork object',
    fork({
      number: number => number,
      squared: number => number ** 2,
      cubed: number => number ** 3,
    }))
    .case(1, { number: 1, squared: 1, cubed: 1 })
    .case(2, { number: 2, squared: 4, cubed: 8 })
    .case(3, { number: 3, squared: 9, cubed: 27 }),

  ThunkTest(
    'fork array',
    fork([
      object => object.a,
      async object => object.b,
      object => object.c,
    ]))
    .case({ a: 1, b: 2, c: 3 }, [1, 2, 3])
])

TestsMap.set('fork.series', forkSeries => [
  ThunkTest(
    'fork.series object',
    forkSeries({
      number: number => number,
      squared: number => number ** 2,
      cubed: number => number ** 3,
    }))
    .case(1, { number: 1, squared: 1, cubed: 1 })
    .case(2, { number: 2, squared: 4, cubed: 8 })
    .case(3, { number: 3, squared: 9, cubed: 27 }),

  ThunkTest(
    'fork.series array',
    forkSeries([
      object => object.a,
      async object => object.b,
      object => object.c,
    ]))
    .case({ a: 1, b: 2, c: 3 }, [1, 2, 3])
])

TestsMap.set('assign', assign => [
  ThunkTest(
    'assign',
    assign({
      fifthPower({ number }) {
        return number ** 5
      },
      sixthPower({ number }) {
        return number ** 6
      },
    }))
    .case({ number: 1 }, { number: 1, fifthPower: 1, sixthPower: 1 })
    .case({ number: 2 }, { number: 2, fifthPower: 32, sixthPower: 64 })
    .case({ number: 3 }, { number: 3, fifthPower: 243, sixthPower: 729 }),
])

TestsMap.set('get', get => [
  ThunkTest(
    'get',
    get('a'))
    .case({ a: 1 }, 1)
    .case({ a: [] }, [])
    .case({ a: {} }, {})
    .case({ b: 1 }, undefined),

  ThunkTest(
    'get default',
    get('a', 'abc'))
    .case({ a: 1 }, 1)
    .case({ a: [] }, [])
    .case({ a: {} }, {})
    .case({ b: 1 }, 'abc'),

  ThunkTest(
    'get default getter',
    get('a', () => 'abc'))
    .case({ a: 1 }, 1)
    .case({ a: [] }, [])
    .case({ a: {} }, {})
    .case({ b: 1 }, 'abc'),
])

TestsMap.set('pick', pick => [
  ThunkTest(
    'pick',
    pick(['a', 'b']))
    .case({ a: 1 }, { a: 1 })
    .case({ a: 1, b: 2 }, { a: 1, b: 2 })
    .case({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })
    .case({}, {})
    .case([], {}),
])

TestsMap.set('omit', omit => [
  ThunkTest(
    'omit',
    omit(['c']))
    .case({ a: 1 }, { a: 1 })
    .case({ a: 1, b: 2 }, { a: 1, b: 2 })
    .case({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })
    .case({}, {})
    .case([], {}),
])

TestsMap.set('switchCase', switchCase => [
  ThunkTest(
    'switchCase',
    switchCase([
      number => number == 1, () => 'one',
      number => number == 2, () => 'two',
      () => 'something',
    ]))
    .case(1, 'one')
    .case(2, 'two')
    .case(3, 'something'),

  ThunkTest(
    'switchCase async',
    switchCase([
      async number => number == 1, async () => 'one',
      async number => number == 2, async () => 'two',
      async () => 'something',
    ]))
    .case(1, 'one')
    .case(2, 'two')
    .case(3, 'something'),

  ThunkTest(
    'switchCase async variadic',
    switchCase([
      number => number == 1, async () => 'one',
      number => number == 2, async () => 'two',
      async () => 'something',
    ]))
    .case(1, 'one')
    .case(2, 'two')
    .case(3, 'something'),
])

TestsMap.set('map', map => [
  ThunkTest(
    'map syncMapper',
    map(number => number ** 2))
    .case([1, 2, 3, 4, 5], [1, 4, 9, 16, 25])
    .case(new Set([1, 2, 3, 4, 5]), new Set([1, 4, 9, 16, 25]))
    .case({ a: 1, b: 2, c: 3 }, { a: 1, b: 4, c: 9 })
    .case(mapFromObject({ a: 1, b: 2, c: 3 }), mapFromObject({ a: 1, b: 4, c: 9 }))
    .case({ map: mapper => mapper(3) }, 9)
    .case(3, 9)
    .case((a, b) => a + b, squaredAdd => {
      assert.strictEqual([1, 2, 3, 4, 5].reduce(squaredAdd, 0), 55)
    })
    .case(function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    }, squaredRange => {
      assert.deepEqual([...squaredRange(1, 6)], [1, 4, 9, 16, 25])
    })
    .case((function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), numbersGenerator => {
      assert.deepEqual([...numbersGenerator], [1, 4, 9, 16, 25])
    })
    .case(async function* asyncRange(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    }, async squaredRange => {
      const array = []
      for await (const number of squaredRange(1, 6)) {
        array.push(number)
      }
      assert.deepEqual(array, [1, 4, 9, 16, 25])
    })
    .case((async function* asyncRange(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), async asyncNumbersGenerator => {
      const array = []
      for await (const number of asyncNumbersGenerator) {
        array.push(number)
      }
      assert.deepEqual(array, [1, 4, 9, 16, 25])
    }),

  ThunkTest(
    'map asyncMapper',
    map(async number => number ** 2))
    .case([1, 2, 3, 4, 5], [1, 4, 9, 16, 25])
    .case(new Set([1, 2, 3, 4, 5]), new Set([1, 4, 9, 16, 25]))
    .case(mapFromObject({ a: 1, b: 2, c: 3 }), mapFromObject({ a: 1, b: 4, c: 9 }))
    .case({ map: mapper => mapper(3) }, 9)
    .case(3, 9)
    .case(function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    }, squaredRange => {
      assert.deepEqual([...squaredRange(1, 6)], [1, 4, 9, 16, 25].map(number => Promise.resolve(number)))
    })
    .case(async function* asyncRange(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    }, async squaredRange => {
      const array = []
      for await (const number of squaredRange(1, 6)) {
        array.push(number)
      }
      assert.deepEqual(array, [1, 4, 9, 16, 25])
    })
    .case((async function* asyncRange(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), async asyncNumbersGenerator => {
      const array = []
      for await (const number of asyncNumbersGenerator) {
        array.push(number)
      }
      assert.deepEqual(array, [1, 4, 9, 16, 25])
    }),
])

TestsMap.set('map.series', mapSeries => [
  ThunkTest(
    'map.series',
    mapSeries(number => number ** 2),
    mapSeries(async number => number ** 2))
    .case([1, 2, 3, 4, 5], [1, 4, 9, 16, 25])
    .throws(new Set(), TypeError('[object Set] is not an Array'))
    .throws(null, TypeError('null is not an Array'))
])

TestsMap.set('map.pool', function (mapPool) {
  const sleep = ms => new Promise(resolve => { setTimeout(resolve, ms) })
  let i = 0,
    maxi = 0,
    period = 10
  const plusSleepMinus = n => (async () => {
    i += 1
    maxi = Math.max(maxi, i)
  })().then(() => sleep(period)).then(() => {
    i -= 1
    return n
  })

  return [
    ThunkTest(
      'map.pool poolSize 2',
      mapPool(2, plusSleepMinus))
      .case([1, 2, 3, 4, 5, 6], result => {
        assert.deepEqual(result, [1, 2, 3, 4, 5, 6])
        assert.strictEqual(maxi, 2)
        assert.strictEqual(i, 0)
        maxi = 0
      }),

    ThunkTest(
      'map.pool poolSize 3',
      mapPool(3, plusSleepMinus))
      .case([1, 2, 3, 4, 5, 6], result => {
        assert.deepEqual(result, [1, 2, 3, 4, 5, 6])
        assert.strictEqual(maxi, 3)
        assert.strictEqual(i, 0)
        maxi = 0
      }),

    ThunkTest(
      'map.pool square',
      mapPool(5, number => number ** 2))
      .case([1, 2, 3, 4, 5], [1, 4, 9, 16, 25])
      .throws(1, TypeError('1 is not an Array')),
  ]
})

TestsMap.set('map.withIndex', mapWithIndex => [
  ThunkTest(
    'map.withIndex',
    mapWithIndex((item, index, array) => [item, index, array]))
    .case([1, 2, 3], [[1, 0, [1, 2, 3]], [2, 1, [1, 2, 3]], [3, 2, [1, 2, 3]]]),
])

TestsMap.set('filter', filter => [
  ThunkTest(
    'filter syncPredicate',
    filter(number => number % 2 == 1))
    .case([1, 2, 3, 4, 5], [1, 3, 5])
    .case(new Set([1, 2, 3, 4, 5]), new Set([1, 3, 5]))
    .case({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 })
    .case(mapFromObject({ a: 1, b: 2, c: 3 }), mapFromObject({ a: 1, c: 3 }))
    .case({ filter: predicate => predicate(3) }, true)
    .case(3, 3)
    .case((a, b) => a + b, oddsAdd => {
      assert.strictEqual([1, 2, 3, 4, 5].reduce(oddsAdd, 0), 9)
    })
    .case(function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    }, oddRange => {
      assert.deepEqual([...oddRange(1, 6)], [1, 3, 5])
    })
    .case((function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), numbersGenerator => {
      assert.deepEqual([...numbersGenerator], [1, 3, 5])
    })
    .case(async function* asyncRange(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    }, async oddRange => {
      const array = []
      for await (const number of oddRange(1, 6)) {
        array.push(number)
      }
      assert.deepEqual(array, [1, 3, 5])
    })
    .case((async function* asyncRange(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), async asyncNumbersGenerator => {
      const array = []
      for await (const number of asyncNumbersGenerator) {
        array.push(number)
      }
      assert.deepEqual(array, [1, 3, 5])
    }),

  ThunkTest(
    'filter asyncPredicate',
    filter(async number => number % 2 == 1))
    .case([1, 2, 3, 4, 5], [1, 3, 5])
    .case(new Set([1, 2, 3, 4, 5]), new Set([1, 3, 5]))
    .case({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 })
    .case(mapFromObject({ a: 1, b: 2, c: 3 }), mapFromObject({ a: 1, c: 3 }))
    .case({ filter: predicate => predicate(3) }, true)
    .case(3, 3)
    .case((a, b) => a + b, async oddsAdd => {
      assert.strictEqual(await reduce(oddsAdd, 0)([1, 2, 3, 4, 5]), 9)
    })
    .case(function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    }, oddRange => {
      assert.deepEqual([...oddRange(1, 6)], [1, 2, 3, 4, 5]) // invalid filter because promises
    })
    .case((function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), numbersGenerator => {
      assert.deepEqual([...numbersGenerator], [1, 2, 3, 4, 5]) // invalid filter because promises
    })
    .case(async function* asyncRange(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    }, async oddRange => {
      const array = []
      for await (const number of oddRange(1, 6)) {
        array.push(number)
      }
      assert.deepEqual(array, [1, 3, 5])
    })
    .case((async function* asyncRange(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), async asyncNumbersGenerator => {
      const array = []
      for await (const number of asyncNumbersGenerator) {
        array.push(number)
      }
      assert.deepEqual(array, [1, 3, 5])
    }),
])

;(async function runTestsSeries(methodNames) {
  for (const methodName of methodNames) {
    const Tests = TestsMap.get(methodName)
    if (Tests == null) {
      continue
    }
    const func = require(`./${methodName}`)
    for (const test of Tests(func)) {
      await test()
    }
    for (const property in func) {
      const Tests = TestsMap.get(`${methodName}.${property}`)
      if (Tests == null) {
        continue
      }
      for (const test of Tests(func[property])) {
        await test()
      }
    }
  }
})(Object.keys(rubico))
