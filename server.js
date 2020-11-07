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
var ip = localip.ip;
var netDevice = localip.netDevice;
var port = args.sp || 8080;

var startTime;
var trackTime;

// OSC
var osc_send;
if(args.o){
  var osc_port = Array.isArray(args.o)? args.o : [5005]
  var osc_module = require('./osc-comm.js')(netDevice, osc_port)
  osc_send = osc_module.osc;
} else {
  osc_send = (gc)=>{};
}
// REAPER
var reaper;
if(args.reaper){
  reaper = osc_module.reaper;
} else {
  reaper = (gc)=>{};
}


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
         osc_send({address: "/startAt", args: [{type: "f", value: offset}]})
         reaper({address: "/time", args: [{type: "f", value: offset/100}]})
       };
     }
     catch(err) {
       // console.log(err);
     }

     if(message === "start"){
       timer();
       wss.clients.forEach(function each(client) {
         var json = JSON.stringify({message: 'start'});
         client.send(json);
         console.log('Sent: ' + json);
       });
       osc_send({address: "/play", args: [{type: "i", value: "1"}]})
       reaper({address: "/play", args: [{type: "s", value: "0"}]})
     }
     if(message === "stop"){
       clearTimeout(t);
       offset = trackTime/10;
       wss.clients.forEach(function each(client) {
         var json = JSON.stringify({message: 'stop'});
         client.send(json);
         console.log('Sent: ' + json);
       })
       osc_send({address: "/stop", args: [{type: "i", value: "0"}]})
       reaper({address: "/pause", args: [{type: "s", value: "0"}]})
     }
     if(message === "reset"){
       clearTimeout(t);
       offset = 0;
       wss.clients.forEach(function each(client) {
         var json = JSON.stringify({message: 'reset'});
         client.send(json);
         console.log('Sent: ' + json);
       })
       osc_send({address: "/startAt", args: [{type: "f", value: offset}]})
       reaper({address: "/time", args: [{type: "f", value: offset}]})
     }
   });
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

 var offset = 0;

 function timer(){
   startTime = Date.now();
   clock();
 };

 function clock(init){
   var time = Date.now()-startTime;
   time = time+(offset*10);
   trackTime = time;
   var min = Math.floor(Math.abs(time)/1000/60);
   var sec = Math.floor(Math.abs(time)/1000);
   var mSec = Math.abs(time)%1000;

   if(min < 10) {
     if(time < 0){
       min = "-0" + min;
     } else {
       min = "0" + min;
     }
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
       try {
           client.send(json);
       } catch (e) {
         console.log(e);
       }
   });
   osc_send({address: "/clock", args: [{type: "f", value: min},{type: "f", value: sec},{type: "f", value: mSec},]})
   t = setTimeout(clock, 10)
 }


console.log("Connect to: ");
console.log(ip + ':' + port);
