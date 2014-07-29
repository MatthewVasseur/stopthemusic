jQuery.ajaxSettings.traditional = true; //idk what this does

var MAX_SONGS = 10; // maximum number of songs
var curSong = null; // current song being played
var allSongs; // list of all 10 songs for the game
var index = 0; // index song number for song list
var points = 0; // points obtained

// style functions
function goGame() {
  $("#game").show();
  $("#home").hide();
  $("#answer").hide();
  $("#stop").hide();

  index = 0;
  points = 0;

  randomSongList("pop");
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

function stopMusic() {
  $('#controls').hide();
  $('#answer').show();
}

// guess(): bread and butter of the game.
function guess() {
  $('#stop').hide();

  var input = $('input').val();
  $('input').val("");// clear input
  if (input.toUpperCase() == curSong.title.toUpperCase()) {
    correctAnswer(input);
    points++;

    console.log("CORRECT");
  } else {
    wrongAnswer(input);
    console.log("WRONG");
  }
  $('#points').text(points + "/" + (index+1));

  $('#controls').show();
}

function correctAnswer(input) {
  $('#answer').hide();
  $('#label').text("Congrats! \"" + input + "\"" + " was correct!!");
  $('#label').addClass("text-success");
}

function wrongAnswer(input) {
  $('#answer').hide();
  $('#label').text("Sorry! \"" + input + "\"" + " was wrong!!");
  $('#label').addClass("text-warning");
}


// randomSongList(g): get a song list of the desired genre
function randomSongList(genre) {
  var num = Math.floor(Math.random() * 20);
  var list = "./echonestDB/" + genre + "/" + genre + num + ".js";
  fetchSongs(list, {});
}

// fetchSongs(url, args): fetch a list of songs from specified url with args
function fetchSongs(url, args) {

  console.log("Attempting to fetch songs from " + url + " ...");
  $.getJSON(url, args,
            function(data) {
              allSongs = data.response['songs'];
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
  if (index < MAX_SONGS-1)
    playSong(allSongs[++index]);
  else
    document.write("game over");
}

// getRdioID(song): get the Rdio ID for a given song
function getRdioID(song) {
  console.log("getting id from " + song.title + " ...");

  var rawID = song.tracks[0].foreign_id; // get raw id form
  var id = rawID.split(':')[2]; // get last part of id

  console.log("... received " + id + " for song " + song.title + ".\n");

  return id;
}

// playSong(): being playing the song
function playSong(song) {
  var songID = getRdioID(song);
  curSong = song;

  $('#api').rdio().play(songID);
  $('#stop').show();
}

//playMusic(): beings playing music
function playMusic() {
  playSong(allSongs[index]);
}

$(document).ready(function(){
  initUI();

  /*
  for (var i = 0; i<20; i++) {
    fetchSongs("./echonestDB/pop/pop"+i+".js", {}); //default song list
  }
  */

  $('#api').bind('ready.rdio', function() {
    playMusic();
  });


  $('#api').bind('playingTrackChanged.rdio', function(e, playingTrack, sourcePosition) {
    if (playingTrack) {
      duration = playingTrack.duration;
      /*
      $('#art').attr('src', playingTrack.icon);
      $('#track').text(playingTrack.name);
      $('#album').text(playingTrack.album);
      $('#artist').text(playingTrack.artist);
      */
    }
  });

  $('#api').bind('positionChanged.rdio', function(e, position) {
    var new_width = (Math.floor(100*position/duration))+'%';
    $('#position').css('width', new_width);
  });

  $('#api').bind('playStateChanged.rdio', function(e, playState) {
    if (playState == 0) { // paused
      $('#play').removeClass('btn-primary');
      $('#pause').removeClass('btn-info');

      $('#play').addClass('btn-info');
      $('#pause').addClass('btn-primary');
    } else { // playing
      $('#play').removeClass('btn-info');
      $('#pause').removeClass('btn-primary');

      $('#play').addClass('btn-primary');
      $('#pause').addClass('btn-info');
    }
  });

  // add playback token from token.js
  $('#api').rdio(playback_token);

  // player controls
  //  $('#play').click(function() { $('#api').rdio().play();}); // play
  $('#stop').click(function() {$('#api').rdio().pause(); }); // stop the music
  // next song
  $('#next').click(function() {
    fetchNextSong();
  });
});
