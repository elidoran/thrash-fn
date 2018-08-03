'use strict'

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

      let called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        name: 'emptyInputAndNoContext',
        fn: function() { called = true },

        inputDir: join('test', 'empty'),

        result: function(result) {
          assert(called, 'should call our function')
          assertProps(result)
        },

        done: done
      })
    })


    // 2. a function which needs input but no context
    it('with input array and no context', function(done) {

      let called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        name: 'inputArrayAndNoContext',
        fn: function(a, b, c) {
          called = true
          assert(a != null)
          assert(b != null)
          assert(c != null)
        },

        inputDir: join('test', 'input'),

        result: function(result) {
          assert(called, 'should call our function')
          assertProps(result)
        },

        done: done
      })
    })


    // 3. a function which needs a context but no input
    it('with empty input array and a context', function(done) {

      let called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: function inputAndContext() {
          called = true
          assert(this.a != null)
        },

        inputDir: join('test', 'context'),

        result: function(result) {
          assert(called, 'should call our function')
          assertProps(result)
        },

        done: done
      })
    })


    // 4. a function which needs both input and a context
    it('with both input array and context', function(done) {

      let called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        name: 'bothInputArrayAndContext',

        fn: function(a, b, c) {
          called = true
          assert(a != null)
          assert(b != null)
          assert(c != null)
          assert(this.a != null)
        },

        inputDir: join('test', 'input_context'),

        result: function(result) {
          assert(called, 'should call our function')
          assertProps(result)
        },

        done: done
      })
    })


    // 5. validate the function
    it('with valid result', function(done) {

      let called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        name: 'validatingTest',
        fn: function(n1, n2) {
          called = true
          assert(n1 != null)
          assert(n2 != null)
          return n1 + n2
        },

        inputDir: join('test', 'validate'),

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

      let called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        name: 'testInvalidResult',
        fn: function(n1, n2) {
          called = true
          assert(n1 != null)
          assert(n2 != null)
          return n1 + n2 + 1 // the +1 is wrong, on purpose, for test.
        },

        inputDir: join('test', 'validate'),

        result: function(result) {
          assert(called, 'should call our function')
          assert.equal(result.valid, false, 'should fail validate test')
          assertProps(result)
        },

        done: done
      })
    })


    // 7. a non-optimizable function
    // TODO: figure out how to prevent TurboFan from optimizing...
    it.skip('with non-optimizable function', function(done) {

      let called = false

      function blah(arg) { }

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: function() {
          called = true
          if (arguments.length > 7) {
            arguments[7] = 'dont do this'
            if (arguments[3] === 7.123) {
              try {
                console.log(arguments[3] / arguments[4])
                console.log('1 + 2 =', eval('1+2'))
                if (eval('')) {
                  require('non-existent')
                }
              } catch(error) {
                console.error(error)
                return
              }
            }
          }
        },

        inputDir: join('test', 'input'),

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

        fn: function testCustomPrints() {},

        inputDir: join('test', 'input'),

        print: {
          fnHeader: function customFnHeader() { calledHeader = true },
          result: function customResult() { calledResult = true },
        },

        done: function() {
          assert(calledHeader, 'should have called custom customFnHeader')
          assert(calledResult, 'should have called custom customResult')
          done()
        }
      })
    })


    // 9. input+context from functions
    it('with input+context functions', function(done) {

      let called = false

      thrash({
        minTime : 0.1,
        minCount: 1,
        interval: 2,
        maxTime : 1,
        maxCount: 4,
        validate: false,
        checkOptimize: false,

        name: 'testInputInfoAsFunctions',
        fn: function(a, b, c) {
          called = true
          assert(a != null)
          assert(b != null)
          assert(c != null)
          assert(this.a != null)
        },

        inputDir: join('test', 'input_context_functions'),

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

        name: 'testListeners',
        fn: function() {},

        inputDir: join('test', 'listeners'),

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

    // 11. specify multiple implementations to compare
    it('with both input array and context', function(done) {

      // TODO: not available now that test function is in other file...
      let called = false

      thrash({
        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        // specify both inputs and the implementations to compare.
        inputDir: join('test', 'compare', 'inputs'),
        fnDir   : join('test', 'compare', 'implementations'),

        result: function(result) {
          assert(result.valid, 'should be a valid result')
          assertProps(result)
        },

        done: done
      })
    })

  })


  describe('asynchronous', function() {

     // 1. a simple function which doesn't need input or context.
     it('with empty input array and no context', function(done) {

       let called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,
         validate: false,
         checkOptimize: true,

         name: 'emptyInputAndNoContext',
         fn: function(callback) {
           called = true
           process.nextTick(callback)
         },

         inputDir: join('test', 'empty'),

         result: function(result) {
           assert(called, 'should call our function')
           assertProps(result)
         },

         done: done
       })
     })


     // 2. a function which needs input but no context
     it('with input array and no context', function(done) {

       let called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,

         name: 'inputArrayAndNoContext',
         fn: function(a, b, c, callback) {
           called = true
           assert(a != null)
           assert(b != null)
           assert(c != null)
           process.nextTick(callback)
         },

         inputDir: join('test', 'input'),

         result: function(result) {
           assert(called, 'should call our function')
           assertProps(result)
         },

         done: done
       })
     })


     // 3. a function which needs a context but no input
     it('with empty input array and a context', function(done) {

       let called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,

         fn: function emptyInputAndContext(callback) {
           called = true
           assert(this.a != null)
           process.nextTick(callback)
         },

         inputDir: join('test', 'context'),

         result: function(result) {
           assert(called, 'should call our function')
           assertProps(result)
         },

         done: done
       })
     })


     // 4. a function which needs both input and a context
     it('with both input array and context', function(done) {

       let called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,

         name: 'bothInputArrayAndContext',
         fn: function(a, b, c, callback) {
           called = true
           assert(a != null)
           assert(b != null)
           assert(c != null)
           assert(this.a != null)
           process.nextTick(callback)
         },

         inputDir: join('test', 'input_context'),

         result: function(result) {
           assert(called, 'should call our function')
           assertProps(result)
         },

         done: done
       })
     })


     // 5. validate the function
     it('with valid result', function(done) {

       let called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,

         name: 'validResult',
         fn: function(n1, n2, callback) {
           called = true
           assert(n1 != null)
           assert(n2 != null)
           callback(null, n1 + n2)
         },

         inputDir: join('test', 'validate'),

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

       let called = false

       thrash({
         async: true,

         minTime : 1,
         minCount: 1,
         interval: 3,
         maxTime : 1,
         maxCount: 12,

         name: 'invalidResult',
         fn: function(n1, n2, callback) {
           called = true
           assert(n1 != null)
           assert(n2 != null)
           callback(null, n1 + n2 + 1) // the +1 is wrong, on purpose, for test.
         },

         inputDir: join('test', 'validate'),

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

         name: 'errorResult',
         fn: function(n1, n2, callback) {
           callback(new Error('testing'))
         },

         inputDir: join('test', 'validate'),

         done: function(error) {
           assert(error)
           done()
         }
       })
     })


     // 8. a non-optimizable function
     // TODO: figure out how to prevent TurboFan from optimizing...
     it.skip('with non-optimizable function', function(done) {

       let called = false

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

         inputDir: join('test', 'input'),

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

         name: 'testListeners',
         fn: function(callback) {
           process.nextTick(callback)
         },

         inputDir: join('test', 'listeners'),

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

         name: 'withoutResultListener',
         fn: function(callback) {
           process.nextTick(callback)
         },

         inputDir: join('test', 'listeners'),

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

        inputDir: join('test', 'empty'),

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

        inputDir: join('test', 'input'),

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

        inputDir: join('test', 'context'),

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

        inputDir: join('test', 'input_context'),

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

        inputDir: join('test', 'validate'),

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

        inputDir: join('test', 'validate'),

        result: function(result) {
          assert.equal(result.valid, false, 'should fail validate test')
          assertProps(result)
        },

        done: done
      })
    })


    // 7. a non-optimizable function
    // TODO: figure out how to prevent TurboFan from optimizing...
    it.skip('with non-optimizable function', function(done) {

      thrash({
        spawn: true,

        minTime : 1,
        minCount: 1,
        interval: 3,
        maxTime : 1,
        maxCount: 12,

        fn: resolve(__dirname, 'for-spawn', 'fn-unoptimizable.js'),

        inputDir: join('test', 'input'),

        result: function(result) {
          assert.equal(result.optimized, false, 'should not optimize')
          assertProps(result)
        },

        done: done
      })
    })
  })
})
