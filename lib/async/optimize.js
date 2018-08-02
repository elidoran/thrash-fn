var optimize = require('@optimal/fn')

module.exports = function asyncOptimize(options, done) {
  var input, args, count

  input = options.input

  if (options.checkOptimize !== false) {
    args = input.args()

    // wait until each call completes to move to the next task.
    count = 0
    args.push(function() {
      // optimizer runs it twice, tells it to optimize next time,
      // then runs it a third time.
      count++
      if (count >= 3) {
        args.pop()
        done()
      }
    })

    // optimization result is returned despite async function.
    options.results.optimized = optimize(options.fn, input.context(), args).optimized
  }

  else {
    done()
  }
}
