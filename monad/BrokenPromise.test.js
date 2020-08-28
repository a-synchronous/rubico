const assert = require('assert')
const BrokenPromise = require('./BrokenPromise')

const nativeObjectToString = Object.prototype.toString

const objectToString = value => nativeObjectToString.call(value)

describe('BrokenPromise', () => {
  it('new BrokenPromise() -> BrokenPromise', async () => {
    const bp = new BrokenPromise()
    assert.strictEqual(bp.constructor, BrokenPromise)
    bp.resolve()
  })

  it('(bp = new BrokenPromise()).then(any=>(result any)) -> Promise<result>; bp.resolve(1)', async () => {
    const bp = new BrokenPromise()
    let number = 0
    bp.then(res => (number += res))
    await bp.resolve(1)
    assert.strictEqual(number, 1)
  })
})
