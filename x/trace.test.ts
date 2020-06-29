import { assert } from 'chai'
import trace from './trace.ts'

describe('trace', () => {
  it('logs input to console, returning input', async () => {
    assert.strictEqual(trace('hey'), 'hey')
  })
})
