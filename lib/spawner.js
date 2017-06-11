var spawn = require('child_process').spawn
var args  = [ require('path').join('lib', 'spawn.js') ]

module.exports = spawner

function spawner(options, done) {
  var child

  if (options.files.length > 0) {

    child = spawn('node', args, {
      stdio: [
        'ipc',     // no stdin stuff, use as IPC to communicate the result.
        'inherit', // pass any stdout stuff to our stdout (ansi colors work).
        'pipe'     // make a pipe for stderr to add a listener and handle error.
      ],
      shell: true,
      env: {
        THRASH_FILENAME: options.files.shift(),
        THRASH_OPTIONS: JSON.stringify(options),
      }
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

      spawner(options, done)
    })
  }

  else {
    done()
  }
}
