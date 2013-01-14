var benchmarker = benchmarker || {};

benchmarker.currentSuite = null;


// Suite holds a collection of implementations to be benchmarked.
benchmarker.Suite = function(title) {
  this.implementations = [];
  this.title = title;
  this.reporter = new benchmarker.Reporter(title);
};


// Adds an implementation to the suite.
benchmarker.Suite.prototype.add = function(label, func, options) {
    this.implementations.push({
      label: label,
      func: func,
      options: options
    });
};


// Executes the suite. The label and execution time of each implementation is
// reported to the reporter.
benchmarker.Suite.prototype.execute = function() {
    var executionTime = 0,
        l = this.implementations.length,
        reporter = this.reporter,
        i;

    var executeImplementations = function(counter, label, func, iterations) {
      setTimeout(function() {
          executionTime = executionTimeOf(func, iterations);
          reporter.add(label, executionTime);
          // is last?
          if ((counter + 1) == l) {
            reporter.publish();
          }
      }, 15);
    };

    for (i = 0; i < l; i++) {
      executeImplementations(i,
        this.implementations[i].label,
        this.implementations[i].func,
        this.implementations[i].options.iterations);
    }
};


// Returns an execution time of a given function. If the execution time of the
// function is fast use higher number of iterations to get more accurate
// results.
var executionTimeOf = function(func, iterations) {
    iterations = iterations || 1000;
    var l = iterations;
        startTime = new Date().getTime();

    while (l--) {
      func();
    }

    return (new Date().getTime() - startTime) / iterations; 
};


// Creates a new benchmarking suite and executes it.
var benchmark = function (title, setImplementations) {
  if (typeof title != 'string' || typeof setImplementations != 'function') {
    throw 'Invalid benchmark definition.';
  }
  benchmarker.currentSuite = new benchmarker.Suite(title);
  setImplementations();
  benchmarker.currentSuite.execute();
};


// Adds an implementation to the current benchmarking suite.
var implementation = function (label, func, options) {
  if (typeof label != 'string' || typeof func != 'function') {
    throw 'Invalid run definition.';
  }
  options = options || {};
  options.iterations = options.iterations || 1000;

  benchmarker.currentSuite.add(label, func, options);
};











benchmarker.Reporter = benchmarker.Reporter || (function () {
  var columnWidth = 20;

  // Default reporter constructor.
  function Reporter(title) {
    this.reports = [];
    this.title = title;
  }


  // Adds a new report.
  Reporter.prototype.add = function(label, time) {
    this.reports.push({
      label: label,
      time: time
    });
  };


  // Prints all reports to the console.
  Reporter.prototype.publish = function() {
    var l = this.reports.length,
        slowestTime = this.getSlowestTime(),
        i, str;

    console.log(this.title);

    for (i = 0; i < l; i++) {
      str = parseReportString(this.reports[i].label,
        this.reports[i].time, slowestTime);
      console.log(str);
    }
  };


  // Returns the time of the slowest benchmark in the reports list.
  Reporter.prototype.getSlowestTime = function() {
    if (this.reports.length === 0) return;

    var slowest = this.reports[0].time;
    for (var i = 1, l = this.reports.length; i < l; i++) {
      if (slowest < this.reports[i].time) {
        slowest = this.reports[i].time;
      }
    }
    return slowest;
  };


  // Returns a string that represents a report and can be print to the console.
  var parseReportString = function(label, time, slowestTime) {
    var labelStr, timeStr, timeBarLength, timeBarStr = '*';

    labelStr = padString(label, columnWidth, ' ');
    timeStr = padString(time.toString() + ' ms', columnWidth, ' ');
    timeBarLength = Math.round(columnWidth / slowestTime * time);
    if (timeBarLength < 1) { timeBarLength = 1; }
    timeBarStr = padString(timeBarStr, timeBarLength, '*');
    
    return '  ' + labelStr + timeStr + timeBarStr;
  };


  // Returns a string with given length, either by clipping or padding the
  // original.
  var padString = function(str, length, paddingChar) {
    if (str.length > length) {
      str = str.substring(0, length);
    } else {
      while (str.length < length) {
        str += paddingChar;
      }
    }
    return str;
  };

  return Reporter;
})();

