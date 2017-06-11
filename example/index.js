process.chdir(__dirname)

// require('@thrash/fn')({
require('../lib/index.js')({
  async: true,

  minTime: 1,
  minCount: 1e3,
  interval: 100, // also affects how often result is printed to screen
  maxTime: 10,
  maxCount: 1e6,
  validate: true, // the default
  checkOptimize: true, // the default

  inputs: 'inputs',

  fn: require('./fn.js'),

  result: function(result) {
    // use result...
  },

  done: function(error) {
    console.log('all done. error =', error)
  }
})
