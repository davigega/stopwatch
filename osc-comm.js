"use strict"
const osc = require('osc')
const broadcastAddress = require('broadcast-address');

// var ip_arr = ["localhost"];

module.exports = function(iface, osc_port){
  var broadcast = broadcastAddress(iface);
  var module = {};
  console.log('- OSC broadcasting on address: '+broadcast+":"+osc_port+" -\n");
  module.osc = function(msg){
    udpPort.send(msg, broadcast, osc_port)
  }
  module.reaper = function(msg){
      udpPort.send(msg, "127.0.0.1", osc_port)
  }
  return module
}

/////////////////////////////////////////
/////////////// INCOMING ////////////////
/////////////////////////////////////////

// receive port
var udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57991,
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
