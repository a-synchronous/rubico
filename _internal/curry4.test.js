const assert = require('assert')
const curry4 = require('./curry4')
const __ = require('./placeholder')

describe('curry4', () => {
  const func = function (a, b, c, d) {
    return [a, b, c, d]
  }
  it('resolves arguments in __ position for arg0', async () => {
    const curried = curry4(func, __, 1, 2, 3)
    assert.deepEqual(curried(4), [4, 1, 2, 3])
  })
  it('resolves arguments in __ position for arg1', async () => {
    const curried = curry4(func, 1, __, 2, 3)
    assert.deepEqual(curried(4), [1, 4, 2, 3])
  })
  it('resolves arguments in __ position for arg2', async () => {
    const curried = curry4(func, 1, 2, __, 3)
    assert.deepEqual(curried(4), [1, 2, 4, 3])
  })
  it('resolves arguments in __ position for arg3', async () => {
    const curried = curry4(func, 1, 2, 3, __)
    assert.deepEqual(curried(4), [1, 2, 3, 4])
  })
})
