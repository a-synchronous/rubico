const PossiblePromise = require('./PossiblePromise')
const assert = require('assert')

describe('PossiblePromise', () => {
  describe('new PossiblePromise(p Promise|any) -> PossiblePromise', () => {
    it('p nonPromise', async () => {
      const pp = new PossiblePromise('hey')
      assert.strictEqual(pp.constructor, PossiblePromise)
      assert.strictEqual(pp.value, 'hey')
    })
    it('p Promise', async () => {
      const pp = new PossiblePromise(Promise.resolve('hey'))
      assert.strictEqual(pp.constructor, PossiblePromise)
      assert(pp.value instanceof Promise)
    })
  })

  describe('new PossiblePromise(p Promise|any).then(f function)', () => {
    it('p nonPromise; calls f with p', async () => {
      const pp = new PossiblePromise(10)
      const f = number => number ** 2
      assert.strictEqual(pp.then(f), 100)
    })
    it('p Promise; supplies f to p.then', async () => {
      const pp = new PossiblePromise(Promise.resolve(10))
      assert(pp.then(number => number ** 2) instanceof Promise)
      assert.strictEqual(await pp.then(number => number ** 2), 100)
    })
  })

  describe('PossiblePromise.then(p Promise|any, f function)', () => {
    it('p nonPromise; calls f with nonPromise', async () => {
      assert.strictEqual(PossiblePromise.then(10, number => number ** 2), 100)
    })
    it('p Promise, supplies f to p.then', async () => {
      assert(PossiblePromise.then(Promise.resolve(10), number => number ** 2) instanceof Promise)
      assert.strictEqual(
        await PossiblePromise.then(Promise.resolve(10), number => number ** 2),
        100,
      )
    })
  })

  describe('PossiblePromise.catch(p Promise|any, catcher function)', () => {
    it('p nonPromise; noops, returns p', async () => {
      assert.strictEqual(PossiblePromise.catch(1, console.error), 1)
    })
    it('p Promise; supplies catcher to p.catch', async () => {
      const err = PossiblePromise.catch(
        Promise.reject(new Error('hey')),
        err => err,
      )
      assert.strictEqual((await err).message, 'hey')
    })
  })

  describe('PossiblePromise.all(ps Array<Promise|any>) -> Promise', () => {
    it('ps has some Promises; calls Promise.all', async () => {
      const ps = [Promise.resolve('hey'), 'ho', 'hi']
      assert(PossiblePromise.all(ps) instanceof Promise)
      assert.deepEqual(await PossiblePromise.all(ps), ['hey', 'ho', 'hi'])
    })
    it('ps has no Promises; returns PossiblePromise', async () => {
      const ps = ['hey', 'ho', 'hi']
      assert(typeof PossiblePromise.all(ps).then === 'function')
      assert.deepEqual(await PossiblePromise.all(ps), ps)
    })
  })

  describe('PossiblePromise.args(f function)', () => {
    it('resolves any Promises passed as arguments to f', async () => {
      const add = (a, b) => a + b
      assert(
        PossiblePromise.args(add)(Promise.resolve(1), 2) instanceof Promise,
      )
      assert.strictEqual(
        await PossiblePromise.args(add)(Promise.resolve(1), 2),
        3,
      )
    })
    it('behaves synchronously for no Promise arguments', async () => {
      const add = (a, b) => a + b
      assert.strictEqual(
        PossiblePromise.args(add)(1, 2),
        3,
      )
    })
  })
})
