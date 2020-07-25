/*
 * @synopsis
 * (desc string, loopCount number, fn function) => time number
 *
 * @playground
 * timeInLoop(1e6, () => 'yo') // 3
 */
const timeInLoop = (loopCount, fn) => {
  const startTime = Date.now()
  for (let i = 0; i < loopCount; i++) {
    fn()
  }
  return Date.now() - startTime
}

module.exports = timeInLoop

// thanks: https://gist.github.com/funfunction/91b5876a5f562e1e352aed0fcabc3858
