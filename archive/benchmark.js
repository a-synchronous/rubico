#!/usr/bin/env node

require('./global')
const fs = require('fs')
const File = require('./_internal/File')
const findAllFilePaths = require('./_internal/findAllFilePaths')
const package = require('./package.json')

const file = new File(`${__dirname}/benchmark-output-${package.version}`)

const benchmark = async function (options = {}) {
  const { bestOf = 5 } = options
  const paths = await findAllFilePaths(`${__dirname}/benchmarks`)

  for (const path of paths) {
    const cases = require(path)
    let index = -1

    while (++index < cases.length) {
      const runs = Array.from({ length: bestOf })
        .map(() => cases[index]({ silent: true }))

      const { description, loopCount } = runs[0]
      const bestRun = runs.reduce(
        (currentBest, run) =>
          run.duration < currentBest.duration ? run : currentBest,
      )

      const output = `
${description}: ${loopCount.toExponential()}: ${Math.trunc(bestRun.duration * 1000) / 1000}ms
      `.trim()
      console.log(output)
      file.write(`${output}\n`)
    }
  }
}

setImmediate(async function () {
  console.log(`Benchmarking v${package.version}`)
  benchmark()
})
