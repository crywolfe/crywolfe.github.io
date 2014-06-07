/*
 * Copyright 2013 Boris Smus. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 /* modified by Gerald Wolfe 2014 */


navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);
function MicrophoneSample() {
  this.WIDTH = 70;
  this.HEIGHT = 2400;
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
    var newWidth = this.WIDTH * percent * 2;

    var newOffset = this.WIDTH - newWidth;

    var barHeight = this.HEIGHT*3/times.length;

    drawContext.fillStyle = 'blue';
    drawContext2.fillStyle = 'brown';

    drawContext.fillRect(newOffset - 15,i * barHeight, 30, 5);
    drawContext2.fillRect(newOffset + 20,i * barHeight, 30, 5);
  }
  requestAnimFrame(this.visualize.bind(this));
};
