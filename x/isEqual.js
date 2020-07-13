const { eq } = require('..')

const isEqual = (a, b) => eq(a, b)()

module.exports = isEqual
