const Test = require('thunk-test')
const assert = require('assert')
const includes = require('./includes')

describe('includes', () => {
  it(
    'checks if a value includes another value',
    Test(includes)
    .case(5, includes5 => {
      assert.strictEqual(includes5([1, 2, 3, 4, 5]), true)
      assert.strictEqual(includes5([1, 2, 3]), false)
      assert.strictEqual(includes5({ a: 1, b: 2, c: 3, d: 4, e: 5 }), true)
      assert.strictEqual(includes5({ a: 1, b: 2, c: 3 }), false)
      assert.strictEqual(includes5(null), false)
      assert.strictEqual(includes5(15), false)
    })
  )
})
