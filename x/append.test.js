const assert = require('assert')
const append = require('./append')

const fruits = ['apple', 'banana']

describe('append', () => {
  it('array array', async () => {
    const result = append(['lemon', 'papaya'])(fruits)
    assert.deepEqual(result, ['apple', 'banana', 'lemon', 'papaya'])
  })
  it('string array', async () => {
    const result = append('lemon')(fruits)
    assert.deepEqual(result, ['apple', 'banana', 'lemon'])
  })
  it('string string', async () => {
    const result = append('world')('hello ')
    assert.deepEqual(result, 'hello world')
  })
  it('fail when value is an object', async () => {
    assert.throws(() => append('hello ')({}), new TypeError('[object Object] is not an Array or string'))
  })
  it('fails with object and string', async () => {
    assert.throws(() => append({})('world'), new TypeError('[object Object] is not a string'
    ))

  })
})
