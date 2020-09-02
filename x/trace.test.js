const assert = require('assert')
const trace = require('./trace')

describe('trace', () => {
  it('logs input to console, returning input', async () => {
    assert.strictEqual(trace('hey'), 'hey')
  })
  it('lazy trace', async () => {
    let logged = ''
    const lazyTrace = trace(value => (logged = `hello ${value}`))
    assert.equal(typeof lazyTrace, 'function')
    lazyTrace('world')
    assert.strictEqual(logged, 'hello world')
  })
  it('lazy trace async', async () => {
    let logged = ''
    const lazyTrace = trace(async value => (logged = `hello ${value}`))
    assert.equal(typeof lazyTrace, 'function')
    const p = lazyTrace('world')
    assert(p instanceof Promise)
    await p
    assert.strictEqual(logged, 'hello world')
  })
})
