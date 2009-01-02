var seinfeld = new function() {
  var inst = this;

  Cu.import("resource://seinfeld/service.js");

  var $ = function(x) { return document.getElementById(x); };

  this.show = function() {
    if (svc.username()) {
      svc.update();
    }
    else {
      window.openDialog('chrome://seinfeld/content/config.xul', 'config', 'centerscreen,chrome,modal');
    }
  };

  this.onNotify = function(data) {
    $("seinfeld-status").value = data.current_streak;
  };

  function init() {
    svc.addListener(inst);
    window.removeEventListener('load', init, false);
  }

  window.addEventListener('load', init, false);
};
