const assert = require('assert')
const pluck = require('./pluck')

const createAbc = v => ({ a: { b: { c: v } } })

describe('pluck', () => {
  it('creates a new collection by getting a path from every element of an old collection', async () => {
    const nested = [1, 2, 3].map(createAbc)
    assert.deepEqual(
      pluck('a.b.c')(nested),
      [1, 2, 3],
    )
    assert.deepEqual(
      pluck(nested, 'a.b.c'),
      [1, 2, 3],
    )
  })
})
