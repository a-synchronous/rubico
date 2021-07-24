const assert = require('assert')
const unless = require('./unless')

const isEven = num => num % 2 === 0

describe('unless', () => {
  it('happy path', async () => {
    const doubleIfEven = unless(isEven, num => num * 2)

    assert.strictEqual(doubleIfEven(100), 100)
    assert.strictEqual(doubleIfEven(101), 202)
  })

  it('async happy path', async () => {
    const asyncIsEven = async num => num % 2 == 0
    const asyncDoubleIfEven = unless(asyncIsEven, num => num * 2)

    assert.strictEqual(await asyncDoubleIfEven(100), 100)
    assert.strictEqual(await asyncDoubleIfEven(101), 202)
  })
})
