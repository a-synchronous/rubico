const assert = require('assert')
const heapUsedInLoop = require('./heapUsedInLoop')

describe('heapUsedInLoop', () => {
  it('heapUsedInLoop(desc string, loopCount number, func (loop number)=>any) -> ()', async () => {
    assert.strictEqual(heapUsedInLoop('', 1, () => 5), undefined)
  })
  it('heapUsedInLoop.async(desc string, loopCount number, func (loop number)=>Promise|any) -> ()', async () => {
    assert.strictEqual(await heapUsedInLoop.async('', 1, async () => 5), undefined)
  })
  it('heapUsedInLoop.skip', async () => {
    assert.strictEqual(heapUsedInLoop.skip('', 1, () => 5), undefined)
  })
  it('heapUsedInLoop.async.skip -> ()', async () => {
    assert.strictEqual(heapUsedInLoop.async.skip('', 1, async () => 5), undefined)
  })
})
