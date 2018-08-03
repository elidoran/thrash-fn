'use strict'

// asynchronous task runner.
const tasks = require('./tasks.js')

// use to ensure default stuff (functions) are available in the `options`.
const withDefaults = require('./withDefaults.js')

// get our options provided as an environment value.
const options = withDefaults(JSON.parse(process.env.THRASH_OPTIONS))

options.result = function(result) {
  // let's not send back the entire array of `times`.
  result.times = null
  process.send({result: result})
}

options.print.fnHeader = function() {}
options.print.inputHeader = function() {}

tasks(options, [

  // use async/sync to run it
  (options.async && './async/index.js') || './sync/index.js'

].map(require), function (error) {
  if (error) {
    console.error(error)
  }
})
