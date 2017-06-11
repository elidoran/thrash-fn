// input file's `args` property provides input arguments to function.
// asynchronous mode provides a callback as the last arg.
// input file's `context` property provides a "this" context object.
module.exports = function fn(a, b, c, done) {

  // TODO: couldn't figure out a way which would only prevent optimization
  // for the args/context provided by unoptimizable.js.
  // if you figure one out, please let me know, or send a PR. :)

  // either of these prevent optimizability.
  // unless you turn on the TurboFan via --turbo:
  //   node --turbo example/index.js
  var bad = Array.prototype.slice.call(arguments, 1, 2)
  // var bad = Array.prototype.slice.call(arguments, 0, arguments.length)

  // fake it taking time to complete asynchronously.
  var delay  = 1 // ms. pretty slow really.
  var error  = null
  var result = (a + b + c) / this.divisor

  setTimeout(done, delay, error, result)
}
