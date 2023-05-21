const assert = require('assert')
const curryArgs4 = require('./curryArgs4')
const __ = require('./placeholder')

describe('curryArgs4', () => {
  const func = function (a, b, c, d) {
    return [a, b, c, d]
  }
  it('resolves arguments in __ position for arg0', async () => {
    const curried = curryArgs4(func, __, 1, 2, 3)
    assert.deepEqual(curried(1, 2, 3), [[1, 2, 3], 1, 2, 3])
  })
  it('resolves arguments in __ position for arg1', async () => {
    const curried = curryArgs4(func, 1, __, 2, 3)
    assert.deepEqual(curried(1, 2, 3), [1, [1, 2, 3], 2, 3])
  })
  it('resolves arguments in __ position for arg2', async () => {
    const curried = curryArgs4(func, 1, 2, __, 3)
    assert.deepEqual(curried(1, 2, 3), [1, 2, [1, 2, 3], 3])
  })
  it('resolves arguments in __ position for arg3', async () => {
    const curried = curryArgs4(func, 1, 2, 3, __)
    assert.deepEqual(curried(1, 2, 3), [1, 2, 3, [1, 2, 3]])
  })
})
