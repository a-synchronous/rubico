const assert = require('assert')
const forEach = require('./forEach')

describe('forEach', () => {
  it('execute a function for each item of a collection, returning the collection', async () => {
    let total = 0
    assert.deepEqual(
      forEach(number => total += number)([1, 2, 3]),
      [1, 2, 3],
    )
    assert.strictEqual(total, 6)
  })
  it('works in transducer position', async () => {
    let total = 0
    assert.deepEqual(
      [1, 2, 3].reduce(
        forEach(number => total += number)((a, b) => a.concat([b])),
        [],
      ),
      [1, 2, 3],
    )
    assert.strictEqual(total, 6)
    assert.deepEqual(
      [1, 2, 3].reduce(
        forEach(console.log)((a, b) => a + b),
        0,
      ),
      6,
    )
  })
})
