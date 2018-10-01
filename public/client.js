
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
  if(typeof(data.start) == "number" ){
    var time = data.start;
    var min = Math.floor(time/100/60);
    var sec = Math.floor(time/100);
    var mSec = time % 100;

    if(min < 10) {
        min = "0" + min;
    }
    if(sec >= 60) {
        sec = sec % 60;
    }
    if(sec < 10) {
        sec = "0" + sec;
    }
    document.getElementById('timerLabel').innerHTML = min + ":" + sec + ":" + mSec;
  };


  if(data.status === 'Connected'){
      var span = document.getElementById('label');
      span.innerHTML = 'CONNECTED';
      span.classList.add('connected');
  }

  if(data.message === "start"){
    document.getElementById("startBtn").disabled = true;
    document.getElementById("sendStart").disabled = true;
  }

  if(data.message === "stop"){
    document.getElementById("startBtn").disabled = false;
    document.getElementById("sendStart").disabled = false;
  }

  if(data.message === "reset"){
    document.getElementById('timerLabel').innerHTML = "00:00:0";
    document.getElementById("startBtn").disabled = false;
    document.getElementById("sendStart").disabled = false;
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

document.querySelector('#startBtn').addEventListener('click', function(event) {
  socket.send("start");
})

document.querySelector('#stopBtn').addEventListener('click', function(event) {
  socket.send("stop");
})

document.querySelector('#resetBtn').addEventListener('click', function(event) {
  socket.send("reset");
})

var startAt = function(){
    var time = document.querySelector('#startAt').value;
    var re =/^[0-9][0-9]|[0-9]:[0-5][0-9]:([0-9][0-9]|[0-9])$/;

    if(re.test(time)){
      time = time.split(":")
      var min = parseInt(time[0]*60);
      var sec = parseInt(time[1]);
      var ms = parseInt(time[2]);
      var init = parseInt(((min+sec)*100)+ms);
      var json = JSON.stringify({"startAt": init});
      socket.send(json);
    }
    else {
         alert("Time Format not correct\nTime Format mm:ss:dc")
    }
}

window.addEventListener('beforeunload', function() {
  socket.close();
});
