require("./global.js")

const myVar = "z"

const log = x => thunkify(console.log, x)

switchCase(
  myVar,
  eq("a"), log("first"),
  eq("b"), log("second"),
  eq("c"), log("third"),
  eq("z"), log("last"),
  log("unknown"),
)
