// style functions
function goGame() {
  $("#game").show();
  $("#home").hide();
}

function goHome() {
  $("#game").hide();
  $("#home").show();
}

function goInfo() {
  $("#info").toggle();
}


var curSong = null;
var allSongs;
var apiswf = null; // reference to api swf

$(document).ready(function(){

  // initialize css
  $("#game").hide();
  $("#home").show();
  $("#info").hide();

  var flashvars = {
    'playbackToken' : playback_token,
    'domain' : domain,
    'listener' : 'callback_object'
  };
  var params = {
    'allowScriptAccess' : 'always'
  };
  var attributes = {};

  swfobject.embedSWF('http://www.rdio.com/api/swf/', 'apiswf',
                     1, 1, '9.0.0', 'expressInstall.swf',
                     flashvars, params, attributes);

  // set up the controls
  $('#play').click(function() {
    apiswf.rdio_play($('#play_key').val());
  });
  $('#stop').click(function() { apiswf.rdio_stop(); });
  $('#pause').click(function() { apiswf.rdio_pause(); });
  $('#previous').click(function() { apiswf.rdio_previous(); });
  $('#next').click(function() { apiswf.rdio_next(); });

});

var callback_object = {};

callback_object.ready = function ready(user) {
  apiswf = $('#apiswf').get(0);

  apiswf.rdio_startFrequencyAnalyzer({
    frequencies: '10-band',
    period: 100
  });
}