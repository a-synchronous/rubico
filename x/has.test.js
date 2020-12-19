const Test = require('thunk-test')
const assert = require('assert')
const has = require('./has')

describe('has', () => {
  it(
    'checks if a value has a key',
    Test(has)
    .case('b', hasB => {
      assert.strictEqual(hasB(new Set(['a', 'b', 'c'])), true)
      assert.strictEqual(hasB(new Set(['a', 'c'])), false)
      assert.strictEqual(hasB(new Map([['a', 1], ['b', 2], ['c', 3]])), true)
      assert.strictEqual(hasB(new Map([['a', 1], ['c', 3]])), false)
      assert.strictEqual(hasB({ a: 1, b: 2, c: 3 }), true)
      assert.strictEqual(hasB({ a: 1, c: 3 }), false)
      assert.strictEqual(hasB(null), false)
      assert.strictEqual(hasB(15), false)
    })
  )
})
