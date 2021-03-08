const rubico = require('./rubico')
const rubicoX = require('./x')
const rubicoVersion = require('./package.json').version
const fs = require('fs')
const nodePath = require('path')
const { minify } = require('terser')

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
  identity,
  noop,
  trace,
  last,
  isEmpty,
  find,
  forEach,
  flatten,
  isObject,
} = rubicoX

const Stdout = {
  concat(...args) {
    console.log(...args)
    return this
  },
}

const split = delimiter => value => value.split(delimiter)

const slice = (from, to) => value => value.slice(from, to < 0 ? value.length + to : to)

const toString = value => value.toString()

const replace = (pattern, replacement) => value => value.replace(pattern, replacement)

const startsWith = pattern => value => value.startsWith(pattern)

const endsWith = pattern => value => value.endsWith(pattern)

const has = item => value => value.has(item)

const isArray = Array.isArray

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
            /const \w+ = require\('(.+)'\)/,
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

const ignoredNames = new Set([
  'is',
  'heapUsedInLoop',
  'timeInLoop',
  'tracef',
])

// name string => boolean
const nameIsIgnored = name => ignoredNames.has(name)

pipe([
  tap(tryCatch(
    thunkify(fs.promises.rm, `${__dirname}/dist`, { recursive: true }),
    noop)),
  tap(thunkify(fs.promises.mkdir, `${__dirname}/dist/x`, { recursive: true })),
  transform(
    pipe([
      filter(pipe([
        get('name'),
        not(nameIsIgnored),
      ])),
      map(assign({
        baseCodeBundle: pipe([
          get('path'),
          pathToCodeBundle,
        ]),
      })),

      map(switchCase([
        eq('esm', get('type')),
        assign({
          codeBundle: ({ name, baseCodeBundle }) => `
/**
 * rubico v${rubicoVersion}
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
${baseCodeBundle}export default ${name}
`.trimStart(),
        }),
        eq('esm-minified', get('type')),
        assign({
          codeBundle: async ({ name, baseCodeBundle }) => `
/**
 * rubico v${rubicoVersion}
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
${(await minify(`${baseCodeBundle}export default ${name}`)).code}
`.trimStart(),
        }),
        eq('cjs', get('type')),
        assign({
          codeBundle: ({ name, baseCodeBundle }) => `
/**
 * rubico v${rubicoVersion}
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, ${name}) {
  if (typeof module == 'object') (module.exports = ${name}) // CommonJS
  else if (typeof define == 'function') define(() => ${name}) // AMD
  else (root.${name} = ${name}) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'
${baseCodeBundle}return ${name}
}())))
`.trimStart(),
        }),
        eq('cjs-minified', get('type')),
        assign({
          codeBundle: async ({ name, baseCodeBundle }) => `
/**
 * rubico v${rubicoVersion}
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

${(await minify(`(function (root, ${name}) {
  if (typeof module == 'object') (module.exports = ${name}) // CommonJS
  else if (typeof define == 'function') define(() => ${name}) // AMD
  else (root.${name} = ${name}) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'
${baseCodeBundle}return ${name}
}())))`)).code}
`.trimStart(),
        }),
        function throwingUnrecognizedTypeError({ name, type }) {
          throw new TypeError(`${name} - unrecognized type ${type}`)
        }
      ])),

      forEach(pipe([
        get('distPath'),
        replace(process.env.HOME, '~'),
        curry.arity(2, console.log, 'writing', __),
      ])),
    ]),
    {
      async concat({ distPath, codeBundle }) {
        await fs.promises.writeFile(distPath, codeBundle)
        return this
      },
    },
    // Stdout,
    null,
  ),
])([

  Object.keys(rubico).map(pipe([
    fork({
      name: identity,
      path: pipe([
        name => `${name}.js`,
        curry.arity(2, pathResolve, __dirname, __),
      ]),
    }),
  ])).flatMap(fork([

    assign({
      type: always('esm'),
      distPath: pipe([
        get('name'),
        name => `${name}.es.js`,
        curry.arity(3, pathResolve, __dirname, 'dist', __),
      ]),
    }),
    assign({
      type: always('esm-minified'),
      distPath: pipe([
        get('name'),
        name => `${name}.es.min.js`,
        curry.arity(3, pathResolve, __dirname, 'dist', __),
      ]),
    }),

    assign({
      type: always('cjs'),
      distPath: pipe([
        get('name'),
        name => `${name}.js`,
        curry.arity(3, pathResolve, __dirname, 'dist', __),
      ]),
    }),
    assign({
      type: always('cjs-minified'),
      distPath: pipe([
        get('name'),
        name => `${name}.min.js`,
        curry.arity(3, pathResolve, __dirname, 'dist', __),
      ]),
    }),
  ])),
  Object.keys(rubicoX).map(pipe([
    fork({
      name: identity,
      path: pipe([
        name => `${name}.js`,
        curry.arity(3, pathResolve, __dirname, 'x', __),
      ]),
    }),

  ])).flatMap(fork([
    assign({
      type: always('esm'),
      distPath: pipe([
        get('name'),
        name => `${name}.es.js`,
        curry.arity(3, pathResolve, __dirname, 'dist/x', __),
      ]),
    }),
    assign({
      type: always('esm-minified'),
      distPath: pipe([
        get('name'),
        name => `${name}.es.min.js`,
        curry.arity(3, pathResolve, __dirname, 'dist/x', __),
      ]),
    }),

    assign({
      type: always('cjs'),
      distPath: pipe([
        get('name'),
        name => `${name}.js`,
        curry.arity(3, pathResolve, __dirname, 'dist/x', __),
      ]),
    }),
    assign({
      type: always('cjs-minified'),
      distPath: pipe([
        get('name'),
        name => `${name}.min.js`,
        curry.arity(3, pathResolve, __dirname, 'dist/x', __),
      ]),
    }),
  ])),

  [
    {
      name: 'rubico',
      type: 'esm',
      path: pathResolve(__dirname, 'rubico.js'),
      distPath: pathResolve(__dirname, 'es.js'),
    },
    {
      name: 'rubico',
      type: 'cjs',
      path: pathResolve(__dirname, 'rubico.js'),
      distPath: pathResolve(__dirname, 'index.js'),
    },
    {
      name: 'rubico',
      type: 'esm',
      path: pathResolve(__dirname, 'rubico.js'),
      distPath: pathResolve(__dirname, 'dist', 'rubico.es.js'),
    },

    {
      name: 'rubico',
      type: 'esm-minified',
      path: pathResolve(__dirname, 'rubico.js'),
      distPath: pathResolve(__dirname, 'dist', 'rubico.es.min.js'),
    },
    {
      name: 'rubico',
      type: 'cjs',
      path: pathResolve(__dirname, 'rubico.js'),
      distPath: pathResolve(__dirname, 'dist', 'rubico.js'),
    },
    {
      name: 'rubico',
      type: 'cjs-minified',
      path: pathResolve(__dirname, 'rubico.js'),
      distPath: pathResolve(__dirname, 'dist', 'rubico.min.js'),
    },
  ],

  /* TODO fix name conflicts
  [
    {
      name: 'rubicoX',
      type: 'esm',
      path: pathResolve(__dirname, 'x', 'index.js'),
      distPath: pathResolve(__dirname, 'dist', 'rubico-x.es.js'),
    },
    {
      name: 'rubicoX',
      type: 'cjs',
      path: pathResolve(__dirname, 'x', 'index.js'),
      distPath: pathResolve(__dirname, 'dist', 'rubico-x.js'),
    },
    {
      name: 'rubicoX',
      type: 'esm-minified',
      path: pathResolve(__dirname, 'x', 'index.js'),
      distPath: pathResolve(__dirname, 'dist', 'rubico-x.es.min.js'),
    },
    {
      name: 'rubicoX',
      type: 'cjs-minified',
      path: pathResolve(__dirname, 'x', 'index.js'),
      distPath: pathResolve(__dirname, 'dist', 'rubico-x.min.js'),
    },
  ],
  */
].flat(1))
