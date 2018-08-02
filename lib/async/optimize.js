'use strict'

const optimize = require('@optimal/fn')

module.exports = function asyncOptimize(options, done) {

  // if we're supposed to verify it's optimizable.
  // NOTE: withDefaults() ensures non-null, defaults to true.
  if (options.checkOptimize) {

    // local alias.
    const input = options.input

    // generate new args array for this run.
    const args = input.args()

    // @optimal/fn will call the function multiple times.
    // we're in async mode, so, let's provide a callback which will count
    // each execution so we'll know when they are all done.
    // then we move to the next task.
    let count = 0

    args.push(function() {
      // optimizer runs it twice, tells it to optimize next time,
      // then runs it a third time.
      count++
      if (count >= 3) {
        args.pop() // remove this callback function.
        done()     //
      }
    })

    // give the function, context, and args to @optimal/fn to run.
    // NOTE: optimization result is returned despite function being async.
    options.results.optimized = optimize(options.fn, input.context(), args).optimized
  }

  // otherwise, we skip checking optimizability.
  else {
    done()
  }
}
