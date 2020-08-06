/*
 * @name Instance
 *
 * @synopsis
 * new Instance(x !null&!undefined) -> Instance
 *
 * @catchphrase
 * Performant type checking
 */
const Instance = function(x) {
  if (!Instance.isInstance(x)) {
    throw new TypeError(`cannot convert ${x} to Instance`)
  }
  this.value = x
}

/*
 * @synopsis
 * Instance.isInstance(x any) -> boolean
 */
Instance.isInstance = x => x !== undefined && x !== null

/*
 * @synopsis
 * Instance.is(x !null&!undefined, constructor function) -> boolean
 */
Instance.is = (x, constructor) => x.constructor === constructor

/*
 * @synopsis
 * new Instance(x !null&!undefined).is(constructor function) -> boolean
 */
Instance.prototype.is = function(constructor) {
  return this.value.constructor === constructor
}

/*
 * @synopsis
 * Instance.isString(x !null&!undefined) -> boolean
 */
Instance.isString = x => x.constructor === String

/*
 * @synopsis
 * new Instance(x !null&!undefined).isString() -> boolean
 */
Instance.prototype.isString = function() {
  return this.value.constructor === String
}

/*
 * @synopsis
 * Instance.isNumber(x !null&!undefined) -> boolean
 */
Instance.isNumber = x => x.constructor === Number

/*
 * @synopsis
 * new Instance(x !null&!undefined).isNumber() -> boolean
 */
Instance.prototype.isNumber = function() {
  return this.value.constructor === Number
}

/*
 * @synopsis
 * Instance.isArray(x !null&!undefined) -> boolean
 */
Instance.isArray = x => x.constructor === Array

/*
 * @synopsis
 * new Instance(x !null&!undefined).isArray() -> boolean
 */
Instance.prototype.isArray = function() {
  return this.value.constructor === Array
}

/*
 * @synopsis
 * Instance.isObject(x !null&!undefined) -> boolean
 */
Instance.isObject = x => x.constructor === Object

/*
 * @synopsis
 * new Instance(x !null&!undefined).isObject() -> boolean
 */
Instance.prototype.isObject = function() {
  return this.value.constructor === Object
}

/*
 * @synopsis
 * Instance.isSet(x !null&!undefined) -> boolean
 */
Instance.isSet = x => x.constructor === Set

/*
 * @synopsis
 * new Instance(x !null&!undefined).isSet() -> boolean
 */
Instance.prototype.isSet = function() {
  return this.value.constructor === Set
}

/*
 * @synopsis
 * Instance.isMap(x !null&!undefined) -> boolean
 */
Instance.isMap = x => x.constructor === Map

/*
 * @synopsis
 * new Instance(x !null&!undefined).isMap() -> boolean
 */
Instance.prototype.isMap = function() {
  return this.value.constructor === Map
}

/*
 * @synopsis
 * Instance.isIterable(x !null&!undefined) -> boolean
 */
Instance.isIterable = x => Boolean(x[Symbol.iterator])

/*
 * @synopsis
 * new Instance(x !null&!undefined).isIterable() -> boolean
 */
Instance.prototype.isIterable = function() {
  return Boolean(this.value[Symbol.iterator])
}

/*
 * @synopsis
 * Instance.isAsyncIterable(x !null&!undefined) -> boolean
 */
Instance.isAsyncIterable = x => Boolean(x[Symbol.asyncIterator])

/*
 * @synopsis
 * new Instance(x !null&!undefined).isAsyncIterable() -> boolean
 */
Instance.prototype.isAsyncIterable = function() {
  return Boolean(this.value[Symbol.asyncIterator])
}

/*
 * @synopsis
 * Instance.isFunction(x !null&!undefined) -> boolean
 */
Instance.isFunction = x => new Instance(x).isFunction()

/*
 * @synopsis
 * new Instance(x !null&!undefined).isFunction() -> boolean
 */
Instance.prototype.isFunction = function() {
  return typeof this.value === 'function'
}

/*
 * @synopsis
 * Instance.isReadable(x !null&!undefined) -> boolean
 */
Instance.isReadable = x => typeof x.read === 'function'

/*
 * @synopsis
 * new Instance(x !null&!undefined).isReadable() -> boolean
 */
Instance.prototype.isReadable = function() {
  return typeof this.value.read === 'function'
}

/*
 * @synopsis
 * Instance.isWritable(x !null&!undefined) -> boolean
 */
Instance.isWritable = x => typeof x.write === 'function'

/*
 * @synopsis
 * new Instance(x !null&!undefined).isWritable() -> boolean
 */
Instance.prototype.isWritable = function() {
  return typeof this.value.write === 'function'
}

/*
 * @synopsis
 * Instance.isPromise(x !null&!undefined) -> boolean
 */
Instance.isPromise = x => typeof x.then === 'function'

/*
 * @synopsis
 * new Instance(x !null&!undefined).isPromise() -> boolean
 */
Instance.prototype.isPromise = function() {
  return typeof this.value.then === 'function'
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
 * Instance.isTypedArray(x !null&!undefined) -> boolean
 */
Instance.isTypedArray = x => (
  typedArrayConstructorNames.has(x.constructor.name))

/*
 * @synopsis
 * new Instance(x !null&!undefined).isTypedArray() -> boolean
 */
Instance.prototype.isTypedArray = function() {
  return typedArrayConstructorNames.has(this.value.constructor.name)
}

/*
 * @synopsis
 * Instance.isNumberTypedArray(x !null&!undefined) -> boolean
 */
Instance.isNumberTypedArray = x => (
  numberTypedArrayConstructorNames.has(x.constructor.name))

/*
 * @synopsis
 * new Instance(x !null&!undefined).isNumberTypedArray() -> boolean
 */
Instance.prototype.isNumberTypedArray = function() {
  return numberTypedArrayConstructorNames.has(this.value.constructor.name)
}

/*
 * @synopsis
 * Instance.isBigIntTypedArray(x !null&!undefined) -> boolean
 */
Instance.isBigIntTypedArray = x => (
  bigIntTypedArrayConstructorNames.has(x.constructor.name))

/*
 * @synopsis
 * new Instance(x !null&!undefined).isBigIntTypedArray() -> boolean
 */
Instance.prototype.isBigIntTypedArray = function() {
  return bigIntTypedArrayConstructorNames.has(this.value.constructor.name)
}

module.exports = Instance
