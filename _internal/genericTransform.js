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
 *   accum undefined|null,
 * >(args, transducer, accum) -> Promise|accum
 * ```
 *
 * @description
 * Reduce a value, always returning the initial accum
 */
const identityTransform = function (collection, transducer, accum) {
  const nil = genericReduce(collection, transducer(noop), null)
  return isPromise(nil) ? nil.then(always(accum)) : accum
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
 *   accum Semigroup|any,
 * >(collection, transducer, accum) -> accum
 * ```
 */
const genericTransform = function (collection, transducer, accum) {
  if (isArray(accum)) {
    return genericReduce(collection, transducer(arrayExtend), accum)
  }
  if (isBinary(accum)) {
    const intermediateArray = genericReduce(collection, transducer(arrayExtend), [])
    return isPromise(intermediateArray)
      ? intermediateArray.then(curry2(binaryExtend, accum, __))
      : binaryExtend(accum, intermediateArray)
  }
  if (accum == null) {
    return identityTransform(collection, transducer, accum)
  }

  const constructor = accum.constructor
  if (typeof accum == 'string' || constructor == String) {
    const result = genericReduce(collection, transducer(arrayExtend), [accum])
    return isPromise(result)
      ? result.then(curry3(callPropUnary, __, 'join', ''))
      : result.join('')
  }
  if (typeof accum.concat == 'function') {
    return genericReduce(collection, transducer(callConcat), accum)
  }
  if (typeof accum.write == 'function') {
    return genericReduce(collection, transducer(streamExtend), accum)
  }
  if (constructor == Set) {
    return genericReduce(collection, transducer(setExtend), accum)
  }
  if (constructor == Object) {
    return genericReduce(collection, transducer(objectAssign), accum)
  }
  return identityTransform(collection, transducer, accum)
}

module.exports = genericTransform
