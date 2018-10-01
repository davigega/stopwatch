'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();
var http = require('http');
var express = require('express');
var WSS = require('ws').Server;

var app = express().use(express.static('public'));
var server = http.createServer(app);
var port = 8080;

var ip;
var startTime;
var trackTime;

app.get('/ip', function(req, res){
  res.send(ip);
 });
///////////// OSC /////////////

var osc = require('osc');

 var udpPort = new osc.UDPPort({
   localAddress: "0.0.0.0",
   localPort: 57991,
   metadata: true
 });

 udpPort.on("message", function(oscMsg, timeTag, info){
   console.log(("msg: ", oscMsg));
 })

 udpPort.open();

 udpPort.on("ready", function () {
     udpPort.send({
         address: "/test",
         args: [
             {
                 type: "s",
                 value: "timer ready"
             },
             {
                 type: "i",
                 value: 100
             }
         ]
     }, "127.0.0.1", 57120);
 });

function communication(min, sec, ds, ip, port) {
  udpPort.send({
    address: "/timer",
    args: [
        {
            type: "f",
            value: min
        },
        {
            type: "f",
            value: sec
        },
        {
            type: "f",
            value: ds
        }
    ]
}, ip, port);
};

// function communication2(min, sec, ds) {
//   udpPort.send({
//     address: "/timer",
//     args: [
//         {
//             type: "f",
//             value: min
//         },
//         {
//             type: "f",
//             value: sec
//         },
//         {
//             type: "f",
//             value: ds
//         }
//     ]
// }, "127.0.0.1", 57120);
// };

///////////// OSC /////////////

server.listen(port);

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
  //console.log(Date.now());
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

  communication(min, sec, mSec, "127.0.0.1", 57120);
  communication(min, sec, mSec, "192.168.0.248", 57100);

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
          "ss": sec,
          "ms": parseInt(mSec/100)
        }
      });
    client.send(json);
  });
  t = setTimeout(clock, 10)
}

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log("Ip available: ");
      console.log(ifname + ':' + alias, iface.address + ':' + port);
    } else {
      // this interface has only one ipv4 adress
      console.log("Connect to: ");
      //console.log(ifname, iface.address + ':' + port);
      console.log(iface.address + ':' + port);
      ip = iface.address;
    }
    ++alias;
  });
});
