const assert = require('assert')
const findIndex = require('./findIndex')

describe('findIndex', function () {
  it('finds the index in an array of the first item matching a predicate function', async function () {
    const startsWithAAA = string => string.startsWith('AAA')
    {
      const foundIndex = findIndex(startsWithAAA)([
        'BBB',
        'AAB',
        'AAA',
      ])
      assert.equal(foundIndex, 2)

      const notFoundIndex = findIndex(startsWithAAA)([
        'CCC',
        'CCD',
        'EEE',
      ])
      assert.equal(notFoundIndex, -1)
    }

    const startsWithAAAAsync = async string => string.startsWith('AAA')
    {
      const foundIndex = await findIndex(startsWithAAAAsync)([
        'BBB',
        'AAB',
        'AAA',
      ])
      assert.equal(foundIndex, 2)

      const notFoundIndex = await findIndex(startsWithAAAAsync)([
        'CCC',
        'CCD',
        'EEE',
      ])
      assert.equal(notFoundIndex, -1)
    }
  })
})
