"use strict"
const osc = require('osc')
const broadcastAddress = require('broadcast-address');

// var ip_arr = ["localhost"];

module.exports = function(iface, osc_portArr, reaper_port){
  var broadcast = broadcastAddress(iface);
  var module = {};
  console.log('- OSC broadcasting on address: '+broadcast);
  module.osc = function(msg){
    for (var osc_port of osc_portArr) {
      udpPort.send(msg, broadcast, osc_port)
    }
  }
  module.reaper = function(msg){
      udpPort.send(msg, "127.0.0.1", reaper_port)
  }
  return module
}

/////////////////////////////////////////
/////////////// INCOMING ////////////////
/////////////////////////////////////////

// receive port
var udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 5000,
  metadata: true,
  broadcast:true
});

try {
    udpPort.open();
} catch (e) {
    console.log("OSC incoming UDPPort not available. Try changing the localPort attribute");
}

udpPort.on("message", function(oscMsg, timeTag, info){
  console.log(("msg: ", oscMsg.args[0].value));
})
