module.exports = {
  args: [ 'a', 'b', 'c' ],

  context: {
    a: 'a'
  },

  validate: function(result) {
    return (result.a == true) && (result.b == true) && (result.c == true)
      && (result.thiz == true)
  }

}
