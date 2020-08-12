const assert = require('assert')
const isFunction = require('./isFunction')

describe('isFunction(x any) -> boolean', () => {
  it('x function; true', async () => {
    assert.strictEqual(isFunction(function(){}), true)
  })
  it('x AsyncFunction; true', async () => {
    assert.strictEqual(isFunction(async function(){}), true)
  })
  it('x ()=>{}; true', async () => {
    assert.strictEqual(isFunction(() => {}), true)
  })
  it('x async ()=>{}; true', async () => {
    assert.strictEqual(isFunction(async () => {}), true)
  })
  it('x GeneratorFunction; true', async () => {
    assert.strictEqual(isFunction(function*(){}), true)
  })
  it('x AsyncGeneratorFunction; true', async () => {
    assert.strictEqual(isFunction(async function*(){}), true)
  })
  it('x 1; false', async () => {
    assert.strictEqual(isFunction(1), false)
  })
  it('x null; false', async () => {
    assert.strictEqual(isFunction(null), false)
  })
  it('x undefined; false', async () => {
    assert.strictEqual(isFunction(undefined), false)
  })
})
