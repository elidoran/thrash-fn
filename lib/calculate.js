// values used to calculate the "margin of error"
var critical = require('./criticals-table.js')

// standard deviation (and variance):
//   https://www.mathsisfun.com/data/standard-deviation-formulas.html

module.exports = function calculate(result) {

  result.rate      = result.count / result.elapsed
  result.average   = result.elapsed / result.count
  result.variance  = variance(result)
  result.deviation = Math.sqrt(result.variance)

  // standard error of the mean
  result.error = result.deviation / Math.sqrt(result.count)

  // both "degrees of freedom" and "critical value" are used to
  // calculate the margin of error. i inlined their calculations.
  // alone they would be:
  //   degrees of freedom = result.count - 1
  //   critical value     = table[freedom || 1] || table.infinity

  // Compute the margin of error.
  //   (TODO: i need a way to test the 1 and infinity...)
  //   istanbul ignore next
  result.margin = result.error * (critical[(result.count - 1) || 1] || critical.infinity)

  // Compute the relative margin of error.
  //   (TODO: i need a way to test the zero)
  //   istanbul ignore next
  result.relativeMargin = (result.error / result.average) * 100 || 0

  // TODO:
  // for right now, return false every time cuz we're never certain.
  // eventually, use the above calculations to determine we are "certain"
  // enough to stop.
  // Maybe track how much the results change from interval to interval
  // and stop when the change is very small?
  // Or, maybe the above info is enough?
  return false
}

function variance(result) {
  var index, variance

  for (variance = index = 0; index < result.times.length; index++) {
    variance += Math.pow((result.times[index] - result.average), 2)
  }

  // not a "sample" so not using "n - 1"
  return variance / result.count // sample: (result.count - 1)
}
