const promiseRace = require('./promiseRace')
const __ = require('./placeholder')
const curry2 = require('./curry2')
const isPromise = require('./isPromise')
const LinkedList = require('./LinkedList')
const symbolAsyncIterator = require('./symbolAsyncIterator')
const arrayPush = require('./arrayPush')
const sleep = require('./sleep')

/**
 * @name SerialMappingAsyncIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * serialMappingAsyncIterator = new SerialMappingAsyncIterator(
 *   asyncIter AsyncIterator<T>,
 *   mapper T=>Promise|any,
 * ) -> serialMappingAsyncIterator AsyncIterator
 *
 * serialMappingAsyncIterator.next() -> Promise<{ value: any, done: boolean }>
 * ```
 */
const SerialMappingAsyncIterator = (asyncIterator, mapper) => {
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
        let mappedItem = mapper(item)
        if (isPromise(mappedItem)) {
          mappedItem = await mappedItem
        }
        buffer.append(mappedItem)
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
          return { value: buffer.popFirst(), done: false }
        }
        await sleep(10)
      }

      if (buffer.length > 0) {
        return { value: buffer.popFirst(), done: false }
      }

      return { value: undefined, done: true }
    },

  }
}

module.exports = SerialMappingAsyncIterator
