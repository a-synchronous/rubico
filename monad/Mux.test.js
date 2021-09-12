const assert = require('assert')
const Mux = require('./Mux')

const asyncIteratorToArray = async x => {
  const y = []
  for await (const xi of x) y.push(xi)
  return y
}

describe('Mux', () => {
  describe('new Mux(x Array|Set) -> Mux', () => {
    it('x [1, 2, 3]', async () => {
      assert.deepEqual(new Mux([1, 2, 3]).value, [1, 2, 3])
      assert.deepEqual(new Mux([1, 2, 3]).constructor.name, 'Mux')
    })
    it('x Set<[1, 2, 3]>', async () => {
      assert.deepEqual(new Mux(new Set([1, 2, 3])).value, new Set([1, 2, 3]))
      assert.deepEqual(new Mux(new Set([1, 2, 3])).constructor.name, 'Mux')
    })
    it('x 1; TypeError', async () => {
      assert.throws(
        () => new Mux(1),
        new TypeError('1 is not a Sequence'),
      )
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => new Mux(null),
        new TypeError('null is not a Sequence'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => new Mux(undefined),
        new TypeError('undefined is not a Sequence'),
      )
    })
  })

  describe('Mux.isSequence(x any) -> boolean', () => {
    it('x [1, 2, 3]; true', async () => {
      assert.strictEqual(Mux.isSequence([1, 2, 3]), true)
    })
    it('x Set<[1, 2, 3]>; true', async () => {
      assert.strictEqual(Mux.isSequence(new Set([1, 2, 3])), true)
    })
    it('x Generator; true', async () => {
      assert.strictEqual(Mux.isSequence((function*(){})()), true)
    })
    it('x GeneratorFunction; true', async () => {
      assert.strictEqual(Mux.isSequence(function*(){}), true)
    })
    it('x AsyncGenerator; true', async () => {
      assert.strictEqual(Mux.isSequence((async function*(){})()), true)
    })
    it('x AsyncGeneratorFunction; true', async () => {
      assert.strictEqual(Mux.isSequence(async function*(){}), true)
    })
    it('x 1; false', async () => {
      assert.strictEqual(Mux.isSequence(1), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Mux.isSequence(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Mux.isSequence(undefined), false)
    })
  })

  describe('<T any>Mux.zip(x Sequence<Sequence<T>|T>T) -> y Iterator<Array<T|undefined>>', () => {
    it('Mux.zip(1)', async () => {
      const iter = Mux.zip(1)
      const arr = [...iter]
      assert.deepEqual(arr, [[1]])
    })
    it('Mux.zip(<T any>x Array<Array<T>>) -> y Iterator<Array<T>>', async () => {
      const iter = Mux.zip([
        [1, 2, 3],
        ['a', 'b', 'c'],
      ])
      const transposed = [...iter]
      assert.deepEqual(transposed, [
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
      ])
    })
    it('Mux.zip(<T any>x Array<Iterator<T>>) -> y Iterator<Array<T>>', async () => {
      const generate123 = function*() { yield 1; yield 2; yield 3 }
      const generateABC = function*() { yield 'a'; yield 'b'; yield 'c' }
      const iter = Mux.zip([
        generate123(),
        generateABC(),
      ])
      const transposed = [...iter]
      assert.deepEqual(transposed, [
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
      ])
    })
    it('Mux.zip(<T any>x GeneratorFunction<Array<T>|T>) -> y Iterator<Array<T>>', async () => {
      {
        const iter = Mux.zip(function*() { yield [1]; yield [2]; yield [3]; yield [4]; yield [5]; yield [6] })
        const transposed = [...iter]
        assert.deepEqual(transposed, [[1, 2, 3, 4, 5, 6]])
      }
      {
        const iter = Mux.zip(function*() { yield [1]; yield 2; yield [3]; yield 4; yield [5]; yield 6 })
        const transposed = [...iter]
        assert.deepEqual(transposed, [[1, 2, 3, 4, 5, 6]])
      }
      {
        const iter = Mux.zip(function*() { yield 1; yield 2; yield 3; yield 4; yield 5; yield 6 })
        const transposed = [...iter]
        assert.deepEqual(transposed, [[1, 2, 3, 4, 5, 6]])
      }
    })
    it('WARNING: potentially unexpected behavior - Mux.zip(<T any>x Iterator<Array<T>|T>) -> y Iterator<[]>', async () => {
      {
        const iter = Mux.zip((function*() { yield [1]; yield [2]; yield [3]; yield [4]; yield [5]; yield [6] })())
        const transposed = [...iter]
        assert.deepEqual(transposed, [])
      }
      {
        const iter = Mux.zip((function*() { yield [1]; yield 2; yield [3]; yield 4; yield [5]; yield 6 })())
        const transposed = [...iter]
        assert.deepEqual(transposed, [])
      }
      {
        const iter = Mux.zip((function*() { yield 1; yield 2; yield 3; yield 4; yield 5; yield 6 })())
        const transposed = [...iter]
        assert.deepEqual(transposed, [])
      }
    })
    it('Mux.zip(<T any>x AsyncGeneratorFunction<Array<T>|T>) -> y AsyncIterator<Array<T>>', async () => {
      const generate123 = async function*() { yield 1; yield 2; yield 3 }
      const generateABC = async function*() { yield 'a'; yield 'b'; yield 'c' }
      {
        const iter = Mux.zip(async function*() { yield [1]; yield [2]; yield [3]; yield [4]; yield [5]; yield [6] })
        const transposed = await asyncIteratorToArray(iter)
        assert.deepEqual(transposed, [[1, 2, 3, 4, 5, 6]])
      }
      {
        const iter = Mux.zip(async function*() { yield [1]; yield 2; yield [3]; yield 4; yield [5]; yield 6 })
        const transposed = await asyncIteratorToArray(iter)
        assert.deepEqual(transposed, [[1, 2, 3, 4, 5, 6]])
      }
      {
        const iter = Mux.zip(async function*() { yield 1; yield 2; yield 3; yield 4; yield 5; yield 6 })
        const transposed = await asyncIteratorToArray(iter)
        assert.deepEqual(transposed, [[1, 2, 3, 4, 5, 6]])
      }
    })
    it('Mux.zip(<T any>x AsyncIterator<Array<T>|T>) -> y AsyncIterator<Array<T>>', async () => {
      {
        const iter = Mux.zip((async function*() { yield [1]; yield [2]; yield [3]; yield [4]; yield [5]; yield [6] })())
        const transposed = await asyncIteratorToArray(iter)
        assert.deepEqual(transposed, [[1, 2, 3, 4, 5, 6]])
      }
      {
        const iter = Mux.zip(async function*() { yield [1]; yield 2; yield [3]; yield 4; yield [5]; yield 6 })
        const transposed = await asyncIteratorToArray(iter)
        assert.deepEqual(transposed, [[1, 2, 3, 4, 5, 6]])
      }
      {
        const iter = Mux.zip(async function*() { yield 1; yield 2; yield 3; yield 4; yield 5; yield 6 })
        const transposed = await asyncIteratorToArray(iter)
        assert.deepEqual(transposed, [[1, 2, 3, 4, 5, 6]])
      }
    })
    it('Mux.zip(<T any>x Array<AsyncGenerator<T>|T>) -> y AsyncIterator<Array<T>>', async () => {
      const generate123 = async function*() { yield 1; yield 2; yield 3 }
      const generateABC = async function*() { yield 'a'; yield 'b'; yield 'c' }
      {
        const iter = Mux.zip([
          generate123,
          generateABC,
        ])
        const transposed = await asyncIteratorToArray(iter)
        assert.deepEqual(transposed, [
          [1, 'a'],
          [2, 'b'],
          [3, 'c'],
        ])
      }
    })
    it('Mux.zip(<T any>x Array<AsyncIterator<T>|T>) -> y AsyncIterator<Array<T>>', async () => {
      const generate123 = async function*() { yield 1; yield 2; yield 3 }
      const generateABC = async function*() { yield 'a'; yield 'b'; yield 'c' }
      {
        const iter = Mux.zip([
          generate123(),
          generateABC(),
        ])
        const transposed = await asyncIteratorToArray(iter)
        assert.deepEqual(transposed, [
          [1, 'a'],
          [2, 'b'],
          [3, 'c'],
        ])
      }
    })
  })

  describe('Mux.concat', () => {
    describe('<T any>Mux.concat(x SyncSequence<SyncSequence<T>|T>|T) -> Iterator<T>', () => {
      it('<T any>x Array<Array<T>|T>', async () => {
        const iter = Mux.concat([[1, 2, 3], [1, 2, 3], [1, 2, 3], 5, 6])
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3, 5, 6])
      })
      it('<T any>x Array<Iterator<T>|T>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const iter = Mux.concat([generate123(), generate123(), generate123(), 5, 6])
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3, 5, 6])
      })
      it('WARNING: potentially unexpected behavior - x Iterator<Array>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const iter = Mux.concat(generate123())
        const flattened = [...iter]
        assert.deepEqual(flattened, [])
      })
      it('x GeneratorFunction<Array>', async () => {
        const generateArrays123 = function*() { yield [1]; yield [2]; yield [3] }
        const iter = Mux.concat(generateArrays123)
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3])
      })
      it('<T any>x GeneratorFunction<T>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const generate123123123 = function*() { yield* generate123(); yield* generate123(); yield* generate123() }
        const iter = Mux.concat(generate123123123)
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3])
      })
      it('x GeneratorFunction<GeneratorFunction>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const generateGeneratorFuncs = function*() { yield generate123; yield generate123; yield generate123 }
        const iter = Mux.concat(generateGeneratorFuncs)
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3])
      })
      it('x Array<GeneratorFunction>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const iter = Mux.concat([generate123, generate123, generate123])
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3])
      })
    })

    describe('<T any>Mux.concat(x Sequence<Sequence<T>|T>|T) -> AsyncIterator<T>', () => {
      it('<T any>x AsyncGeneratorFunction<Array<T>|T>', async () => {
        const asyncGenerate123456WithArrays = async function*() { yield [1]; yield 2; yield [3]; yield 4; yield [5]; yield 6 }
        const iter = Mux.concat(asyncGenerate123456WithArrays)
        const flattened = await asyncIteratorToArray(iter)
        assert.deepEqual(flattened, [1, 2, 3, 4, 5, 6])
      })
      it('x AsyncGeneratorFunction<Array>', async () => {
        const asyncGenerate123Array = async function*() { yield [1]; yield [2]; yield [3] }
        const iter = Mux.concat(asyncGenerate123Array)
        const flattened = await asyncIteratorToArray(iter)
        assert.deepEqual(flattened, [1, 2, 3])
      })
      it('x Array<AsyncGeneratorFunction>', async () => {
        const asyncGenerate123 = async function*() { yield 1; yield 2; yield 3 }
        const iter = Mux.concat([asyncGenerate123, asyncGenerate123, asyncGenerate123])
        const flattened = await asyncIteratorToArray(iter)
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3])
      })
      it('x AsyncGeneratorFunction<AsyncGeneratorFunction>', async () => {
        const asyncGenerate123 = async function*() { yield 1; yield 2; yield 3 }
        const asyncGenerateFuncs = async function*() { yield asyncGenerate123; yield asyncGenerate123; yield asyncGenerate123 }
        const iter = Mux.concat(asyncGenerateFuncs)
        const flattened = await asyncIteratorToArray(iter)
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3])
      })
      it('x AsyncIterator<Array>', async () => {
        const asyncGenerateFuncs = async function*() { yield [1, 2, 3]; yield [1, 2, 3]; yield [1, 2, 3] }
        const iter = Mux.concat(asyncGenerateFuncs())
        const flattened = await asyncIteratorToArray(iter)
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3])
      })
      it('x AsyncIterator<AsyncIterator>', async () => {
        const asyncGenerate123 = async function*() { yield 1; yield 2; yield 3 }
        const asyncGenerateFuncs = async function*() { yield asyncGenerate123(); yield asyncGenerate123(); yield asyncGenerate123() }
        const iter = Mux.concat(asyncGenerateFuncs())
        const flattened = await asyncIteratorToArray(iter)
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3])
      })
    })
  })

  describe('Mux.switch', () => {
    describe('<T any>Mux.switch(x SyncSequence<SyncSequence<T>|T>|T) -> Iterator<T>', () => {
      it('<T any>x Array<Array<T>|T>', async () => {
        const iter = Mux.switch([[1, 2, 3], [1, 2, 3], [1, 2, 3], 5, 6])
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 1, 1, 5, 6, 2, 2, 2, 3, 3, 3])
      })
      it('<T any>x Array<Iterator<T>|T>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const iter = Mux.switch([generate123(), generate123(), generate123(), 5, 6])
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 1, 1, 5, 6, 2, 2, 2, 3, 3, 3])
      })
      it('WARNING: potentially unexpected behavior - x Iterator<Array>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const iter = Mux.switch(generate123())
        const flattened = [...iter]
        assert.deepEqual(flattened, [])
      })
      it('x GeneratorFunction<Array>', async () => {
        const generateArrays123 = function*() { yield [1]; yield [2]; yield [3] }
        const iter = Mux.switch(generateArrays123)
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3])
      })
      it('<T any>x GeneratorFunction<T> - switch must abide by the top level Sequence\'s order', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const generate123123123 = function*() { yield* generate123(); yield* generate123(); yield* generate123() }
        const iter = Mux.switch(generate123123123)
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3])
      })
      it('x GeneratorFunction<GeneratorFunction>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const generateGeneratorFuncs = function*() { yield generate123; yield generate123; yield generate123 }
        const iter = Mux.switch(generateGeneratorFuncs)
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 1, 1, 2, 2, 2, 3, 3, 3])
      })
      it('x Array<GeneratorFunction>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const iter = Mux.switch([generate123, generate123, generate123])
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 1, 1, 2, 2, 2, 3, 3, 3])
      })
    })

    describe('<T any>Mux.switch(x Sequence<Sequence<T>|T>|T) -> AsyncIterator<T>', () => {
      it('<T any>x AsyncGeneratorFunction<Array<T>|T>', async () => {
        const asyncGenerate123456WithArrays = async function*() { yield [1, 10]; yield 2; yield [3, 30]; yield 4; yield [5, 50]; yield 6 }
        const iter = Mux.switch(asyncGenerate123456WithArrays)
        const flattened = await asyncIteratorToArray(iter)
        assert.deepEqual(flattened, [1, 2, 3, 4, 5, 6, 10, 30, 50])
      })
      it('x AsyncGeneratorFunction<Array>', async () => {
        const asyncGenerate123Array = async function*() { yield [1, 1]; yield [2, 2]; yield [3, 3] }
        const iter = Mux.switch(asyncGenerate123Array)
        const flattened = await asyncIteratorToArray(iter)
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3])
      })
      it('x Array<AsyncGeneratorFunction>', async () => {
        const asyncGenerate123 = async function*() { yield 1; yield 2; yield 3 }
        const iter = Mux.switch([asyncGenerate123, asyncGenerate123, asyncGenerate123])
        const flattened = await asyncIteratorToArray(iter)
        assert.deepEqual(flattened, [1, 1, 1, 2, 2, 2, 3, 3, 3])
      })
      it('x AsyncGeneratorFunction<AsyncGeneratorFunction>', async () => {
        const asyncGenerate123 = async function*() { yield 1; yield 2; yield 3 }
        const asyncGenerateFuncs = async function*() { yield asyncGenerate123; yield asyncGenerate123; yield asyncGenerate123 }
        const iter = Mux.switch(asyncGenerateFuncs)
        const flattened = await asyncIteratorToArray(iter)
        assert.deepEqual(flattened, [1, 1, 1, 2, 2, 2, 3, 3, 3])
      })
      it('x AsyncIterator<Array>', async () => {
        const asyncGenerateFuncs = async function*() { yield [1, 2, 3]; yield [1, 2, 3]; yield [1, 2, 3] }
        const iter = Mux.switch(asyncGenerateFuncs())
        const flattened = await asyncIteratorToArray(iter)
        assert.deepEqual(flattened, [1, 1, 1, 2, 2, 2, 3, 3, 3])
      })
      it('x AsyncIterator<AsyncIterator>', async () => {
        const asyncGenerate123 = async function*() { yield 1; yield 2; yield 3 }
        const asyncGenerateFuncs = async function*() { yield asyncGenerate123(); yield asyncGenerate123(); yield asyncGenerate123() }
        const iter = Mux.switch(asyncGenerateFuncs())
        const flattened = await asyncIteratorToArray(iter)
        assert.deepEqual(flattened, [1, 1, 1, 2, 2, 2, 3, 3, 3])
      })
    })
  })

  describe('Mux.race', () => {
    describe('<T any>Mux.race(x SyncSequence<SyncSequence<T>|T>|T) -> Iterator<T>', () => {
      it('<T any>x Array<Array<T>|T>', async () => {
        const iter = Mux.race([[1, 2, 3], [1, 2, 3], [1, 2, 3], 5, 6])
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3, 5, 6])
      })
      it('<T any>x Array<Iterator<T>|T>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const iter = Mux.race([generate123(), generate123(), generate123(), 5, 6])
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3, 5, 6])
      })
      it('WARNING: potentially unexpected behavior - x Iterator<Array>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const iter = Mux.race(generate123())
        const flattened = [...iter]
        assert.deepEqual(flattened, [])
      })
      it('x GeneratorFunction<Array>', async () => {
        const generateArrays123 = function*() { yield [1]; yield [2]; yield [3] }
        const iter = Mux.race(generateArrays123)
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3])
      })
      it('<T any>x GeneratorFunction<T>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const generate123123123 = function*() { yield* generate123(); yield* generate123(); yield* generate123() }
        const iter = Mux.race(generate123123123)
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3])
      })
      it('x GeneratorFunction<GeneratorFunction>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const generateGeneratorFuncs = function*() { yield generate123; yield generate123; yield generate123 }
        const iter = Mux.race(generateGeneratorFuncs)
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3])
      })
      it('x Array<GeneratorFunction>', async () => {
        const generate123 = function*() { yield 1; yield 2; yield 3 }
        const iter = Mux.race([generate123, generate123, generate123])
        const flattened = [...iter]
        assert.deepEqual(flattened, [1, 2, 3, 1, 2, 3, 1, 2, 3])
      })
    })

    const delay = ms => new Promise(resolve => { setTimeout(resolve, ms) })

    describe('<T any>Mux.race(x Sequence<Sequence<T>|T>|T) -> AsyncIterator<T>', () => {
      it('x Array<AsyncGeneratorFunction>', async () => {
        const f = async function*() { await delay(5); yield 10; yield 20 }
        const g = async function*() { yield 1; yield 2; yield 3; await delay(10); yield 30 }
        const iter = Mux.race([f, g])
        const muxedArr = await asyncIteratorToArray(iter)
        assert.deepEqual(muxedArr, [1, 2, 3, 10, 20, 30])
      })
      it('x AsyncGeneratorFunction<AsyncGeneratorFunction>', async () => {
        const f = async function*() { await delay(5); yield 10; yield 20 }
        const g = async function*() { yield 1; yield 2; yield 3; await delay(10); yield 30 }
        const iter = Mux.race(async function*() { yield f; yield g })
        const muxedArr = await asyncIteratorToArray(iter)
        assert.deepEqual(muxedArr, [1, 2, 3, 10, 20, 30])
      })
      it('x AsyncIterator<AsyncIterator>', async () => {
        const f = async function*() { await delay(5); yield 10; yield 20 }
        const g = async function*() { yield 1; yield 2; yield 3; await delay(10); yield 30 }
        const iter = Mux.race((async function*() { yield f(); yield g() })())
        const muxedArr = await asyncIteratorToArray(iter)
        assert.deepEqual(muxedArr, [1, 2, 3, 10, 20, 30])
      })
      it('x AsyncIterator<AsyncIterator> - regular yield*', async () => {
        const f = async function*() { await delay(5); yield 10; yield 20 }
        const g = async function*() { yield 1; yield 2; yield 3; await delay(10); yield 30 }
        const iter = Mux.race((async function*() { yield* f(); yield* g() })())
        const muxedArr = await asyncIteratorToArray(iter)
        assert.deepEqual(muxedArr, [10, 20, 1, 2, 3, 30])
      })
    })
  })

  describe('<T any>Mux.flatten(x (Array|Set)<Iterable<T>|T>) -> (Array|Set)<T>', () => {
    describe('<T any>Mux.flatten(x Array<Iterable<T>|T>) -> Array<T>', () => {
      it('x [[1], 2, [[3]]]; [1, 2, [3]]', async () => {
        const nested = [[1], 2, [[3]]]
        assert.deepEqual(Mux.flatten(nested), [1, 2, [3]])
      })
      it('x [1, 2, 3]; [1, 2, 3]', async () => {
        assert.deepEqual(Mux.flatten([1, 2, 3]), [1, 2, 3])
      })
    })

    describe('<T any>Mux.flatten(x Set<Iterable<T>|T>) -> Set<T>', () => {
      it('x new Set([[1], 2, [[3]]]); new Set([1, 2, [3]])', async () => {
        const nested = new Set([[1], 2, [[3]]])
        assert.deepEqual(Mux.flatten(nested), new Set([1, 2, [3]]))
      })
      it('x Set<[1, 2, 3]>; Set<[1, 2, 3]>', async () => {
        assert.deepEqual(Mux.flatten(new Set([1, 2, 3])), new Set([1, 2, 3]))
      })
    })

    it('x \'hey\'; \'hey\' - strings are Iterable, doesn\'t make too much sense to flatten them, this is here for correctness', async () => {
      const iter = Mux.flatten('hey')
      const s = [...iter].join('')
      assert.strictEqual(s, 'hey')
    })

    it('x 1; Iterator<1>', async () => {
      const iter = Mux.flatten(1)
      const flattened = [...iter]
      assert.deepEqual(flattened, [1])
    })

    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Mux.flatten(undefined),
        { name: 'TypeError' },
      )
    })

    it('x null; TypeError', async () => {
      assert.throws(
        () => Mux.flatten(null),
        { name: 'TypeError' },
      )
    })
  })
})
