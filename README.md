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
In order to use the OSC functionalities you have to use the flag ```-o``` or ```--osc```:
```shell
$ npm start -- --osc
```

You should see the message:
```shell
- OSC broadcasting on address: 192.168.0.255
```
or similar.

The default OSC outgoing port is 5005
you can easily change this value or even add multiple clients like this:
```shell
$ npm start -- -o 5006 -o 5007 -o 5008
```

The default port for incoming messages is the ```5000```. You can change this value in line 29 of ```osc-comm.js``` before starting the program.

This feature simply allow the user to check their OSC connection with the server. The message that you'll send to this address will be simply printed to the Node Console.
