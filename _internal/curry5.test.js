const assert = require('assert')
const curry5 = require('./curry5')
const __ = require('./placeholder')

describe('curry5', () => {
  const func = function (a, b, c, d, e) {
    return [a, b, c, d, e]
  }
  it('resolves arguments in __ position for arg0', async () => {
    const curried = curry5(func, __, 1, 2, 3, 4)
    assert.deepEqual(curried(5), [5, 1, 2, 3, 4])
  })
  it('resolves arguments in __ position for arg1', async () => {
    const curried = curry5(func, 1, __, 2, 3, 4)
    assert.deepEqual(curried(5), [1, 5, 2, 3, 4])
  })
  it('resolves arguments in __ position for arg2', async () => {
    const curried = curry5(func, 1, 2, __, 3, 4)
    assert.deepEqual(curried(5), [1, 2, 5, 3, 4])
  })
  it('resolves arguments in __ position for arg3', async () => {
    const curried = curry5(func, 1, 2, 3, __, 4)
    assert.deepEqual(curried(5), [1, 2, 3, 5, 4])
  })
  it('resolves arguments in __ position for arg4', async () => {
    const curried = curry5(func, 1, 2, 3, 4, __)
    assert.deepEqual(curried(5), [1, 2, 3, 4, 5])
  })
})
