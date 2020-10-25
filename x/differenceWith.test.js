const assert = require('assert')
const ThunkTest = require('thunk-test')
const differenceWith = require('./differenceWith')

describe('differenceWith', () => {
  it(
    'differenceWith strictEqual',
    ThunkTest(
      'differenceWith strictEqual',
      differenceWith((a, b) => a === b, [1, 2, 3, 4, 5]))
      .case([1, 2, 3, 4, 5], [])
      .case([1], [2, 3, 4, 5])
      .case([1, 2], [3, 4, 5])
      .case([1, 2, 3], [4, 5])
      .case([1, 2, 3, 4], [5])
      .case([], [1, 2, 3, 4, 5])
      .throws('', TypeError(' is not an Array'))
      .throws(null, TypeError('null is not an Array'))
  )

  it(
    'differenceWith strictEqual async',
    ThunkTest(
      'differenceWith strictEqual async',
      differenceWith(async (a, b) => a === b, [1, 2, 3, 4, 5]))
      .case([1, 2, 3, 4, 5], [])
      .case([1], [2, 3, 4, 5])
      .case([1, 2], [3, 4, 5])
      .case([1, 2, 3], [4, 5])
      .case([1, 2, 3, 4], [5])
      .case([], [1, 2, 3, 4, 5])
      .throws('', TypeError(' is not an Array'))
      .throws(null, TypeError('null is not an Array'))
  )

  it(
    'differenceWith strictEqual variadicA',
    ThunkTest(
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
  )

  it(
    'differenceWith strictEqual variadicA',
    ThunkTest(
      'differenceWith strictEqual variadicA',
      differenceWith((a, b) => a === b ? true : Promise.resolve(false), [1, 2, 3, 4, 5]))
      .case([1, 2, 3, 4, 5], [])
      .case([1], [2, 3, 4, 5])
      .case([1, 2], [3, 4, 5])
      .case([1, 2, 3], [4, 5])
      .case([1, 2, 3, 4], [5])
      .case([], [1, 2, 3, 4, 5])
      .throws('', TypeError(' is not an Array'))
      .throws(null, TypeError('null is not an Array'))
  )
})
