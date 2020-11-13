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
 * isDeepEqual(arr, arrDiff): 1e+5: 22.642ms
 * _.isEqual(arr, arrDiff): 1e+5: 76.985ms
 * R.equals(arr, arrDiff): 1e+5: 456.832ms
 *
 * richytong [2020-10-01]
 * isDeepEqual(arr, arrCopy): 1e+5: 28.929ms
 * _.isEqual(arr, arrCopy): 1e+5: 151.338ms
 * R.equals(arr, arrCopy): 1e+5: 1.579s
 * isDeepEqual(arr, arrDiff): 1e+5: 12.552ms
 * _.isEqual(arr, arrDiff): 1e+5: 76.846ms
 * R.equals(arr, arrDiff): 1e+5: 467.502ms
 *
 * richytong [2020-11-12]
 * isDeepEqual(arr, arrCopy): 1e+5: 23.445ms
 * _.isEqual(arr, arrCopy): 1e+5: 140.304ms
 * R.equals(arr, arrCopy): 1e+5: 1.607s
 * isDeepEqual(arr, arrDiff): 1e+5: 10.757ms
 * _.isEqual(arr, arrDiff): 1e+5: 75.698ms
 * R.equals(arr, arrDiff): 1e+5: 466.476ms
 */

const arr = [1, [2], [[3]]]

const arrCopy = [1, [2], [[3]]]

const arrDiff = [1, 2, 3]

// console.log(isDeepEqual(arr, arrCopy))
// console.log(isDeepEqual(arr, arrDiff))
// console.log(_.isEqual(arr, arrCopy))
// console.log(_.isEqual(arr, arrDiff))
// console.log(R.equals(arr, arrCopy))
// console.log(R.equals(arr, arrDiff))

// timeInLoop('isDeepEqual(arr, arrCopy)', 1e5, () => isDeepEqual(arr, arrCopy))

// timeInLoop('_.isEqual(arr, arrCopy)', 1e5, () => _.isEqual(arr, arrCopy))

// timeInLoop('R.equals(arr, arrCopy)', 1e5, () => R.equals(arr, arrCopy))

// timeInLoop('isDeepEqual(arr, arrDiff)', 1e5, () => isDeepEqual(arr, arrDiff))

// timeInLoop('_.isEqual(arr, arrDiff)', 1e5, () => _.isEqual(arr, arrDiff))

// timeInLoop('R.equals(arr, arrDiff)', 1e5, () => R.equals(arr, arrDiff))
