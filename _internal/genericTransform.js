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

/**
 * @name genericTransformToNull
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer = (any, any)=>Promise|any
 *
 * genericTransformToNull<
 *   args Array,
 *   transducer Reducer=>Reducer,
 *   result undefined|null,
 * >(args, transducer, result) -> Promise|result
 * ```
 *
 * @description
 * Reduce a value, always returning null or undefined.
 */
const genericTransformToNull = function (args, transducer, result) {
  const nil = genericReduce(args, transducer(noop), null)
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
 *   args ...any,
 *   transducer Reducer=>Reducer,
 *   result Semigroup|any,
 * >(args, transducer, result) -> result
 * ```
 */
const genericTransform = function (args, transducer, result) {
  if (isArray(result)) {
    return genericReduce(args, transducer(arrayExtend), result)
  }
  if (isBinary(result)) {
    const intermediateArray = genericReduce(args, transducer(arrayExtend), [])
    return isPromise(intermediateArray)
      ? intermediateArray.then(curry2(binaryExtend, result, __))
      : binaryExtend(result, intermediateArray)
  }
  if (result == null) {
    return genericTransformToNull(args, transducer, result)
  }

  const resultConstructor = result.constructor
  if (typeof result == 'string' || resultConstructor == String) {
    return genericReduce(args, transducer(add), result)
  }
  if (typeof result.concat == 'function') {
    const __reducer = curry3(callPropUnary, result, 'concat', __)
    return genericReduce(args, transducer(__reducer), result)
  }
  if (typeof result.write == 'function') {
    return genericReduce(args, transducer(streamExtend), result)
  }
  if (resultConstructor == Set) {
    return genericReduce(args, transducer(setExtend), result)
  }
  if (resultConstructor == Object) {
    return genericReduce(args, transducer(objectAssign), result)
  }
  return genericTransformToNull(args, transducer, result)
}

module.exports = genericTransform
