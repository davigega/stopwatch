# Stopwatch
a tcp streaming stopwatch with OSC functionalities

### Requirement
The Stopwatch is written in NodeJS, so you need to install both NodeJS and npm from their respective website. This software is supposed to work in all operating systems.

### Setup
```cd``` into the stopwatch folder and install the dependencies:
```shell
$ cd /path/to/folder/stopwatch
$ npm install
```
then simply start the server with:
```shell
$ npm start
```
if everything was set up correctly you should see a message saying:
```shell
Connect to:
192.168.0.110:8080
```
or similar. You can now open your browser with all the devices connected to the same network and visit the page ```192.168.0.110:8080``` and simply use the website as graphical user interface.
You can change the default http port by adding the ```-sp``` or ```--server-port``` argument:
```shell
npm start -- --server-port=9080
```

### WebSocket
The default WebSocket server's port is set to ```8081```. You can change its value on line 30 of ```server.js``` but remember to change it also on line 1 of ```public/client.js```

### OSC capabilities
coming soon...
