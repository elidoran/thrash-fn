var resolve = require('path').resolve
var options = JSON.parse(process.env.THRASH_OPTIONS)
var tasks   = require('./tasks.js')

options.fn     = require(resolve(options.fn))
options.files  = [process.env.THRASH_FILENAME]
options.result = function(result) {
  // let's not send back the entire array of `times`.
  result.times = null
  process.send({result: result})
}

tasks(options, [

  // use async/sync to run it
  (options.async && './async.js') || './sync.js'

].map(require), function (error) {
  if (error) {
    console.error(error)
  }
})
