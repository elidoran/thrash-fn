const assert = require('assert')

module.exports = function(a, b, c) {
  return {
    a: a != null,
    b: b != null,
    c: c != null,
    thiz: this.a != null,
  }
}
