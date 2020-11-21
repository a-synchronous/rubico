#!/usr/bin/env node

const { pipe, map, transform } = require('..')

const square = number => number ** 2

const toString = value => value.toString()

const randomInt = () => Math.ceil(Math.random() * 100)

const streamRandomInts = async function* () {
  while (true) {
    yield randomInt()
  }
}

transform(
  map(pipe([square, toString])), process.stdout,
)(streamRandomInts())
