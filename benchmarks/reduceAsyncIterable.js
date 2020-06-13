/* right now, this causes a memory leak for infinite async iterables
const reduceAsyncIterable = async (fn, possiblyY0, x) => {
  const iter = x[Symbol.asyncIterator]()
  const y0 = isUndefined(possiblyY0) ? (await iter.next()).value : possiblyY0
  if (isUndefined(y0)) {
    throw new TypeError('reduce(...)(x); x cannot be empty')
  }
  let y = await fn(y0, (await iter.next()).value)
  for await (const xi of iter) {
    y = await fn(y, xi)
  }
  return y
}

const reduce = (fn, x0) => {
  if (!isFunction(fn)) {
    throw new TypeError('reduce(x, y); x is not a function')
  }
  return x => {
    if (isIterable(x)) return reduceIterable(fn, x0, x)
    if (isAsyncIterable(x)) return reduceAsyncIterable(fn, x0, x)
    if (is(Object)(x)) return reduceObject(fn, x0, x)
    throw new TypeError('reduce(...)(x); x invalid')
  }
}
*/

const { map, reduce } = require('..')

const asyncGenerator = async function*() {
  yield 1; yield 2
  // await new Promise(() => {})
  await new Promise(resolve => setTimeout(resolve, 1e9))
  // await Promise.race([])
  yield 3
}

const add = (a, b) => a + b

const logHeapUsed = () => {
  const { heapUsed } = process.memoryUsage()
  console.log(`${promises.length},${(heapUsed / 1024 / 1024).toFixed(2)}`)
}

const fix = mem => (mem / 1024 / 1024).toFixed(2) + 'MiB'

const stats = {
  maxMemoryUsed: 0,
}

const main = async () => {
  let i = 0
  while (i < 1e5) {
    const p = reduce(add, 0)(asyncGenerator())
    p.cancel()
    await p
    const { heapUsed } = process.memoryUsage()
    console.log(`${i},${(heapUsed / 1024 / 1024).toFixed(2)}`)
    stats.maxMemoryUsed = Math.max(stats.maxMemoryUsed, heapUsed)
    i += 1
  }
  console.log(map(fix)(stats))
}

main()
