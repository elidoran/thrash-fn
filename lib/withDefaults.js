'use strict'

const print = require('./print.js')

const defaults = {
  minTime : 60,    // 1 minute
  minCount: 1000,  // 1000 executions
  interval: 1000,  // how often metrics are calculated to consider stopping
  maxTime : 600,   // 10 minutes
  maxCount: 1e9,   // 1 billion executions
  async   : false, // if functions run asynchronously
  spawn   : false, // whether to run performance tests in child processes
  validate: true,  // whether to run input validators
  checkOptimize: true, // whether to check if function is optimizable

  showInputs: true,          // print list of inputs.
  showImplementations: true, // print list of implementations.

  // predefine the below properties which may be used.

  name      : null, // name for single-function thrash (when fn is provided).

  fn        : null, // current function to thrash, or path to a file to require().
  fnDir     : null, // directory to search for implementations to compare.
  fnNames   : [],   // names of files found in `fnDir`.

  inputDir  : null, // directory to search for input files to load.
  inputNames: null, // input file names (within `inputDir` directory).

  // default print functions can be overridden by user specified functions.
  print: print,

  //
  fnIndex   : -1,   // index into fnNames of fn's we're working with.
  fnName    : null, // name of the current function file we're thrashing.
  inputIndex: -1,   // index into inputNames of input we're working with.
  inputName : null, // name of current input file we using to thrash.
  input     : null, // current `input` we're using to thrash.
  results   : null, // current thrash result we're making.

}

// combine their options and our defaults.
module.exports = function withDefaults(options) {

  // store default `print` object so it's used by default. :)
  // NOTE: if left undefined then assign() will use it as `null` when
  //       the user doesn't provide `options.print`.
  var allPrints = print

  // if they specified a `print` property then let's combine with ours
  // so all of them will be combined together.
  // then they can specify one or more of them, instead of all.
  // NOTE: otherwise their `print` sub-property will overwrite the default's
  //       and it may not contain all of them.
  if (options.print) {
    allPrints = Object.assign({}, print, options.print)
  }

  // specify the `allPrints` last so it'll be used over the others.
  // NOTE: we set it to the default print object at the top.
  return Object.assign({}, defaults, options, { print: allPrints })
}
