const assert = require('assert')
const unless = require('./unless')

const isEven = num => num % 2 === 0

describe('unless', () => {
  it('happy path', async () => {
    const doubleIfOdd = unless(isEven, num => num * 2)

    assert.strictEqual(doubleIfOdd(100), 100)
    assert.strictEqual(doubleIfOdd(101), 202)
  })

  it('async happy path', async () => {
    const asyncIsEven = async num => num % 2 == 0
    const asyncDoubleIfOdd = unless(asyncIsEven, num => num * 2)

    assert.strictEqual(await asyncDoubleIfOdd(100), 100)
    assert.strictEqual(await asyncDoubleIfOdd(101), 202)
  })
})
