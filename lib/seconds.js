'use strict'

module.exports = function seconds(time) { // see: process.hrtime()
  return time[0] + (time[1] / 1e9)
}
