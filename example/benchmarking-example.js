//
// In this example, three different implementations of a factorial function are
// benchmarked using the benchmarker.js.
//
var recursiveFactorial = function (n) {
  if (n > 1) {
    return n * recursiveFactorial(n - 1);
  }
  return 1;
};

var iterativeFactorial = function (n) {
  var factorial = n;
  while ((n -= 1) > 1) {
    factorial = factorial * n;
  }
  return factorial;
};

var lutFactorial = (function () {
  var lut = [];
  var f = function (n) {
    if (n === 0 || n === 1) {
      return 1;
    }
    if (lut[n] > 0) {
      return lut[n];
    } else {
      return lut[n] = f(n - 1) * n;
    }
  };
  // Populate LUT from 0 to 100
  f(100);
  return f;
})();


// Benchmarking is defined by calling a global benchmark function. First
// parameter to it is a title describing what is being benchmarked. The second
// parameter is a function, inside of which, all the different implementations
// are defined.
benchmark('factorial of 100', function() {

  // Implementations are added by calling a global implementation function.
  // First parameter to it is a string that describes the implementation. The
  // second parameter is a function where the actual implementation is wrapped
  // in. The third parameter is an optional options object. Currently only one
  // option can be defined, the number of iterations that is used for
  // calculating the runtime of the implementation. Note that the faster the
  // implementation the more iterations should be used. The default is 1000.
  implementation('Recursive', function() {
    recursiveFactorial(100);
  }, { iterations: 10000 });

  implementation('Iterative', function() {
    iterativeFactorial(100);
  }, { iterations: 10000 });

  implementation('Look Up Table', function() {
    lutFactorial(100);
  }, { iterations: 100000 });
 
});

