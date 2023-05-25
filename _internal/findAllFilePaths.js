const fs = require('fs')
const pathResolve = require('./pathResolve')

// findAllFilePaths(path string) -> filePaths Promise<Array<string>>
const findAllFilePaths = async function (path) {
  const files = await fs.promises.readdir(path, {
    withFileTypes: true,
    recursive: true,
  })
  const result = []
  for (const file of files) {
    if (file.isDirectory()) {
      const filePaths = await findAllFilePaths(pathResolve(path, file.name))
      result.push(...filePaths)
    } else {
      result.push(pathResolve(path, file.name))
    }
  }
  return result
}

module.exports = findAllFilePaths
