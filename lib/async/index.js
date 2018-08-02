'use strict'

// used to convert string path to file into the function to thrash.
const loadFn = require('./loadFn.js')

// the primary "next task" to do the async sequence.
const loopInputs = require('./async/loopInputs.js')

module.exports = function async(options, done, control) {

  // do these for single-function thrashing.
  if (options.fnNames.length < 1) {
    loadFn(options)                 // load the function we're going to thrash.
    options.print.fnHeader(options) // print the header before doing inputs.
  }

  // this task will handle adding tasks differently for single/multi functions.
  control.queue(loopInputs)
}


function start(options, done, control) {

  // if we haven't processed all inputs yet...
  if (options.inputIndex < options.inputNames.length) {

    control.queue([
      prep,    // reads next input and prepares a result.
      valid,   // tests function to produce `valid.result` (optional).
      optimal, // tests function is optimizable (optional).
      thrash,  // tests performance.
      start,   // come back here to start the next input, if it exists.
    ])
  }

  done()
}