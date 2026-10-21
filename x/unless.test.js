const assert = require('assert')
const unless = require('./unless')

const isEven = num => num % 2 === 0

describe('unless', () => {
  it('execute a function when a predicate is not true', async () => {
    const doubleIfOdd = unless(isEven, num => num * 2)

    assert.strictEqual(doubleIfOdd(100), 100)
    assert.strictEqual(doubleIfOdd(101), 202)
  })

  it('execute a function when an async predicate is not true', async () => {
    const asyncIsEven = async num => num % 2 == 0
    const asyncDoubleIfOdd = unless(asyncIsEven, num => num * 2)

    assert.strictEqual(await asyncDoubleIfOdd(100), 100)
    assert.strictEqual(await asyncDoubleIfOdd(101), 202)
  })
})
