'use strict'

// if a path to the function is provided, instead of a function,
// then require() it.
module.exports = function loadFn(options) {

  if ('string' === typeof options.fn) {
    // remember `fn` path as name unless there already is one.
    options.name = options.name || options.fn

    options.fn = require(resolve(options.fn))
  }

  else {
    options.name = options.name || options.fn.name || options.fn.displayName
  }
}
