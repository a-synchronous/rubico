/**
 * @name timeInLoopAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * timeInLoop.async(desc string, loopCount number, fn function) -> undefined
 * ```
 *
 * @description
 * Like timeInLoop, but every call is awaited
 *
 * ```js
 * timeInLoop.async('async hello', 1e6, async () => 'hello') // async hello: 1e+6: 116.006ms
 * ```
 */
const timeInLoopAsync = async (desc, loopCount, fn) => {
  const d = `${desc}: ${loopCount.toExponential()}`
  console.time(d)
  for (let i = 0; i < loopCount; i++) {
    await fn()
  }
  console.timeEnd(d)
}

module.exports = timeInLoopAsync
