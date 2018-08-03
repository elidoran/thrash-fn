'use strict'

const {resolve} = require('path')
const {spawn}   = require('child_process')

// the `args` to spawn() always specify the ./spawn.js file.
// resolve it to make sure we're specifying the exact one.
const args = [
  require('path').resolve(__dirname, 'spawn.js')
]

module.exports = function queueSpawnTasks(options, done, control) {

  // hold the spawner tasks we're going to build and queue.
  const tasks = []

  // if there are multiple functions then do multi-function mode.
  // which iterates inputs and for each input it iterates functions.
  if (options.fnNames.length) {

    for (const inputName of inputNames) {

      // add task to print the input header before all the tasks which use it.
      tasks.push(function (options, done) {

        options.print.inputHeader(inputName)
        
        done()
      })

      for (const fnName of options.fnNames) {

        const fnPath = resolve(options.fnDir, fnName)

        tasks.push(buildSpawnerTask(fnPath, inputName))
      }
    }
  }

  // single function, so, use fn with each input.
  else {
    // first print the fn header.
    // instead of putting this in a task, let's do it now.
    options.print.fnHeader(options)

    // add tasks for each input.
    for (const inputName of options.inputNames) {
      tasks.push(buildSpawnTask(options.fn, inputName))
    }
  }

  control.queue(tasks)

  done()
}

function buildSpawnTask(fnPath, inputName) {

  return function(options, done) {

    const newOptions = Object.assign({}, options, {
      // set the absolute path to the fn we want it to run.
      fn: fnPath,

      // null/empty these values for the spawned task.
      fnDir  : null,
      fnNames: [],

      // make only the one input we want it to use.
      inputNames: [inputName],
    })

    run(newOptions, done)
  }
}

// once the individual fn and input are specified then we do the spawning.
function run(options, done) {

  const child = spawn('node', args, {
    stdio: [
      'ipc',     // no stdin stuff, use as IPC to communicate the result.
      'inherit', // pass any stdout stuff to our stdout (ansi colors work).
      'pipe'     // make a pipe for stderr to add a listener and handle error.
    ],

    shell: true,

    env: Object.assign({}, process.env, {
      THRASH_OPTIONS: JSON.stringify(options),
    })
  })

  child.on('message', function(message) {
    // we don't use message except for the result...
    // istanbul ignore else
    if (message && message.result && options.result) {
      options.result(message.result, options)
    }
  })

  child.stderr.once('data', function(data) {
    done(new Error(data))
  })

  child.once('error', done)

  child.once('close', function(code) {
    if (code != 0) done(new Error('spawned process exited with ' + code))

    else done()
  })

}
