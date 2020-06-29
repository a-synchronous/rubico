const assert = require('assert')
const trace = require('./trace')

describe('trace.js', () => {
  it('logs input to console, returning input', async () => {
    assert.strictEqual(trace('hey'), 'hey')
  })
})
