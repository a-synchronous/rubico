const includes = require('./includes')

const isIn = container => function isIn(value) {
  if (container == null || value == null) {
    return false
  }
  if (container.constructor == Set) {
    return container.has(value)
  }
  if (container.constructor == Map) {
    return Array.from(container.values()).includes(value)
  }

  return includes(value)(container)
}

module.exports = isIn
