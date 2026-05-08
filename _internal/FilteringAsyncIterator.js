const promiseRace = require('./promiseRace')
const __ = require('./placeholder')
const curry2 = require('./curry2')
const isPromise = require('./isPromise')
const LinkedList = require('./LinkedList')
const symbolAsyncIterator = require('./symbolAsyncIterator')
const arrayPush = require('./arrayPush')
const sleep = require('./sleep')

/**
 * @name FilteringAsyncIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * filteringAsyncIterator = new FilteringAsyncIterator(
 *   asyncIter AsyncIterator<T>,
 *   predicate T=>Promise|boolean,
 * ) -> filteringAsyncIterator AsyncIterator
 *
 * filteringAsyncIterator.next() -> Promise<{ value: any, done: boolean }>
 * ```
 */
const FilteringAsyncIterator = (asyncIterator, predicate) => {
  const buffer = new LinkedList()

  let index = -1
  let consumingAsyncIterator = false
  let isAsyncIteratorDone = false

  return {
    [symbolAsyncIterator]() {
      return this
    },

    // _consumeAsyncIterator() -> Promise<>
    async _consumeAsyncIterator() {
      for await (const item of asyncIterator) {
        index += 1
        const booleanResult = predicate(item)
        buffer.append([booleanResult, item])
      }
      isAsyncIteratorDone = true
    },

    /**
     * @name next
     *
     * @synopsis
     * ```coffeescript [specscript]
     * next() -> Promise<{ value, done }>
     * ```
     */
    async next() {
      if (!consumingAsyncIterator) {
        this._consumeAsyncIterator()
        consumingAsyncIterator = true
      }

      while (!isAsyncIteratorDone) {
        if (buffer.length > 0) {
          let [booleanResult, item] = buffer.popFirst()
          if (isPromise(booleanResult)) {
            booleanResult = await booleanResult
          }
          if (booleanResult) {
            return { value: item, done: false }
          }
          continue
        }
        await sleep(10)
      }

      while (buffer.length > 0) {
        let [booleanResult, item] = buffer.popFirst()
        if (isPromise(booleanResult)) {
          booleanResult = await booleanResult
        }
        if (booleanResult) {
          return { value: item, done: false }
        }
      }

      return { value: undefined, done: true }
    },

  }
}

module.exports = FilteringAsyncIterator
