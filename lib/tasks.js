// used to flatten tasks array given to control.queue().
const flatten = require('@flatten/array')

// task runner function which allows adding more tasks via `control.queue()`.
module.exports = function runTasks(options, tasks, done) {

  // provided as the 3rd argument to tasks so they can add more tasks.
  const control = {
    queue: function queue(array) {

      // allow callers to pass arrays in the array by flattening it now.
      flatten(array)

      // add the array's contents to the front of our tasks array
      // so they're called right after the task which is adding them.
      tasks.unshift.apply(tasks, array)
    }
  }

  // iterator callback to move to the next task, or handle the error.
  function next(error) {

    // call the final callback if:
    //   1. there's an error.
    //   2. there are no more tasks in the `tasks` array.
    if (error || tasks.length < 1) done(error)

    // avoid building up a huge call stack by using nextTick().
    // call shift() to get the next task from the front of the array,
    // and, removing it means we're done when the array is empty.
    // provide the options/next/control as args to the task.
    else process.nextTick(tasks.shift(), options, next, control)
  }

  // call our iterator to run the first task (or finish if there are none).
  // the tasks must call the next() callback or processing will halt.
  next()
}
