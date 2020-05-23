#!/usr/bin/env node

const { map, tap, transform } = require('..')

function SimpleQueue({ size }) {
  this.size = size
  this.buffer = []
}

SimpleQueue.prototype.push = function(item) {
  this.buffer.push(item)
  if (this.buffer.length > this.size) {
    this.buffer.shift()
  }
  return this
}

SimpleQueue.prototype[Symbol.iterator] = function*() {
  for (const item of this.buffer) {
    yield item
  }
}

const average = iterable => {
  let sum = 0, count = 0
  for (const item of iterable) {
    sum += item
    count += 1
  }
  return sum / count
}

const floatingPointAverage = ({ historySize }) => {
  const queue = new SimpleQueue({ size: historySize })
  return item => {
    queue.push(item)
    const avg = average(queue)
    console.log(queue, avg)
    return avg
  }
}

const numbersStream = {
  /* ... */
  [Symbol.asyncIterator]: async function*() {
    for (let i = 0; i < 1000; i++) yield i
  },
}

transform(
  map(floatingPointAverage({ historySize: 50 })),
  null,
)(numbersStream)

// https://stackoverflow.com/questions/60960080/javascript-transducers-for-a-data-flow-project/61944627#61944627
