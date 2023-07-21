const assert = require('assert')
const curryArgs3 = require('./curryArgs3')
const __ = require('./placeholder')

describe('curryArgs3', () => {
  const func = function (a, b, c) {
    return [a, b, c]
  }
  it('resolves arguments in __ position for arg0', async () => {
    const curried = curryArgs3(func, __, 1, 2)
    assert.deepEqual(curried(3), [[3], 1, 2])
  })
  it('resolves arguments in __ position for arg1', async () => {
    const curried = curryArgs3(func, 1, __, 2)
    assert.deepEqual(curried(3), [1, [3], 2])
  })
  it('resolves arguments in __ position for arg2', async () => {
    const curried = curryArgs3(func, 1, 2, __)
    assert.deepEqual(curried(3), [1, 2, [3]])
  })
})
