var assert = require('assert')

module.exports = function(n1, n2) {
  assert(n1 != null)
  assert(n2 != null)
  return n1 + n2 + 1 // wrong on purpose for testing
}
