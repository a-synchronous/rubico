const fs = require('fs')
const path = require('path')

const pathResolve = (...args) => path.resolve(...args)

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

const distTest = async function main() {
  const filePaths = await findAllFilePaths(`${__dirname}/dist`)
  for (const path of filePaths) {
    if (path.includes('.es') || path.endsWith('.mjs')) {
      // TODO
      continue
    }
    console.log('Testing', path)
    require(path)
  }
}

distTest()
