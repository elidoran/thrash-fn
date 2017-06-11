var defaults = {
  minTime : 60,    // 1 minute
  minCount: 1000,  // 1000 executions
  interval: 1000,  // how often metrics are calculated to consider stopping
  maxTime : 600,   // 10 minutes
  maxCount: 1e9,   // 1 billion executions
  async   : false, // if functions run asynchronously
  spawn   : false, // whether to run performance tests in child processes
  validate: true,  // whether to run input validators
  checkOptimize: true, // whether to check if function is optimizable
}

// combine their options and our defaults
module.exports = function withDefaults(options) {
  return Object.assign({}, defaults, options)
}
