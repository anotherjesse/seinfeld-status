/* consts and stuff */

const Cc = Components.classes;
const Ci = Components.interfaces;

var prefs = Cc['@mozilla.org/preferences-service;1']
  .getService(Ci.nsIPrefService)
  .getBranch('extensions.seinfeld.');

prefs.QueryInterface(Ci.nsIPrefBranch2);

var _username;
var _data;

/* listener for windows */

var _listeners = [];

function addListener(listener) {
  _listeners.push(listener);
  if (_data) {
    listener.onNotify(_data);
  }
  else {
    getUpdate()
  }

}

function removeListener(listener) {
  _listeners.delete(listener); // FIXME
}

function notifyListeners(msg) {
  _listeners.forEach(
    function notify(listener) {
      try {
        listener.onNotify(msg);
      } catch(e) {
        dump("Error notifying listener: " + e + "\n");
      }
    }
  );
}

/* web service urls */

function URL() {
  return "http://calendaraboutnothing.com/~" + _username;
}

function jsonURL() {
  return "http://calendaraboutnothing.com/~" + _username + ".json";
}

/* api integration */

function getUpdate() {
  if (_username) {
    var nsJSON = Cc["@mozilla.org/dom/json;1"].createInstance(Ci.nsIJSON);

    var req = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
      .createInstance(Ci.nsIXMLHttpRequest);
    req.mozBackgroundRequest = true;

    req.onload = function seinfeld_onload(aEvent) {
      if (req.status == 200) {
        var data = nsJSON.decode(req.responseText);
        _data = data;
        notifyListeners(data);
      }
    };
    req.open("GET", jsonURL());
    req.send(null);
  }
}

/* watch for updates to the username pref */

var prefObserver = {
  observe: function(subject, topic, data) {
    if (topic != "nsPref:changed") {
      return;
    }

    if (data=='username') {
      _username = prefs.getCharPref("username");
      getUpdate();
    }
  }
};

prefs.addObserver('', prefObserver, false);

try {
  _username = prefs.getCharPref("username");
} catch(e) {}

/* exposed parts of service */

var EXPORTED_SYMBOLS = ['svc'];
svc = {};
svc.addListener = addListener;
svc.removeListener = removeListener;
svc.url = URL;
svc.update = getUpdate;
svc.username = function() {
  if (_username && _username != '') {
    return _username;
  }
}
