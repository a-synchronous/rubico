const assert = require('assert')
const walk = require('./walk')

const distTest = async function main() {
  const filepaths = []
  for await (const filepath of walk(`${__dirname}/dist`)) {
    filepaths.push(filepath)
  }
  filepaths.push(`${__dirname}/index.js`)
  filepaths.push(`${__dirname}/es.js`)

  for (const path of filepaths) {
    if (
      path.includes('.es')
      || path.endsWith('.mjs')
      || path.includes('es.js')
    ) {
      // TODO
    }
    else {
      const required = require(path)
      console.log('Successfully required', path)

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
        assert.equal(Object.keys(required).length, 6)
      }
    }
  }
}

distTest()
