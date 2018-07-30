var fs = require('fs')
var resolve = require('path').resolve

// checks for `compare` option.
// if found, requires each file in the named directory.
module.exports = function implementationList(options, done) {

  // if we're supposed to lookup implementations to compare...
  if (options.compare) {

    // set that into options.files so it's a queue we go thru.
    fs.readdir(options.compare, function(error, files) {

      if (!error) {
        // prepend directory to file, resolve it, then require it
        options.compare = files.map(resolve.bind(null, options.compare)).map(require)
      }

      done(error)
    })
  }

  else { // otherwise we're done.
    done()
  }
}

// 1 fn, * inputs:

// inputs directory path:
//
//  ok | optimize | ops/sec | deviation | input file name


// * fn, * inputs:

// input file path:
//
//   ok | optimize | ops/sec | deviation | implementation display name
//   .......
//
//   fastest is fastest-display-name
