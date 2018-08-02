'use strict'

const {join, resolve} = require('path')
const prep  = require('./prep.js')

module.exports = function asyncPrep(options, done) {

  options.results = prep.result()
  options.input   = prep.input(options.input)

  done()
}

/* move to loopInput / nextInput
options.inputIndex += 1

const inputName = options.inputNames[options.inputIndex]
const input     = require(resolve(options.inputDir, inputName))

options.input    = prep.input(input)
*/
