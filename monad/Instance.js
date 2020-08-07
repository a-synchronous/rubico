/* rubico v1.5.0
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

'use strict'

/*
 * @name Instance
 *
 * @synopsis
 * new Instance(x any) -> Instance
 *
 * @catchphrase
 * Performant type checking
 */
const Instance = function(x) {
  this.value = x
}

/*
 * @name Instance.isInstance
 *
 * @synopsis
 * Instance.isInstance(x any) -> boolean
 *
 * @catchphrase
 * `false` <- only for `undefined` and `null`
 */
Instance.isInstance = x => x != null

/*
 * @synopsis
 * new Instance(x any).isInstance() -> boolean
 */
Instance.prototype.isInstance = function() {
  return this.value != null
}

/*
 * @synopsis
 * Instance.is(x any, constructor function) -> boolean
 */
Instance.is = (x, constructor) => x != null && x.constructor == constructor

/*
 * @synopsis
 * new Instance(x any).is(constructor function) -> boolean
 */
Instance.prototype.is = function(constructor) {
  const x = this.value
  return x != null && x.constructor == constructor
}

/*
 * @synopsis
 * Instance.isString(x any) -> boolean
 */
Instance.isString = x => (
  typeof x == 'string' || (x != null && x.constructor == String))

/*
 * @synopsis
 * new Instance(x any).isString() -> boolean
 */
Instance.prototype.isString = function() {
  const x = this.value
  return typeof x == 'string' || (x != null && x.constructor == String)
}

/*
 * @synopsis
 * Instance.isNumber(x any) -> boolean
 */
Instance.isNumber = x => (
  typeof x === 'number' || (x != null && x.constructor == Number))

/*
 * @synopsis
 * new Instance(x any).isNumber() -> boolean
 */
Instance.prototype.isNumber = function() {
  const x = this.value
  return typeof x === 'number' || (x != null && x.constructor == Number)
}

/*
 * @synopsis
 * Instance.isArray(x any) -> boolean
 */
Instance.isArray = Array.isArray

/*
 * @synopsis
 * new Instance(x any).isArray() -> boolean
 */
Instance.prototype.isArray = function() {
  return Array.isArray(this.value)
}

/*
 * @synopsis
 * Instance.isObject(x any) -> boolean
 */
Instance.isObject = x => x != null && x.constructor == Object

/*
 * @synopsis
 * new Instance(x any).isObject() -> boolean
 */
Instance.prototype.isObject = function() {
  const x = this.value
  return x != null && x.constructor == Object
}

/*
 * @synopsis
 * Instance.isSet(x any) -> boolean
 */
Instance.isSet = x => x != null && x.constructor == Set

/*
 * @synopsis
 * new Instance(x any).isSet() -> boolean
 */
Instance.prototype.isSet = function() {
  const x = this.value
  return x != null && x.constructor == Set
}

/*
 * @synopsis
 * Instance.isMap(x any) -> boolean
 */
Instance.isMap = x => x != null && x.constructor == Map

/*
 * @synopsis
 * new Instance(x any).isMap() -> boolean
 */
Instance.prototype.isMap = function() {
  const x = this.value
  return x != null && x.constructor == Map
}

const symbolIterator = Symbol.iterator

/*
 * @synopsis
 * Instance.isIterable(x any) -> boolean
 */
Instance.isIterable = x => x != null && Boolean(x[symbolIterator])

/*
 * @synopsis
 * new Instance(x any).isIterable() -> boolean
 */
Instance.prototype.isIterable = function() {
  const x = this.value
  return x != null && Boolean(x[symbolIterator])
}

const symbolAsyncIterator = Symbol.asyncIterator

/*
 * @synopsis
 * Instance.isAsyncIterable(x any) -> boolean
 */
Instance.isAsyncIterable = x => x != null && Boolean(x[symbolAsyncIterator])

/*
 * @synopsis
 * new Instance(x any).isAsyncIterable() -> boolean
 */
Instance.prototype.isAsyncIterable = function() {
  const x = this.value
  return x != null && Boolean(x[symbolAsyncIterator])
}

/*
 * @synopsis
 * Instance.isFunction(x any) -> boolean
 */
Instance.isFunction = x => typeof x == 'function'

/*
 * @synopsis
 * new Instance(x any).isFunction() -> boolean
 */
Instance.prototype.isFunction = function() {
  return typeof this.value == 'function'
}

/*
 * @synopsis
 * Instance.isReadable(x any) -> boolean
 */
Instance.isReadable = x => x != null && typeof x.read == 'function'

/*
 * @synopsis
 * new Instance(x any).isReadable() -> boolean
 */
Instance.prototype.isReadable = function() {
  const x = this.value
  return x != null && typeof x.read == 'function'
}

/*
 * @synopsis
 * Instance.isWritable(x any) -> boolean
 */
Instance.isWritable = x => x != null && typeof x.write == 'function'

/*
 * @synopsis
 * new Instance(x any).isWritable() -> boolean
 */
Instance.prototype.isWritable = function() {
  const x = this.value
  return x != null && typeof x.write == 'function'
}

/*
 * @synopsis
 * Instance.isPromise(x any) -> boolean
 */
Instance.isPromise = x => x != null && typeof x.then == 'function'

/*
 * @synopsis
 * new Instance(x any).isPromise() -> boolean
 */
Instance.prototype.isPromise = function() {
  const x = this.value
  return x != null && typeof x.then == 'function'
}

const typedArrayConstructorNames = new Set([
  'Uint8ClampedArray',
  'Uint8Array', 'Int8Array',
  'Uint16Array', 'Int16Array',
  'Uint32Array', 'Int32Array',
  'Float32Array', 'Float64Array',
  'BigUint64Array', 'BigInt64Array',
])

const numberTypedArrayConstructorNames = new Set([
  'Uint8ClampedArray',
  'Uint8Array', 'Int8Array',
  'Uint16Array', 'Int16Array',
  'Uint32Array', 'Int32Array',
  'Float32Array', 'Float64Array',
])

const bigIntTypedArrayConstructorNames = new Set([
  'BigUint64Array', 'BigInt64Array',
])

/*
 * @synopsis
 * Instance.isTypedArray(x any) -> boolean
 */
Instance.isTypedArray = ArrayBuffer.isView

// Instance.isTypedArrayCandidate0 = x => x != null && typedArrayConstructorNames.has(x.constructor.name)

// Instance.isTypedArrayCandidate1 = ArrayBuffer.isView

/*
 * @synopsis
 * new Instance(x any).isTypedArray() -> boolean
 */
Instance.prototype.isTypedArray = function() {
  return ArrayBuffer.isView(this.value)
}

module.exports = Instance
