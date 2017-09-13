module.exports = {
  // provided as input args 'a', 'b', 'c'
  args: [ 1, 2, 3 ],
  // could be:
  // args: function() { return [ 1, 2, 3 ] }

  // provided as the "this" context:
  context: {
    divisor: 2
  },
  // could be:
  // context: function() { return {divisor: 2} }

  // used to validate the function's result.
  // 1 + 2 + 3 / 2 = 3
  validate: function(result) { return result === 3 },

  beforeAll: function(options, done) {
    // run before the performance run of each input.
    // in async mode there's a callback.
    done()
  },

  before: function() {
    // run before each time the function is called during a performance run.
    // always synchronous.
  },

  after: function() {
    // run after each time the function is called during a performance run.
    // always synchronous.
  },

  afterAll: function(options, done) {
    // run after the performance run is completed (for one input).
    // in async mode there's a callback.
    done()
  },
}
