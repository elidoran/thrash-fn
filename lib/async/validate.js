module.exports = function asyncValidate(options, done) {
  var input, args

  input = options.input

  if (input.validate) { // validate it works correctly...
    args = input.args()

    args.push(function validateDone(error, result) {
      options.results.valid = error ? false : input.validate(result)
      args.pop()
      done()
    })

    options.fn.apply(input.context(), args)
  }

  else {
    done()
  }
}
