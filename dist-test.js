const findAllFilePaths = require('./_internal/findAllFilePaths')

const distTest = async function main() {
  const filePaths = await findAllFilePaths(`${__dirname}/dist`)
  filePaths.push('index.js')
  filePaths.push('es.js')

  for (const path of filePaths) {
    if (path.includes('.es') || path.endsWith('.mjs')) {
      // TODO
    } else if (path == 'es.js') {
      // TODO
    } else if (path == 'index.js') {
      console.log('Testing', path)
      const rubico = require('.')
      console.log(rubico)
    } else {
      console.log('Testing', path)
      require(path)
    }
  }
}

distTest()
