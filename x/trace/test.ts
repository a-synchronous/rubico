import { assert } from 'chai'
import trace from '.'

describe('trace', () => {
  it('logs input to console, returning input', async () => {
    assert.strictEqual(trace('hey'), 'hey')
  })
})
