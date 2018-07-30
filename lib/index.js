// run series of asynchronous tasks
var tasks = require('./tasks')

// used to combine the default options with the specified options
var withDefaults = require('./withDefaults')

module.exports = function thrash(options) {

  // this does:
  //  1. combines specified options with the default options.
  //  2. specifies three initial tasks to be require()'d.
  //  3. chooses the 3rd task: spawn, asyn, or sync.
  //  4. provides options, tasks, and optional "done" callback to tasks runner.
  tasks(withDefaults(options), [

    // get list of input files available.
    // NOTE: we do this for testing one function and comparing multiple ones.
    './input-list.js',

    // get list of implementation files, if specified.
    // NOTE: when multiple implementations are specified then we compare them.
    './implementation-list.js',

    // spawn each one, or use async/sync to run each one.
    (options.spawn && './spawner.js') || (options.async && './async.js') || './sync.js'

  ].map(require), options.done)

}
