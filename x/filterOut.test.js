const assert = require('assert')
const filterOut = require('./filterOut')

describe('filterOut', () => {
  it('rejects values that test true by the predicate from an array', () => {
    const rejectOdds = filterOut(number => number % 2 == 1)
    assert.deepEqual(
      rejectOdds([1, 2, 3, 4, 5]),
      [2, 4],
    )
    assert.deepEqual(
      rejectOdds([]),
      [],
    )
  })

  it('rejects values that test true by the predicate from an object', () => {
    const rejectOdds = filterOut(number => number % 2 == 1)
    assert.deepEqual(
      rejectOdds({ a: 1, b: 2, c: 3 }),
      { b: 2 },
    )
  })

  it('rejects values that test true by the predicate from a set', () => {
    const rejectOdds = filterOut(number => number % 2 == 1)
    assert.deepEqual(
      rejectOdds(new Set([1, 2, 3, 4, 5])),
      new Set([2, 4]),
    )
  })

  it('rejects values that test true by the predicate from a map', () => {
    const rejectOdds = filterOut(number => number % 2 == 1)
    assert.deepEqual(
      rejectOdds(new Map([['a', 1], ['b', 2], ['c', 3]])),
      new Map([['b', 2]]),
    )
  })

  it('creates a rejecting generator function when passed a generator', () => {
    const rejectOdds = filterOut(number => number % 2 == 1)
    const oddsRejectingGenerator = rejectOdds((function* (array) {
      for (const value of array) {
        yield value
      }
    })([1, 2, 3, 4, 5]))
    const evensArray = []
    for (const number of oddsRejectingGenerator) {
      evensArray.push(number)
    }
    assert.deepEqual(evensArray, [2, 4])
  })

  it('creates a rejecting generator function when passed an async generator', async () => {
    const asyncRejectOdds = filterOut(async number => number % 2 == 1)
    const oddsRejectingGenerator = asyncRejectOdds((async function* (array) {
      for (const value of array) {
        yield value
      }
    })([1, 2, 3, 4, 5]))
    const evensArray = []
    for await (const number of oddsRejectingGenerator) {
      evensArray.push(number)
    }
    assert.deepEqual(evensArray, [2, 4])
  })
})
