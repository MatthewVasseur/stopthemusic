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

function initUI() {
  // initialize show/hide
  $("#game").hide();
  $("#home").show();
  $("#info").hide();
}

jQuery.ajaxSettings.traditional = true; //idk what this does

var MAX_SONGS = 10; // maximum number of songs
var curSong = null; // current song being played
var allSongs; // list of all 10 songs for the game
var index; // index number for song list


// fetchSongs(url, args): fetch a list of songs from specified url with args
function fetchSongs(url, args) {

  console.log("Attempting to fetch songs ...");
  $.getJSON(url, args,
            function(data) {
              allSongs = data['songs'];
              console.log("... SUCCESS!\n");
            },
            function() {
              console.log("... Trouble getting the song list.\n");
              error("Trouble getting the song list.");
            }
           );
}

// fetchNextSong(): fetch the next song in the playlist
function fetchNextSong() {
  playSong(allSongs[++index]);
}

// getRdioID(song): get the Rdio ID for a given song
function getRdioID(song) {
  console.log("getting id from " + song.title + ".");

  var rawID = song.tracks[0].foreign_id; // get raw id form
  var id = rawID.split(':')[2]; // get last part of id

  console.log("received " + id + " for song " + song.title + ".\n");

  return id;
}

// playSong(): being playing the song
function playSong(song) {
  var songID = getRdioID(song);
  curSong = song;

  $('#api').rdio().play(songID);
}

//playMusic(): beings playing music
function playMusic() {
  index = 0;
  playSong(allSongs[index]);
}

$(document).ready(function(){
  initUI();
  fetchSongs("./songs.js", {}); //default song list

  $('#api').bind('ready.rdio', function() {
    playMusic();
  });

  /*
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
  */

  $('#api').bind('playStateChanged.rdio', function(e, playState) {
    if (playState == 0) { // paused
      $('#play').removeClass('btn-primary');
      $('#pause').removeClass('btn-info');

      $('#play').addClass('btn-info');
      $('#pause').addClass('btn-primary');
    } else {
      $('#play').removeClass('btn-info');
      $('#pause').removeClass('btn-primary');

      $('#play').addClass('btn-primary');
      $('#pause').addClass('btn-info');
    }
  });

  // add playback token from token.js
  $('#api').rdio(playback_token);

  // player controls
  $('#play').click(function() { $('#api').rdio().play();}); // play
  $('#pause').click(function() { $('#api').rdio().pause(); }); //pause
  // next song
  $('#next').click(function() {
    fetchNextSong();
  });
});
