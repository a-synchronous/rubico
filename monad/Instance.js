const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

/**
 * @name Instance
 *
 * @synopsis
 * new Instance(value any) -> Instance
 *
 * @catchphrase
 * Type checking
 */
class Instance {
  constructor(value) {
    this.value = value
  }

  /**
   * @name Instance.prototype.chain
   *
   * @synopsis
   * <A any, B any>new Instance(x A).chain(f A=>Instance<B>) -> Instance<B>
   *
   * @description
   * For associativity
   *
   * @example
   * const inst = new Instance(3)
   * console.log(
   *   inst.chain(number => new Instance(number ** 2))
   * ) // Instance { 9 }
   */
  chain(func) {
    return func(this.value)
  }

  /**
   * @name Instance.prototype.map
   *
   * @synopsis
   * <A any, B any>new Instance(value A).map(func A=>B) -> Instance<B>
  map(func) {
    return new Instance(func(this.value))
  } */


  /**
   * @name Instance.prototype.is
   *
   * @synopsis
   * new Instance(x any).is(ctor function) -> boolean
   */
  is(ctor) {
    const x = this.value
    return x != null && x.constructor == ctor
  }


  /**
   * @name Instance.prototype.isString
   *
   * @synopsis
   * new Instance(x any).isString() -> boolean
   */
  isString() {
    const x = this.value
    return typeof x == 'string' || (x != null && x.constructor == String)
  }

  /**
   * @name Instance.prototype.isNumber
   *
   * @synopsis
   * new Instance(x any).isNumber() -> boolean
   */
  isNumber() {
    const x = this.value
    return typeof x == 'number' || (x != null && x.constructor == Number)
  }

  /**
   * @name Instance.prototype.isArray
   *
   * @synopsis
   * new Instance(x any).isArray() -> boolean
   */
  isArray() {
    return Array.isArray(this.value)
  }

  /**
   * @name Instance.prototype.isObject
   *
   * @synopsis
   * new Instance(x any).isObject() -> boolean
   */
  isObject() {
    const x = this.value
    return x != null && x.constructor == Object
  }

  /**
   * @name Instance.prototype.isSet
   *
   * @synopsis
   * new Instance(x any).isSet() -> boolean
   */
  isSet() {
    const x = this.value
    return x != null && x.constructor == Set
  }

  /**
   * @name Instance.prototype.isMap
   *
   * @synopsis
   * new Instance(x any).isMap() -> boolean
   */
  isMap() {
    const x = this.value
    return x != null && x.constructor == Map
  }

  /**
   * @name Instance.prototype.isIterable
   *
   * @synopsis
   * new Instance(value any).isIterable() -> boolean
   */
  isIterable() {
    const value = this.value
    return value != null && typeof value[symbolIterator] == 'function'
  }

  /**
   * @name Instance.prototype.isAsyncIterable
   *
   * @synopsis
   * new Instance(value any).isAsyncIterable() -> boolean
   */
  isAsyncIterable() {
    const value = this.value
    return value != null && typeof value[symbolAsyncIterator] == 'function'
  }

  /**
   * @name Instance.prototype.isFunction
   *
   * @synopsis
   * new Instance(x any).isFunction() -> boolean
   */
  isFunction() {
    return typeof this.value == 'function'
  }

  /**
   * @name Instance.prototype.isReadable
   *
   * @synopsis
   * new Instance(x any).isReadable() -> boolean
   */
  isReadable() {
    const x = this.value
    return x != null && typeof x.read == 'function'
  }

  /**
   * @name Instance.prototype.isWritable
   *
   * @synopsis
   * new Instance(x any).isWritable() -> boolean
   */
  isWritable() {
    const x = this.value
    return x != null && typeof x.write == 'function'
  }

  /**
   * @name Instance.prototype.isPromise
   *
   * @synopsis
   * new Instance(x any).isPromise() -> boolean
   */
  isPromise() {
    const x = this.value
    return x != null && typeof x.then == 'function'
  }

  /**
   * @name Instance.prototype.isTypedArray
   *
   * @synopsis
   * new Instance(x any).isTypedArray() -> boolean
   */
  isTypedArray() {
    return ArrayBuffer.isView(this.value)
  }

}

/*
 * @name Instance.isInstance
 *
 * @synopsis
 * Instance.isInstance(x any) -> boolean
 *
 * @catchphrase
 * `false` <- only for `undefined` and `null`
 *
 * @TODO Change to isDefined
 */
Instance.isInstance = x => x != null

/*
 * @name Instance.is
 *
 * @synopsis
 * Instance.is(x any, constructor function) -> boolean
 */
Instance.is = (x, constructor) => x != null && x.constructor == constructor

/*
 * @name Instance.isString
 *
 * @synopsis
 * Instance.isString(x any) -> boolean
 */
Instance.isString = x => (
  typeof x == 'string' || (x != null && x.constructor == String))

/*
 * @name Instance.isNumber
 *
 * @synopsis
 * Instance.isNumber(x any) -> boolean
 */
Instance.isNumber = x => (
  typeof x == 'number' || (x != null && x.constructor == Number))

/*
 * @name Instance.isArray
 *
 * @synopsis
 * Instance.isArray(x any) -> boolean
 */
Instance.isArray = Array.isArray

/*
 * @name Instance.isObject
 *
 * @synopsis
 * Instance.isObject(x any) -> boolean
 */
Instance.isObject = x => x != null && x.constructor == Object

/*
 * @name Instance.isSet
 *
 * @synopsis
 * Instance.isSet(x any) -> boolean
 */
Instance.isSet = x => x != null && x.constructor == Set

/*
 * @name Instance.isMap
 *
 * @synopsis
 * Instance.isMap(x any) -> boolean
 */
Instance.isMap = x => x != null && x.constructor == Map

/*
 * @name Instance.isIterable
 *
 * @synopsis
 * Instance.isIterable(value any) -> boolean
 */
Instance.isIterable = function isIterable(value) {
  return value != null && typeof value[symbolIterator] == 'function'
}

/*
 * @name Instance.isAsyncIterable
 *
 * @synopsis
 * Instance.isAsyncIterable(value any) -> boolean
 */
Instance.isAsyncIterable = function isAsyncIterable(value) {
  return value != null && typeof value[symbolAsyncIterator] == 'function'
}

/*
 * @name Instance.isFunction
 *
 * @synopsis
 * Instance.isFunction(x any) -> boolean
 */
Instance.isFunction = x => typeof x == 'function'

/*
 * @name Instance.isReadable
 *
 * @synopsis
 * Instance.isReadable(x any) -> boolean
 */
Instance.isReadable = x => x != null && typeof x.read == 'function'

/*
 * @name Instance.isWritable
 *
 * @synopsis
 * Instance.isWritable(x any) -> boolean
 */
Instance.isWritable = x => x != null && typeof x.write == 'function'

/*
 * @name Instance.isPromise
 *
 * @synopsis
 * Instance.isPromise(x any) -> boolean
 */
Instance.isPromise = x => x != null && typeof x.then == 'function'

/*
 * @name Instance.isTypedArray
 *
 * @synopsis
 * Instance.isTypedArray(x any) -> boolean
 */
Instance.isTypedArray = ArrayBuffer.isView

module.exports = Instance
