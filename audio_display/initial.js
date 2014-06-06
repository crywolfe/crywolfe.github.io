function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
  // Good to go!
  navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

  window.AudioContext = window.AudioContext ||
                        window.webkitAudioContext;

  var context = new AudioContext();

  navigator.getUserMedia({video:false, audio: true}, function(stream) {
    var microphone = context.createMediaStreamSource(stream);
    var filter = context.createBiquadFilter();

    // microphone -> filter -> destination.
    microphone.connect(filter);
    filter.connect(context.destination);
  }, errorCallback);

} else {
  alert('getUserMedia() is not supported in your browser');
}
