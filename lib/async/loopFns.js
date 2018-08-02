'use strict'

// used to resolve path to function's file before require()'ing it.
const {resolve} = require('path')

// prepares a results object and ensures input has provider functions.
const prep    = require('./async-prep.js')

// optionally verifies function call result is valid.
const valid   = require('./async-validate.js')

// optionally verifies function is optimizable.
const optimal = require('./async-optimize.js')

// does the real async thrash work.
const thrash  = require('./thrash-async.js')

// exported for use in ./loopInputs.js
module.exports = loopFns

// iterates over `options.fnNames` to thrash each function with
// the current input.
// NOTE: the loopInputs task will iterate to the next input and then
//       recall this loopFns task again.
function loopFns(options, done, control) {

  // increment index to next function.
  // NOTE: withDefaults() starts this at -1 so first increment sets it to 0.
  options.fnIndex += 1

  // if there are more functions to run with the input...
  if (options.fnIndex < options.fnNames.length) {

    // get the name of the next function file and require it.
    options.fnName = options.fnNames[options.fnIndex]
    options.fn     = require(resolve(options.fnDir, options.fnName))

    // now queue up the thrash task to thrash the function with the current input,
    // and this same task to iterate to the next function to thrash, or quit.
    control.queue([
      prep,     // prepare to do a thrash.
      valid,    // optionally validate function.
      optimal,  // optionally verify optimizability.
      thrash,   // thrash fn/input pair!
      loopFns,  // function iterator... (this function we're in)
    ])
  }

  // otherwise we're done looping on the functions.
  else {
    done()
  }
}
