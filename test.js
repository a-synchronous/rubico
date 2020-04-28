const assert = require('assert')
const r = require('.')

const ase = assert.strictEqual

const ade = assert.deepEqual

const hi = x => x + 'hi'

const ho = async x => x + 'ho'

const hey = x => new Promise(res => setTimeout(() => res(x + 'hey'), 10))

describe('rubico', () => {
  describe('flow', () => {
    it('chains async and regular functions together', async () => {
      ase(await r.flow(hi, ho, hey)('yo'), 'yohihohey')
    })
    it('does something without arguments', async () => {
      ase(await r.flow(hi, ho, hey)(), 'undefinedhihohey')
    })
    it('chaining one fn is the same as just calling that fn', async () => {
      ase(await r.flow(hey)('yo'), await hey('yo'))
    })
    it('chaining no fns is identity', async () => {
      ase(await r.flow()('yo'), 'yo')
    })
    it('can be sync', async () => {
      ase(r.flow(hi, hi, hi)('yo'), 'yohihihi')
    })
    it('returns a promise if any fns async', async () => {
      assert.ok(r.flow(hi, hi, hi, hey)('yo') instanceof Promise)
    })
    it('throws a meaningful error on non functions', async () => {
      assert.throws(
        () => {
          r.flow(() => 1, undefined, () => 2)
        },
        new TypeError('undefined [1] is not a function'),
      )
    })
    it('handles sync errors good', async () => {
      assert.throws(
        () => r.flow(hi, hi, x => { throw new Error(`throwing ${x}`) })('yo'),
        new Error('throwing yohihi'),
      )
    })
    it('handles async errors good', async () => {
      assert.rejects(
        () => r.flow(hi, hey, x => { throw new Error(`throwing ${x}`) })('yo'),
        new Error('throwing yohihey'),
      )
    })
  })

  describe('diverge', () => {
    it('parallelizes input to Array', async () => {
      ade(
        await r.diverge([hi, ho, hey])('yo'),
        ['yohi', 'yoho', 'yohey'],
      )
    })
    it('parallelizes input to Object', async () => {
      ade(
        await r.diverge({ a: hi, b: ho, c: hey })('yo'),
        ({ a: 'yohi', b: 'yoho', c: 'yohey' }),
      )
    })
    it('throws TypeError for String', async () => {
      assert.throws(
        () => r.diverge('ayelmao'),
        new TypeError('cannot diverge to String'),
      )
    })
    it('throws TypeError for Set', async () => {
      assert.throws(
        () => r.diverge(new Set([hi])),
        new TypeError('cannot diverge to Set'),
      )
    })
    it('throws TypeError for Map', async () => {
      assert.throws(
        () => r.diverge(new Map([['a', hi]])),
        new TypeError('cannot diverge to Map'),
      )
    })
  })
})
