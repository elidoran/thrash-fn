var join     = require('path').join
var resolve  = require('path').resolve
var relative = require('path').relative
var thrash   = require('./thrash-sync.js')
var print    = require('./print.js')

module.exports = function sync(options, done) {
  var filename, path, input

  print.header(options)

  while (options.files.length > 0) {
    filename = options.files.shift()
    path     = join(options.inputs, filename)
    input    = require(resolve(path))
    print.input(path, input, options)

    thrash(filename, options, input)
  }

  console.log()
  done()
}
