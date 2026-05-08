const LinkedList = require('./LinkedList')
const assert = require('assert')

describe('LinkedList', () => {
  it('integration', async () => {
    const ll = new LinkedList()

    assert.strictEqual(ll.popFirst(), undefined)

    ll.append('value1')
    assert.strictEqual(ll.length, 1)

    assert.strictEqual(ll.popFirst(), 'value1')
    assert.strictEqual(ll.length, 0)
    assert.strictEqual(ll.popFirst(), undefined)
    assert.strictEqual(ll.length, 0)

    ll.append('value1')
    assert.strictEqual(ll.length, 1)
    ll.append('value2')
    assert.strictEqual(ll.length, 2)
    ll.append('value3')
    assert.strictEqual(ll.length, 3)

    assert.strictEqual(ll.popFirst(), 'value1')
    assert.strictEqual(ll.length, 2)
    assert.strictEqual(ll.popFirst(), 'value2')
    assert.strictEqual(ll.length, 1)
    assert.strictEqual(ll.popFirst(), 'value3')
    assert.strictEqual(ll.length, 0)
    assert.strictEqual(ll.popFirst(), undefined)
    assert.strictEqual(ll.length, 0)
  })
})
