const fs = require('fs')

/**
 * @name File
 *
 * @synopsis
 * ```coffeescript [specscript]
 * new File(path string) -> File
 * ```
 */
const File = function (path) {
  this.path = path
  this.writeStream = fs.createWriteStream(path)
  return this
}

/**
 * @name File.prototype.write
 *
 * @synopsis
 * ```coffeescript [specscript]
 * new File(...).write(str string) -> ()
 * ```
 */
File.prototype.write = function (str) {
  this.writeStream.write(str)
}

/**
 * @name File.prototype.rm
 *
 * @synopsis
 * ```coffeescript [specscript]
 * new File(...).rm() -> Promise<>
 * ```
 */
File.prototype.rm = async function () {
  await fs.promises.rm(this.path)
}

module.exports = File
