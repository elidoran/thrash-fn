var optimize  = require('@optimal/fn')

var prep      = require('./prep.js')
var seconds   = require('./seconds.js')
var calculate = require('./calculate.js')
var print     = require('./print.js').result

module.exports = function thrashSync(filename, options) {
  var result, fn, context, args, index, hrtime, time, input

  result = prep.result()             // create result object with props.
  input  = prep.input(arguments[2])  // ensure args/context are functions

  fn = options.fn // alias

  if (input.validate) { // validate it works correctly...
    result.valid = input.validate(fn.apply(input.context(), input.args()))
  }

  if (options.checkOptimize !== false) { // check if it's optimizable
    result.optimized = optimize(fn, input.context(), input.args()).optimized
  }

  if (input.beforeAll) input.beforeAll(options)

  for (index = 0; true; index++) { // loop until a max is reached or we're certain

    // if maxTime or maxCount have been reached then we quit the loop.
    if (index >= options.maxCount || result.elapsed >= options.maxTime) {
      result.count = index
      calculate(result)
      break
    }

    // if we've reached the minimums and we're at an "interval" then:
    //   1. calculate result so far
    //   2. print the result as a kind of progress update
    //   3. consider stopping (TODO)
    else if (index > 0 && index % options.interval === 0
                       && index >= options.minCount
                       && result.elapsed >= options.minTime) {
      result.count = index // must update count before calculate()

      // calculate() returns true if it's "certain", so, we can stop.
      //   TODO: until I figure out how to tell when we can stop early...
      //   istanbul ignore if
      if (calculate(result)) break // final print happens at function's end

      else {
        print(filename, result, options, false)
        // TODO: avoid building up massive result.times array by storing the
        // result.times based info in a way we can include it in the next calculate().
      }
    }

    // else we keep looping.

    // generate new context/args (may return the same one every time)
    context = input.context()
    args    = input.args()

    if (input.before) input.before(options)

    hrtime  = process.hrtime() // use high resolution: nanoseconds
    fn.apply(context, args)
    time = seconds(process.hrtime(hrtime))

    if (input.after) input.after(options)

    result.times.push(time) // remember each time to calculate average
    result.elapsed += time  // track overall time for all runs
    result.min = Math.min(result.min, time)
    result.max = Math.max(result.max, time)
  }

  if (input.afterAll) input.afterAll(options)

  print(filename, result, options, true) // true = use newline

  if (typeof options.result === 'function') options.result(result, options)
}
