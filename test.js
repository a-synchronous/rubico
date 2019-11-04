const assert = require('assert')
const _ = require('.')

const giveNull = () => null
const giveNullAsync = async () => null
const hi = x => x + 'hi'
const ho = async x => x + 'ho'
const hey = x => new Promise(res => setTimeout(() => res(x + 'hey'), 10))
const add = (a, b) => a + b
const delayedAdd1 = x => new Promise(res => setTimeout(() => res(add(1, x)), 10))
const range = (start, end) => {
  const arr = Array(end - start)
  for (let i = start; i < end; i++) arr[i - start] = i
  return arr
}

describe('rubico', () => {
  describe('_.map', () => {
    it('async a -> b', async () => {
      assert.deepEqual(
        await _.map(delayedAdd1)([1, 2, 3]),
        [2, 3, 4],
      )
      assert.deepEqual(
        await _.map(delayedAdd1)(new Set([1,2,3])),
        new Set([2, 3, 4]),
      )
      assert.deepEqual(
        await _.map(delayedAdd1)(new Map([['a', 1], ['b', 2], ['c', 3]])),
        new Map([['a', 2], ['b', 3], ['c', 4]]),
      )
      assert.deepEqual(
        await _.map(delayedAdd1)({ a: 1, b: 2, c: 3 }),
        { a: 2, b: 3, c: 4 },
      )
    }).timeout(5000)
  })

  describe('_.flow', () => {
    it('chains async and regular functions together', async () => {
      assert.strictEqual(await _.flow(hi, ho, hey)('yo'), 'yohihohey')
    })

    it('does something without arguments', async () => {
      assert.strictEqual(await _.flow(hi, ho, hey)(), 'undefinedhihohey')
    })

    it('chaining one fn is the same as just calling that fn', async () => {
      assert.strictEqual(await _.flow(hey)('yo'), await hey('yo'))
    })

    it('chaining no fns is identity', async () => {
      assert.strictEqual(await _.flow()('yo'), 'yo')
    })
  })

  describe('_.syncFlow', () => {
    it('chains regular functions only', async () => {
      assert.strictEqual(_.syncFlow(hi, hi, hi)('hi'), 'hihihihi')
    })
  })

  describe('_.amp', () => {
    it('executes fns in series like fn && fn ...', async () => {
      assert.strictEqual(await _.amp(hi, ho, hey)('yo'), 'yohihohey')
    })

    it('breaks execution on falsy return', async () => {
      assert.strictEqual(await _.amp(hi, ho, () => null, hey)('yo'), null)
    })

    it('multiple arguments => [...args]', async () => {
      assert.deepEqual(await _.amp((...x) => x)('yo', 'hey'), ['yo', 'hey'])
    })

    it('no fns => x', async () => {
      assert.strictEqual(await _.amp()('yo'), 'yo')
    })
  })

  describe('_.alt', () => {
    it('alternates flow paths based on first not null execution', async () => {
      assert.strictEqual(
        await _.alt(giveNullAsync, giveNull, hey, ho, giveNullAsync)('yo'),
        'yohey',
      )
    })

    it('alternating one fn is the same as calling that fn', async () => {
      assert.strictEqual(await _.alt(hey)('yo'), await hey('yo'))
    })

    it('alternating no fns => undefined', async () => {
      assert.strictEqual(await _.alt()('yo'), undefined)
    })
  })

  describe('_.parallel', () => {
    it('runs fns in parallel', async () => {
      assert.deepEqual(
        await _.parallel(hi, ho, hey)('yo'),
        ['yohi', 'yoho', 'yohey'],
      )
    })

    it('no fns => []', async () => {
      assert.deepEqual(await _.parallel()('yo'), [])
    })
  })

  describe('_.sideEffect', () => {
    it('executes a function but returns arguments', async () => {
      assert.strictEqual(await _.sideEffect(console.log)('hey'), 'hey')
    })

    it('multiple arguments => [...args]', async () => {
      assert.deepEqual(
        await _.sideEffect(console.log)('yo', 'yo'),
        ['yo', 'yo'],
      )
    })
  })

  describe('_.trace', () => {
    it('console logs a tag and args', async () => {
      assert.strictEqual(await _.trace('hey')('hey'), 'hey')
    })
  })

  describe('_.props', () => {
    it('awaits promise props in parallel', async () => {
      assert.deepEqual(
        await _.props({ hey: hey('hey'), ho: ho('ho') }),
        { hey: 'heyhey', ho: 'hoho' },
      )
    })

    it('{} => {}', async () => {
      assert.deepEqual(await _.props({}), {})
    })
  })
})

