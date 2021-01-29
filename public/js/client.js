
var socket = new WebSocket('ws://'+ ip +':8081/');
//console.log("ws://" + ip + ":8081/");
socket.onopen = function(event) {
}

socket.onerror = function(event) {
  var span = document.getElementById('label');
  span.innerHTML = 'ERROR';
}

socket.onmessage = function (event) {

  var data = JSON.parse(event.data);

  if(data.status === 'Connected'){
      var span = document.getElementById('label');
      span.innerHTML = 'CONNECTED';
      span.classList.add('connected');
  }

  if(data.clock){
      var min = data.clock.mm;
      var sec = data.clock.ss;
      var mSec = data.clock.ms;
      document.getElementById('timerLabel').innerHTML = min + ":" + sec + ":" + mSec;
    }
  }

socket.onclose = function(event) {
  var span = document.getElementById('label');
  span.innerHTML = 'DISCONNECTED';
  span.classList.remove('connected');
  span.classList.add('disconnected');

}

window.addEventListener('beforeunload', function() {
  socket.close();
});
