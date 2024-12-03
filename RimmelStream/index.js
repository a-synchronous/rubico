/**
 * @name RimmelStream
 *
 * @synopsis
 * ```coffeescript [specscript]
 * new RimmelStream() -> RimmelStream
 * ```
 */
class RimmelStream {
  constructor() {
    this._i = new Subject()
    this._o = new Subject()
  }

  next(value) {
    return this._i.next(value)
  }

  subscribe(observer) {
    return this._o.subscribe(observer)
  }

  complete() {
    this._i.complete()
  }
}

module.exports = RimmelStream
