'use strict'

// used to check if a function can be optimized with some input.
const optimize  = require('@optimal/fn')

// used to create results object and normalize input stuff as functions.
const prep      = require('./prep.js')

// formats high-res time as seconds.
const seconds   = require('./seconds.js')

// calculate results for printout.
const calculate = require('./calculate.js')

// sync style thrash-ing.
module.exports = function thrashSync(filename, options) {

  const print  = options.print.result     // prints a thrash result line
  const fn     = options.fn               // alias
  const result = prep.result()            // create result object with props.
  const input  = prep.input(arguments[2]) // ensure args/context are functions
  
  // if we're supposed to validate it works and there's a validate function to call...
  if (options.validate && 'function' === typeof input.validate) {
    result.valid = input.validate(
      fn.apply(input.context(), input.args())
    )

    // if we tested it and it's INVALID then let's quit right now.
    if (result.valid === false) {
      // print final result for this thrash.
      print(filename, result, options, true) // true = use newline
      return
    }
  }

  if (options.checkOptimize) { // check if it's optimizable
    result.optimized = optimize(
      fn, input.context(), input.args()
    ).optimized
  }

  if (input.beforeAll) input.beforeAll(options)

  for (let index = 0; true; index++) { // loop until a max is reached or we're certain

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
      //         something like seeing standard deviation is repeatedly similar...
      //   istanbul ignore if
      if (calculate(result)) break // final print happens at function's end

      else {
        print(filename, result, options, false) // false means no newline
        // TODO: avoid building up massive result.times array by storing the
        // result.times based info in a way we can include it in the next calculate().
      }
    }

    // else we keep looping.

    // generate new context/args (may return the same one every time)
    const context = input.context()
    const args    = input.args()

    if (input.before) input.before(options)

    const hrtime  = process.hrtime() // use high resolution: nanoseconds
    fn.apply(context, args)
    const time = seconds(process.hrtime(hrtime))

    if (input.after) input.after(options)

    result.times.push(time) // remember each time to calculate average
    result.elapsed += time  // track overall time for all runs
    result.min = Math.min(result.min, time)
    result.max = Math.max(result.max, time)
  }

  if (input.afterAll) input.afterAll(options)

  // print final result for this thrash.
  print(filename, result, options, true) // true = use newline

  // if a "result" callback exists then call it with result.
  if (typeof options.result === 'function') options.result(result, options)
}
