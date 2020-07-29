/*
 * @synopsis
 * (desc string, loopCount number, fn function) => ()
 *
 * @playground
 * timeInLoop(1e6, () => 'yo') // 3
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

// thanks: https://gist.github.com/funfunction/91b5876a5f562e1e352aed0fcabc3858
