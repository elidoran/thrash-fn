var fs = require('fs')

module.exports = function inputList(options, done) {

  // set that into options.files so it's a queue we go thru.
  fs.readdir(options.inputs, function(error, files) {
    options.files = files
    done(error)
  })

}
