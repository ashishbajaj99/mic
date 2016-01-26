# mic
A simple stream wrapper for arecord (Linux (including Raspbian), Windows) and sox (Mac). Returns a Passthrough stream object so that stream control like pause(), resume(), pipe(), etc. are all available.

Installation
============
```
$ npm install mic
```

API
============
Below is an example of how to use the module. 
```javascript
var mic = require('mic');
mic.start ({ 'rate': '16000', 'channels': '1' });
var micInputStream = mic.audioStream;

```

### Constructor: Thread(proc, next, [numThreads])
Returns a thread object. The inputs are:
* `proc` - The .js file that needs to be launched as a seperate child process
* `next` - The callback function to execute in the context of the parent process after the child process has sent back a compute done message.
**Note:** Output parameters can be passed back to the parent process as JSON object via process.send, and will come in as arguments to this callback
* `numThreads` - Optional argument to suggest number of child processes to fork. If left blank, then the number of child processes will default to number of available CPU cores available on your machine

### Thread.execute(params, [affinity])
Kick starts child process in a round robin manner. If child is busy, the start command is queued to the child process. The inputs are:
* `params` - Input to the child process to start its computations. Can be JSON.
* `affinity` - Optional argument to specifiy which thread to execute this on. If left blank then it will be queued to the next child process in a circular fashion

### Thread.close()
Kills all child processes - to be used by parent to clean up all the child processes

License
==========
The MIT License (MIT)

Copyright (c) 2014 Ashish Bajaj bajaj.ashish@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
