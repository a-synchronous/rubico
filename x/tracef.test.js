const assert = require('assert')
const tracef = require('./tracef')

describe('tracef', () => {
  it('logs transformed input to console, returning input', async () => {
    assert.deepEqual(tracef(x => x[0])(['hey']), ['hey'])
  })
})
