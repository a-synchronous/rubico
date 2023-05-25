const findAllFilePaths = require('./_internal/findAllFilePaths')

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
