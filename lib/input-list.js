'use strict'

// used for fs.readdir() to get files list.
const fs = require('fs')

module.exports = function inputList(options, done) {

  // only get the names if they didn't provide them for us.
  // this allows them to provide the info explicitly.

  if (options.inputNames) {
    done()
  }

  else {
    fs.readdir(options.inputDir, function acceptInputs(error, files) {

      // set filenames into options.inputNames so it's a queue we go thru.
      options.inputNames = files

      done(error)
    })
  }

}
