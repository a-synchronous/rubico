"use strict";
var __1 = require("../..");
var trace = function (x) { return __1.tap(console.log)(x); };
trace["default"] = trace;
module.exports = trace;
