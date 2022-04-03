const pipe = require('../../../pipe')
const reduce = require('../../../reduce')
const switchCase = require('../../../switchCase')
const noop = require('../../../x/noop')
const fetchJsonp = require('fetch-jsonp')
const { debounce } = require('./utils')

const searchInput = document.getElementById('search')
const resultList = document.getElementById('results')
const template = document.getElementById('template').innerHTML

const toSearchUrl = search => `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${search}`

const getSearchResult = pipe([
  toSearchUrl,
  fetchJsonp,
  response => response.json(),
])

const selectFoundedNames = result => result[1]

const render = resultContent => {
  resultList.innerHTML = reduce((html, item) => html + template.replace(/\{name\}/g, item), '')(resultContent)
}

const runSearch = pipe([
  getSearchResult,
  switchCase([
    result => Array.isArray(result) && result.length === 4,
    pipe([
      selectFoundedNames,
      render,
    ]),
    noop,
  ]),
])


searchInput.onkeyup = function (event) {
  debounce(() => runSearch(event.target.value), 500)()
}
