const Cc = Components.classes;
const Ci = Components.interfaces;

var $ = function(x) { return document.getElementById(x); };
var prefs = Cc['@mozilla.org/preferences-service;1']
  .getService(Ci.nsIPrefService)
  .getBranch('extensions.seinfeld.');

function getChar(prefName, defaultValue) {
  if (prefs.getPrefType(prefName)){
    var rval = prefs.getCharPref(prefName);
    if (rval != '') {
      return rval;
    }
  }

  return defaultValue;
}

function init() {
  /* populate with the current settings */
  $('username').value = getChar('username', '');
}

function save() {
  prefs.setCharPref('username', $('username').value);
}
