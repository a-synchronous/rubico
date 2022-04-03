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

module.exports = { debounce }
