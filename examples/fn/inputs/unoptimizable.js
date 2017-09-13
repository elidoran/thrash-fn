// NOTE: wasn't able to figure out some args/context which only prevented
// optimization "sometimes" so I could have it show not optimizable result
// for this input.
// instead, there's some code in fn.js to uncomment which will ruin optimizability.
module.exports = {
  // intentionally providing no args so they're missing
  // to prevent optimization.
  args: [1, 2, 3],

  // provided as the "this" context:
  context: {
    divisor: 0
  },

  // intentionally returning true so it shows as valid.
  validate: function(result) { return true },

}
