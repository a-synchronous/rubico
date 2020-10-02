const timeInLoop = require('./timeInLoop')
const unionWith = require('./unionWith')
const _ = require('lodash')

/**
 * @name unionWith
 *
 * @benchmark
 * unionWith((a, b) => a.a == b.a)(nestedObjects): 1e+5: 95.553ms
 * _.unionWith((a, b) => a.a == b.a)(nestedObjects): 1e+5: 100.701ms
 *
 * richytong 2020-10-01:
 * unionWith((a, b) => a.a == b.a)(nestedObjects): 1e+5: 38.952ms
 * _.unionWith((a, b) => a.a == b.a)(nestedObjects): 1e+5: 101.171ms
 */

const nestedObjects = [
  [{ a: 1 }, { a: 1 }],
  [{ a: 1 }, { a: 2 }, { a: 3 }],
  [{ a: 2 }],
]

const subject = unionWith((a, b) => a.a == b.a)

const _unionWith = _.unionWith

const _subject = _unionWith((a, b) => a.a == b.a)

// console.log(subject(nestedObjects))
// console.log(_unionWith(...nestedObjects, (a, b) => a.a == b.a))

// timeInLoop('unionWith((a, b) => a.a == b.a)(nestedObjects)', 1e5, () => { subject(nestedObjects) })

// timeInLoop('_.unionWith((a, b) => a.a == b.a)(nestedObjects)', 1e5, () => { _unionWith(...nestedObjects, (a, b) => a.a == b.a) })
