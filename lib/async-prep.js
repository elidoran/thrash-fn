var join    = require('path').join
var resolve = require('path').resolve
var print   = require('./print.js')
var prep    = require('./prep.js')

module.exports = function asyncPrep(options, done) {
  var filename, path, input

  filename = options.files.shift()
  path     = join(options.inputs, filename)
  input    = require(resolve(path))

  print.input(path, input, options)

  options.filename = filename
  options.input    = prep.input(input)
  options.results  = prep.result()

  done()
}
