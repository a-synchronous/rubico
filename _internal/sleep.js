/**
 * @name sleep
 *
 * @synopsis
 * ```coffeescript [specscript]
 * sleep(time number) -> promiseThatResolvesAfterTime Promise
 * ```
 */
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})


module.exports = sleep
