const assert = require('assert')
const { reduce } = require('.')

describe('benchmarks', () => {
  describe('reduce(...)(AsyncIterable)', () => {
    it('no memory leaks on cancel', async () => {
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

      const add = (a, b) => a + b

      const timeoutIDs = new Map()

      const asyncGenerator = async function*(i) {
        yield 1; yield 2
        await new Promise(resolve => {
          const id = setTimeout(resolve, 1e9)
          timeoutIDs.set(i, id)
        })
        yield 3
      }

      let i = 0, maxHeapUsed = 0
      while (i < 1e5) {
        const p = reduce(add, 0)(asyncGenerator(i))
        await sleep(1)
        p.cancel()
        try {
          await p
        } catch (err) {
          if (err.message !== 'cancelled') throw err
          clearTimeout(timeoutIDs.get(i))
          timeoutIDs.delete(i)
        }
        const { heapUsed } = process.memoryUsage()
        console.log(`${i},${(heapUsed / 1024 / 1024).toFixed(2)}`)
        i += 1
        maxHeapUsed = Math.max(maxHeapUsed, heapUsed)
        assert.ok((maxHeapUsed / 1024 / 1024) < 30)
      }
    }).timeout(5 * 60 * 1000)
  })
})
