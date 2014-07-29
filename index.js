jQuery.ajaxSettings.traditional = true;

// style functions
function goGame() {
  $("#game").show();
  $("#home").hide();
  fetchSongs("");
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


// fetchSongs(u): fetch a list of songs from specified url
function fetchSongs(u) {
  var url; //url from which to fetch songs

  if (u =="") {
    url = 'songs.js';
  } else {
    url = u;
  }

  console.log("Attempting to fetch songs.");
  $.getJSON(url, {},
            function(data) {
              allSongs = data['songs'];
              console.log("SUCCESS!\n");
            },
            function() {
              console.log("Trouble getting the song list.\n");
              error("Trouble getting the song list.");
            }
           );
}

// getRdioID(song): get the Rdio ID for a given song
function getRdioID(song) {
  console.log(song);
  console.log("getting id from " + song.title + ".");

  var rawID = song.tracks[0].foreign_id; // get raw id form
  var id = rawID.split(':')[2]; // get last part of id

  console.log("received " + id + " for song " + song.title + ".\n");

  return id;
}

//playMusic(): beings playing music
function startGame() {
  var songID;
  songID = getRdioID(allSongs[0]);
  $('#api').rdio().play(songID);
}

$(document).ready(function(){


  // initialize css
  $("#game").hide();
  $("#home").show();
  $("#info").hide();

  $('#api').bind('ready.rdio', function() {
    playMusic();
  });

  $('#api').bind('playingTrackChanged.rdio', function(e, playingTrack, sourcePosition) {
    if (playingTrack) {
      duration = playingTrack.duration;
      $('#art').attr('src', playingTrack.icon);
      $('#track').text(playingTrack.name);
      $('#album').text(playingTrack.album);
      $('#artist').text(playingTrack.artist);
    }
  });

  $('#api').bind('positionChanged.rdio', function(e, position) {
    $('#position').css('width', Math.floor(100*position/duration)+'%');
  });

  $('#api').bind('playStateChanged.rdio', function(e, playState) {
    if (playState == 0) { // paused
      $('#play').show();
      $('#pause').hide();
    } else {
      $('#play').hide();
      $('#pause').show();
    }
  });

  // this is a valid playback token for localhost.
  // but you should go get your own for your own domain.
  $('#api').rdio(playback_token);

  $('#previous').click(function() { $('#api').rdio().previous(); });
  $('#play').click(function() { $('#api').rdio().play(); });
  $('#pause').click(function() { $('#api').rdio().pause(); });
  $('#next').click(function() { $('#api').rdio().next(); });
});
