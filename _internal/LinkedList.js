/**
 * @name LinkedList
 *
 * @docs
 * ```coffeescript [specscript]
 * new LinkedList() -> LinkedList
 * ```
 */
class LinkedList {
  constructor() {
    this.first = null
    this.last = null
    this.length = 0
  }

  // popFirst() -> firstValue any
  popFirst() {
    const first = this.first

    if (first == null) {
      return undefined
    }

    if (first.next) {
      this.first = first.next
    } else {
      this.first = null
    }

    this.length -= 1

    return first.value
  }

  // append(value any) -> undefined
  append(value) {
    const node = { value }
    if (this.first == null) {
      this.first = node
    }

    if (this.last == null) {
      this.last = node
    } else {
      this.last.next = node
      this.last = node
    }

    this.length += 1
  }

}

module.exports = LinkedList
