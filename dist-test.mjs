import assert from 'assert'
import walk from './walk.mjs'

function assertGlobal() {
  pipe
  compose
  tap
  all
  assign
  tryCatch
  switchCase
  map
  filter
  reduce
  transform
  flatMap
  forEach
  some
  every
  and
  or
  not
  eq
  gt
  lt
  gte
  lte
  get
  set
  pick
  omit
  thunkify
  always
  curry
  __
  Transducer
}

function assertGlobalNoTransducer() {
  pipe
  compose
  tap
  all
  assign
  tryCatch
  switchCase
  map
  filter
  reduce
  transform
  flatMap
  forEach
  some
  every
  and
  or
  not
  eq
  gt
  lt
  gte
  lte
  get
  set
  pick
  omit
  thunkify
  always
  curry
  __
}

function deleteGlobal() {
  delete globalThis.pipe
  delete globalThis.compose
  delete globalThis.tap
  delete globalThis.all
  delete globalThis.assign
  delete globalThis.tryCatch
  delete globalThis.switchCase
  delete globalThis.map
  delete globalThis.filter
  delete globalThis.reduce
  delete globalThis.transform
  delete globalThis.flatMap
  delete globalThis.forEach
  delete globalThis.some
  delete globalThis.every
  delete globalThis.and
  delete globalThis.or
  delete globalThis.not
  delete globalThis.eq
  delete globalThis.gt
  delete globalThis.lt
  delete globalThis.gte
  delete globalThis.lte
  delete globalThis.get
  delete globalThis.set
  delete globalThis.pick
  delete globalThis.omit
  delete globalThis.thunkify
  delete globalThis.always
  delete globalThis.curry
  delete globalThis.__
  delete globalThis.Transducer
}

function assertRubico(rubico) {
  assert(rubico.pipe)
  assert(rubico.compose)
  assert(rubico.tap)
  assert(rubico.all)
  assert(rubico.assign)
  assert(rubico.tryCatch)
  assert(rubico.switchCase)
  assert(rubico.map)
  assert(rubico.filter)
  assert(rubico.reduce)
  assert(rubico.transform)
  assert(rubico.flatMap)
  assert(rubico.forEach)
  assert(rubico.some)
  assert(rubico.every)
  assert(rubico.and)
  assert(rubico.or)
  assert(rubico.not)
  assert(rubico.eq)
  assert(rubico.gt)
  assert(rubico.lt)
  assert(rubico.gte)
  assert(rubico.lte)
  assert(rubico.get)
  assert(rubico.set)
  assert(rubico.pick)
  assert(rubico.omit)
  assert(rubico.thunkify)
  assert(rubico.always)
  assert(rubico.curry)
  assert(rubico.__)
}

function assertTransducer(Transducer) {
  assert(Transducer.map)
  assert(Transducer.filter)
  assert(Transducer.flatMap)
  assert(Transducer.forEach)
  assert(Transducer.passthrough)
  assert(Transducer.tryCatch)
}

const distTest = async function main() {
  await import('./global.mjs')
  assertGlobal()
  deleteGlobal()

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
        assertGlobalNoTransducer()
        deleteGlobal()
      } else if (name.includes('rubico') || name.includes('index.js')) {
        assertRubico(module.default)
      } else if (name.includes('Transducer')) {
        assertTransducer(module.default)
      } else {
        assert(typeof module.default, 'function')
      }
    }
  }

  const moduleX = await import('./x/index.mjs')
  assert.equal(Object.keys(moduleX.default).length, 33)
}

distTest()
