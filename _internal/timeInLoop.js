/**
 * @name timeInLoop
 *
 * @synopsis
 * ```coffeescript [specscript]
 * timeInLoop(description string, loopCount number, fn function, options? {
 *   silent?: boolean,
 * }) -> undefined
 * ```
 *
 * @description
 * Logs the amount of time required for a function to run a certain number of times
 *
 * ```js
 * timeInLoop('hello', 1e6, () => 'hello') // hello: 1e+6: 3.474ms
 * ```
 *
 * Reference: https://gist.github.com/funfunction/91b5876a5f562e1e352aed0fcabc3858
 */
const timeInLoop = (description, loopCount, fn, options = {}) => {
  const d = `${description}: ${loopCount.toExponential()}`
  const start = performance.now()
  for (let i = 0; i < loopCount; i++) {
    fn()
  }
  const end = performance.now()
  const duration = end - start

  if (options.silent) {
    return { description, loopCount, duration }
  }

  console.log(`${d}: ${duration}`)
  return { description, loopCount, duration }
}

module.exports = timeInLoop
