/**
 * @name timeInLoop
 *
 * @synopsis
 * timeInLoop(desc string, loopCount number, fn function) -> undefined
 *
 * @catchphrase
 * How long does a function take to run this many loops
 *
 * @example
 * timeInLoop('yo', 1e6, () => 'yo') // yo: 1e+6: 3.474ms
 */
const timeInLoop = (desc, loopCount, fn) => {
  const d = `${desc}: ${loopCount.toExponential()}`
  console.time(d)
  for (let i = 0; i < loopCount; i++) {
    fn()
  }
  console.timeEnd(d)
}

/**
 * @name timeInLoop.async
 *
 * @synopsis
 * timeInLoop.async(desc string, loopCount number, fn function) -> undefined
 *
 * @catchphrase
 * Like timeInLoop, but every call is awaited
 *
 * @example
 * timeInLoop.async('asyncYo', 1e6, async () => 'yo') // asyncYo: 1e+6: 116.006ms
 */
timeInLoop.async = async (desc, loopCount, fn) => {
  const d = `${desc}: ${loopCount.toExponential()}`
  console.time(d)
  for (let i = 0; i < loopCount; i++) {
    await fn()
  }
  console.timeEnd(d)
}

module.exports = timeInLoop

// thanks: https://gist.github.com/funfunction/91b5876a5f562e1e352aed0fcabc3858
