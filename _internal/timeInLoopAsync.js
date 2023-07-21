/**
 * @name timeInLoopAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * timeInLoop.async(description string, loopCount number, fn function, options? {
 *   silent?: boolean,
 * }) -> undefined
 * ```
 *
 * @description
 * Like timeInLoop, but every call is awaited
 *
 * ```js
 * timeInLoop.async('async hello', 1e6, async () => 'hello') // async hello: 1e+6: 116.006ms
 * ```
 */
const timeInLoopAsync = async (description, loopCount, fn, options = {}) => {
  const d = `${description}: ${loopCount.toExponential()}`
  const start = performance.now()
  for (let i = 0; i < loopCount; i++) {
    await fn()
  }
  const end = performance.now()
  const duration = end - start

  if (options.silent) {
    return { description, loopCount, duration }
  }

  console.log(`${d}: ${duration}`)
  return { description, loopCount, duration }
}

module.exports = timeInLoopAsync
