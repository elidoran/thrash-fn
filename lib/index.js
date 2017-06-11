// run series of asynchronous tasks
var tasks = require('./tasks')

// used to combine the default options with the specified options
var withDefaults = require('./withDefaults')

module.exports = function thrash(options) {

  tasks(withDefaults(options), [

    // get list of input files available
    './input-list.js',

    // spawn each one, or use async/sync to run each one.
    (options.spawn && './spawner.js') || (options.async && './async.js') || './sync.js'

  ].map(require), options.done)

}
