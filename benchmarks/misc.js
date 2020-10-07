const timeInLoop = require('../x/timeInLoop')

const thunkify1 = (func, argument) => () => func(argument)

const thunkify2 = (func, arg0, arg1) => () => func(arg0, arg1)

/**
 * @name checkNullOrUndefined
 *
 * @benchmark
 * 'foo' == null: 1e+7: 12.223ms
 * 'foo' === undefined || 'foo' === null: 1e+7: 12.475ms
 * typeof 'foo' === 'undefined' || 'foo' === null: 1e+7: 12.456ms
 */

{
  const timeInLoop = (desc, loopCount, fn) => {
    const d = `${desc}: ${loopCount.toExponential()}`
    console.time(d)
    for (let i = 0; i < loopCount; i++) {
      fn()
    }
    console.timeEnd(d)
  }

  // console.log('null == null', null == null)
  // console.log('undefined == null', undefined == null)
  // console.log('1 == null', 1 == null)
  // console.log('0 == null', 0 == null)
  // console.log('true == null', true == null)
  // console.log('false == null', false == null)
  // console.log('\'foo\' == null', 'foo' == null)

  // timeInLoop('\'foo\' == null', 1e7, () => 'foo' == null)

  // timeInLoop('\'foo\' === undefined || \'foo\' === null', 1e7, () => 'foo' === undefined || 'foo' === null)

  // timeInLoop('typeof \'foo\' === \'undefined\' || \'foo\' === null', 1e7, () => typeof 'foo' === 'undefined' || 'foo' === null)
}

/**
 * @name typeofNumber
 *
 * @benchmark
 * typeof (1) == 'number': 1e+7: 12.459ms
 * (1).constructor == Number: 1e+7: 12.729ms
 */

// timeInLoop('typeof (1) == \'number\'', 1e7, () => { typeof (1) == 'number' })

// timeInLoop('(1).constructor == Number', 1e7, () => { (1).constructor == Number })

/**
 * @name copyArray
 *
 * @benchmark
 * arr.slice(0): 1e+6: 16.683ms
 * arr.slice(): 1e+6: 16.358ms
 * arr.concat(): 1e+6: 176.57ms
 * Array.from(arr): 1e+6: 27.923ms
 * arrayFromForLoopPush(arr): 1e+6: 84.221ms
 * [...arr]: 1e+6: 23.789ms
 */

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const arrayFromForLoopPush = x => {
  const y = []
  for (const xi of x) y.push(xi)
  return y
}

// timeInLoop('arr.slice(0)', 1e6, () => arr.slice(0))

// timeInLoop('arr.slice()', 1e6, () => arr.slice())

// timeInLoop('arr.concat()', 1e6, () => arr.concat())

// timeInLoop('Array.from(arr)', 1e6, () => Array.from(arr))

// timeInLoop('arrayFromForLoopPush(arr)', 1e6, () => arrayFromForLoopPush(arr))

// timeInLoop('[...arr]', 1e6, () => [...arr])

/**
 * @name copyObject
 *
 * @benchmark
 * Object.assign({}, obj): 1e+6: 163.58ms
 * objectFromForLoop(obj): 1e+6: 179.523ms
 * { ...obj }: 1e+6: 46.614ms
 */

const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }

const objectFromForLoop = x => {
  const y = {}
  for (const key in x) y[key] = x[key]
  return y
}

// timeInLoop('Object.assign({}, obj)', 1e6, () => Object.assign({}, obj))

// timeInLoop('objectFromForLoop(obj)', 1e6, () => objectFromForLoop(obj))

// timeInLoop('{ ...obj }', 1e6, () => ({ ...obj }))

/**
 * @name copySet
 *
 * @benchmark
 * new Set(set): 1e+5: 91.358ms
 * setFromForLoop(set): 1e+5: 66.598ms
 */

const set = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

const setFromForLoop = x => {
  const y = new Set()
  for (const item of x) y.add(item)
  return y
}

// timeInLoop('new Set(set)', 1e5, () => new Set(set))

// timeInLoop('setFromForLoop(set)', 1e5, () => setFromForLoop(set))

/**
 * @name copyMap
 *
 * @benchmark
 * new Map(map): 1e+5: 65.702ms
 * mapFromForLoopSpreadOperator(set): 1e+5: 53.743ms
 * mapFromForLoopDestructuring(set): 1e+5: 55.4ms
 */

const map = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])

const mapFromForLoopSpreadOperator = x => {
  const y = new Map()
  for (const entry of x) y.set(...entry)
  return y
}

const mapFromForLoopDestructuring = x => {
  const y = new Map()
  for (const [k, v] of x) y.set(k, v)
  return y
}

// timeInLoop('new Map(map)', 1e5, () => new Map(map))

// timeInLoop('mapFromForLoopSpreadOperator(map)', 1e5, () => mapFromForLoopSpreadOperator(map))

// timeInLoop('mapFromForLoopDestructuring(map)', 1e5, () => mapFromForLoopDestructuring(map))

/**
 * @name conditionalPropertyAccess
 *
 * @benchmark
 * obj.a.b.c: 1e+7: 12.715ms
 * obj.a && obj.a.b && obj.a.b.c: 1e+7: 13.014ms
 * obj.a?.b?.c: 1e+7: 12.885ms
 */

{
  const obj = { a: { b: { c: 3 } } }

  // timeInLoop('obj.a.b.c', 1e7, () => { obj.a.b.c })

  // timeInLoop('obj.a && obj.a.b && obj.a.b.c', 1e7, () => { obj.a && obj.a.b && obj.a.b.c })

  // timeInLoop('obj.a?.b?.c', 1e7, () => { obj.a?.b?.c })
}

/**
 * @name objectIteration
 *
 * @benchmark
 * forKeyInObj: 1e+6: 20.02ms
 * forOwnKeyInObj: 1e+6: 21.986ms
 * objectKeysReduce: 1e+6: 225.397ms
 * objectValuesIterate: 1e+6: 261.689ms
 * objectEntriesIterate: 1e+6: 505.486ms
 */

{
  const obj = { a: 1, b: 2, c: 3 }

  const noop = () => {}

  const forKeyInObj = () => {
    let total = 0
    for (const k in obj) total += obj[k]
    return total
  }

  const hasOwnProperty = Object.prototype.hasOwnProperty

  const hasOwn = (obj, key) => hasOwnProperty.call(obj, key)

  const forOwnKeyInObj = () => {
    let total = 0
    for (const k in obj) {
      if (hasOwn(obj, k)) {
        total += obj[k]
      }
    }
    return total
  }

  const add = (a, b) => a + b

  const objectKeysReduce = () => Object.values(obj).reduce(add)

  const objectValues = function* (object) {
    for (const key in object) {
      yield object[key]
    }
  }

  const objectValuesIterate = () => {
    let total = 0
    for (const value of objectValues(obj)) total += value
    return total
  }

  const objectEntriesIterate = () => {
    let total = 0
    for (const [key, value] of Object.entries(obj)) total += value
    return total
  }

  // const func = forKeyInObj
  // const func = forOwnKeyInObj
  // const func = objectKeysReduce
  // const func = objectValuesIterate
  // const func = objectEntriesIterate

  // console.log(func())
  // timeInLoop(func.name, 1e6, func)
}

/**
 * @name functionCalls
 *
 * @benchmark
 * regularCall: 1e+7: 13.045ms
 * protoCall: 1e+7: 13.261ms
 * boundProtoCall: 1e+7: 13.025ms
 * protoApply: 1e+7: 167.227ms
 * boundProtoApply: 1e+7: 161.647ms
 */

{
  const identity = value => value

  const identityCall = identity.call.bind(identity)

  const identityApply = identity.apply.bind(identity)

  const hey = 'hey'

  const heyArr = ['hey']

  const regularCall = () => identity(hey)

  const protoCall = () => identity.call(null, hey)

  const boundProtoCall = () => identityCall(null, hey)

  const protoApply = () => identity.apply(null, heyArr)

  const boundProtoApply = () => identityApply(null, heyArr)

  // const func = regularCall
  // const func = protoCall
  // const func = boundProtoCall
  // const func = protoApply
  // const func = boundProtoApply

  // console.log(func())
  // timeInLoop(func.name, 1e7, func)
}

/**
 * @name async-await
 *
 * @benchmark
 * async-add: 1e+6: 111.432ms
 * async-add-return-await: 1e+6: 238.221ms
 */

{
  const add = (a, b) => a + b

  // timeInLoop.async('async-add', 1e6, async () => add(1, 2))

  // timeInLoop.async('async-add-return-await', 1e6, async () => await add(1, 2))
}

/**
 * @name functionCreation
 *
 * @benchmark
 * () => {}: 1e+8: 102.585ms
 * function hey() {}: 1e+8: 100.069ms
 * Function(): 1e+6: 557.682ms
 * new Function(): 1e+6: 566.321ms
 */

// timeInLoop('() => {}', 1e8, () => { () => {} })

// timeInLoop('function hey() {}', 1e8, () => { function hey() {} })

// timeInLoop('Function()', 1e6, () => { Function() })

// timeInLoop('new Function()', 1e6, () => { new Function() })

/**
 * @name isArray
 *
 * @benchmark
 * nativeArrayIsArray: 1e+7: 14.438ms
 * preES5IsArray: 1e+7: 174.324ms
 */

{
  const nativeArrayIsArray = Array.isArray

  var str = {}.toString;

  const preES5IsArray = function (obj) {
    try {
      return str.call(obj) === '[object Array]';
    }
    catch (e) {
      return false;
    }
  };

  // timeInLoop('nativeArrayIsArray', 1e7, () => nativeArrayIsArray([]))

  // timeInLoop('preES5IsArray', 1e7, () => preES5IsArray([]))
}

/**
 * @name arrayPush
 *
 * @benchmark
 * arrayPushArrayLength([], 1): 1e+7: 309.364ms
 * arrayPushByProtoBind(array, 1): 1e+7: 405.707ms
 * array.push(1): 1e+7: 307.791ms
 *
 * @note Bo5
 */

const arrayPushArrayLength = function (array, value, index) {
  array[array.length] = value
  return array
}

const arrayProtoPush = Array.prototype.push

{
  const array = []

  const arrayPushByProtoBind = arrayProtoPush.bind(array)

  // timeInLoop('arrayPushArrayLength(array, 1)', 1e7, () => arrayPushArrayLength(array, 1))

  // timeInLoop('arrayPushByProtoBind(array, 1)', 1e7, () => arrayPushByProtoBind(1))

  // timeInLoop('array.push(1)', 1e7, () => array.push(1))
}

const objectAssign1 = Object.assign

const objectAssign2 = (a, b) => ({ ...a, ...b })

/**
 * @name objectAssign
 *
 * @benchmark
 * objectAssign1: 1e+6: 55.65ms
 * objectAssign2: 1e+6: 113.392ms
 */

{
  const objectA = { a: 1, b: 2, c: 3 }

  const objectB = { d: 4, e: 5 }

  // timeInLoop('objectAssign1', 1e6, () => objectAssign1(objectA, objectB))

  // timeInLoop('objectAssign2', 1e6, () => objectAssign2(objectA, objectB))
}

const arrayForEach01 = (array, func) => array.forEach(func)

const arrayForEach02 = function (array, func) {
  const arrayLength = array.length
  let index = -1
  while (++index < arrayLength) {
    func(index)
  }
}

const arrayForEach03 = function (array, func) {
  for (const item of array) {
    func(item)
  }
}

/**
 * @name arrayForEach
 *
 * @benchmark
 * arrayForEach01: 1e+7: 57.411ms
 * arrayForEach02: 1e+7: 86.507ms
 * arrayForEach03: 1e+7: 132.766ms
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const identity = value => value

  // timeInLoop('arrayForEach01', 1e7, thunkify2(arrayForEach01, numbers, identity))

  // timeInLoop('arrayForEach02', 1e7, thunkify2(arrayForEach02, numbers, identity))

  // timeInLoop('arrayForEach03', 1e7, thunkify2(arrayForEach03, numbers, identity))
}

const toBoolean1 = Boolean

const toBoolean2 = value => !!value

/**
 * @name typeCastingBoolean
 *
 * @benchmark
 * Boolean(true): 1e+7: 12.723ms
 * !!true: 1e+7: 13.632ms
 */

// timeInLoop('Boolean(true)', 1e7, () => Boolean(true))

// timeInLoop('!!true', 1e7, () => toBoolean2(true))
