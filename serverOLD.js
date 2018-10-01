
var http = require('http');
var express = require('express');
var WSS = require('ws').Server;

var app = express().use(express.static('public'));
var server = http.createServer(app);
server.listen(8080);

var wss = new WSS({ port: 8081 });
var users = 0;
var t;

wss.on('connection', function(socket) {
  users = users+1;
  console.log('Connected Users:' + users);

  var json = JSON.stringify({ status: 'Connected' });
  socket.send(json);
  console.log('Sent: ' + json);

  socket.on('message', function(message) {
    console.log('Received: ' + message);

    try {
      var jsonObj = JSON.parse(message)
      if(jsonObj){
        offset = jsonObj.startAt;
        console.log(offset);
        wss.clients.forEach(function each(client) {
          var json = JSON.stringify({"start": offset});
          client.send(json);
          console.log('Sent: ' + json);
        })
      };
    }
    catch(err) {
    }

    if(message === "start"){
      timer();
      wss.clients.forEach(function each(client) {
        var json = JSON.stringify({message: 'start'});
        client.send(json);
        console.log('Sent: ' + json);
      })
    }
    if(message === "stop"){
      clearTimeout(t);
      offset = trackTime/10;
      wss.clients.forEach(function each(client) {
        var json = JSON.stringify({message: 'stop'});
        client.send(json);
        console.log('Sent: ' + json);
      })
    }
    if(message === "reset"){
      clearTimeout(t);
      offset = 0;
      wss.clients.forEach(function each(client) {
        var json = JSON.stringify({message: 'reset'});
        client.send(json);
        console.log('Sent: ' + json);
      })
    }
  });
  socket.on('close', function() {
    console.log('A Connection has been closed');
    users = users-1;
    console.log('Connected Users:' + users);
  });

});

// ===========================================================================

var offset = 0;

function timer(){
  startTime = Date.now();
  clock();
};

function clock(init){
  var time = Date.now()-startTime;
  time = time+(offset*10);
  trackTime = time;
  var min = Math.floor(time/1000/60);
  var sec = Math.floor(time/1000);
  var mSec = time%1000;

  if(min < 10) {
      min = "0" + min;
  }
  if(sec >= 60) {
      sec = sec % 60;
  }
  if(sec < 10) {
      sec = "0" + sec;
  }

  wss.clients.forEach(function each(client) {
    var json = JSON.stringify({
      "clock":
        {
          "mm": min,
          "ss": sec
          //"ms": parseInt(mSec/100) + "0"
        }
      });
    client.send(json);
  });
  t = setTimeout(clock, 10)
}
