/*
 * Copyright 2013 Boris Smus. All Rights Reserved.
 */

 /* modified extensively by Gerald Wolfe 2014 */


navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);
function MicrophoneSample() {
  this.WIDTH = 1000;
  this.HEIGHT = 2000;
  this.getMicrophoneInput();
  this.canvas = document.querySelector('canvas');
  this.canvas2 = document.querySelector('canvas');
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
  filter.type = filter.NOTCH;
  filter.Q = 10.0;

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
  this.canvas2.width = this.WIDTH;
  this.canvas.height = this.HEIGHT;
  this.canvas2.height = this.HEIGHT;
  var drawContext = this.canvas.getContext('2d');
  var drawContext2 = this.canvas2.getContext('2d');

  var times = new Uint8Array(this.analyser.frequencyBinCount);
  this.analyser.getByteTimeDomainData(times);
  for (var i = 0; i < times.length; i++) {
    var value = times[i];
    var percent = value / 256;
    var newWidth = this.WIDTH * percent * 1.5;

    var newOffset = this.WIDTH - newWidth;

    var barHeight = this.HEIGHT*2.2/times.length;

    drawContext.fillStyle = 'blue';

    drawContext.fillRect(newOffset - 150,i * barHeight, 30, 5);

    drawContext2.fillStyle = 'blue';
    drawContext2.fillRect(newOffset + 680,i * barHeight, 30, 5);
  }
  requestAnimFrame(this.visualize.bind(this));
};
