const fs = require('fs')

// findAllFilePaths(path string) -> filePaths Promise<Array<string>>
const findAllFilePaths = async function (path) {
  const files = await fs.promises.readdir(path, {
    withFileTypes: true,
    recursive: true,
  })
  const result = []
  for (const file of files) {
    if (file.isDirectory()) {
      continue
    } else {
      result.push(`${file.path}/${file.name}`)
    }
  }
  return result
}

module.exports = findAllFilePaths
