const fs = require('fs')

module.exports = function inputList(options, done) {

  // set that into options.files so it's a queue we go thru.
  fs.readdir(options.inputs, function(error, files) {
    // NOTE: see lib/withDefaults.js
    //  predefined this property via defaults so it isn't being added now.
    options.files = files
    done(error)
  })

}
