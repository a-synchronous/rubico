const rubico = require('.')
const rubicoX = require('./x')
const fs = require('fs')
const nodePath = require('path')

const {
  pipe, tap,
  switchCase, tryCatch,
  fork, assign, get, pick, omit,
  map, filter, reduce, transform, flatMap,
  and, or, not, any, all,
  eq, gt, lt, gte, lte,
  thunkify, always,
  curry, __,
} = rubico

const {
  trace,
  last,
  isEmpty,
  find,
} = rubicoX

const Stdout = {
  concat(...args) {
    console.log(...args)
    return this
  },
}

const identity = value => value

const split = delimiter => value => value.split(delimiter)

const slice = (from, to) => value => value.slice(from, to < 0 ? value.length + to : to)

const toString = value => value.toString()

const replace = (pattern, replacement) => value => value.replace(pattern, replacement)

const startsWith = pattern => value => value.startsWith(pattern)

const pathResolve = nodePath.resolve

const pathDirname = nodePath.dirname

// code string => string
const codeRemoveComments = replace(/\/\*\*[\s\S]+?\*\//g, '')

// code string => string
const codeRemoveExports = replace(/module.exports .+?\n/, '')

// path string => cjs string
const pathToCjs = pipe.sync([
  fs.readFileSync,
  toString,
  codeRemoveComments,
  codeRemoveExports,
])

// path string => bundle string
const pathToBundle = pipe([
  fork({
    path: identity,
    code: pipe([
      fs.promises.readFile,
      toString,
      replace(/\/\*\*[\s\S]+?\*\//g, ''),
    ]),
  }),
  ({ path, code }) => {
    const alreadyRequiredPaths = new Set()
    let cwd = pathDirname(path),
      result = code
    while (result.includes('require(')) {
      result = result.replace(/const \w+ = require\('(.+)'\)/g, (match, $1) => {
        const requiredPath = pathResolve(cwd, `${$1}.js`),
          requiredCwd = pathDirname(requiredPath)
        if (alreadyRequiredPaths.has(requiredPath)) {
          return ''
        }
        alreadyRequiredPaths.add(requiredPath)
        let requiredCode = pathToCjs(requiredPath)

        while (requiredCode.includes('require(')) {
          requiredCode = requiredCode.replace(
            /const \w+ = require\('(.+)'\)/g,
            pipe.sync([
              (match, $1) => $1,
              filename => `${filename}.js`,
              curry.arity(2, pathResolve, requiredCwd, __),
              switchCase([
                requiredPath => alreadyRequiredPaths.has(requiredPath),
                always(''),
                pipe.sync([
                  tap.sync(requiredPath => alreadyRequiredPaths.add(requiredPath)),
                  fs.readFileSync,
                  toString,
                  codeRemoveComments,
                  codeRemoveExports,
                ]),
              ]),
            ]))
        }
        return requiredCode
      })
      result = result.replace(/\n{2,}/g, '\n\n')
      console.log(path, result)
      return result
    }
  },
])

pipe([
  split(/[\n, ]/g),
  filter(not(isEmpty)),
  fork({
    names: identity,
    codeMap: reduce(
      pipe([
        map(filename => `${__dirname}/${filename}.js`),
        map(fork({
          path: identity,
          code: pathToBundle,
        })),
      ])((codeMap, { path, code }) => codeMap.set(path, code)),
      new Map()),
  }),
  trace,
])(`
  pipe, tap,
  switchCase, tryCatch,
  fork, assign, get, pick, omit,
  map, filter, reduce, transform, flatMap,
  and, or, not, any, all,
  eq, gt, lt, gte, lte,
  thunkify, always,
  curry, __,
`)

/*
pipe([
  split(/[\n, ]/g),
  transform(
    pipe([
      filter(not(isEmpty)),
      map(filename => `${__dirname}/${filename}.js`),
      map(fork({
        path: identity,
        code: pipe([
          curry.arity(1, fs.promises.readFile, __),
          toString,
          replace(/\/\*\*[\s\S]+?\*\//g, ''),
        ]),
      })),
      map(assign({
        requiresReplaced: pipe([
          get('code'),
          replace(/require\('(.+)'\)/g, (match, $1) => require.cache[pathResolve()]),
        ]),
        requiresReplaced({ path, code }) {
          return code.replace(
            /require\('(.+)'\)/g,
            (match, $1) => {
              console.log('pathResolve', pathResolve(__dirname, `${$1}.js`))
              const requireModule = require.cache[pathResolve(__dirname, `${$1}.js`)]
              console.log('requireModule', requireModule.exports)
              return requireModule.exports.toString()
            },
          )
        },
      })),
      map(assign({
        name({ path }) {
          return last(path.split('/')).slice(0, -3)
        },
      })),
      map(assign({
        exports({ name, code }) {
          return code.split(/\n+/)
            .find(startsWith('module.exports'))
            .replace('module.exports = ', '')
        },
      })),
    ]),
    Stdout,
  ),
])(`
  pipe, tap,
  switchCase, tryCatch,
  fork, assign, get, pick, omit,
  map, filter, reduce, transform, flatMap,
  and, or, not, any, all,
  eq, gt, lt, gte, lte,
  thunkify, always,
  curry, __,
`)
  */

// console.log(require.cache['/home/richard/code/rubico/curry.js'])
// console.log('curry', require.cache['/home/richard/code/rubico/curry.js'].exports.toString())
// console.log('hey', require.cache['/home/richard/code/rubico/distributor.js'].children)
