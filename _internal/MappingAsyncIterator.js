const promiseRace = require('./promiseRace')
const __ = require('./placeholder')
const curry2 = require('./curry2')
const isPromise = require('./isPromise')
const LinkedList = require('./LinkedList')
const symbolAsyncIterator = require('./symbolAsyncIterator')
const arrayPush = require('./arrayPush')
const sleep = require('./sleep')

/**
 * @name MappingAsyncIterator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mappingAsyncIterator = new MappingAsyncIterator(
 *   asyncIter AsyncIterator<T>,
 *   mapper T=>Promise|any,
 *   context object
 * ) -> mappingAsyncIterator AsyncIterator
 *
 * mappingAsyncIterator.next() -> Promise<{ value: any, done: boolean }>
 * ```
 */
const MappingAsyncIterator = (asyncIterator, mapper, context) => {
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
        const mappedItem = mapper.call(context, item)
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
          let value = buffer.popFirst()
          if (isPromise(value)) {
            value = await value
          }
          return { value, done: false }
        }
        await sleep(10)
      }

      if (buffer.length > 0) {
        let value = buffer.popFirst()
        if (isPromise(value)) {
          value = await value
        }
        return { value, done: false }
      }

      return { value: undefined, done: true }
    },

  }
}

module.exports = MappingAsyncIterator
