const assert = require('assert')
const findAllFilePaths = require('./_internal/findAllFilePaths')

const distTest = async function main() {
  const filePaths = await findAllFilePaths(`${__dirname}/dist`)
  filePaths.push(`${__dirname}/index.js`)
  filePaths.push(`${__dirname}/es.js`)

  for (const path of filePaths) {
    if (
      path.includes('.es')
      || path.endsWith('.mjs')
      || path.includes('es.js')
    ) {
      // TODO
    }
    else {
      console.log('Testing', path)
      const required = require(path)

      if (
        path.includes('rubico.js')
        || path.includes('rubico.min.js')
        || path.includes('index.js')
      ) {
        assert.equal(Object.keys(required).length, 31)
      } else if (
        path.includes('Transducer.js')
        || path.includes('Transducer.min.js')
      ) {
        assert.equal(Object.keys(required).length, 5)
      }
    }
  }
}

distTest()
