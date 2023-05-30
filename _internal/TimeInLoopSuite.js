const timeInLoop = require('./timeInLoop')
const timeInLoopAsync = require('./timeInLoopAsync')

/**
 * @name formatRunOutput
 *
 * @synopsis
 * ```coffeescript [specscript]
 * formatRunOutput(
 *   description string,
 *   loopCount number,
 *   duration number
 * ) -> formatted string
 * ```
 */
const formatRunOutput = function (description, loopCount, duration) {
  const formattedDuration = duration < 1e3
    ? `${duration.toFixed(3)}ms`
    : `${(duration / 1e3).toFixed(3)}s`
  return `
${description}: ${loopCount.toExponential()}: ${formattedDuration}
  `.trim()
}

/**
 * @name TimeInLoopSuite
 *
 * @synopsis
 * ```coffeescript [specscript]
 * new TimeInLoopSuite(options? {
 *   loopCount?: number,
 *   runs?: number,
 *   async?: boolean,
 * }) -> TimeInLoopSuite
 * ```
 */
const TimeInLoopSuite = function (options = {}) {
  this.loopCount = options.loopCount ?? 1e6
  this.runs = options.runs ?? 5
  this.isAsync = options.async ?? false
  this.benchmarkCases = []
  this.handlerMap = new Map()
}


/**
 * @name TimeInLoopSuite.prototype.emit
 *
 * @synopsis
 * ```coffeescript [specscript]
 * new TimeInLoopSuite(...).emit(eventName string, event Object) -> ()
 * ```
 */
TimeInLoopSuite.prototype.emit = function (eventName, event) {
  const handlerMap = this.handlerMap
  if (handlerMap.has(eventName)) {
    handlerMap.get(eventName).forEach(handler => handler(event))
  }
}

/**
 * @name TimeInLoopSuite.prototype.on
 *
 * @synopsis
 * ```coffeescript [specscript]
 * new TimeInLoopSuite(...).on(eventName string, handler function) -> ()
 * ```
 */
TimeInLoopSuite.prototype.on = function (eventName, handler) {
  const handlerMap = this.handlerMap
  if (handlerMap.has(eventName)) {
    handlerMap.get(eventName).add(handler)
  } else {
    handlerMap.set(eventName, new Set([handler]))
  }
}

/**
 * @name TimeInLoopSuite.prototype.add
 *
 * @synopsis
 * ```coffeescript [specscript]
 * new TimeInLoopSuite(...).add(description string, func function) -> ()
 * ```
 */
TimeInLoopSuite.prototype.add = function (description, func) {
  const { loopCount, isAsync } = this
  this.benchmarkCases.push({
    description,
    loopCount,
    benchmark: isAsync
      ? () => timeInLoopAsync(description, loopCount, func, { silent: true })
      : () => timeInLoop(description, loopCount, func, { silent: true }),
  })
}

/**
 * @name TimeInLoopSuite.prototype.run
 *
 * @synopsis
 * ```coffeescript [specscript]
 * new TimeInLoopSuite(...).run() -> Promise<>
 * ```
 */
TimeInLoopSuite.prototype.run = async function () {
  const caseBestRuns = []
  for (const { description, loopCount, benchmark } of this.benchmarkCases) {
    const durations = []
    let runCount = 0
    while (runCount < this.runs) {
      const { duration } = await benchmark()
      durations.push(duration)
      runCount += 1
      this.emit('run', { description, duration, loopCount })
    }

    const caseBestDuration = Math.min(...durations)

    const caseBestRun = {
      description,
      duration: caseBestDuration,
      loopCount,
      output: formatRunOutput(description, loopCount, caseBestDuration),
    }

    caseBestRuns.push(caseBestRun)

    this.emit('caseBestRun', caseBestRun)
  }

  const suiteBestRun = caseBestRuns.reduce(
    (suiteBest, run) => run.duration < suiteBest.duration ? run : suiteBest
  )

  this.emit('suiteBestRun', suiteBestRun)
}

module.exports = TimeInLoopSuite
