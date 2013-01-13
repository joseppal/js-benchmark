//
// Benchmarking example.
//
benchmark('factorial of 100', function() {

  run('Recursive', function() {
    recursiveFactorial(100);
  }, { iterations: 10000 });

  run('Iterative', function() {
    iterativeFactorial(100);
  }, { iterations: 10000 });

  run('Look Up Table', function() {
    lutFactorial(100);
  }, { iterations: 10000 });
 
});


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

