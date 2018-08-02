'use strict'

const {join, resolve} = require('path')

const prep  = require('../prep.js')

module.exports = function asyncPrep(options, done) {

  options.results = prep.result()
  options.input   = prep.input(options.input)

  done()
}
