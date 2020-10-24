"use strict"
const osc = require('osc')

var ip_arr = ["192.168.1.3"];
var osc_port = 5005;

 var udpPort = new osc.UDPPort({
   localAddress: "0.0.0.0",
   localPort: 57991,
   metadata: true
 });

try {
    udpPort.open();
} catch (e) {
    console.log("OSC port not available");
}

udpPort.on("message", function(oscMsg, timeTag, info){
  console.log(("msg: ", oscMsg.args[0].value));
})


function osc_sends(msg){
  for(var add in ip_arr){
    // console.log(ip_arr[add])
    udpPort.send(msg, ip_arr[add], osc_port)

  }
}

function reaper(msg){
    udpPort.send(msg, "127.0.0.1", osc_port)
}

module.exports = {osc: osc_sends, reaper: reaper}
