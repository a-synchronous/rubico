/*
 * @synopsis
 * (desc string, loopCount number, fn function) => time number
 *
 * @repl
 * timeInLoop('myFn', 1e6, () => 'yo') // 3
 */
const timeInLoop = (loopCount, fn) => {
  const startTime = Date.now()
  for (let i = 0; i < loopCount; i++) {
    fn()
  }
  return Date.now() - startTime
}

module.exports = timeInLoop
