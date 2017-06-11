module.exports = {

  result: function prepResult() {
    return {
      elapsed  : 0,
      count    : 0,
      rate     : 0,
      min      : Infinity,
      average  : 0,
      max      : 0,
      variance : 0,
      deviation: 0,
      times    : [],
    }
  },

  input: function prepInput(input) {
    return Object.assign({}, input, {
      context: returnIt(input.context),
      args   : returnIt(input.args || [])
    })
  }
}

function returnIt(it) {
  return (typeof it === 'function') ? it : function() { return it }
}
