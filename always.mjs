/**
 * rubico may be freely distributed under the CFOSS license.
 */

const always = value => function getter() { return value }

export default always
