'use strict'

const {resolve} = require('path')

const thrash = require('./thrash.js')
const loadFn = require('../loadFn.js')

// select single/multi function style.
module.exports = function sync(options, done) {
  // NOTE: withDefaults() ensures fnNames is non-null.
  if (options.fnNames.length) multiFunction(options, done)

  else singleFunction(options, done)
}

// thrash a single function with multiple inputs.
function singleFunction(options, done) {

  // load function (if not already there)
  // print function name as header
  // iterate inputs
  //   load input
  //   thrash function with next input (prints result, input name tail)
  //   repeat until all inputs are used

  try { // catches require() error

    // if they specified a path to the function's file then require() it.
    loadFn(options)

    // print the function's name as the header.
    // NOTE: can be options.name for an unnamed function.
    options.print.fnHeader(options)

    // TODO: accept return result to check if we had an error?
    iterateInputs(options)

    done()

  } catch(error) {
    done(error)
  }
}


// worker function which may throw an error from require().
// it's wrapped in a try-catch in caller (singleFunction).
function iterateInputs(options) {

  for (const inputName of options.inputNames) {

    // get the input from the file resolved with dir and name.
    // NOTE: if loaded previously then require() cached it.
    const input = require(resolve(options.inputDir, inputName))

    // TODO: accept return result to check if we should stop?
    thrash(inputName, options, input)

    options.print.gap()
  }
}


// thrash multiple functions with all inputs.
function multiFunction(options, done) {
  // iterate inputs
  //   load input
  //   print input as header (after load in case input provides a name)
  //   iterate functions
  //     thrash next function with input
  //     print thrash result with function's name as tail
  //     repeat until all functions are used with input
  //   repeat until all inputs are used with all functions

  try { // catches require() error

    // TODO: accept return result to check if we had an error?
    iterateFns(options)

    done()

  } catch(error) {
    done(error)
  }

}

// worker function which may throw an error from require().
// it's wrapped in a try-catch in caller (multiFunction).
function iterateFns(options) {

  for (const inputName of options.inputNames) {

    // get the input from the file resolved with dir and name.
    // NOTE: if previously require()'d then it's cached.
    const input = require(resolve(options.inputDir, inputName))

    // only print its short name, we already reported its dir...
    // prefer name provided by input itself.
    options.print.inputHeader(input.name || inputName)

    // use input in each implementation function.
    for (const fnName of options.fnNames) {

      // get the implementation.
      // NOTE: if previously require()'d then it's cached.
      options.name = fnName
      options.fn   = require(resolve(options.fnDir, fnName))

      // TODO: accept return result to check if we should stop?
      thrash(fnName, options, input)
    }

    options.print.gap()
  }
}
