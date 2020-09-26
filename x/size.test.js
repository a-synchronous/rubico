const assert = require('assert')
const size = require('./size')

describe('size', () => {
  describe('size(value any) -> number', () => {
    it('value [1, 2, 3]; 3', async () => {
      assert.strictEqual(size([1, 2, 3]), 3)
    })
    it('value []; 0', async () => {
      assert.strictEqual(size([]), 0)
    })
    it('value { a: 1, b: 2, c: 3 }; 3', async () => {
      assert.strictEqual(size({ a: 1, b: 2, c: 3 }), 3)
    })
    it('value {}; 0', async () => {
      assert.strictEqual(size({}), 0)
    })
    it('value new Set([1, 2, 3]); 3', async () => {
      assert.strictEqual(size(new Set([1, 2, 3])), 3)
    })
    it('value new Set(); 0', async () => {
      assert.strictEqual(size(new Set()), 0)
    })
    it('value new Map([1, 1], [2, 2], [3, 3]); 3', async () => {
      assert.strictEqual(size(new Map([
        [1, 1], [2, 2], [3, 3],
      ])), 3)
    })
    it('value new Map(); 0', async () => {
      assert.strictEqual(size(new Map()), 0)
    })
    it('value \'hey\'; 3', async () => {
      assert.strictEqual(size('hey'), 3)
    })
    it('value \'\'; 0', async () => {
      assert.strictEqual(size(''), 0)
    })
  })
})
