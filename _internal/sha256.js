const crypto = require('crypto')

const sha256 = value => crypto
  .createHash('sha256')
  .update(value)
  .digest('hex')

module.exports = sha256
