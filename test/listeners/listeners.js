module.exports = {
  args: [],

  beforeAll: function(options, done) {
    options.beforeAll = true
    if (done) done()
  },

  before: function(options) {
    options.before = true
  },

  after: function(options) {
    options.after = true
  },

  afterAll : function(options, done) {
    options.afterAll = true
    if (done) done()
  },

}
