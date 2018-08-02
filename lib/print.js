'use strict'

const pad   = require('pad')
const comma = require('comma-number')
const ansi  = require('ansi2')(process.stdout)

module.exports = {

  gap: function printGap() {
    ansi.newline().newline()
  },

  dir: function path(prefix, path) {
    ansi.bold().black(prefix).black(path).write(':').newline()
  },

  files: function files(paths) {
    for (const path of paths) {
      ansi.black('+  ').black(path).newline()
    }

    ansi.newline()
  },

  fnHeader: function fnHeader(options) {
    const name =
      options.name
      || (options.fn && (options.fn.name || options.fn.displayName))
      // how do we know which options.fnNames index we are at?

    // tell them which implementation function we're running for the inputs.
    ansi.reset().bold().black(name).write(':').newline()
  },

  inputHeader: function inputHeader(name) {
    // tell them which input we're using on the following implementations.
    ansi.reset().bold().black(name).write(':').newline().newline()
  },

  result: function printResult(name, result, options, isFinal) {
    // 12,345,678 ops/s |   +-0.32% | input-or-fn-name

    // print over previous result iteration...
    ansi.reset().restartLine().bold()

    // string() accepts left padding size and decimal count

    // print rate in bold blue padded to length 12 without decimals.
    ansi.blue(string(12, 0, result.rate)).boldReset()

    // print rate unit, column separator, and plus/minus symbol in muted grey.
    ansi.gray(' ops/s | ±')

    // print deviation in magenta padded to length 7 with 2 decimals.
    ansi.magenta(string(7, 2, result.deviation))

    // print percentage symbol and column separator in muted grey.
    ansi.gray('% | ')

    // input/fn name is bolded.
    ansi.bold()

    // select color for name based on valid/optimized, then write it.
    selectNameColor(result).write(name)

    // if this is the final time we're printing this result line then
    // progress to the next line.
    if (isFinal) ansi.newline()
  },

}

// use multiplication to move shift the part we want to before the decimal.
// then, round it to drop off the extra decimal part we don't want.
// then, split the string where we want the decimal point and recombine.
// then, pad it.
function string(width, decimals, value) {
  let string = Math.round(value * Math.pow(10, decimals)).toString()

  if (decimals > 0) {
    string = comma(string.slice(0, -decimals))
             + '.' + string.slice(-decimals, string.length)
  }

  else {
    string = comma(string)
  }

  return pad(width, string)
}

function selectNameColor(result) {

  // if invalid then show as red.
  // NOTE:
  //   will only have a boolean value if options.validate is true
  //   and an input.validate() function was provided.
  if (result.valid === false) ansi.red()

  // if optimizable (and valid...) then show as green.
  // NOTE:
  //   will only have a boolean value if options.checkOptimize is true.
  else if (result.optimized === true) ansi.green()

  // otherwise, show as black. means valid but not optimized,
  // or, we didn't check for valid or optimized...
  else ansi.black()

  // return it so it can be chained like:
  //  selectColor(result).write(name)
  return ansi
}
