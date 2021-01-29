'use strict';

var http = require('http');
var express = require('express');
var WSS = require('ws').Server;

var app = express().use(express.static('public'));
var server = http.createServer(app);

const minimist = require('minimist');
var args = minimist(process.argv.slice(2),{
  alias:{
    sp: 'server-port',
    o: 'osc'
  }
});

const localip = require("./localip.js")
var ip = localip.ip || "127.0.0.1";
var port = args.sp || 8080;
var osc_port = args.o || 5000;

var min = 0
var sec = 0
var ds = 0

// OSC
const osc = require('osc')
// receive port
var udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: osc_port,
  metadata: true,
  broadcast:true
});

try {
    udpPort.open();
} catch (e) {
    console.log("OSC incoming UDPPort not available. Try changing the localPort attribute");
}

udpPort.on("message", function(oscMsg, timeTag, info){
  switch (oscMsg.address) {
    case '/min':
      min = oscMsg.args[0].value;
      if(min < 10) {
          min = "0" + min;
      }
      break;
    case '/sec':
      sec = oscMsg.args[0].value;
      if(sec < 10) {
          sec = "0" + sec;
      }
      if(sec >= 60) {
          sec = sec % 60;
      }
      break;
    case '/ds':
      ds = oscMsg.args[0].value
      break;
    default:
      console.log(oscMsg.args[0].value);

  }
  // console.log(oscMsg);
  clock()
})

app.get('/ip', function(req, res){
  res.send(ip);
 });

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

   socket.on('message', function(message) {});

   socket.on('close', function() {
     console.log('A Connection has been closed');
     users = users-1;
     console.log('Connected Users:' + users);
   });
   socket.on('error', function(err){
     console.log('\nA connection was lost abruptly!');
     console.log("Maybe someone's display turned off");
     console.log('Check connected devices!\n');
   })
 });

 // ===========================================================================

 function clock(){
   wss.clients.forEach(function each(client) {
     var json = JSON.stringify({
       "clock":
         {
           "mm": min,
           "ss": sec,
           "ms": parseInt(ds)
         }
       });
       try {
           client.send(json);
       } catch (e) {
         console.log(e);
       }
   });
 }
 console.log("OSC Listening on port: ", osc_port);
 // console.log(ip + ':' + port);

console.log("Connect to: ");
console.log(ip + ':' + port);
