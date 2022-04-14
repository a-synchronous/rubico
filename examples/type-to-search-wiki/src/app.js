const { pipe, switchCase, noop } = rubico

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
  resultList.innerHTML = resultContent.reduce((html, item) => html + template.replace(/\{name\}/g, item), '')
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

const debounce = (func, timeout = 300) => {
  // eslint-disable-next-line init-declarations
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

searchInput.onkeyup = function (event) {
  debounce(() => runSearch(event.target.value), 500)()
}
