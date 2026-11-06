require("./global.js")

const array = [{ value: 3 }, { value: 1 }, { value: 5 }, { value: 4 }, { value: 2 }]

const comparator = gt(get("value"), get("value"))

array.sort(switchCase(comparator, 1, -1))

console.log(array)
