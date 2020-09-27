const isPromise = require('./isPromise')

/**
 * @name promiseObjectAllExecutor
 *
 * @synopsis
 * ```coffeescript [specscript]
 * promiseObjectAllExecutor(resolve function) -> ()
 * ```
 */
const promiseObjectAllExecutor = object => function executor(resolve) {
  const result = {}
  let numPromises = 0
  for (const key in object) {
    const value = object[key]
    if (isPromise(value)) {
      numPromises += 1
      value.then((key => function (res) {
        result[key] = res
        numPromises -= 1
        if (numPromises == 0) {
          resolve(result)
        }
      })(key))
    } else {
      result[key] = value
    }
  }
  if (numPromises == 0) {
    resolve(result)
  }
}

/**
 * @name promiseObjectAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * promiseObjectAll(object<Promise|any>) -> Promise<object>
 * ```
 *
 * @description
 * Like `Promise.all` but for objects.
 */
const promiseObjectAll = object => new Promise(promiseObjectAllExecutor(object))

module.exports = promiseObjectAll
