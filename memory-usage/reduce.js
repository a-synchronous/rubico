const { reduce } = require('..')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const iterations = 1e4

const timeoutIDs = new Map()

const asyncGenerator = async function*(i) {
  yield 1; yield 2
  await new Promise(resolve => {
    const id = setTimeout(resolve, 1e9)
    timeoutIDs.set(i, id)
  })
  yield 3
}

void (async () => {
  let i = 0, maxHeapUsed = 0
  while (i < iterations) {
    const p = reduce((a, b) => a + b, 0)(asyncGenerator(i))
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
  }

  console.log('maxHeapUsed (MiB)', maxHeapUsed / 1024 / 1024)
})()

// https://stackoverflow.com/questions/62336381/is-this-promise-cancellation-implementation-for-reducing-an-async-iterable-on-th
