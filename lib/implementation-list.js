'use strict'

// used for fs.readdir() to get files list.
const fs = require('fs')

// checks for `compare` option and looks up implementation files.
module.exports = function implementationList(options, done) {

  // if we're supposed to lookup implementations to compare...
  //
  // only get the names if they didn't provide them for us.
  // this allows them to provide the info explicitly.

  // NOTE: withDefaults() ensures options.fnNames is non-null.
  if (options.fnDir && !options.fnNames.length) {
    fs.readdir(options.fnDir, function acceptImplementations(error, files) {

      // NOTE: don't require() them because we'll want their names.
      // NOTE: don't resolve() them because we'll want their short names.
      options.fnNames = files

      done(error)
    })
  }

  else {
    done()
  }
}
