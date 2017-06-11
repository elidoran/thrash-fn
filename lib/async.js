var prep    = require('./async-prep.js')
var valid   = require('./async-validate.js')
var optimal = require('./async-optimize.js')
var thrash  = require('./thrash-async.js')
var print   = require('./print.js')

// prints the header *once* and then starts the `async`
module.exports = function async(options, done, control) {
  print.header(options)
  start(options, done, control)
}

function start(options, done, control) {

  if (options.files.length > 0) {
    control.queue([
      prep,    // reads next input and prepares a result
      valid,   // tests function produces valid result (optional)
      optimal, // tests function is optimizable (optional)
      thrash,  // tests performance
      start,   // come back here to start the next input, if it exists.
    ])
  }

  done()
}
