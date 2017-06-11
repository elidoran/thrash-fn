var flatten = require('@flatten/array')

module.exports = function runTasks(options, tasks, done) {
  var control = {
    queue: function queue(array) {
      flatten(array)
      tasks.unshift.apply(tasks, array)
    }
  }

  function next(error) {
    if (error || tasks.length < 1) done(error)

    // avoid building up a huge call stack by using nextTick().
    else process.nextTick(tasks.shift(), options, next, control)
  }

  next()
}
