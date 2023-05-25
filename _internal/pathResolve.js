const path = require('path')

// pathResolve(...args) -> resolvedPath string
const pathResolve = (...args) => path.resolve(...args)

module.exports = pathResolve
