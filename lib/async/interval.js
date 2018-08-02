'use strict'

const seconds   = require('../seconds.js')
const calculate = require('../calculate.js')

module.exports = function interval(options, done) {

  // local aliases.
  const result = options.results
  const input  = options.input
  const fn     = options.fn
  const print  = options.print.result

  // use provided listeners, or, create a no-op function.
  // NOTE: these listeners must be synchronous functions.
  const before = ('function' === typeof input.before) ? input.before : function() {}
  const after  = ('function' === typeof input.after)  ? input.after  : function() {}

  // generate new context/args (may return the same one every time)
  let context = input.context()
  let args    = input.args()

  // count each time.
  let index   = options.results.count

  // use high-res time in both run() and next() functions.
  let hrtime  = null

  args.push(next) // add our callback defined below.

  run() // start the async run's (define right below here)

  function run() {
    before(options)

    hrtime = process.hrtime() // use high resolution: nanoseconds

    fn.apply(context, args)
  }

  // add our callback
  function next(error) {
    // NOTE: due to async processing the tracked time includes the time to
    //       call this callback and reach this point.
    let time = seconds(process.hrtime(hrtime))

    after(options)

    // remove the callback we added (the function we're in now); just in case.
    args.pop()

    // if there was an error then pass that on to the done() callback.
    if (error) { done(error) }

    // otherwise, keep working.
    else { // another run or we're done based on `interval`

      // count run()'s we complete
      index += 1

      // track these for every run()
      result.times.push(time) // remember each time to calculate average
      result.elapsed += time  // track overall time for all runs
      result.min = Math.min(result.min, time)
      result.max = Math.max(result.max, time)

      // if we haven't reached `interval` yet then do another run().
      if (index % options.interval !== 0) {
        context = input.context()  // new context
        args    = input.args()     // new args
        args.push(next)            // add our callback
        run()                      // new run() call with new args/context.
      }

      // we're done with this interval.
      else {
        result.count    = index                       // store back into count.
        options.certain = calculate(result)           // create derivative results.
        // TODO: how does it know to use inputName or fnName ?
        print(options.inputName, result, options, false) // false = not final print.
        done()
      }
    }
  }
}
