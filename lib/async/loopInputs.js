'use strict'

// iterates of fnNames for multi-function mode.
const loopFns = require('./loopFns.js')

// prepares a results object and ensures input has provider functions.
const prep    = require('./prep.js')

// optionally verifies function call result is valid.
const valid   = require('./validate.js')

// optionally verifies function is optimizable.
const optimal = require('./optimize.js')

// does the real async thrash work.
const thrash  = require('./thrash.js')

// NOTE:
//  can't assign it and declare it at the same time because we need to
//  call it to queue it, so, separate declaration/export lines.
module.exports = loopInputs

// handles sequence of ops for both single and multi function.
function loopInputs(options, done, control) {

  // always move to the next input index.
  // NOTE: it starts as -1 so the first time it's moved to 0.
  options.inputIndex += 1

  // if there are more inputs to process...
  if (options.inputIndex < options.inputNames.length) {

    // get the next input's name and load it.
    // store the info in `options` for use in later tasks.
    options.inputName = options.inputNames[options.inputIndex]            // nextInput
    options.input = require(resolve(options.inputDir, options.inputName)) // loadInput

    // if we're doing a single-function then we queue the thrash task now.
    // NOTE: withDefaults() sets fnNames to an empty array.
    if (options.fnNames.length < 1) {
      // these tasks handle the async thrashing steps for an fn/input pair.
      control.queue([
        prep,     // prepare to do a thrash.
        valid,    // optionally validate function.
        optimal,  // optionally verify optimizability.
        thrash,   // thrash fn/input pair!
      ])
    }

    // else we're doing a multi-function,
    // so we print the current input as the header
    // and queue up the functions looping task.
    else {

      // multi-function prints the current input as the header and
      // then each function's name is on the results line underneath.
      //
      // allow `input.name` to override `options.inputName`.
      options.print.inputHeader(options.input.name || options.inputName)

      // this handles looping over the multiple functions to thrash each with
      // the current input.
      control.queue([loopFns])
    }

    // always the last task added so it returns here repeatedly, until done.
    control.queue([loopInputs])
  }

  // we're all done with the inputs.
  else {
    done()
  }
}
/* single-function:

  loadFn
  printFnHeader
  loopInputs
    nextInput
    loadInput
    thrash fn+input
    loopInputs

multi-function:

  loopInputs
    nextInput
    loadInput
    printInputHeader    -
    loopFunctions       |
      nextFunction      |
      loadFn            | - single does thrash here, instead.
      thrash fn+input   |
      loopFunctions     -
    loopInputs
*/
