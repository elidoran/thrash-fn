'use strict'

const interval = require('./async-interval.js')

module.exports = function thrashAsync(options, done, control) {

  // build an array of tasks to queue up via control.
  const tasks = []

  // if there's a "beforeAll" listener function then add it.
  if ('function' === options.input.beforeAll) tasks.push(options.input.beforeAll)

  // add the main "async thrashing" task "interval" and the repeater task "requeue".
  tasks.push(interval, requeue)

  // if there's a "afterAll" listener function then add it.
  if ('function' === options.input.afterAll) tasks.push(options.input.afterAll)
  // queue the tasks to run next.
  // NOTE:
  //  we only add the listeners this once, not in requeue() below
  //  because we run beforeAll first and then afterAll last, both *once*.
  control.queue(tasks)

  // we're done with our work.
  done()
}

function requeue(options, done, control) {

  // local aliases for easier reading.
  const count   = options.results.count
  const elapsed = options.results.elapsed

  // we are done if:
  //   1. we've reached either max count or max time.
  //   2. we're "certain" and we've reached *both* min's
  if (
    (count >= options.maxCount || elapsed >= options.maxTime)
    || (options.certain && count >= options.minCount && elapsed >= options.minTime)
  ) {

    options.print.gap() // newline after we're done with this fn/input pair.

    // if there's a `result` listener function then call it.
    if ('function' === typeof options.result) {
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
