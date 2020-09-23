const rubico = require('.')
const trace = require('./x/trace')
const commentParser = require('comment-parser')
const fs = require('fs')
const path = require('path')
const unified = require('unified')
const markdown = require('remark-parse')

const {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
} = rubico

const isArray = Array.isArray

const identity = value => value

const toString = value => value.toString()

const split = expr => value => value.split(expr)

const slice = (from, to) => value => value.slice(from, to)

const join = delimiter => value => value.join(delimiter)

// tagName string -> parsedComment Object -> boolean
const parsedCommentHasTag = tagName => function lookingForTag(parsedComment) {
  return parsedComment.tags.findIndex(tag => tag.tag == tagName) != -1
}

// (tagName string, defaultValue any?) -> parsedComment Object -> object
const parsedCommentGetTag = (
  tagName, defaultValue,
) => function gettingTag(parsedComment) {
  const tag = parsedComment.tags.find(tag => tag.tag == tagName)
  return tag === undefined ? defaultValue : tag
}

// parsedComment -> boolean
const parsedCommentIsComplete = and([
  parsedCommentHasTag('name'),
  parsedCommentHasTag('synopsis'),
  parsedCommentHasTag('description'),
])

// parsedComment Object -> docName string
const parsedCommentGetName = pipe([parsedCommentGetTag('name'), get('name')])

// tagName string -> parsedComment -> doc Object
const parsedCommentToDocSourceBy = tagName => pipe([
  parsedCommentGetTag(tagName),
  get('source'),
  split('\n'),
  slice(1),
  join('\n'),
])

// parsedComment -> docSource {}
const parsedCommentToDocSource = fork({
  name: parsedCommentGetName,
  synopsis: parsedCommentToDocSourceBy('synopsis'),
  description: parsedCommentToDocSourceBy('description'),
})

const excludedFunctions = new Set([])

// docSource Object -> boolean
const docSourceIsExclusion = docSource => excludedFunctions.has(docSource.name)

// code string => Array<ParsedComments>
const parser = code => commentParser(code, { trim: false })

const markdownParser = unified().use(markdown)

// code string => something
const parseMarkdown = code => markdownParser.parse(code)

// stdout as a Semigroup
const Stdout = {
  concat(...args) {
    console.log(...args)
    return this
  },
}

// code string -> ()
const cronist = pipe([
  parser,
  transform(
    pipe([
      filter(parsedCommentIsComplete),
      map(parsedCommentToDocSource),
      filter(not(docSourceIsExclusion)),
      map(assign({
        mdast: pipe([get('description'), parseMarkdown]),
      })),
    ]),
    Stdout,
    // () => [],
  )
])

const cli = pipe([
  fs.promises.readFile,
  toString,
  cronist,
  // trace,
])

cli('./index.js')
