const timeInLoop = require('../x/timeInLoop')
const Instance = require('./Instance')
const _ = require('lodash')
const R = require('ramda')

/*
 * @name Instance.isString
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * typeof 'hey' === 'string': 1e+7: 12.443ms
 * typeof 'hey' == 'string': 1e+7: 11.985ms
 * Instance.isString('hey'): 1e+7: 12.431ms
 * _.isString('hey'): 1e+7: 12.526ms
 *
 * typeof undefined === 'string': 1e+7: 12.249ms
 * typeof undefined == 'string': 1e+7: 12.203ms
 * Instance.isString(undefined): 1e+7: 13.198ms
 * _.isString(undefined): 1e+7: 13.353ms
 *
 * Instance.isString(constructedString): 1e+7: 12.88ms
 * _.isString(constructedString): 1e+7: 12.892ms
 */

// timeInLoop('typeof \'hey\' === \'string\'', 1e7, () => { typeof 'hey' === 'string' })

// timeInLoop('typeof \'hey\' == \'string\'', 1e7, () => { typeof 'hey' == 'string' })

// timeInLoop('Instance.isString(\'hey\')', 1e7, () => { Instance.isString('hey') })

// timeInLoop('_.isString(\'hey\')', 1e7, () => { _.isString('hey') })

// timeInLoop('typeof undefined === \'string\'', 1e7, () => { typeof undefined === 'string' })

// timeInLoop('typeof undefined == \'string\'', 1e7, () => { typeof undefined == 'string' })

// timeInLoop('Instance.isString(undefined)', 1e7, () => { Instance.isString(undefined) })

// timeInLoop('_.isString(undefined)', 1e7, () => { _.isString(undefined) })

const constructedString = String('hey')

// timeInLoop('Instance.isString(constructedString)', 1e7, () => { Instance.isString(constructedString) })

// timeInLoop('_.isString(constructedString)', 1e7, () => { _.isString(constructedString) })

/*
 * @name Instance.isNumber
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * typeof 1 === 'number': 1e+7: 11.981ms
 * typeof 1 == 'number': 1e+7: 11.938ms
 * Instance.isNumber(1): 1e+7: 12.426ms
 * _.isNumber(1): 1e+7: 12.486ms
 *
 * typeof undefined === 'number': 1e+7: 11.817ms
 * typeof undefined == 'number': 1e+7: 11.819ms
 * Instance.isNumber(undefined): 1e+7: 13.263ms
 * _.isNumber(undefined): 1e+7: 13.424ms
 *
 * typeof constructedNumber === 'number': 1e+7: 11.992ms
 * typeof constructedNumber == 'number': 1e+7: 12.029ms
 * Instance.isNumber(constructedNumber): 1e+7: 12.483ms
 * _.isNumber(constructedNumber): 1e+7: 12.515ms
 */

// timeInLoop('typeof 1 === \'number\'', 1e7, () => { typeof 1 === 'number' })

// timeInLoop('typeof 1 == \'number\'', 1e7, () => { typeof 1 == 'number' })

// timeInLoop('Instance.isNumber(1)', 1e7, () => Instance.isNumber(1))

// timeInLoop('_.isNumber(1)', 1e7, () => _.isNumber(1))

// timeInLoop('typeof undefined === \'number\'', 1e7, () => { typeof undefined === 'number' })

// timeInLoop('typeof undefined == \'number\'', 1e7, () => { typeof undefined == 'number' })

// timeInLoop('Instance.isNumber(undefined)', 1e7, () => Instance.isNumber(undefined))

// timeInLoop('_.isNumber(undefined)', 1e7, () => _.isNumber(undefined))

const constructedNumber = Number(1)

// timeInLoop('typeof constructedNumber === \'number\'', 1e7, () => { typeof constructedNumber === 'number' })

// timeInLoop('typeof constructedNumber == \'number\'', 1e7, () => { typeof constructedNumber == 'number' })

// timeInLoop('Instance.isNumber(constructedNumber)', 1e7, () => Instance.isNumber(constructedNumber))

// timeInLoop('_.isNumber(constructedNumber)', 1e7, () => _.isNumber(constructedNumber))

/*
 * @name Instance.isArray
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * Array.isArray([]): 1e+7: 14.019ms
 * Instance.isArray([]): 1e+7: 13.894ms
 * _.isArray([]): 1e+7: 14.014ms
 */

// timeInLoop('Array.isArray([])', 1e7, () => { Array.isArray([]) })

// timeInLoop('Instance.isArray([])', 1e7, () => { Instance.isArray([]) })

// timeInLoop('_.isArray([])', 1e7, () => { _.isArray([]) })

/*
 * @name Instance.isObject
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * _.isObject({}): 1e+7: 13.329ms
 * Instance.isObject({}): 1e+7: 13.757ms
 *
 * isObject1({}): 1e+8: 100.769ms
 * isObject2({}): 1e+8: 100.656ms
 */

const isObject1 = value => value != null && value.constructor == Object

const isObject2 = value => value != null && Object(value) === value

// timeInLoop('_.isObject({})', 1e7, () => { _.isObject({}) })

// timeInLoop('Instance.isObject({})', 1e7, () => { Instance.isObject({}) })

// timeInLoop('isObject1({})', 1e8, () => { isObject1({}) })

// timeInLoop('isObject2({})', 1e8, () => { isObject2({}) })

/*
 * @name Instance.isSet
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * new Set() instanceof Set: 1e+6: 54.717ms
 * _.isSet(new Set()): 1e+6: 62.099ms
 * Instance.isSet(new Set()): 1e+6: 51.353ms
 */

// timeInLoop('new Set() instanceof Set', 1e6, () => { new Set() instanceof Set })

// timeInLoop('_.isSet(new Set())', 1e6, () => { _.isSet(new Set()) })

// timeInLoop('Instance.isSet(new Set())', 1e6, () => { Instance.isSet(new Set()) })

/*
 * @name Instance.isMap
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * new Map().constructor == Map: 1e+6: 57.668ms
 * new Map().constructor === Map: 1e+6: 59.993ms
 * new Map() instanceof Map: 1e+6: 60.385ms
 * _.isMap(new Map()): 1e+6: 65.735ms
 * Instance.isMap(new Map()): 1e+6: 57.714ms
 */

// timeInLoop('new Map().constructor == Map', 1e6, () => { new Map().constructor == Map })

// timeInLoop('new Map().constructor === Map', 1e6, () => { new Map().constructor === Map })

// timeInLoop('new Map() instanceof Map', 1e6, () => { new Map() instanceof Map })

// timeInLoop('_.isMap(new Map())', 1e6, () => { _.isMap(new Map()) })

// timeInLoop('Instance.isMap(new Map())', 1e6, () => { Instance.isMap(new Map()) })

/*
 * @name Instance.isIterable
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * Boolean([][Symbol.iterator]): 1e+7: 12.789ms
 * Boolean([][symbolIterator]): 1e+7: 12.77ms
 * !!([][Symbol.iterator]): 1e+7: 12.656ms
 * !!([][symbolIterator]): 1e+7: 12.689ms
 *
 * Instance.isIterable([]): 1e+7: 13.441ms - Boolean(x[Symbol.iterator])
 * Instance.isIterable([]): 1e+7: 13.127ms - Boolean(x[symbolIterator])
 * Instance.isIterable([]): 1e+7: 13.841ms - !!(x[Symbol.iterator])
 * Instance.isIterable([]): 1e+7: 14.804ms - !!(x[symbolIterator])
 *
 * isIterable1([]): 1e+8: 101.399ms
 * isIterable2([]): 1e+8: 101.262ms
 * isIterable3([]): 1e+8: 100.874ms
 *
 * @remarks
 * Dereferencing Symbol.iterator vs symbolIterator is slower in some cases
 */

const symbolIterator = Symbol.iterator

const isIterable1 = value => value != null && Boolean(value[symbolIterator])

const isIterable2 = value => value != null && symbolIterator in value

const isIterable3 = value => value != null && typeof value[symbolIterator] == 'function'

// timeInLoop('Boolean([][Symbol.iterator])', 1e7, () => { Boolean([][Symbol.iterator]) })

// timeInLoop('Boolean([][symbolIterator])', 1e7, () => { Boolean([][symbolIterator]) })

// timeInLoop('!!([][Symbol.iterator])', 1e7, () => { !!([][Symbol.iterator]) })

// timeInLoop('!!([][symbolIterator])', 1e7, () => { !!([][symbolIterator]) })

// timeInLoop('Instance.isIterable([])', 1e7, () => Instance.isIterable([]))

// timeInLoop('isIterable1([])', 1e8, () => isIterable1([]))

// timeInLoop('isIterable2([])', 1e8, () => isIterable2([]))

// timeInLoop('isIterable3([])', 1e8, () => isIterable3([]))

/*
 * @name Instance.isAsyncIterable
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * Boolean([][Symbol.asyncIterator]): 1e+7: 12.784ms
 * Boolean([][symbolAsyncIterator]): 1e+7: 14.044ms
 * !!([][Symbol.asyncIterator]): 1e+7: 12.652ms
 * !!([][symbolAsyncIterator]): 1e+7: 13.846ms
 *
 * Instance.isAsyncIterable([]): 1e+7: 13.415ms Boolean(x[Symbol.asyncIterator])
 * Instance.isAsyncIterable([]): 1e+7: 13.061ms Boolean(x[symbolAsyncIterator])
 * Instance.isAsyncIterable([]): 1e+7: 15.02ms !!(x[Symbol.asyncIterator])
 * Instance.isAsyncIterable([]): 1e+7: 15.205ms !!(x[symbolAsyncIterator])
 *
 * isAsyncIterable1([]): 1e+8: 101.159ms
 * isAsyncIterable2([]): 1e+8: 101.132ms
 * isAsyncIterable3([]): 1e+8: 100.894ms
 */

const symbolAsyncIterator = Symbol.asyncIterator

const isAsyncIterable1 = value => value != null && Boolean(value[symbolAsyncIterator])

const isAsyncIterable2 = value => value != null && symbolAsyncIterator in value

const isAsyncIterable3 = value => value != null && typeof value[symbolAsyncIterator] == 'function'

// timeInLoop('Boolean([][Symbol.asyncIterator])', 1e7, () => { Boolean([][Symbol.asyncIterator]) })

// timeInLoop('Boolean([][symbolAsyncIterator])', 1e7, () => { Boolean([][symbolAsyncIterator]) })

// timeInLoop('!!([][Symbol.asyncIterator])', 1e7, () => { !!([][Symbol.asyncIterator]) })

// timeInLoop('!!([][symbolAsyncIterator])', 1e7, () => { !!([][symbolAsyncIterator]) })

// timeInLoop('Instance.isAsyncIterable([])', 1e7, () => Instance.isAsyncIterable([]))

// timeInLoop('isAsyncIterable1([])', 1e8, () => isAsyncIterable1([]))

// timeInLoop('isAsyncIterable2([])', 1e8, () => isAsyncIterable2([]))

// timeInLoop('isAsyncIterable3([])', 1e8, () => isAsyncIterable3([]))

/*
 * @name Instance.isFunction
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * typeof function(){} == 'function': 1e+7: 12.811ms
 * typeof function(){} === 'function': 1e+6: 5.016ms
 * (function(){}) instanceof Function: 1e+6: 21.784ms
 * _.isFunction: 1e+6: 71.169ms
 *
 * Instance.isFunction: 1e+6: 5.132ms - typeof x == 'function'
 * Instance.isFunction: 1e+6: 5.236ms - typeof x === 'function'
 */

// timeInLoop('typeof function(){} == \'function\'', 1e7, () => { typeof (function(){}) == 'function' })

// timeInLoop('typeof function(){} === \'function\'', 1e6, () => { typeof (function(){}) === 'function' })

// timeInLoop('(function(){}) instanceof Function', 1e6, () => { (function(){}) instanceof Function })

// timeInLoop('_.isFunction', 1e6, () => _.isFunction(function(){}))

// timeInLoop('Instance.isFunction', 1e6, () => Instance.isFunction(function(){}))

/*
 * @name Instance.isReadable
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * typeof ({ read(){} }).read == 'function': 1e+7: 14.234ms
 * typeof ({ read(){} }).read === 'function': 1e+7: 14.125ms
 *
 * Instance.isReadable({ read(){} }): 1e+7: 14.885ms - typeof x.read == 'function'
 * Instance.isReadable({ read(){} }): 1e+7: 14.966ms - typeof x.read === 'function'
 */

// timeInLoop('typeof ({ read(){} }).read == \'function\'', 1e7, () => { typeof ({ read(){} }).read == 'function' })

// timeInLoop('typeof ({ read(){} }).read === \'function\'', 1e7, () => { typeof ({ read(){} }).read == 'function' })

// timeInLoop('Instance.isReadable({ read(){} })', 1e7, () => Instance.isReadable({ read(){} }))

/*
 * @name Instance.isWritable
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * typeof ({ write(){} }).write == 'function': 1e+7: 14.096ms
 * typeof ({ write(){} }).write === 'function': 1e+7: 14.126ms
 *
 * Instance.isWritable({ write(){} }): 1e+7: 14.899ms - typeof x.write == 'function'
 * Instance.isWritable({ write(){} }): 1e+7: 15.029ms - typeof x.write === 'function'
 */

// timeInLoop('typeof ({ write(){} }).write == \'function\'', 1e7, () => { typeof ({ write(){} }).write == 'function' })

// timeInLoop('typeof ({ write(){} }).write === \'function\'', 1e7, () => { typeof ({ write(){} }).write == 'function' })

// timeInLoop('Instance.isWritable({ write(){} })', 1e7, () => Instance.isWritable({ write(){} }))

/*
 * @name Instance.isPromise
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * Promise.resolve() instnaceof Promise: 1e+6: 18.719ms
 * typeof Promise.resolve().then == 'function': 1e+6: 18.365ms
 * typeof Promise.resolve().then === 'function': 1e+6: 19.201ms
 *
 * Instance.isPromise(Promise.resolve()): 1e+6: 19.341ms - typeof x.then == 'function'
 * Instance.isPromise(Promise.resolve()): 1e+6: 19.974ms - typeof x.then === 'function'
 */

// timeInLoop('Promise.resolve() instnaceof Promise', 1e6, () => { Promise.resolve() instanceof Promise })

// timeInLoop('typeof Promise.resolve().then == \'function\'', 1e6, () => { typeof Promise.resolve().then == 'function' })

// timeInLoop('typeof Promise.resolve().then === \'function\'', 1e6, () => { typeof Promise.resolve().then === 'function' })

// timeInLoop('Instance.isPromise(Promise.resolve())', 1e6, () => Instance.isPromise(Promise.resolve()))

/*
 * @name Instance.isTypedArray
 *
 * @node_version 14.3.0
 *
 * @benchmark
 * Instance.isTypedArrayCandidate0(new Uint8Array): 1e+6: 91.477ms
 * Instance.isTypedArrayCandidate0(new Uint8Array): 1e+6: 51.18ms
 */

// timeInLoop('Instance.isTypedArrayCandidate0(new Uint8Array)', 1e6, () => Instance.isTypedArrayCandidate0(new Uint8Array))

// timeInLoop('Instance.isTypedArrayCandidate0(new Uint8Array)', 1e6, () => Instance.isTypedArrayCandidate1(new Uint8Array))

/*
 * @name
 *
 * @node_version 14.3.0
 *
 * @benchmark
 */

// timeInLoop('', 1e6, () => {})
