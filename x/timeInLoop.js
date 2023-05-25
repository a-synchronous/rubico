const _timeInLoop = require('../_internal/timeInLoop')
const timeInLoopAsync = require('../_internal/timeInLoopAsync')

/**
 * @name timeInLoop
 *
 * @synopsis
 * timeInLoop(desc string, loopCount number, fn function) -> undefined
 *
 * @description
 * Logs the amount of time required for a function to run a certain number of times
 *
 * ```coffeescript [specscript]
 * timeInLoop('hello', 1e6, () => 'hello') // hello: 1e+6: 3.474ms
 * ```
 *
 * Reference: https://gist.github.com/funfunction/91b5876a5f562e1e352aed0fcabc3858
 */
const timeInLoop = _timeInLoop

/**
 * @name timeInLoop.async
 *
 * @synopsis
 * timeInLoop.async(desc string, loopCount number, fn function) -> undefined
 *
 * @description
 * Like timeInLoop, but every call is awaited
 *
 * ```coffeescript [specscript]
 * timeInLoop.async('async hello', 1e6, async () => 'hello') // async hello: 1e+6: 116.006ms
 * ```
 */
timeInLoop.async = timeInLoopAsync

module.exports = timeInLoop
