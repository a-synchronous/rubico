const { eq, get } = require('..')

const is = constructor => x => eq(() => constructor, get('constructor'))(x)

module.exports = is
