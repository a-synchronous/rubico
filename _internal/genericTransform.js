const isPromise = require('./isPromise')
const isArray = require('./isArray')
const isBinary = require('./isBinary')
const callPropUnary = require('./callPropUnary')
const __ = require('./placeholder')
const curry2 = require('./curry2')
const curry3 = require('./curry3')
const always = require('./always')
const noop = require('./noop')
const add = require('./add')
const genericReduce = require('./genericReduce')
const objectAssign = require('./objectAssign')
const arrayExtend = require('./arrayExtend')
const binaryExtend = require('./binaryExtend')
const streamExtend = require('./streamExtend')
const setExtend = require('./setExtend')
const callConcat = require('./callConcat')

/**
 * @name identityTransform
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer = (any, any)=>Promise|any
 *
 * identityTransform<
 *   collection any,
 *   transducer Reducer=>Reducer,
 *   result undefined|null,
 * >(args, transducer, result) -> Promise|result
 * ```
 *
 * @description
 * Reduce a value, always returning the initial result
 */
const identityTransform = function (collection, transducer, result) {
  const nil = genericReduce(collection, transducer(noop), null)
  return isPromise(nil) ? nil.then(always(result)) : result
}

/**
 * @name genericTransform
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer = (any, any)=>Promise|any
 * Semigroup = Array|string|Set|TypedArray
 *   |{ concat: function }|{ write: function }|Object
 *
 * genericTransform<
 *   collection any,
 *   transducer Reducer=>Reducer,
 *   result Semigroup|any,
 * >(collection, transducer, result) -> result
 * ```
 */
const genericTransform = function (collection, transducer, result) {
  if (isArray(result)) {
    return genericReduce(collection, transducer(arrayExtend), result)
  }
  if (isBinary(result)) {
    const intermediateArray = genericReduce(collection, transducer(arrayExtend), [])
    return isPromise(intermediateArray)
      ? intermediateArray.then(curry2(binaryExtend, result, __))
      : binaryExtend(result, intermediateArray)
  }
  if (result == null) {
    return identityTransform(collection, transducer, result)
  }

  const resultConstructor = result.constructor
  if (typeof result == 'string' || resultConstructor == String) {
    // TODO: use array + join over adding
    return genericReduce(collection, transducer(add), result)
  }
  if (typeof result.concat == 'function') {
    return genericReduce(collection, transducer(callConcat), result)
  }
  if (typeof result.write == 'function') {
    return genericReduce(collection, transducer(streamExtend), result)
  }
  if (resultConstructor == Set) {
    return genericReduce(collection, transducer(setExtend), result)
  }
  if (resultConstructor == Object) {
    return genericReduce(collection, transducer(objectAssign), result)
  }
  return identityTransform(collection, transducer, result)
}

module.exports = genericTransform
