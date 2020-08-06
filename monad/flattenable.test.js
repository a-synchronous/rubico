const assert = require('assert')
const Flattenable = require('./flattenable')

describe('Flattenable', () => {
  describe('new Flattenable(x Array|Set) -> Flattenable', () => {
    it('x [1, 2, 3]', async () => {
      assert.deepEqual(new Flattenable([1, 2, 3]).value, [1, 2, 3])
      assert.deepEqual(new Flattenable([1, 2, 3]).constructor.name, 'Flattenable')
    })
    it('x Set<[1, 2, 3]>', async () => {
      assert.deepEqual(new Flattenable(new Set([1, 2, 3])).value, new Set([1, 2, 3]))
      assert.deepEqual(new Flattenable(new Set([1, 2, 3])).constructor.name, 'Flattenable')
    })
    it('x 1; TypeError', async () => {
      assert.throws(
        () => new Flattenable(1),
        new TypeError('cannot convert 1 to Flattenable'),
      )
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => new Flattenable(null),
        new TypeError('cannot convert null to Flattenable'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => new Flattenable(undefined),
        new TypeError('cannot convert undefined to Flattenable'),
      )
    })
  })

  describe('Flattenable.isFlattenable(x any) -> boolean', () => {
    it('x [1, 2, 3]; true', async () => {
      assert.strictEqual(Flattenable.isFlattenable([1, 2, 3]), true)
    })
    it('x Set<[1, 2, 3]>; true', async () => {
      assert.strictEqual(Flattenable.isFlattenable(new Set([1, 2, 3])), true)
    })
    it('x 1; false', async () => {
      assert.strictEqual(Flattenable.isFlattenable(1), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Flattenable.isFlattenable(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Flattenable.isFlattenable(undefined), false)
    })
  })

  describe('Flattenable.flatten(x Array)', () => {
    it('x [[1], 2, [[3]]]; [1, 2, [3]]', async () => {
      const nested = [[1], 2, [[3]]]
      assert.deepEqual(Flattenable.flatten(nested), [1, 2, [3]])
    })
    it('x [1, 2, 3]; [1, 2, [3]]', async () => {
      assert.deepEqual(Flattenable.flatten([1, 2, 3]), [1, 2, 3])
    })
  })

  describe('new Flattenable(x Array).flatten()', () => {
    it('x [[1], 2, [[3]]]; [1, 2, [3]]', async () => {
      const nested = [[1], 2, [[3]]]
      assert.deepEqual(new Flattenable(nested).flatten(), [1, 2, [3]])
    })
    it('x [1, 2, 3]; [1, 2, [3]]', async () => {
      assert.deepEqual(new Flattenable([1, 2, 3]).flatten(), [1, 2, 3])
    })
  })

  describe('Flattenable.flatten(x Set)', () => {
    it('x new Set([[1], 2, [[3]]]); new Set([1, 2, [3]])', async () => {
      const nested = new Set([[1], 2, [[3]]])
      assert.deepEqual(Flattenable.flatten(nested), new Set([1, 2, [3]]))
    })
    it('x Set<[1, 2, 3]>; Set<[1, 2, 3]>', async () => {
      assert.deepEqual(Flattenable.flatten(new Set([1, 2, 3])), new Set([1, 2, 3]))
    })
  })

  describe('new Flattenable(x Set).flatten()', () => {
    it('x new Set([[1], 2, [[3]]]); new Set([1, 2, [3]])', async () => {
      const nested = new Set([[1], 2, [[3]]])
      assert.deepEqual(new Flattenable(nested).flatten(), new Set([1, 2, [3]]))
    })
    it('x Set<[1, 2, 3]>; Set<[1, 2, 3]>', async () => {
      assert.deepEqual(new Flattenable(new Set([1, 2, 3])).flatten(), new Set([1, 2, 3]))
    })
  })
})
