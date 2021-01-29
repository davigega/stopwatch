# Stopwatch
a tcp OSC bridging stopwatch

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
OSC Listening on port: 5000
Connect to:
192.168.0.110:8080
```
or similar. You can now open your browser with all the devices connected to the same network and visit the page ```192.168.0.110:8080``` and you should see a big clock on your screen.
You can change the default http port by adding the ```-sp``` or ```--server-port``` argument:
```shell
npm start -- --server-port=9080
```
### OSC
The node server will accept 3 different messages on port `5000` at the following OSC addresses:
```
/min, <int>
/sec, <int>
/ds, <int>
```
The clock will take care of adding a 0 in front of the numbers < 10

You can send any other OSC formatted message to the server to test the connection. For example:
```
"/test", "CIAO"
```
will print `CIAO` in the console. This message will not be displayed in the browser.
#### Changing the OSC listening port

You can change the default OSC incoming port using the `-o` or `--osc` flag as following:
```
npm start -- -o 5007

OSC Listening on port: 5007
Connect to:
...
```
### WebSocket
The default WebSocket server's port is set to ```8081```. You can change its value on line 30 of ```server.js``` but remember to change it also on line 1 of ```public/client.js```
