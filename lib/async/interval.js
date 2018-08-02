var seconds   = require('../seconds.js')
var calculate = require('../calculate.js')

module.exports = function interval(options, done) {
  var result, input, index, context, args, hrtime, fn

  result = options.results
  input  = options.input
  index  = options.results.count
  fn     = options.fn

  // generate new context/args (may return the same one every time)
  context = input.context()
  args    = input.args()

  args.push(next) // add our callback

  run() // start the async run's

  function run() {
    if (input.before) input.before(options) // requiring a sync function...

    hrtime = process.hrtime() // use high resolution: nanoseconds

    fn.apply(context, args)
  }

  // add our callback
  function next(error) {
    // NOTE: due to async processing the tracked time includes the time to
    //       call this callback and reach this point.
    var time = seconds(process.hrtime(hrtime))

    if (input.after) input.after(options) // requiring a sync function...

    args.pop()

    if (error) { done(error) }

    else { // another run or we're done based on `interval`
      index++ // count run()'s we complete
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
        run()
      }

      else { // we're done with this interval.
        result.count    = index
        options.certain = calculate(result)
        print(options.filename, result, options, false) // false = not final print.
        done()
      }
    }
  }
}
