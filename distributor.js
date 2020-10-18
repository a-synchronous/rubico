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
  thunkify, always, // create lazy computations
  curry, __, // partially apply arguments
} = rubico

const {
  trace,
  last,
  isEmpty,
  find,
  forEach,
  flatten,
} = rubicoX

const Stdout = {
  concat(...args) {
    console.log(...args)
    return this
  },
}

const FileSystem = {
  concat(path, chunk) {
  },
}

const identity = value => value

const split = delimiter => value => value.split(delimiter)

const slice = (from, to) => value => value.slice(from, to < 0 ? value.length + to : to)

const toString = value => value.toString()

const replace = (pattern, replacement) => value => value.replace(pattern, replacement)

const startsWith = pattern => value => value.startsWith(pattern)

const endsWith = pattern => value => value.endsWith(pattern)

const pathResolve = nodePath.resolve

const pathDirname = nodePath.dirname

// path string => cjs string
const pathToCode = pipe.sync([
  fs.readFileSync,
  toString,
  replace(/\/\*\*[\s\S]+?\*\//g, ''),
  replace(/module.exports .+?\n/, ''),
])

// path string => codeBundle string
const pathToCodeBundle = pipe([
  fork({
    path: identity,
    code: pathToCode,
  }),

  ({ path, code }) => {
    const alreadyRequiredPaths = new Set()
    let cwd = pathDirname(path),
      result = code
    while (result.includes('require(')) {
      result = result.replace(/const \w+ = require\('(.+)'\)/g, (match, $1) => {
        const requiredPath = pathResolve(cwd, `${$1}.js`)
        if (alreadyRequiredPaths.has(requiredPath)) {
          return ''
        }
        alreadyRequiredPaths.add(requiredPath)
        let requiredCode = pathToCode(requiredPath)

        while (requiredCode.includes('require(')) {
          requiredCode = requiredCode.replace(
            /const \w+ = require\('(.+)'\)/g,
            pipe([
              (match, $1) => $1,
              filename => `${filename}.js`,
              curry.arity(2, pathResolve, pathDirname(requiredPath), __),
              switchCase([
                requiredPath => alreadyRequiredPaths.has(requiredPath),
                always(''),
                pipe([
                  tap(requiredPath => alreadyRequiredPaths.add(requiredPath)),
                  fork({
                    requiredPath: identity,
                    code: pathToCode,
                  }),
                  ({ requiredPath, code }) => {
                    code = code.replace(/const (\w+) = require\('(.+)'\)/g, (match, $1, $2) => {
                      const newPath = pathResolve(pathDirname(requiredPath), $2)
                      const newStatement = `const ${$1} = require('${newPath}')`
                      return newStatement
                    })
                    return code
                  },
                ]),
              ]),
            ]))
        }
        return requiredCode
      })
      result = result.replace(/\n{2,}/g, '\n\n')
    }
    return result
  },
])

transform(
  pipe([
    map(methodName => `${__dirname}/${methodName}.js`),
    map(fork({
      path: identity,
      name: pipe([
        split('/'),
        last,
        switchCase([
          endsWith('.js'),
          slice(0, -3),
          identity,
        ]),
      ]),
      codeBundle: pathToCodeBundle,
    })),
    // map(trace),
    map(assign({
      distPath: pipe([
        get('name'),
        name => `${name}.js`,
        curry(pathResolve, __dirname, 'dist', __),
      ]),
    })),
  ]),
  {
    async concat({ codeBundle, distPath }) {
      const result = await fs.promises.writeFile(distPath, codeBundle)
      console.log('write result', result)
      return this
    },
  },
  // Stdout,
  null,
)([
  Object.keys(rubico),
  Object.keys(rubicoX).map(method => `x/${method}`),
].flat(1))

  /*
pipe([
  Object.keys,
  fork({
    names: identity,
    codeMap: reduce(
      pipe([
        map(filename => `${__dirname}/${filename}.js`),
        map(fork({
          path: identity,
          code: pathToCodeBundle,
        })),
      ])((codeMap, { path, code }) => codeMap.set(path, code)),
      new Map()),
  }),
  tap(({ codeMap }) => {
    for (const [path, code] of codeMap) {
      console.log(`file://${path}\n\/\/ START\n${code}\/\/ END\n`)
    }
  }),
])(rubico)
  */

  /*
pipe([
  Object.keys,
  fork({
    names: identity,
    codeMap: reduce(
      pipe([
        map(filename => `${__dirname}/x/${filename}.js`),
        map(fork({
          path: identity,
          code: pathToCodeBundle,
        })),
      ])((codeMap, { path, code }) => codeMap.set(path, code)),
      new Map()),
  }),
  tap(({ codeMap }) => {
    for (const [path, code] of codeMap) {
      console.log(`file://${path}\n\/\/ START\n${code}\/\/ END\n`)
    }
  }),
])(rubicoX)
*/
