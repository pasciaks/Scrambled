//
// # SimpleServer
//

//var async = require('async');

var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var express = require('express');
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

// storage.initSync();
// pats = storage.getItem('pats');
// storage.setItem('pats',pats);

var nn = 0; ///image background index

var wordCount = 0;

var sockets = [];

var DICT = [];

var foundWords = [];

var history = [];

var howManyLetters = 10;

var letterChoices = "";

var gameAge=Date.now();
var gameAgeMax=1000*60*60*24; 

var lastusercount = 1;

var fs = require('fs');

function myRead(filename) {
  return fs.readFileSync(filename, 'utf8');
}

//myWrite(whichFile,JSON.stringify(theQuestions));
function myWrite(file, data) {
  var filename=""+file+"";
  //console.log("\n\n\nWriting..." + file + "\n\n\n");
  //console.log(data + " > " + file);
  fs.writeFile(filename, data, function(err) {
    if (err) { /* Do whatever is appropriate if append fails*/ }
  });
}

var PUZZLE_UPDATE = {
  'timestamp': Math.floor(Date.now() / 1000),
  'tiles': [{
    'pos': 123,
    'letter': "A",
    'owner': 0,
    'user': 0,
    'bonus': 0
  }]
};

var LONGTERM = {
  'score': [0, 1, 2],
  'matches': 0,
  'wins': [0, 1, 2],
}

var ROOM = {
  'ID': 'open',
  'Name': 'Open Room no limits',
  'PlayerLimit': 15
};

function string_recurse(active, rest) {
  if (rest.length == 0) {
    //console.log(active);
    /*global globalPossibilities*/
    globalPossibilities.push(active);
  }
  else {
    string_recurse(active + rest.charAt(0), rest.substring(1, rest.length));
    string_recurse(active, rest.substring(1, rest.length));
  }
}

function scramble(str) {
  var scrambled = '',
    src = str.split(''),
    randomNum;
  while (src.length > 1) {
    randomNum = Math.floor(Math.random() * src.length);
    scrambled += src[randomNum];
    src.splice(randomNum, 1);
  }
  scrambled += src[0];
  return scrambled;
}

function makeLetterSet() {
  var commonLetters = ["E", "T", "A", "O", "I", "N", "S", "R", "H", "D", "L", "U", "C", "M", "F", "Y", "W", "G", "P", "B", "V", "K", "X", "Q", "J", "Z"];
  var letterFrequency = [1202, 910, 812, 768, 731, 695, 628, 602, 592, 432, 398, 288, 271, 261, 230, 211, 209, 203, 182, 149, 111, 69, 17, 11, 10, 7];
  letterChoices = "";
  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < letterFrequency[i]; j++) {
      letterChoices = letterChoices + commonLetters[i];
    }
  }
  letterChoices = scramble(letterChoices);
  return letterChoices;
}

var theLetters = makeLetterSet();

var theData = {
  'theWord': scramble(theLetters).substr(0, howManyLetters),
  'time': 60000*15,
  'foundWords': foundWords,
  'back': './img/heart.png'
};

theData.theWord = "SCRAMBLED"; //FIRST GAME STARTS WITH THE LETTERS LOVE
theData.back =  './img/scramback' + Math.floor(Math.random()*10) + '.png';

fs.readFile('word2.dict', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }
  DICT = data.split(/\n/);
});

io.set('log level', 2);

router.use(express.static(path.resolve(__dirname, 'client')));

function newPuzzle(data, socket) {

  wordCount = 0;
  foundWords = [];
  history = [];

  theData.theWord = scramble(theLetters).substr(0, howManyLetters); //+ Math.floor(Math.random() * 0));
  theData.time = 60000*15;
  theData.foundWords = foundWords;
  theData.back = './img/scramback' + nn + '.png';//Math.floor(Math.random()*10) + '.png';
  nn++;
  if (nn>9) nn=0;

  socket.broadcast.emit("PUZZLE_NEW", theData);
  socket.emit("PUZZLE_NEW", theData);
}

function savehistory(data,socket) {
  
  //todo  //xxxxx added in this writing stuff
  //console.log("Writing..." + './history/word_history_'+theData.theWord+".txt");
    myWrite('./history/word_history_'+theData.theWord+".txt",JSON.stringify(history));
    console.log("Done...Writing..." + './history/word_history_'+theData.theWord+".txt");
  
}

function announcePlayerNew(data, socket) {
  socket.broadcast.emit("PLAYER_JOINED", data);
  socket.emit("PLAYER_JOINED", data);
  
  savehistory(data,socket);

}

function announcePlayerLeft(data, socket) {
  //socket.broadcast.emit("PLAYER_LEFT", data);
}

function recordHistory(incomingData, wordresult) {

  console.log("Time Elapsed by " + incomingData.player + " : " + incomingData.secondsElapsed);
  
  history.push(incomingData); //{ 'data':ddd, 'result':wordresult });
  
  if (history.length>10000) history.splice(0,100);

  // for (var i=0;i<history.length;i++) {
  //   console.log("History:" + i + " " + history[i]);
  // }

}

io.on('connection', function(socket) {
  
  //random back each connection ... no
  //theData.back =  './img/scramback' + Math.floor(Math.random()*10) + '.png';

  sockets.push(socket);
  socket.team = (lastusercount % 2) + 1;
  socket.user = lastusercount;
  socket.score = 0;
  lastusercount++;

  socket.emit("PUZZLE_NEW", theData);
  socket.emit("HISTORY_GOT", history);

  socket.on('disconnect', function() {

    var data = socket.username;
    if (data == null) data = "non-logged in user ";
    //console.log(data + " logged Out");
    //announcePlayerLeft(data, socket);
    sockets.splice(sockets.indexOf(socket), 1);

  });

  socket.on('LOGON', function(data) {
    socket.username = data.user;
    data = "" + socket.username;
    if (!data) data = "unknown";
    console.log(socket.username + " logged in");
    socket.emit("ID", data);
    announcePlayerNew(data, socket);
  });

  socket.on('WORD_ATTEMPT', function(info) {

    // console.log(info);
    // console.log(socket);

    info.wordCount = 0 + wordCount;
    info.player = socket.username;
    info.score = socket.score;

    // if (theData.theWord == 'LOSTWORDS') {
    //   if (foundWords.length > 0) foundWords = [];
    // }

    // //already used
    // if (foundWords.indexOf(info.theWord.toLowerCase()) > -1) {
    //   //socket.broadcast.emit("BADWORD_BACK",info);
    //   //if (theData.theWord != 'LOSTWORDS') socket.score--;
    //   //info.score=socket.score;
    //   socket.emit("BADWORD_BACK_SELF", info);
    //   //recordHistory(info,'USED');
    //   //if (socket) socket.emit("HISTORY_GOT", history);
    // }
    // else {
    
    if (info.theWord.length > 0) {

  //console.log(Date.now()-gameAge);        
        
if ((Date.now()-gameAge)>gameAgeMax) {
  //console.log("New puzzle time: " + gameAge);
  gameAge=Date.now();
  newPuzzle({}, socket); 
  return;
}        
        
        if (DICT.indexOf(info.theWord.toLowerCase()) > -1) {
          //todo capture more than just the word in found list, capture all metadata (color, etc)
          foundWords.push(info.theWord.toLowerCase()); //xxxxxxxxx
          theData.foundWords = foundWords;
          socket.score += info.theWord.length * 3;
          //if (info.theWord=="LOVE") socket.score=Math.floor(socket.score*1.1);
          info.score = socket.score;

          wordCount++;
          info.wordCount = wordCount;

          recordHistory(info, 'GOOD');
          //if (socket) socket.emit("HISTORY_GOT", history);

          socket.broadcast.emit("WORD_BACK", info);
          socket.emit("WORD_BACK_SELF", info);

          //temporary new puzzle every 5 good words          
          // if (wordCount>2) {
          //     wordCount=0;
          //     newPuzzle(info, socket);
          // } 

        }
        else {

          //not a good dict word and over 1 char long
          socket.emit("BAD_BADWORD_BACK_SELF", info);

          //recordHistory(info,'BAD');
          //if (socket) socket.emit("HISTORY_GOT", history);

        }
      }
      
  //  }

  });

  socket.on('VALIDATE_WORD_ARRAY', function(data) {
    // console.log("VALIDATE_WORD_ARRAY " + data.length);
    var tempP;
    var goodWords = [];
    for (var i = 0; i < data.length; i++) {
      tempP = data[i].toLowerCase();
      if (DICT.indexOf(tempP) > -1) {
        goodWords.push(tempP);
      }
    }
    //console.log("VALIDATED_WORD_ARRAY " + goodWords.length);
    socket.emit("VALIDATED_WORD_ARRAY", goodWords);
  });

  socket.on('NEW_PUZZLE', function(data) {
    newPuzzle(data, socket);
  });

  socket.on('GET_HISTORY', function(data) {
    socket.emit("HISTORY_GOT", history);
  });

  socket.emit('USER_GOT', {
    'u': socket.user,
    't': socket.team
  });

});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
