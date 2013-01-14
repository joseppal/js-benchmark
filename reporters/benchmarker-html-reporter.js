var benchmarker = benchmarker || {};

benchmarker.Reporter = benchmarker.Reporter || (function () {

  function Reporter(title) {
    this.reports = [];
    this.title = title;
    this.container = $('<div class="bm">');

    $('body').append(this.container);
  }


  // Adds a new report.
  Reporter.prototype.add = function(label, time) {
    this.reports.push({
      label: label,
      time: time
    });
  };


  // Displays reports.
  Reporter.prototype.publish = function() {
    var slowestTime = this.getSlowestTime(),
        l = this.reports.length,
        ul, li, timebar, timebarWidth;


    $('<h2 class="bm-title">').html(this.title).appendTo(this.container);
    ul = $('<ul class="bm-ul">');

    for (i = 0; i < l; i++) {
      li = $('<li>');
      $('<div class="bm-label">').html(this.reports[i].label).appendTo(li);
      $('<div class="bm-time">').html(this.reports[i].time + ' ms').appendTo(li);
      timebar = $('<div class="bm-timebar">');

      timebarWidth =  Math.round(this.reports[i].time / slowestTime * 300);
      timebar.css('width', timebarWidth);
      timebar.appendTo(li);
      ul.append(li);
    }

    this.container.append(ul);
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

  return Reporter;
})();

