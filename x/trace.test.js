const assert = require('assert')
const trace = require('./trace')

describe('trace', () => {
  it('logs input to console, returning input', async () => {
    assert.strictEqual(trace('hey'), 'hey')
  })
})
