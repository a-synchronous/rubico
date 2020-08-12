const timeInLoop = require('./timeInLoop')
const isDeepEqual = require('./isDeepEqual')
const _ = require('lodash')
const R = require('ramda')

/**
 * @name isDeepEqual
 *
 * @benchmark
 * isDeepEqual(arr, arrCopy): 1e+5: 101.307ms
 * _.isEqual(arr, arrCopy): 1e+5: 149.487ms
 * R.equals(arr, arrCopy): 1e+5: 1.538s
 *
 * isDeepEqual(arr, arrDiff): 1e+5: 22.642ms
 * _.isEqual(arr, arrDiff): 1e+5: 76.985ms
 * R.equals(arr, arrDiff): 1e+5: 456.832ms
 */

const arr = [1, [2], [[3]]]

const arrCopy = [1, [2], [[3]]]

const arrDiff = [1, 2, 3]

// timeInLoop('isDeepEqual(arr, arrCopy)', 1e5, () => isDeepEqual(arr, arrCopy))

// timeInLoop('_.isEqual(arr, arrCopy)', 1e5, () => _.isEqual(arr, arrCopy))

// timeInLoop('R.equals(arr, arrCopy)', 1e5, () => R.equals(arr, arrCopy))

// timeInLoop('isDeepEqual(arr, arrDiff)', 1e5, () => isDeepEqual(arr, arrDiff))

// timeInLoop('_.isEqual(arr, arrDiff)', 1e5, () => _.isEqual(arr, arrDiff))

// timeInLoop('R.equals(arr, arrDiff)', 1e5, () => R.equals(arr, arrDiff))
