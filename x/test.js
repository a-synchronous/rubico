const assert = require('assert')
const x = require('.')

describe('rubico/x', () => {
  it('synopsis: Object<function>', async () => {
    assert.strictEqual(typeof x, 'object')
    assert.strictEqual(x.constructor, Object)
    assert(Object.values(x).every(v => typeof v === 'function'))
  })
})
