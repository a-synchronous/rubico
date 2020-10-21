const memoryUsage = process.memoryUsage.bind(process)

/**
 * @name bytesToMiB
 *
 * @synopsis
 * bytesToMiB(bytes number) -> MiB string
 */
const bytesToMiB = bytes => `${(bytes / 1024 / 1024).toFixed(2)} MiB`

/**
 * @name heapUsedInLoop
 *
 * @catchphrase
 * max and avg heap used in loop
 *
 * @synopsis
 * heapUsedInLoop(
 *   desc string,
 *   loopCount number,
 *   func (loop number)=>any
 * ) -> ()
 *
 * @description
 * **heapUsedInLoop** is a memory usage measurement function. Supply `description`, `loopCount`, and a function `func` for that function to be run `loopCount` times, finally logging average and max heap used per loop in terms of megabytes MiB.
 *
 * ```javascript
 * heapUsedInLoop('my-description', 1e5, function () {
 *   return 1 + 1
 * }) /*
 * 0 5.88 MiB
 * 1 5.92 MiB
 * ...
 * 99997 7.34 MiB
 * 99998 7.34 MiB
 * 99999 7.35 MiB
 * my-description: 1e+5: {
 *   "max": "7.15 MiB",
 *   "avg": "5.50 MiB"
 * }
 * ```
 *
 * @node-only
 */
const heapUsedInLoop = function (desc, loopCount, func) {
  const d = `${desc}: ${loopCount.toExponential()}:`
  let loop = -1,
    maxHeapUsed = 0,
    totalHeapUsed = 0
  while (++loop < loopCount) {
    func(loop)
    const { heapUsed } = memoryUsage()
    console.log(loop, bytesToMiB(heapUsed))
    maxHeapUsed = Math.max(maxHeapUsed, heapUsed)
    totalHeapUsed += heapUsed
  }
  console.log(d, JSON.stringify({
    max: bytesToMiB(maxHeapUsed),
    avg: bytesToMiB(totalHeapUsed / loopCount)
  }, null, 2))
}

heapUsedInLoop.skip = function noop() {}

/**
 * @name heapUsedInLoop.async
 *
 * @synopsis
 * heapUsedInLoop.async(
 *   desc string,
 *   loopCount number,
 *   func (loop number)=>Promise|any
 * ) -> ()
 */
heapUsedInLoop.async = async function heapUsedInLoopAsync(
  desc, loopCount, func,
) {
  const d = `${desc}: ${loopCount.toExponential()}:`
  let maxHeapUsed = 0,
    totalHeapUsed = 0
  for (let loop = 0; loop < loopCount; loop++) {
    await func(loop)
    const { heapUsed } = memoryUsage()
    console.log(loop, bytesToMiB(heapUsed))
    maxHeapUsed = Math.max(maxHeapUsed, heapUsed)
    totalHeapUsed += heapUsed
  }
  console.log(d, JSON.stringify({
    max: bytesToMiB(maxHeapUsed),
    avg: bytesToMiB(totalHeapUsed / loopCount)
  }, null, 2))
}

heapUsedInLoop.async.skip = function noop() {}

module.exports = heapUsedInLoop
