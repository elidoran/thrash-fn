var pad   = require('pad')
var comma = require('comma-number')
var ansi  = require('ansi2')(process.stdout)

// Example:
//
// some/input/*:
//
// ok | optimize |   ops/sec   | deviation | input file
//-----------------------------------------------------------------------
// ██ |    ██    |  12,345,678 |   +-0.32% | file.js

module.exports = {

  header: function printHeader(options) {
    if (options.printHeader) options.printHeader(options.inputs, ansi, options)

    else {
      ansi.bold().blue(options.inputs).write(': ').newline().newline() // write the path.

      ansi.bold().underline()

      if (options.validate !== false) {
        ansi.black(' ok ').gray('|')
      }

      if (options.checkOptimize !== false) {
        ansi.black(' optimize ').gray('|')
      }

      ansi.black('    ops/sec  ').gray('|')
          .black(' deviation '  ).gray('|')
          .black(' input file             ').newline()
    }
  },

  input: function printInput(path, input, options) {
    if (options.printInput) options.printInput(path, input, options)
  },

  result: function printResult(filename, result, options, isFinal) {
    if (options.printResult) options.printResult(filename, result, ansi, options)

    else {
      // example line:
      //  ██   |    ██   |  12,345,678 |   +-0.32% | file.js

      ansi.reset().restartLine().bold()

      if (options.validate !== false) {
        if (result.valid != null) {
          (result.valid) ? ansi.green(' ██ ') : ansi.red(' ██ ')
        } else {
          ansi.gray(' ██ ')
        }
        ansi.gray('| ')
      }

      if (options.checkOptimize !== false) {
        (result.optimized) ? ansi.green('   ██    ') : ansi.red('   ██    ')
        ansi.gray('| ')
      }

      // string() accepts left padding size and decimal count
      ansi.bold().blue(string(11, 0, result.rate)).boldReset()
          .gray(' | ±').magenta(string(7, 2, result.deviation)).gray('% | ')
          .bold().cyan(filename)
    }

    if (isFinal) ansi.newline()
    else ansi.reset()
  },
}

// use multiplication to move shift the part we want to before the decimal.
// then, round it to drop off the extra decimal part we don't want.
// then, split the string where we want the decimal point and recombine.
// then, pad it.
function string(width, decimals, value) {
  var string = Math.round(value * Math.pow(10, decimals)).toString()

  if (decimals > 0) {
    string = comma(string.slice(0, -decimals))
             + '.' + string.slice(-decimals, string.length)
  }

  else {
    string = comma(string)
  }

  return pad(width, string)
}
