var interval = require('./async-interval.js')

module.exports = function thrashAsync(options, done, control) {
  var tasks = []

  if (isFn(options.input.beforeAll)) tasks.push(options.input.beforeAll)

  tasks.push(interval, requeue)

  if (isFn(options.input.afterAll)) tasks.push(options.input.afterAll)

  control.queue(tasks)
  done()
}

function isFn(f) { return typeof f === 'function' }

function requeue(options, done, control) {
  var count   = options.results.count
  var elapsed = options.results.elapsed

  // we are done if:
  //   1. we've reached either max count or max time.
  //   2. we're "certain" and we've reached *both* min's
  if (
    (count >= options.maxCount || elapsed >= options.maxTime)
    || (options.certain && count >= options.minCount && elapsed >= options.minTime)
  ) {
    console.log() // newline after we're done with this input.

    if (typeof options.result === 'function') {
      options.result(options.results, options)
    }
  }

  else { // requeue another interval run
    control.queue([
      interval, // runs a loop `interval` times and calculates result.
      requeue,  // requeue's another interval unless we're done.
    ])
  }

  done()
}
