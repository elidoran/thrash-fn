'use strict'

// used to convert string path to file into the function to thrash.
const loadFn = require('../loadFn.js')

// the primary "next task" to do the async sequence.
const loopInputs = require('./loopInputs.js')

module.exports = function async(options, done, control) {

  // do these for single-function thrashing.
  if (options.fnNames.length < 1) {
    loadFn(options)                 // load the function we're going to thrash.
    options.print.fnHeader(options) // print the header before doing inputs.
  }

  // this task will handle adding tasks differently for single/multi functions.
  control.queue([loopInputs])

  done()
}
