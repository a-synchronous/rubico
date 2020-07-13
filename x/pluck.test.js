const assert = require('assert')
const pluck = require('./pluck')

const createAbc = v => ({ a: { b: { c: v } } })

describe('pluck', () => {
  it('creates a new collection by getting a path from every item of an old collection', async () => {
    assert.deepEqual(
      pluck('a.b.c')([1, 2, 3].map(createAbc)),
      [1, 2, 3],
    )
  })
  it('works in transducer position', async () => {
    assert.deepEqual(
      [1, 2, 3].map(createAbc).reduce(
        pluck('a.b.c')((a, b) => a.concat([b])),
        [],
      ),
      [1, 2, 3],
    )
  })
})
