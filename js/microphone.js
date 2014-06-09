/*
 * Copyright 2013 Boris Smus. All Rights Reserved.
 */

 /* modified extensively by Gerald Wolfe 2014 */


navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);
function MicrophoneSample() {
  this.WIDTH = 640;
  this.HEIGHT = 30;
  this.getMicrophoneInput();
  this.canvas = document.querySelector('canvas');
}

MicrophoneSample.prototype.getMicrophoneInput = function() {
  navigator.getUserMedia({audio: true},
                          this.onStream.bind(this),
                          this.onStreamError.bind(this));
};

MicrophoneSample.prototype.onStream = function(stream) {
  var input = context.createMediaStreamSource(stream);
  var filter = context.createBiquadFilter();
  filter.frequency.value = 60.0;
  // filter.frequency.value = 200.0;
  // filter.type = filter.BANDPASS;
  filter.type = filter.NOTCH;
  filter.Q = 10;
  // filter.Q = 20;

  var analyser = context.createAnalyser();

  // Connect graph.
  input.connect(filter);
  filter.connect(analyser);

  this.analyser = analyser;
  // Setup a timer to visualize some stuff.
  requestAnimFrame(this.visualize.bind(this));
};

MicrophoneSample.prototype.onStreamError = function(e) {
  alert('error', e);
};

MicrophoneSample.prototype.visualize = function() {
  this.canvas.width = this.WIDTH;
  this.canvas.height = this.HEIGHT;
  var drawContext = this.canvas.getContext('2d');

  var times = new Uint8Array(this.analyser.frequencyBinCount);
  this.analyser.getByteTimeDomainData(times);
  for (var i = 0; i < times.length; i++) {
    var value = times[i];
    var percent = value / 256;
    // var newWidth = this.WIDTH * percent * 1.3;
    // var newHeight = this.HEIGHT * percent;
    //
    // // var newOffset = this.WIDTH - newWidth;
    // var newOffset = this.HEIGHT - newHeight;
    //
    // // var barHeight = this.HEIGHT/(times.length* 2);
    // var barWidth = this.WIDTH/(times.length);
    //
    // drawContext.fillStyle = 'blue';
    // // drawContext.fillRect(newOffset - 255,i * barHeight, 18, 1);
    // drawContext.fillRect(i * barWidth, newOffset, 2, 1);

    var height = this.HEIGHT * percent /2;
    var offset = this.HEIGHT - height - 1;
    var barWidth = this.WIDTH/times.length;
    drawContext.fillStyle = 'blue';
    drawContext.fillRect(i * barWidth, offset, 20, 5);

  }
  requestAnimFrame(this.visualize.bind(this));
};
