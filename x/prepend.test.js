const assert = require('assert')
const prepend = require('./prepend')

const fruits = ['apple', 'banana']

describe('prepend', () => {
  it('array array', async () => {
    const result = prepend(['lemon', 'papaya'])(fruits)
    assert.deepEqual(result, ['lemon', 'papaya', 'apple', 'banana'])
  })
  it('string array', async () => {
    const result = prepend('lemon')(fruits)
    assert.deepEqual(result, ['lemon', 'apple', 'banana'])
  })
  it('string string', async () => {
    const result = prepend('hello ')('world')
    assert.deepEqual(result, 'hello world')
  })
  it('fail when value is an object', async () => {
    assert.throws(() => prepend('hello ')({}), new TypeError('[object Object] is not an Array or string'))
  })
  it('fails with object and string', async () => {
    assert.throws(() => prepend({})('world'), new TypeError('[object Object] is not a string'
    ))

  })
})
