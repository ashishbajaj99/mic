var Transform = require('stream').Transform;
var util = require("util");

function IsSilence(options) {
    var that = this;
    var debug = false, ToggleCall = false, Silent = true;
    Transform.call(that, options);
    var consecSilenceCount = 0;
    var numSilenceFramesExitThresh = 0;

    that.getNumSilenceFramesExitThresh = function getNumSilenceFramesExitThresh() {
        return numSilenceFramesExitThresh;
    };

    that.getDebug = function getDebug(){
        return debug;
    };

    that.setToggleCall = function setToggleCall(value){
        ToggleCall = value;
        return;
    };

    that.getToggleCall = function getToggleCall()
    {
        return ToggleCall;
    };

    that.ToggleSilent = function ToggleSilent(silent)
    {
        if (!ToggleCall){return true;}
        if(Silent == silent)
        {
            return false;
        }
        else
        {
            Silent = silent;
            return true;
        }
    };

    that.setDebug = function setDebug(value)
    {
        debug = value;
        return;
    };

    that.getConsecSilenceCount = function getConsecSilenceCount() {
        return consecSilenceCount;
    };

    that.setNumSilenceFramesExitThresh = function setNumSilenceFramesExitThresh(numFrames) {
        numSilenceFramesExitThresh = numFrames;
        return;
    };

    that.incrConsecSilenceCount = function incrConsecSilenceCount() {
        consecSilenceCount++;
        return consecSilenceCount;
    };

    that.resetConsecSilenceCount = function resetConsecSilenceCount() {
        consecSilenceCount = 0;
        return;
    };
};
util.inherits(IsSilence, Transform);

IsSilence.prototype._transform = function(chunk, encoding, callback) {
    var i;
    var speechSample;
    var silenceLength = 0;
    var self = this;
    var consecutiveSilence = self.getConsecSilenceCount();
    var numSilenceFramesExitThresh = self.getNumSilenceFramesExitThresh();
    var incrementConsecSilence = self.incrConsecSilenceCount;
    var resetConsecSilence = self.resetConsecSilenceCount;

    if(numSilenceFramesExitThresh) {
        for(i=0; i<chunk.length; i=i+2) {
            if(chunk[i+1] > 128) {
                speechSample = (chunk[i+1] - 256) * 256;
            } else {
                speechSample = chunk[i+1] * 256;
            }
            speechSample += chunk[i];

            if(Math.abs(speechSample) > 2000) {
                if(self.getDebug()) console.log("Found speech block");
                if(self.ToggleSilent(false))
                {
                    if (self.getToggleCall()){self.emit('silenceComplete');}
                    self.emit('speech');
                }
                resetConsecSilence();
                break;
            } else {
                silenceLength++;
            }
        }
        if(silenceLength == chunk.length/2) {
            consecutiveSilence = incrementConsecSilence();
            if (self.getDebug()) console.log("Found silence block: %d of %d", consecutiveSilence, numSilenceFramesExitThresh);
            //emit 'silence' only once each time the threshold condition is met
            if((consecutiveSilence === numSilenceFramesExitThresh) && self.ToggleSilent(true)) {
                if (self.getToggleCall()){self.emit('speechComplete');}
                self.emit('silence');
            }
        }
    }
    this.push(chunk);
    callback();
};

module.exports = IsSilence;
