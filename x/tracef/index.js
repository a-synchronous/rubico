"use strict";
var __1 = require("../..");
var tracef = function (transformationFn) { return function (x) { return __1.tap(__1.pipe([
    transformationFn,
    console.log,
]))(x); }; };
tracef["default"] = tracef;
module.exports = tracef;
