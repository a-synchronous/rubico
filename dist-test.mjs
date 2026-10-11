import assert from 'assert'
import walk from './walk.mjs'

const distTest = async function main() {
  await import('./global.mjs')
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
  for await (const filepath of walk(`${import.meta.dirname}/dist`)) {
    filepaths.push(filepath)
  }
  filepaths.push(`${import.meta.dirname}/index.js`)
  filepaths.push(`${import.meta.dirname}/es.js`)

  for (const path of filepaths) {
    if (
      path.includes('.es')
      || path.endsWith('.mjs')
      || path.includes('es.js')
    ) {
      const module = await import(path)
      console.log('Successfully imported', path)

      if (
        path.includes('rubico.js')
        || path.includes('rubico.min.js')
        || path.includes('index.js')
      ) {
        assert.equal(Object.keys(module.default).length, 31)
        assert.equal(typeof module.default.pipe, 'function')
        assert.equal(typeof module.default.compose, 'function')
        assert.equal(typeof module.default.tap, 'function')
        assert.equal(typeof module.default.all, 'function')
        assert.equal(typeof module.default.assign, 'function')
        assert.equal(typeof module.default.tryCatch, 'function')
        assert.equal(typeof module.default.switchCase, 'function')
        assert.equal(typeof module.default.map, 'function')
        assert.equal(typeof module.default.filter, 'function')
        assert.equal(typeof module.default.reduce, 'function')
        assert.equal(typeof module.default.transform, 'function')
        assert.equal(typeof module.default.flatMap, 'function')
        assert.equal(typeof module.default.forEach, 'function')
        assert.equal(typeof module.default.some, 'function')
        assert.equal(typeof module.default.every, 'function')
        assert.equal(typeof module.default.and, 'function')
        assert.equal(typeof module.default.or, 'function')
        assert.equal(typeof module.default.not, 'function')
        assert.equal(typeof module.default.gt, 'function')
        assert.equal(typeof module.default.lt, 'function')
        assert.equal(typeof module.default.gte, 'function')
        assert.equal(typeof module.default.lte, 'function')
        assert.equal(typeof module.default.get, 'function')
        assert.equal(typeof module.default.set, 'function')
        assert.equal(typeof module.default.pick, 'function')
        assert.equal(typeof module.default.omit, 'function')
        assert.equal(typeof module.default.thunkify, 'function')
        assert.equal(typeof module.default.always, 'function')
        assert.equal(typeof module.default.curry, 'function')
        assert.equal(typeof module.default.__, 'symbol')
      } else if (
        path.includes('Transducer.js')
        || path.includes('Transducer.min.js')
      ) {
        assert.equal(Object.keys(module.default).length, 6)
        assert.equal(typeof module.default.map, 'function')
        assert.equal(typeof module.default.filter, 'function')
        assert.equal(typeof module.default.flatMap, 'function')
        assert.equal(typeof module.default.forEach, 'function')
        assert.equal(typeof module.default.passthrough, 'function')
        assert.equal(typeof module.default.tryCatch, 'function')
      }
    }
  }
}

distTest()
