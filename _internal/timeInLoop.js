/**
 * @name timeInLoop
 *
 * @synopsis
 * ```coffeescript [specscript]
 * timeInLoop(desc string, loopCount number, fn function) -> undefined
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
const timeInLoop = (desc, loopCount, fn) => {
  const d = `${desc}: ${loopCount.toExponential()}`
  console.time(d)
  for (let i = 0; i < loopCount; i++) {
    fn()
  }
  console.timeEnd(d)
}

module.exports = timeInLoop
