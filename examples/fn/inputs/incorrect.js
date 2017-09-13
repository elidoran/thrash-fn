module.exports = {
  // provided as input args 'a', 'b', 'c'
  args: [ 2, 4, 6 ],

  // provided as the "this" context:
  context: {
    divisor: 3
  },

  // used to validate the function's result.
  // 2 + 4 + 6 / 3 = 4
  // intentionally making validate *wrong* so it shows
  // what it looks like when a function doesn't validate.
  validate: function(result) { return result === 999 },

}
