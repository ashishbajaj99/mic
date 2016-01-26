# mic
A simple stream wrapper for arecord (Linux (including Raspbian), Windows) and sox (Mac). Returns a Passthrough stream object so that stream control like pause(), resume(), pipe(), etc. are all available.

I've tested this on my Raspberry Pi in a speech recognition project called Ashiya and it works very well. Here are my node versions on raspberry pi:

```
$ npm version
{ mic: '1.0.0',
  npm: '3.3.12',
  ares: '1.10.1-DEV',
  http_parser: '2.6.0',
  modules: '47',
  node: '5.3.0',
  openssl: '1.0.2e',
  uv: '1.8.0',
  v8: '4.6.85.31',
  zlib: '1.2.8' }
```

Installation
============
This module depends on your machine having an installation of sox (Mac/Windows Users) OR ALSA tools for Linux. You can use this library to record from any microphone device.
Before installing and experimenting with the mic module, you need to ensure that you are able to capture audio via the command line:

```
$ arecord temp.wav
```
OR
```
$ rec temp.wav
```
To get ALSA tools on Raspberry Pi running raspbian, try the following:
```
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt-get install alsa-base alsa-utils
```

After the above is tested and validated, you can proceed to install the module using:

```
$ npm install mic
```

API
============
Below is an example of how to use the module. 
```javascript
var mic = require('mic');
var fs = require('fs');

mic.startCapture ({ 'rate': '16000', 'channels': '1' });
var micInputStream = mic.audioStream;
var micInputStreamInfo = mic.infoStream;
var outputFileStream = fs.WriteStream('output.raw');

micInputStream.pipe(outputFileStream);

micInputStream.on('data', function(data) {
    console.log("Recieved Input Stream: " + data.length);
});

micInputStream.on('error', function(err) {
    cosole.log("Error in Input Stream: " + err);
});

micInputStreamInfo.on('data', function(data) {
    console.log("Recieved Info: " + data);
});

micInputStream.on('error', function(err) {
    cosole.log("Error in Info Stream: " + err);
});
    
```

You should be able to playback the output file using. Note that arecord pipes the 44 byte WAV header, whereas SOX does NOT add any header. So we need to provide the file format details to the player:

```
$ aplay -f S16_LE -r 16000 -c 1 output.raw
```

### mic.startCapture(options)
Starts the audioStream either using arecord OR using sox.
* `options` - JSON containing command line options. Following are valid options:
    * `endian`: `big` OR `little`, default: `little`
    * `bitwidth`: `8` OR `16` OR `24` OR anything valid supported by arecord OR sox, default: `16`
    * `encoding`: `signed-integer` OR `unsinged-integer` (none of the other encoding formats are supported), default:`signed-integer`
    * `rate`: `8000` OR `16000` OR `44100` OR anything valid supported by arecord OR sox, default: `16000`
    * `channels`: `1` OR `2` OR anything valid supported by arecord OR sox, default: `1` (mono)
    * `device`: `hw:0,0` OR `plughw:1, 0` OR anything valid supported by arecord. Ignored for sox on macOS.

### mic.stopCapture()
This kills the arecord OR sox process that was started in the startCapture routine.

### mic.audioStream
This is a simple PassThrough stream that is output from arecord OR sox. This can be directly piped to a speaker stream OR a file stream.

### mic.infoStream
This contains all the log messages on stderr as emitted by arecord OR sox. These are not necessarily errors and could be just informational messages. See example above on usage.


License
==========
The MIT License (MIT)

Copyright (c) 2016 Ashish Bajaj bajaj.ashish@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
