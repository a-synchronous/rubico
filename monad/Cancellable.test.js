const assert = require('assert')
const Cancellable = require('./Cancellable')

describe('Cancellable', () => {
  describe('Cancellable(func ...any=>Promise|any) -> ...any=>CancellablePromise|any', () => {
    const createInfinitePromise = () => Promise.race([])
    it('func ()=>Promise', async () => {
      const createCancellablePromise = Cancellable(createInfinitePromise)
      const cancellablePromise = createCancellablePromise()
      assert.strictEqual(cancellablePromise.cancel.name, 'cancel')
      cancellablePromise.cancel(new Error('cancelled'))
      assert.strictEqual(cancellablePromise.cancel.name, 'noop')
      try {
        await cancellablePromise
        throw new Error('unreachable')
      } catch (err) {
        assert.strictEqual(err.message, 'cancelled')
      }
    })
    it('func any=>any', async () => {
      const identity = Cancellable(value => value)
      assert.strictEqual(identity(null), null)
    })
  })
})
