const assert = require('assert')
const Transducer = require('./Transducer')
const compose = require('./compose')
const reduce = require('./reduce')
const transform = require('./transform')

describe('Transducer', () => {
  const ade = assert.deepEqual
  const ase = assert.strictEqual
  const aok = assert.ok

  describe('integration: transducers from Transducer.map, Transducer.filter, Transducer.flatMap', () => {
    const concat = (y, xi) => y.concat(xi)
    const add = (y, xi) => y + xi
    const isOdd = number => number % 2 == 1

    it('reduce with sync transduced reducers', async () => {
      const squareOdds = compose([
        Transducer.filter(isOdd),
        Transducer.map(x => x ** 2),
      ])
      ade(
        reduce(squareOdds(concat), [])([1, 2, 3, 4, 5]),
        [1, 9, 25],
      )
      ade(
        reduce(squareOdds((y, xi) => y.add(xi)), new Set())([1, 2, 3, 4, 5]),
        new Set([1, 9, 25]),
      )
      const appendAlphas = compose([
        Transducer.map(x => `${x}a`),
        Transducer.map(x => `${x}b`),
        Transducer.map(x => `${x}c`),
      ])
      ase(
        reduce(appendAlphas(add), '')('123'),
        '1abc2abc3abc',
      )
      ade(
        reduce(appendAlphas(concat), [])('123'),
        ['1abc', '2abc', '3abc'],
      )
    })

    it('reduce with an async transduced reducer', async () => {
      const hosWithHey = compose([
        Transducer.filter(async x => x === 'ho'),
        Transducer.map(x => Promise.resolve(`${x}hey`)),
      ])
      const hihos = { a: 'hi', b: 'ho', c: 'hi', d: 'ho', e: 'hi', f: 'ho' }
      aok(reduce(hosWithHey(add), '')(hihos) instanceof Promise),
      aok(reduce(hosWithHey(concat), [])(hihos) instanceof Promise),
      ase(
        await reduce(hosWithHey(add), '')(hihos),
        'hoheyhoheyhohey',
      )
      ade(
        await reduce(hosWithHey(concat), [])(hihos),
        ['hohey', 'hohey', 'hohey'],
      )
    })

    it('flatMapping transducer', async () => {
      const createOddMultiplesSync = compose([
        Transducer.filter(isOdd),
        Transducer.flatMap(number => [number * 2, number * 3]),
      ])

      ase(
        reduce([1, 2, 3], createOddMultiplesSync(add), 0),
        2 + 3 + 6 + 9,
      )
      ade(
        reduce([1, 2, 3], createOddMultiplesSync(concat), []),
        [2, 3, 6, 9],
      )

      const createOddMultiplesAsync = compose([
        Transducer.filter(isOdd),
        Transducer.flatMap(async number => [number * 2, number * 3]),
      ])

      const p1 = reduce([1, 2, 3], createOddMultiplesAsync(add), 0)
      aok(p1 instanceof Promise)
      const p2 = reduce([1, 2, 3], createOddMultiplesAsync(concat), [])
      aok(p2 instanceof Promise)
      await p1.then(result => {
        ase(result, 2 + 3 + 6 + 9)
      })
      await p2.then(result => {
        ade(result, [2, 3, 6, 9])
      })
    })

    it('forEach transducer', async () => {
      let sum1 = 0
      reduce([1, 2, 3, 4, 5], Transducer.forEach(number => {
        sum1 += number
      })(() => {}), null)
      assert.equal(sum1, 15)

      let sum2 = 0
      await reduce([1, 2, 3, 4, 5], Transducer.forEach(async number => {
        sum2 += number
      })(() => {}), null)
      assert.equal(sum2, 15)
    })

    it('passthrough transducer', async () => {
      assert.deepEqual(
        transform({ a: 1, b: 2, c: 3 }, Transducer.passthrough, []),
        [1, 2, 3],
      )
    })
  })

})
