'use strict'

module.exports = function asyncValidate(options, done) {

  // if we're supposed to validate and input provides a function to do it
  if (options.validate && 'function' === typeof options.input.validate) {

    // local alias.
    const input = options.input

    // generate args for this call.
    const args = input.args()

    // add a callback which records the results as well as calls `done()`.
    args.push(function validateDone(error, result) {

      // record "valid" boolean.
      // if there's an `error` then it's false.
      // otherwise record the return value of input's validate().
      options.results.valid = error ? false : input.validate(result)

      // remove this callback from args array, just in case.
      args.pop()

      // call the tasks callback.
      done()
    })

    // call the function with a new context and our special args.
    options.fn.apply(input.context(), args)
  }

  // otherwise, skip validating it.
  else {
    done()
  }
}
