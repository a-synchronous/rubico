const assert = require('assert')
const keys = require('./keys')

describe('keys', () => {
  it('grabs keys off an Object', async () => {
    assert.deepEqual(keys({ a: 1, b: 2, c: 3 }), ['a', 'b', 'c'])
    assert.deepEqual(keys({}), [])
  })
  it('grabs keys off a Map', async () => {
    const m = new Map()
    m.set('a', 1)
    m.set('b', 2)
    m.set('c', 3)
    assert.deepEqual(keys(m), ['a', 'b', 'c'])
    const p = new Map()
    assert.deepEqual(keys(p), [])
  })
  it('grabs values (keys) for a Set', async () => {
    assert.deepEqual(keys(new Set(['a', 'b', 'c'])), ['a', 'b', 'c'])
    assert.deepEqual(keys(new Set([1, 2, 3])), [1, 2, 3])
  })
  it('grabs keys as an array of indices', async () => {
    assert.deepEqual(keys(['a', 'b', 'c']), [0, 1, 2])
    assert.deepEqual(keys([]), [])
    assert.deepEqual(keys('abc'), [0, 1, 2])
    assert.strictEqual(keys('abc')[0], '0')
    assert.deepEqual(keys(''), [])
  })
  it('[] for nullish', async () => {
    assert.deepEqual(keys(null), [])
    assert.deepEqual(keys(undefined), [])
    assert.deepEqual(keys(), [])
  })
  const Foo = function () {
    this.a = 1
    this.b = 2
  }
  Foo.prototype.toString = () => '[object Foo]'
  Foo.prototype.c = 3
  it('only direct properties (no prototype)', async () => {
    assert.deepEqual(keys(new Foo()), ['a', 'b'])
  })
})
