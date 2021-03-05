const assert = require('assert')
const callProp = require('./callProp')

describe('callProp', () => {
  it('calls a property on an object with arguments', async () => {
    const roundedDown = callProp('toFixed', 2)(5.99222222222222222222)
    assert.strictEqual(roundedDown, '5.99')
    assert.strictEqual(callProp('toString')(1), '1')
  })
})
