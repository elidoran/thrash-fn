'use strict'

module.exports = function printFiles(options, done) {

  // alias for readability...
  const {print} = options

  // allow user to specify option to *not* print these out.
  if (options.showInputs) {
    // tell them the inputs path we looked in:
    print.dir('Inputs in ', options.inputDir)

    // tell them each inputs file we found:
    print.files(options.inputNames)
  }

  // NOTE: withDefaults() ensures options.fnNames is non-null.
  if (options.fnNames.length && options.showImplementations) {
    // tell them the path we looked in:
    print.dir('Implementations in ', options.fnDir)

    // tell them each implementation file we found:
    print.files(options.fnNames)
  }

  done()
}
