const assert = require('assert')
const walk = require('./walk')

const distTest = async function main() {
  require('./global')
  assert.equal(typeof globalThis.pipe, 'function')
  assert.equal(typeof globalThis.compose, 'function')
  assert.equal(typeof globalThis.tap, 'function')
  assert.equal(typeof globalThis.all, 'function')
  assert.equal(typeof globalThis.assign, 'function')
  assert.equal(typeof globalThis.tryCatch, 'function')
  assert.equal(typeof globalThis.switchCase, 'function')
  assert.equal(typeof globalThis.map, 'function')
  assert.equal(typeof globalThis.filter, 'function')
  assert.equal(typeof globalThis.reduce, 'function')
  assert.equal(typeof globalThis.transform, 'function')
  assert.equal(typeof globalThis.flatMap, 'function')
  assert.equal(typeof globalThis.forEach, 'function')
  assert.equal(typeof globalThis.some, 'function')
  assert.equal(typeof globalThis.every, 'function')
  assert.equal(typeof globalThis.and, 'function')
  assert.equal(typeof globalThis.or, 'function')
  assert.equal(typeof globalThis.not, 'function')
  assert.equal(typeof globalThis.gt, 'function')
  assert.equal(typeof globalThis.lt, 'function')
  assert.equal(typeof globalThis.gte, 'function')
  assert.equal(typeof globalThis.lte, 'function')
  assert.equal(typeof globalThis.get, 'function')
  assert.equal(typeof globalThis.set, 'function')
  assert.equal(typeof globalThis.pick, 'function')
  assert.equal(typeof globalThis.omit, 'function')
  assert.equal(typeof globalThis.thunkify, 'function')
  assert.equal(typeof globalThis.always, 'function')
  assert.equal(typeof globalThis.curry, 'function')
  assert.equal(typeof globalThis.__, 'symbol')
  assert.equal(typeof globalThis.Transducer, 'object')

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
      // test in dist-test.mjs
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
        assert.equal(typeof required.pipe, 'function')
        assert.equal(typeof required.compose, 'function')
        assert.equal(typeof required.tap, 'function')
        assert.equal(typeof required.all, 'function')
        assert.equal(typeof required.assign, 'function')
        assert.equal(typeof required.tryCatch, 'function')
        assert.equal(typeof required.switchCase, 'function')
        assert.equal(typeof required.map, 'function')
        assert.equal(typeof required.filter, 'function')
        assert.equal(typeof required.reduce, 'function')
        assert.equal(typeof required.transform, 'function')
        assert.equal(typeof required.flatMap, 'function')
        assert.equal(typeof required.forEach, 'function')
        assert.equal(typeof required.some, 'function')
        assert.equal(typeof required.every, 'function')
        assert.equal(typeof required.and, 'function')
        assert.equal(typeof required.or, 'function')
        assert.equal(typeof required.not, 'function')
        assert.equal(typeof required.gt, 'function')
        assert.equal(typeof required.lt, 'function')
        assert.equal(typeof required.gte, 'function')
        assert.equal(typeof required.lte, 'function')
        assert.equal(typeof required.get, 'function')
        assert.equal(typeof required.set, 'function')
        assert.equal(typeof required.pick, 'function')
        assert.equal(typeof required.omit, 'function')
        assert.equal(typeof required.thunkify, 'function')
        assert.equal(typeof required.always, 'function')
        assert.equal(typeof required.curry, 'function')
        assert.equal(typeof required.__, 'symbol')
      } else if (
        path.includes('Transducer.js')
        || path.includes('Transducer.min.js')
      ) {
        assert.equal(Object.keys(required).length, 6)
        assert.equal(typeof required.map, 'function')
        assert.equal(typeof required.filter, 'function')
        assert.equal(typeof required.flatMap, 'function')
        assert.equal(typeof required.forEach, 'function')
        assert.equal(typeof required.passthrough, 'function')
        assert.equal(typeof required.tryCatch, 'function')
      }
    }
  }
}

distTest()
