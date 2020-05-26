#!/usr/bin/env node

const { filter } = require('..')

const uniqueInOrder = filter.withIndex((current, index, array) => {
  if (index === 0) {
    return true
  } else if (current === array[index - 1]) {
    return false
  } else {
    return true
  }
})

console.log(
  uniqueInOrder('AAAABBBCCDAABBB'), // => ABCDAB
  uniqueInOrder('ABBCcAD'), // => ABCcAD
  uniqueInOrder([1,2,2,3,3]), // => [1, 2, 3]
)
