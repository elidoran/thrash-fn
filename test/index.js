const assert  = require('assert')
const join    = require('path').join
const resolve = require('path').resolve

const thrash = require('../lib/index.js')

function assertProps(result) {
  assert(result, 'should have a result')
  assert(result.elapsed > 0, 'should have `elapsed`')
  assert(result.count > 0, 'should have `count`')
  assert(result.rate > 0, 'should have `rate`')
  assert(result.min > 0, 'should have `min`')
  assert(result.average > 0, 'should have `average`')
  assert(result.max > 0, 'should have `max`')
  assert(result.variance > 0, 'should have `variance`')
  assert(result.deviation > 0, 'should have `deviation`')
}

describe('test thrash fn', function() {

  describe('synchronous', function() {

    // 1. a simple function which doesn't need input or context.
    it('with empty input array and no context', function(done) {

      var called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: function() { called = true },

        inputs: join('test', 'empty'),

        result: function(result) {
          // console.log('result:', result)
          assert(called, 'should call our function')
          assertProps(result)
        },

        done: done
      })
    })


    // 2. a function which needs input but no context
    it('with input array and no context', function(done) {

      var called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: function(a, b, c) {
          called = true
          assert(a != null)
          assert(b != null)
          assert(c != null)
        },

        inputs: join('test', 'input'),

        result: function(result) {
          assert(called, 'should call our function')
          assertProps(result)
        },

        done: done
      })
    })


    // 3. a function which needs a context but no input
    it('with empty input array and a context', function(done) {

      var called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: function() {
          called = true
          assert(this.a != null)
        },

        inputs: join('test', 'context'),

        result: function(result) {
          assert(called, 'should call our function')
          assertProps(result)
        },

        done: done
      })
    })


    // 4. a function which needs both input and a context
    it('with both input array and context', function(done) {

      var called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: function(a, b, c) {
          called = true
          assert(a != null)
          assert(b != null)
          assert(c != null)
          assert(this.a != null)
        },

        inputs: join('test', 'input_context'),

        result: function(result) {
          assert(called, 'should call our function')
          assertProps(result)
        },

        done: done
      })
    })


    // 5. validate the function
    it('with valid result', function(done) {

      var called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: function(n1, n2) {
          called = true
          assert(n1 != null)
          assert(n2 != null)
          return n1 + n2
        },

        inputs: join('test', 'validate'),

        result: function(result) {
          assert(called, 'should call our function')
          assert.equal(result.valid, true, 'should pass validate test')
          assertProps(result)
        },

        done: done
      })
    })


    // 6. a function producing an invalid result
    it('with invalid result', function(done) {

      var called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: function(n1, n2) {
          called = true
          assert(n1 != null)
          assert(n2 != null)
          return n1 + n2 + 1 // the +1 is wrong, on purpose, for test.
        },

        inputs: join('test', 'validate'),

        result: function(result) {
          assert(called, 'should call our function')
          assert.equal(result.valid, false, 'should fail validate test')
          assertProps(result)
        },

        done: done
      })
    })


    // 7. a non-optimizable function
    it('with non-optimizable function', function(done) {

      var called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: function() {
          called = true
          // there is no arguments[3] ...
          return arguments[3]
        },

        inputs: join('test', 'input'),

        result: function(result) {
          assert(called, 'should call our function')
          assert.equal(result.optimized, false, 'should not optimize')
          assertProps(result)
        },

        done: done
      })
    })


    // 8. with custom printers
    it('with custom printers', function(done) {

      var calledHeader, calledInput, calledResult

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: function() {},

        inputs: join('test', 'input'),

        printHeader: function() { calledHeader = true },
        printInput : function()  { calledInput  = true },
        printResult: function() { calledResult = true },

        done: function() {
          assert(calledHeader)
          assert(calledInput)
          assert(calledResult)
          done()
        }
      })
    })


    // 9. input+context from functions
    it('with input+context functions', function(done) {

      var called = false

      thrash({
        minTime : 0.1,
        minCount: 1,
        interval: 2,
        maxTime : 1,
        maxCount: 4,
        validate: false,
        checkOptimize: false,

        fn: function(a, b, c) {
          called = true
          assert(a != null)
          assert(b != null)
          assert(c != null)
          assert(this.a != null)
        },

        inputs: join('test', 'input_context_functions'),

        done: function() {
          assert(called)
          done()
        }
      })
    })


    // 10. repeat simple one with extra listeners.
    it('with beforeAll/before/after/afterAll listeners', function(done) {

      var result, options, beforeAll, before, after, afterAll

      thrash({
        // small minTime to ensure we can run that branch...
        minTime : 0.0000001,
        minCount: 1,
        interval: 2,
        maxTime : 1,
        maxCount: 4,
        validate: false,
        checkOptimize: false,

        fn: function() {},

        inputs: join('test', 'listeners'),

        result: function(/* result, options */) {
          result = arguments[0]
          options = arguments[1]
          assertProps(result)
          assert(options.beforeAll)
          assert(options.before)
          assert(options.after)
          // afterAll hasn't been called yet...
        },

        done: function() {
          assert(options.afterAll)
          done()
        }
      })
    })

  })


  describe('asynchronous', function() {

     // 1. a simple function which doesn't need input or context.
     it('with empty input array and no context', function(done) {

       var called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,
         validate: false,
         checkOptimize: true,

         fn: function(callback) {
           called = true
           process.nextTick(callback)
         },

         inputs: join('test', 'empty'),

         result: function(result) {
           assert(called, 'should call our function')
           assertProps(result)
         },

         done: done
       })
     })


     // 2. a function which needs input but no context
     it('with input array and no context', function(done) {

       var called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,

         fn: function(a, b, c, callback) {
           called = true
           assert(a != null)
           assert(b != null)
           assert(c != null)
           process.nextTick(callback)
         },

         inputs: join('test', 'input'),

         result: function(result) {
           assert(called, 'should call our function')
           assertProps(result)
         },

         done: done
       })
     })


     // 3. a function which needs a context but no input
     it('with empty input array and a context', function(done) {

       var called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,

         fn: function(callback) {
           called = true
           assert(this.a != null)
           process.nextTick(callback)
         },

         inputs: join('test', 'context'),

         result: function(result) {
           assert(called, 'should call our function')
           assertProps(result)
         },

         done: done
       })
     })


     // 4. a function which needs both input and a context
     it('with both input array and context', function(done) {

       var called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,

         fn: function(a, b, c, callback) {
           called = true
           assert(a != null)
           assert(b != null)
           assert(c != null)
           assert(this.a != null)
           process.nextTick(callback)
         },

         inputs: join('test', 'input_context'),

         result: function(result) {
           assert(called, 'should call our function')
           assertProps(result)
         },

         done: done
       })
     })


     // 5. validate the function
     it('with valid result', function(done) {

       var called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,

         fn: function(n1, n2, callback) {
           called = true
           assert(n1 != null)
           assert(n2 != null)
           callback(null, n1 + n2)
         },

         inputs: join('test', 'validate'),

         result: function(result) {
           assert(called, 'should call our function')
           assert.equal(result.valid, true, 'should pass validate test')
           assertProps(result)
         },

         done: done
       })
     })


     // 6. a function producing an invalid result
     it('with invalid result', function(done) {

       var called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,

         fn: function(n1, n2, callback) {
           called = true
           assert(n1 != null)
           assert(n2 != null)
           callback(null, n1 + n2 + 1) // the +1 is wrong, on purpose, for test.
         },

         inputs: join('test', 'validate'),

         result: function(result) {
           assert(called, 'should call our function')
           assert.equal(result.valid, false, 'should fail validate test')
           assertProps(result)
         },

         done: done
       })
     })


     // 7. a function producing an error during function for validation
     it('with error result', function(done) {

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,

         fn: function(n1, n2, callback) {
           callback(new Error('testing'))
         },

         inputs: join('test', 'validate'),

         done: function(error) {
           assert(error)
           done()
         }
       })
     })


     // 8. a non-optimizable function
     it('with non-optimizable function', function(done) {

       var called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,

         fn: function(a, b, c, callback) {
           called = true
           // there is no arguments[4] ...
           callback(null, arguments[4])
         },

         inputs: join('test', 'input'),

         result: function(result) {
           assert(called, 'should call our function')
           assert.equal(result.optimized, false, 'should not optimize')
           assertProps(result)
         },

         done: done
       })
     })


     // 9. repeat simple one with extra listeners.
     it('with beforeAll/before/after/afterAll listeners', function(done) {

       var result, options, beforeAll, before, after, afterAll

       beforeAll = before = after = afterAll = false
       thrash({
         async: true,

         minTime : 0.1,
         minCount: 1,
         interval: 2,
         maxTime : 1,
         maxCount: 4,
         validate: false,
         checkOptimize: false,

         fn: function(callback) {
           process.nextTick(callback)
         },

         inputs: join('test', 'listeners'),

         result: function(/* result, options */) {
           result = arguments[0]
           options = arguments[1]
           assertProps(result)
           assert(options.beforeAll)
           assert(options.before)
           assert(options.after)
           // afterAll hasn't been called yet...
         },

         done: function() {
           assert(options.afterAll)
           done()
         }
       })
     })


     // 10. repeat simple one without a result listener
     it('without a result listener', function(done) {

       thrash({
         async: true,

         minTime : 0.1,
         minCount: 1,
         interval: 2,
         maxTime : 1,
         maxCount: 4,
         validate: false,
         checkOptimize: false,

         fn: function(callback) {
           process.nextTick(callback)
         },

         inputs: join('test', 'listeners'),

         done: done
       })
     })

   })

  describe('spawn', function() {

    // 1. a simple function which doesn't need input or context.
    it('with empty input array and no context', function(done) {

      thrash({
        spawn: true,

        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: resolve(__dirname, 'for-spawn', 'fn-empty.js'),

        inputs: join('test', 'empty'),

        result: function(result) {
          assertProps(result)
        },

        done: done
      })
    })


    // 2. a function which needs input but no context
    it('with input array and no context', function(done) {

      thrash({
        spawn: true,

        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: resolve(__dirname, 'for-spawn', 'fn-input.js'),

        inputs: join('test', 'input'),

        result: function(result) {
          assertProps(result)
        },

        done: done
      })
    })


    // 3. a function which needs a context but no input
    it('with empty input array and a context', function(done) {

      thrash({
        spawn: true,

        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: resolve(__dirname, 'for-spawn', 'fn-context.js'),

        inputs: join('test', 'context'),

        result: function(result) {
          assertProps(result)
        },

        done: done
      })
    })


    // 4. a function which needs both input and a context
    it('with both input array and context', function(done) {

      thrash({
        spawn: true,

        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: resolve(__dirname, 'for-spawn', 'fn-input_context.js'),

        inputs: join('test', 'input_context'),

        result: function(result) {
          assertProps(result)
        },

        done: done
      })
    })


    // 5. validate the function
    it('with valid result', function(done) {

      thrash({
        spawn: true,

        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: resolve(__dirname, 'for-spawn', 'fn-validate-true.js'),

        inputs: join('test', 'validate'),

        result: function(result) {
          assert.equal(result.valid, true, 'should pass validate test')
          assertProps(result)
        },

        done: done
      })
    })


    // 6. a function producing an invalid result
    it('with invalid result', function(done) {

      thrash({
        spawn: true,

        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: resolve(__dirname, 'for-spawn', 'fn-validate-false.js'),

        inputs: join('test', 'validate'),

        result: function(result) {
          assert.equal(result.valid, false, 'should fail validate test')
          assertProps(result)
        },

        done: done
      })
    })


    // 7. a non-optimizable function
    it('with non-optimizable function', function(done) {

      thrash({
        spawn: true,

        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: resolve(__dirname, 'for-spawn', 'fn-unoptimizable.js'),

        inputs: join('test', 'input'),

        result: function(result) {
          assert.equal(result.optimized, false, 'should not optimize')
          assertProps(result)
        },

        done: done
      })
    })
  })
})
