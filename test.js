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
    it('throws a meaningful error on non functions', async () => {
      assert.throws(
        () => {
          r.flow(() => 1, undefined, () => 2)
        },
        new TypeError('undefined [1] is not a function'),
      )
    })
  })
})
