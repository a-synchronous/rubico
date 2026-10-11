import assert from 'assert'
import walk from './walk.mjs'

function assertGlobal() {
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
}

function assertRubico(rubico) {
  assert.equal(Object.keys(rubico).length, 31)
  assert.equal(typeof rubico.pipe, 'function')
  assert.equal(typeof rubico.compose, 'function')
  assert.equal(typeof rubico.tap, 'function')
  assert.equal(typeof rubico.all, 'function')
  assert.equal(typeof rubico.assign, 'function')
  assert.equal(typeof rubico.tryCatch, 'function')
  assert.equal(typeof rubico.switchCase, 'function')
  assert.equal(typeof rubico.map, 'function')
  assert.equal(typeof rubico.filter, 'function')
  assert.equal(typeof rubico.reduce, 'function')
  assert.equal(typeof rubico.transform, 'function')
  assert.equal(typeof rubico.flatMap, 'function')
  assert.equal(typeof rubico.forEach, 'function')
  assert.equal(typeof rubico.some, 'function')
  assert.equal(typeof rubico.every, 'function')
  assert.equal(typeof rubico.and, 'function')
  assert.equal(typeof rubico.or, 'function')
  assert.equal(typeof rubico.not, 'function')
  assert.equal(typeof rubico.gt, 'function')
  assert.equal(typeof rubico.lt, 'function')
  assert.equal(typeof rubico.gte, 'function')
  assert.equal(typeof rubico.lte, 'function')
  assert.equal(typeof rubico.get, 'function')
  assert.equal(typeof rubico.set, 'function')
  assert.equal(typeof rubico.pick, 'function')
  assert.equal(typeof rubico.omit, 'function')
  assert.equal(typeof rubico.thunkify, 'function')
  assert.equal(typeof rubico.always, 'function')
  assert.equal(typeof rubico.curry, 'function')
  assert.equal(typeof rubico.__, 'symbol')
}

function assertTransducer(Transducer) {
  assert.equal(Object.keys(Transducer).length, 6)
  assert.equal(typeof Transducer.map, 'function')
  assert.equal(typeof Transducer.filter, 'function')
  assert.equal(typeof Transducer.flatMap, 'function')
  assert.equal(typeof Transducer.forEach, 'function')
  assert.equal(typeof Transducer.passthrough, 'function')
  assert.equal(typeof Transducer.tryCatch, 'function')
}

const distTest = async function main() {
  await import('./global.mjs')
  assertGlobal()

  const filepaths = []
  for await (const filepath of walk(`${import.meta.dirname}/dist`)) {
    filepaths.push(filepath)
  }
  filepaths.push(`${import.meta.dirname}/rubico.mjs`)
  filepaths.push(`${import.meta.dirname}/es.js`)
  filepaths.push(`${import.meta.dirname}/x/index.mjs`)

  for (const path of filepaths) {
    if (
      path.endsWith('.mjs')
      || path.endsWith('.es.js')
      || path.endsWith('/es.js')
      || path.endsWith('.es.min.js')
    ) {
      const module = await import(path)
      const name = path.split('/').slice(-1)[0]
      console.log('Successfully imported', name)

      if (name.includes('rubico.global')) {
        assertGlobal()
      } else if (name.includes('rubico') || name.includes('index.js')) {
        assertRubico(module.default)
      } else if (name.includes('Transducer')) {
        assertTransducer(module.default)
      } else if (module.default == __) {
        assert(typeof module.default, 'symbol')
      } else {
        assert(typeof module.default, 'function')
      }
    }
  }

  const moduleX = await import('./x/index.mjs')
  assert.equal(Object.keys(moduleX.default).length, 33)
}

distTest()
