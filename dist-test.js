const Test = require('thunk-test')
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
} = require('./rubico')

const mapFromObject = function (object) {
  const result = new Map()
  for (const key in object) {
    result.set(key, object[key])
  }
  return result
}

const TestsMap = new Map()

TestsMap.set('pipe', pipe => [
  Test(
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

  Test(
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
  Test(
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
  Test(
    'tap syncTapper',
    tap(function noop() {}))
    .case(1, 1)
    .case('hey', 'hey')
    .case(null, null)
    .case({}, {})
    .case({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })
    .case({ a: 1, b: 2, c: 3, d: ['ayo'] }, { a: 1, b: 2, c: 3, d: ['ayo'] }),

  Test(
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
  Test(
    'tap.sync syncTapper',
    tapSync(function noop() {}))
    .case(1, 1)
    .case('hey', 'hey')
    .case(null, null)
    .case({}, {})
    .case({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })
    .case({ a: 1, b: 2, c: 3, d: ['ayo'] }, { a: 1, b: 2, c: 3, d: ['ayo'] }),

  Test(
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
  Test(
    'tap.if',
    tapIf(number => number % 2 == 1, function noop() {}))
    .case(1, 1)
    .case(2, 2),
])

TestsMap.set('fork', fork => [
  Test(
    'fork object',
    fork({
      number: number => number,
      squared: number => number ** 2,
      cubed: number => number ** 3,
    }))
    .case(1, { number: 1, squared: 1, cubed: 1 })
    .case(2, { number: 2, squared: 4, cubed: 8 })
    .case(3, { number: 3, squared: 9, cubed: 27 }),

  Test(
    'fork array',
    fork([
      object => object.a,
      async object => object.b,
      object => object.c,
    ]))
    .case({ a: 1, b: 2, c: 3 }, [1, 2, 3])
])

TestsMap.set('fork.series', forkSeries => [
  Test(
    'fork.series object',
    forkSeries({
      number: number => number,
      squared: number => number ** 2,
      cubed: number => number ** 3,
    }))
    .case(1, { number: 1, squared: 1, cubed: 1 })
    .case(2, { number: 2, squared: 4, cubed: 8 })
    .case(3, { number: 3, squared: 9, cubed: 27 }),

  Test(
    'fork.series array',
    forkSeries([
      object => object.a,
      async object => object.b,
      object => object.c,
    ]))
    .case({ a: 1, b: 2, c: 3 }, [1, 2, 3])
])

TestsMap.set('assign', assign => [
  Test(
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
  Test(
    'get',
    get('a'))
    .case({ a: 1 }, 1)
    .case({ a: [] }, [])
    .case({ a: {} }, {})
    .case({ b: 1 }, undefined),

  Test(
    'get default',
    get('a', 'abc'))
    .case({ a: 1 }, 1)
    .case({ a: [] }, [])
    .case({ a: {} }, {})
    .case({ b: 1 }, 'abc'),

  Test(
    'get default getter',
    get('a', () => 'abc'))
    .case({ a: 1 }, 1)
    .case({ a: [] }, [])
    .case({ a: {} }, {})
    .case({ b: 1 }, 'abc'),
])

TestsMap.set('pick', pick => [
  Test(
    'pick',
    pick(['a', 'b']))
    .case({ a: 1 }, { a: 1 })
    .case({ a: 1, b: 2 }, { a: 1, b: 2 })
    .case({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })
    .case({}, {})
    .case([], {}),
])

TestsMap.set('omit', omit => [
  Test(
    'omit',
    omit(['c']))
    .case({ a: 1 }, { a: 1 })
    .case({ a: 1, b: 2 }, { a: 1, b: 2 })
    .case({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })
    .case({}, {})
    .case([], {}),
])

TestsMap.set('switchCase', switchCase => [
  Test(
    'switchCase',
    switchCase([
      number => number == 1, () => 'one',
      number => number == 2, () => 'two',
      () => 'something',
    ]))
    .case(1, 'one')
    .case(2, 'two')
    .case(3, 'something'),

  Test(
    'switchCase async',
    switchCase([
      async number => number == 1, async () => 'one',
      async number => number == 2, async () => 'two',
      async () => 'something',
    ]))
    .case(1, 'one')
    .case(2, 'two')
    .case(3, 'something'),

  Test(
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
  Test(
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

  Test(
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
  Test(
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
    Test(
      'map.pool poolSize 2',
      mapPool(2, plusSleepMinus))
      .case([1, 2, 3, 4, 5, 6], result => {
        assert.deepEqual(result, [1, 2, 3, 4, 5, 6])
        assert.strictEqual(maxi, 2)
        assert.strictEqual(i, 0)
        maxi = 0
      }),

    Test(
      'map.pool poolSize 3',
      mapPool(3, plusSleepMinus))
      .case([1, 2, 3, 4, 5, 6], result => {
        assert.deepEqual(result, [1, 2, 3, 4, 5, 6])
        assert.strictEqual(maxi, 3)
        assert.strictEqual(i, 0)
        maxi = 0
      }),

    Test(
      'map.pool square',
      mapPool(5, number => number ** 2))
      .case([1, 2, 3, 4, 5], [1, 4, 9, 16, 25])
      .throws(1, TypeError('1 is not an Array')),
  ]
})

TestsMap.set('map.withIndex', mapWithIndex => [
  Test(
    'map.withIndex',
    mapWithIndex((item, index, array) => [item, index, array]))
    .case([1, 2, 3], [[1, 0, [1, 2, 3]], [2, 1, [1, 2, 3]], [3, 2, [1, 2, 3]]]),
])

TestsMap.set('filter', filter => [
  Test(
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

  Test(
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

TestsMap.set('filter.withIndex', filterWithIndex => [
  Test(
    'filter.withIndex',
    filterWithIndex(
      (item, index, array) => item !== array[index + 1]))
  .case([1, 1, 2, 2, 3, 3], [1, 2, 3])
  .case([1, 2, 3], [1, 2, 3])

])

TestsMap.set('reduce', reduce => [
  Test(
    'reduce sync init 0',
    reduce(function add(a, b) { return a + b }, 0))
  .case([1, 2, 3, 4, 5], 15)
  .case(function* range(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  }, addingRange => {
    assert.strictEqual(addingRange(1, 6), 15)
  })
  .case(async function* asyncRange(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  }, async asyncAddingRange => {
    assert.strictEqual(await asyncAddingRange(1, 6), 15)
  })
  .case(function add(a, b) { return a + b }, doubleAdd => {
    assert.strictEqual(doubleAdd([1, 2, 3, 4, 5]), 30)
  })
  .case((function* range(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  })(1, 6), 15)
  .case((async function* asyncRange(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  })(1, 6), 15)
  .case({ reduce: reducer => reducer(1, 2) }, 3)
  .case({ chain: flatMapper => flatMapper(1) }, 1)
  .case({ flatMap: flatMapper => flatMapper(1) }, 1)
  .case({ a: 1, b: 2, c: 3, d: 4, e: 5 }, 15)
  .case(1, 1),

  Test(
    'reduce async init 0',
    reduce(async function asyncAdd (a, b) { return a + b }, 0))
  .case([1, 2, 3, 4, 5], 15)
  .case(function* range(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  }, async addingRange => {
    assert.strictEqual(await addingRange(1, 6), 15)
  })
  .case(async function* asyncRange(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  }, async asyncAddingRange => {
    assert.strictEqual(await asyncAddingRange(1, 6), 15)
  })
  .case(function add(a, b) { return a + b }, async doubleAdd => {
    assert.strictEqual(await doubleAdd([1, 2, 3, 4, 5]), 30)
  })
  .case((function* range(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  })(1, 6), 15)
  .case((async function* asyncRange(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  })(1, 6), 15)
  .case({ reduce: reducer => reducer(1, 2) }, 3)
  .case({ chain: flatMapper => flatMapper(1) }, 1)
  .case({ flatMap: flatMapper => flatMapper(1) }, 1)
  .case({ a: 1, b: 2, c: 3, d: 4, e: 5 }, 15)
  .case(1, 1),

  Test(
    'reduce sync init unary',
    reduce(function add(a, b) { return a + b }))
  .case([1, 2, 3, 4, 5], 15)
  .case(function* range(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  }, addingRange => {
    assert.strictEqual(addingRange(1, 6), 15)
  })
  .case(async function* asyncRange(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  }, async asyncAddingRange => {
    assert.strictEqual(await asyncAddingRange(1, 6), 15)
  })
  .case(function add(a, b) { return a + b }, doubleAdd => {
    assert.strictEqual(doubleAdd([1, 2, 3, 4, 5]), 29) // doubling effect skips 1 since 1 starts out as the result
  })
  .case((function* range(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  })(1, 6), 15)
  .case((async function* asyncRange(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  })(1, 6), 15)
  .case({ reduce: reducer => reducer(1, 2) }, 3)
  .case({ chain: flatMapper => flatMapper(1) }, result => assert(isNaN(result)))
  .case({ flatMap: flatMapper => flatMapper(1) }, result => assert(isNaN(result)))
  .case({ a: 1, b: 2, c: 3, d: 4, e: 5 }, 15)
  .case(1, result => assert(isNaN(result))),

  Test(
    'reduce sync init undefined',
    reduce(function add(a, b) { return a + b }, undefined))
  .case([1, 2, 3, 4, 5], 15)
  .case(function* range(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  }, addingRange => {
    assert.strictEqual(addingRange(1, 6), 15)
  })
  .case(async function* asyncRange(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  }, async asyncAddingRange => {
    assert.strictEqual(await asyncAddingRange(1, 6), 15)
  })
  .case(function add(a, b) { return a + b }, doubleAdd => {
    assert.strictEqual(doubleAdd([1, 2, 3, 4, 5]), 29) // doubling effect skips 1 since 1 starts out as the result
  })
  .case((function* range(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  })(1, 6), 15)
  .case((async function* asyncRange(from, to) {
    for (let i = from; i < to; i++) {
      yield i
    }
  })(1, 6), 15)
  .case({ reduce: reducer => reducer(1, 2) }, 3)
  .case({ chain: flatMapper => flatMapper(1) }, result => assert(isNaN(result)))
  .case({ flatMap: flatMapper => flatMapper(1) }, result => assert(isNaN(result)))
  .case({ a: 1, b: 2, c: 3, d: 4, e: 5 }, 15)
  .case(1, result => assert(isNaN(result))),
])

TestsMap.set('transform', transform => [
  Test(
    'transform Array',
    transform(map(number => number ** 2), []))
    .case([1, 2, 3, 4, 5], [1, 4, 9, 16, 25]),

  Test(
    'transform ()=>Array',
    transform(map(number => number ** 2), () => []))
    .case([1, 2, 3, 4, 5], [1, 4, 9, 16, 25]),

  Test(
    'transform Set',
    transform(map(number => number ** 2), new Set()))
    .case([1, 2, 3, 4, 5], new Set([1, 4, 9, 16, 25])),

  Test(
    'transform Object',
    transform(map(number => ({ [number.toString()]: number ** 2 })), {}))
    .case([1, 2, 3, 4, 5], { 1: 1, 2: 4, 3: 9, 4: 16, 5: 25 }),

  Test(
    'transform Uint8Array',
    transform(map(number => number ** 2), new Uint8Array()))
    .case([1, 2, 3, 4, 5], new Uint8Array([1, 4, 9, 16, 25])),

  Test(
    'transform null',
    transform(map(number => number ** 2), null))
    .case([1, 2, 3, 4, 5], null),

  Test(
    'transform string',
    transform(map(value => `${value}${value}`), ''))
    .case([1, 2, 3, 4, 5], '1122334455'),

  Test(
    'transform explicitSemigroup',
    transform(map(value => `${value}${value}`), { concat() { return this } }))
    .case([1, 2, 3, 4, 5], semigroup => assert(typeof semigroup.concat == 'function')),

  Test(
    'transform writable',
    transform(map(value => `${value}${value}`), { write() { return this } }))
    .case([1, 2, 3, 4, 5], writable => assert(typeof writable.write == 'function')),

  Test(
    'transform 0',
    transform(map(value => `${value}${value}`), 0))
    .case([1, 2, 3, 4, 5], 0),
])

TestsMap.set('flatMap', flatMap => [
  Test(
    'flatMap duplicate',
    flatMap(value => [value, value]))
    .case([1, 2, 3, 4, 5], [1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
    .case(new Uint8Array([1, 2, 3, 4, 5]), new Uint8Array([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]))
    .case(function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    }, duplicateRangeGeneratorFunc => {
      assert.deepEqual([...duplicateRangeGeneratorFunc(1, 6)], [1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
    })
    .case(async function* asyncRange(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    }, async duplicateAsyncRangeGeneratorFunc => {
      const array = []
      for await (const number of duplicateAsyncRangeGeneratorFunc(1, 6)) {
        array.push(number)
      }
      assert.deepEqual(array, [1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
    })
    .case(function add(a, b) { return a + b }, doubleAddReducer => {
      assert.strictEqual([1, 2, 3, 4, 5].reduce(doubleAddReducer, 0), 30)
    })
    .case((function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), numbersGenerator => {
      assert.deepEqual([...numbersGenerator], [1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
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
      assert.deepEqual(array, [1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
    })
    .case({ chain: flatMapper => flatMapper(3) }, [3, 3])
    .case({ flatMap: flatMapper => flatMapper(3) }, [3, 3])
    .case({
      [Symbol.asyncIterator]() {
        return (async function* () {
          yield 1; yield 2; yield 3; yield 4; yield 5
        })()
      },
      values: [],
      write(value) {
        this.values.push(value)
      },
    }, mockStream => {
      assert.deepEqual(mockStream.values, [1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
    }),

  Test(
    'flatMap asyncDuplicate',
    flatMap(async value => [value, value]))
    .case([1, 2, 3, 4, 5], [1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
    .case(new Uint8Array([1, 2, 3, 4, 5]), new Uint8Array([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]))
    .case(function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    }, async duplicateRangeGeneratorFunc => {
      assert.deepEqual(await Promise.all([...duplicateRangeGeneratorFunc(1, 6)]), [1, 2, 3, 4, 5].map(value => [value, value]))
    })
    .case(async function* asyncRange(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    }, async duplicateAsyncRangeGeneratorFunc => {
      const array = []
      for await (const number of duplicateAsyncRangeGeneratorFunc(1, 6)) {
        array.push(number)
      }
      assert.deepEqual(array, [1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
    })
    .case(function add(a, b) { return a + b }, async doubleAddReducer => {
      assert.strictEqual(await reduce(doubleAddReducer, 0)([1, 2, 3, 4, 5]), 30)
    })
    .case((function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), async numbersGenerator => {
      assert.deepEqual(await Promise.all([...numbersGenerator]), [1, 2, 3, 4, 5].map(value => [value, value]))
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
      assert.deepEqual(array, [1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
    })
    .case({ chain: flatMapper => flatMapper(3) }, [3, 3])
    .case({ flatMap: flatMapper => flatMapper(3) }, [3, 3])
    .case({
      [Symbol.asyncIterator]() {
        return (async function* () {
          yield 1; yield 2; yield 3; yield 4; yield 5
        })()
      },
      values: [],
      write(value) {
        this.values.push(value)
      },
    }, mockStream => {
      assert.deepEqual(mockStream.values, [1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
    })
])

TestsMap.set('and', and => [
  Test(
    'and sync',
    and([
      number => number % 2 == 1,
      number => number > 0,
    ]))
    .case(1, true)
    .case(2, false)
    .case(-1, false),

  Test(
    'and async',
    and([
      async number => number % 2 == 1,
      async number => number > 0,
    ]))
    .case(1, true)
    .case(2, false)
    .case(-1, false),
])

TestsMap.set('or', or => [
  Test(
    'or sync',
    or([
      number => number % 2 == 1,
      number => number > 0,
    ]))
    .case(0, false)
    .case(1, true)
    .case(2, true),

  Test(
    'or async',
    or([
      async number => number % 2 == 1,
      async number => number > 0,
    ]))
    .case(0, false)
    .case(1, true)
    .case(2, true),
])

TestsMap.set('not', not => [
  Test(
    'not sync',
    not(number => number == 1))
    .case(0, true)
    .case(1, false)
    .case(2, true),

  Test(
    'not async',
    not(async number => number == 1))
    .case(0, true)
    .case(1, false)
    .case(2, true),
])

TestsMap.set('any', any => [
  Test(
    'any sync',
    any(number => number == 1))
    .case([1, 2, 3], true)
    .case([4, 5, 6], false)
    .case({ a: 1, b: 2, c: 3 }, true)
    .case({ d: 4, e: 5, f: 6 }, false)
    .case(null, false)
    .case(new Set([1, 2, 3]), true)
    .case(new Set([4, 5, 6]), false)
    .case((function* yield123() {
      yield 1; yield 2; yield 3
    })(), true)
    .case((async function* asyncYield123() {
      yield 1; yield 2; yield 3
    })(), true)
    .case((function* yield123() {
      yield 4; yield 5; yield 6
    })(), false)
    .case((async function* asyncYield123() {
      yield 4; yield 5; yield 6
    })(), false),

  Test(
    'any async',
    any(number => number == 1))
    .case([1, 2, 3], true)
    .case([4, 5, 6], false)
    .case({ a: 1, b: 2, c: 3 }, true)
    .case({ d: 4, e: 5, f: 6 }, false)
    .case(null, false)
    .case(new Set([1, 2, 3]), true)
    .case(new Set([4, 5, 6]), false)
    .case((function* yield123() {
      yield 1; yield 2; yield 3
    })(), true)
    .case((async function* asyncYield123() {
      yield 1; yield 2; yield 3
    })(), true)
    .case((function* yield123() {
      yield 4; yield 5; yield 6
    })(), false)
     .case({ a: 1, b: 2, c: 3 }, true)
    .case({ d: 4, e: 5, f: 6 }, false)
   .case((async function* asyncYield123() {
      yield 4; yield 5; yield 6
    })(), false),
])

TestsMap.set('all', all => [
  Test(
    'all sync',
    all(number => number == 1))
    .case([1, 1, 1], true)
    .case([1, 2, 3], false)
    .case({ a: 1, b: 1, c: 1 }, true)
    .case({ d: 1, e: 2, f: 3 }, false)
    .case(null, false)
    .case(new Set([1, 1, 1]), true)
    .case(new Set([1, 2, 3]), false)
    .case((function* yield123() {
      yield 1; yield 1; yield 1
    })(), true)
    .case((async function* asyncYield123() {
      yield 1; yield 1; yield 1
    })(), true)
    .case((function* yield123() {
      yield 1; yield 2; yield 3
    })(), false)
    .case((async function* asyncYield123() {
      yield 1; yield 2; yield 3
    })(), false),

  Test(
    'all async',
    all(async number => number == 1))
    .case([1, 1, 1], true)
    .case([1, 2, 3], false)
    .case({ a: 1, b: 1, c: 1 }, true)
    .case({ d: 1, e: 2, f: 3 }, false)
    .case(null, false)
    .case(new Set([1, 1, 1]), true)
    .case(new Set([1, 2, 3]), false)
    .case((function* yield123() {
      yield 1; yield 1; yield 1
    })(), true)
    .case((async function* asyncYield123() {
      yield 1; yield 1; yield 1
    })(), true)
    .case((function* yield123() {
      yield 1; yield 2; yield 3
    })(), false)
    .case((async function* asyncYield123() {
      yield 1; yield 2; yield 3
    })(), false),
])

TestsMap.set('eq', eq => [
  Test(
    'eq',
    eq(1, value => value),
    eq(1, async value => value),
    eq(value => value, 1),
    eq(async value => value, 1))
    .case(1, true)
    .case(0, false)
])

TestsMap.set('gt', gt => [
  Test(
    'gt',
    gt(1, value => value),
    gt(1, async value => value),
    gt(() => 1, value => value),
    gt(() => 1, async value => value))
    .case(0, true)
    .case(1, false)
    .case(2, false)
])

TestsMap.set('lt', lt => [
  Test(
    'lt',
    lt(1, value => value),
    lt(1, async value => value),
    lt(() => 1, value => value),
    lt(() => 1, async value => value))
    .case(2, true)
    .case(1, false)
    .case(0, false)
])

TestsMap.set('gte', gte => [
  Test(
    'gte',
    gte(1, value => value),
    gte(1, async value => value),
    gte(() => 1, value => value),
    gte(() => 1, async value => value))
    .case(0, true)
    .case(1, true)
    .case(2, false)
])

TestsMap.set('lte', lte => [
  Test(
    'lte',
    lte(1, value => value),
    lte(1, async value => value),
    lte(() => 1, value => value),
    lte(() => 1, async value => value))
    .case(2, true)
    .case(1, true)
    .case(0, false)
])

TestsMap.set('thunkify', thunkify => [
  Test(
    'thunkify',
    thunkify(value => value, 10))
    .case(1, 10)
    .case(null, 10)
    .case(undefined, 10)
])

TestsMap.set('always', always => [
  Test(
    'always',
    always(10))
    .case(1, 10)
    .case(null, 10)
    .case(undefined, 10)
])

TestsMap.set('curry', curry => [
  Test(
    'curry',
    curry(function add (a, b) { return a + b }, __, 1),
    curry(function add (a, b) { return a + b }, 1, __))
    .case(2, 3)
])


TestsMap.set('curry.arity', curryArity => [
  Test(
    'curry.arity',
    curryArity(2, function add (a, b) { return a + b }, __, 1),
    curryArity(2, function add (a, b) { return a + b }, 1, __))
    .case(2, 3)
])

TestsMap.set('__', __ => [
  Test('__', () => __)
    .case(null, __ => {
      assert.strictEqual(typeof __, 'symbol')
    })
])

TestsMap.set('defaultsDeep', defaultsDeep => [
  Test(
    'defaultsDeep',
    defaultsDeep({ a: 1, b: [1, 2, { c: 3 }] }))
    .case({}, { a: 1, b: [1, 2, { c: 3 }] })
    .case({ a: 2 }, { a: 2, b: [1, 2, { c: 3 }] })
    .case({ a: 1, b: [] }, { a: 1, b: [1, 2, { c: 3 }] })
    .case({ a: 1, e: 5 }, { a: 1, b: [1, 2, { c: 3 }], e: 5 })
    .case({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2, { c: 3 }] })
    .case({ a: 1, b: [1, 2, {}] }, { a: 1, b: [1, 2, { c: 3 }] })
    .case({ a: 1, b: [1, 2, { c: 2 }] }, { a: 1, b: [1, 2, { c: 2 }] })
    .case({ a: 1, b: [1, 2, { c: 3 }] }, { a: 1, b: [1, 2, { c: 3 }] })
])

TestsMap.set('differenceWith', differenceWith => [
  Test(
    'differenceWith strictEqual',
    differenceWith((a, b) => a === b, [1, 2, 3, 4, 5]))
    .case([1, 2, 3, 4, 5], [])
    .case([1], [2, 3, 4, 5])
    .case([1, 2], [3, 4, 5])
    .case([1, 2, 3], [4, 5])
    .case([1, 2, 3, 4], [5])
    .case([], [1, 2, 3, 4, 5])
    .throws('', TypeError(' is not an Array'))
    .throws(null, TypeError('null is not an Array')),

  Test(
    'differenceWith strictEqual',
    differenceWith(async (a, b) => a === b, [1, 2, 3, 4, 5]))
    .case([1, 2, 3, 4, 5], [])
    .case([1], [2, 3, 4, 5])
    .case([1, 2], [3, 4, 5])
    .case([1, 2, 3], [4, 5])
    .case([1, 2, 3, 4], [5])
    .case([], [1, 2, 3, 4, 5])
    .throws('', TypeError(' is not an Array'))
    .throws(null, TypeError('null is not an Array')),

    Test(
      'differenceWith strictEqual variadicA',
      differenceWith((a, b) => a === b ? Promise.resolve(true) : false, [1, 2, 3, 4, 5]))
      .case([1, 2, 3, 4, 5], [])
      .case([1], [2, 3, 4, 5])
      .case([1, 2], [3, 4, 5])
      .case([1, 2, 3], [4, 5])
      .case([1, 2, 3, 4], [5])
      .case([], [1, 2, 3, 4, 5])
      .throws('', TypeError(' is not an Array'))
      .throws(null, TypeError('null is not an Array'))
])

TestsMap.set('find', find => [
  Test(
    'find sync',
    find(number => number == 1))
    .case([1, 2, 3], 1)
    .case([], undefined)
    .case(new Set([1, 2, 3]), 1)
    .case(new Set(), undefined)
    .case((function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), 1)
    .case((function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(2, 5), undefined)
    .case((async function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), 1)
    .case((async function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(2, 5), undefined)
    .case({ find: () => 'hey' }, 'hey')
    .case({ a: 1, b: 2, c: 3 }, 1)
    .case({}, undefined),

  Test(
    'find async',
    find(async number => number == 1))
    .case([1, 2, 3], 1)
    .case([], undefined)
    .case(new Set([1, 2, 3]), 1)
    .case(new Set(), undefined)
    .case((function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), 1)
    .case((function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(2, 5), undefined)
    .case((async function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(1, 6), 1)
    .case((async function* range(from, to) {
      for (let i = from; i < to; i++) {
        yield i
      }
    })(2, 5), undefined)
    .case({ find: () => 'hey' }, 'hey')
    .case({ a: 1, b: 2, c: 3 }, 1)
    .case({}, undefined),
])

TestsMap.set('first', first => [
  Test('first', first)
    .case([1, 2, 3], 1)
    .case('abc', 'a')
    .case(null, undefined)
    .case(undefined, undefined)
])

TestsMap.set('flatten', flatten => [
  Test('flatten', flatten)
    .case([[1], [2], [3]], [1, 2, 3])
    .case([1, 2, 3], [1, 2, 3])
    .case(null, null)
    .case(new Set([[1], [2], [3]]), new Set([1, 2, 3]))
    .case({ a: { a: 1 }, b: { b: 2 }, c: { c: 3 } }, { a: 1, b: 2, c: 3 }),
])

TestsMap.set('forEach', forEach => [
  Test('forEach sync', forEach(function noop() {}))
    .case([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])
    .case(function add(a, b) { return a + b }, add => {
      assert.strictEqual([1, 2, 3, 4, 5].reduce(add, 0), 15)
    }),

  Test('forEach async', forEach(function noop() {}))
    .case([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])
    .case(async function add(a, b) { return a + b }, async asyncAdd => {
      assert.strictEqual(await reduce(asyncAdd, 0)([1, 2, 3, 4, 5]), 15)
    }),
])

TestsMap.set('groupBy', groupBy => [
  Test('groupBy property', groupBy('age'))
    .case(
      [{ age: 21 }, { age: 22 }, { age: 21 }, { age: 23 }, { age: 21 }],
      new Map([
        [21, [{ age: 21 }, { age: 21 }, { age: 21 }]],
        [22, [{ age: 22 }]],
        [23, [{ age: 23 }]],
      ]))
    .case(
      new Set([{ age: 21 }, { age: 22 }, { age: 21 }, { age: 23 }, { age: 21 }]),
      new Map([
        [21, [{ age: 21 }, { age: 21 }, { age: 21 }]],
        [22, [{ age: 22 }]],
        [23, [{ age: 23 }]],
      ])),

  Test('groupBy resolver', groupBy(object => object.age))
    .case(
      [{ age: 21 }, { age: 22 }, { age: 21 }, { age: 23 }, { age: 21 }],
      new Map([
        [21, [{ age: 21 }, { age: 21 }, { age: 21 }]],
        [22, [{ age: 22 }]],
        [23, [{ age: 23 }]],
      ]))
    .case(
      new Set([{ age: 21 }, { age: 22 }, { age: 21 }, { age: 23 }, { age: 21 }]),
      new Map([
        [21, [{ age: 21 }, { age: 21 }, { age: 21 }]],
        [22, [{ age: 22 }]],
        [23, [{ age: 23 }]],
      ])),

  Test('groupBy resolver async', groupBy(async object => object.age))
    .case(
      [{ age: 21 }, { age: 22 }, { age: 21 }, { age: 23 }, { age: 21 }],
      new Map([
        [21, [{ age: 21 }, { age: 21 }, { age: 21 }]],
        [22, [{ age: 22 }]],
        [23, [{ age: 23 }]],
      ]))
    .case(
      new Set([{ age: 21 }, { age: 22 }, { age: 21 }, { age: 23 }, { age: 21 }]),
      new Map([
        [21, [{ age: 21 }, { age: 21 }, { age: 21 }]],
        [22, [{ age: 22 }]],
        [23, [{ age: 23 }]],
      ])),
])

TestsMap.set('isDeepEqual', isDeepEqual => [
  Test('isDeepEqual', isDeepEqual)
    .case({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 }, true)
    .case({ a: 1, b: 2, c: 3 }, {}, false)
    .case({ a: 1, b: 2, c: [] }, { a: 1, b: 2, c: [] }, true)
    .case({ a: 1, b: 2, c: [1] }, { a: 1, b: 2, c: [] }, false)
    .case({ a: 1, b: 2, c: [1, { e: 5 }] }, { a: 1, b: 2, c: [1, { e: 5 }] }, true)
    .case({}, {}, true)
    .case([], {}, false)
    .case([], [], true)
    .case(null, null, true)
    .case(undefined, undefined, true)
    .case(undefined, null, false)
])

TestsMap.set('isEmpty', isEmpty => [
  Test('isEmpty', isEmpty)
    .case('', true)
    .case('abc', false)
    .case([], true)
    .case([1, 2, 3], false)
    .case(new Set(), true)
    .case(new Set([1, 2, 3]), false)
    .case(new Map(), true)
    .case(new Map([['a', 1]]), false)
    .case(null, true)
    .case(undefined, true)
])

TestsMap.set('isFunction', isFunction => [
  Test('isFunction', isFunction)
    .case(0, false)
    .case(null, false)
    .case('hey', false)
    .case(() => {}, true)
    .case(function noop() {}, true)
    .case(async function noop() {}, true)
    .case(function* noop() {}, true)
    .case(async function* noop() {}, true)
])

TestsMap.set('isObject', isObject => [
  Test('isObject', isObject)
    .case({ a: 1 }, true)
    .case({}, true)
    .case([], false)
    .case('', false)
    .case('abc', false)
    .case(1, false)
    .case(null, false)
    .case(undefined, false)
])

TestsMap.set('isString', isString => [
  Test('isString', isString)
    .case('abc', true)
    .case('', true)
    .case(String('hey'), true)
    .case(new String('hey'), true)
    .case(0, false)
    .case(null, false)
    .case(undefined, false)
])

TestsMap.set('last', last => [
  Test('last', last)
    .case([1, 2, 3], 3)
    .case('abc', 'c')
    .case(null, undefined)
    .case(undefined, undefined)
])

TestsMap.set('pluck', pluck => [
  Test('pluck', pluck('a'))
    .case([{ a: 1 }, { a: 2 }, { a: 3 }], [1, 2, 3])
    .case([{ a: 1 }, { b: 2 }, { a: 3 }], [1, undefined, 3]),

  Test('pluck', pluck('a.b'))
    .case([{ a: { b: 1 } }, { a: { b: 2 } }, { a: { b: 3 } }], [1, 2, 3]),

  Test('pluck', pluck('a[0]'))
    .case([{ a: [1] }, { a: [2] }, { a: [3] }], [1, 2, 3]),
])

TestsMap.set('size', size => [
  Test('size', size)
    .case('abc', 3)
    .case('', 0)
    .case({ a: 1 }, 1)
    .case({}, 0)
    .case([1, 2, 3], 3)
    .case([], 0)
    .case(new Set([1, 2, 3]), 3)
    .case(new Set(), 0)
    .case(new Map([[1, 2]]), 1)
    .case(new Map(), 0)
    .case(null, 0)
    .case(undefined, 0)
    .case(1, 1)
])

TestsMap.set('trace', trace => [
  Test('trace', trace)
    .case('hey', 'hey')
    .case(1, 1)
    .case(null, null)
    .case(undefined, undefined)
    .case(object => object.a, traceResolver => {
      assert.strictEqual(traceResolver({ a: 1 }), 1)
    })
])

TestsMap.set('unionWith', unionWith => [
  Test('unionWith number', unionWith((a, b) => a == b))
    .case([[1, 2, 3], [1, 2, 3]], [1, 2, 3])
    .throws('ayo', TypeError('ayo is not an Array')),

  Test('unionWith namedObject', unionWith((a, b) => a.name == b.name))
    .case([[{ name: 'hey' }, { name: 'ho' }, { name: 'hey' }]], [{ name: 'hey' }, { name: 'ho' }])
    .throws(1, TypeError('1 is not an Array')),
])

TestsMap.set('uniq', uniq => [
  Test('uniq', uniq)
    .case([1, 1, 2, 2, 3, 3], [1, 2, 3])
    .case([1, 2, 3], [1, 2, 3])
    .case([3, 3, 3, 3, 3, 2, 2, 1], [3, 2, 1])
    .case([3, 3, 3, 3, 3, 1, 2, 2, 1], [3, 1, 2])
    .throws(1, Error('uniq(arr): arr is not an array'))
])

const Foo = function () {
  this.a = 1;
  this.b = 2;
}
Foo.prototype.c = 3;

TestsMap.set('values', values => [
  Test(values)
    .case([1, 2, 3], [1, 2, 3])
    .case([], [])
    .case({ a: 1, b: 2, c: 3 }, [1, 2, 3])
    .case({}, [])
    .case(new Set([1, 2, 3]), [1, 2, 3])
    .case(new Set(), [])
    .case(new Map([[1, 1], [2, 2], [3, 3]]), [1, 2, 3])
    .case(new Map(), [])
    .case('hey', ['h', 'e', 'y'])
    .case(10, [])
    .case(new Foo(), [1, 2])
    .case(null, [])
    .case(undefined, [])
])

async function runTestSeries({ name, path }) {
  const Tests = TestsMap.get(name)
  if (Tests == null) {
    return
  }
  const func = require(path)
  for (const test of Tests(func)) {
    await test()
  }
  for (const property in func) {
    const Tests = TestsMap.get(`${name}.${property}`)
    if (Tests == null) {
      continue
    }
    for (const test of Tests(func[property])) {
      await test()
    }
  }
}

;(async function main() {
  for (const name of Object.keys(require('./rubico'))) {
    await runTestSeries({ name, path: `./${name}` })
  }
  for (const name of Object.keys(require('./rubico'))) {
    await runTestSeries({ name, path: `./dist/${name}.min` })
  }
  for (const name of Object.keys(require('./rubico'))) {
    await runTestSeries({ name, path: `./dist/${name}` })
  }
  for (const name of Object.keys(require('./rubico'))) {
    await runTestSeries({ name, path: `./dist/${name}.min` })
  }
  for (const name of Object.keys(require('./x'))) {
    await runTestSeries({ name, path: `./x/${name}` })
  }
  for (const name of Object.keys(require('./x'))) {
    await runTestSeries({ name, path: `./dist/x/${name}.min` })
  }
  for (const name of Object.keys(require('./x'))) {
    await runTestSeries({ name, path: `./dist/x/${name}` })
  }
  for (const name of Object.keys(require('./x'))) {
    await runTestSeries({ name, path: `./dist/x/${name}.min` })
  }
})()
