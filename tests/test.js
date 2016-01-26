var mic = require('../index.js');
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

