/**
 * Client side script.
 * @author omgimanerd (alvin@omgimanerd.tech)
 * @author Searnsy
 */
/* eslint-disable require-jsdoc */
/* globals $, ResonanceAudio */

//const UPDATE_RATE = 10
//
//$(document).ready(() => {
//  const audioContext = new AudioContext()
//  const resonanceAudio = new ResonanceAudio(audioContext)
//  resonanceAudio.output.connect(audioContext.destination)
//
//  $('.video-input-form').submit(() => {
//    const videoUrl = $('.video-url-input').val()
//    $.post('/spatialize', { url: videoUrl }).done(data => {
//      if (!data.success) {
//        alert('There was an error decoding this audio file! Fuck!')
//        return
//      }
//      const id = data.id
//      const positionVectors = data.positionVectors
//
//      const audioElement = document.createElement('audio')
//      audioElement.src = `/videos/${id}.mp4`
//      const audioElementSource =
//        audioContext.createMediaElementSource(audioElement)
//      const source = resonanceAudio.createSource()
//      audioElementSource.connect(source.input)
//
//      const startTimestamp = Date.now()
//      audioElement.play()
//      const audioId = setInterval(() => {
//        const deltaTime = Date.now() - startTimestamp
//        if (deltaTime > positionVectors.length || audioElement.ended) {
//          clearInterval(audioId)
//        }
//        source.setPosition(...positionVectors[deltaTime])
//      }, UPDATE_RATE)
//    })
//    return false
//  })
//})

var context = new AudioContext()

var soundfile = "/videos/wWN6hZu9jjE.mp4"

function loadAudioBuffer(soundfile) {
  var request = new XMLHttpRequest();
  request.open('GET', '/stream/wWN6hZu9jjE', true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    console.log(request.response)
    context.decodeAudioData(request.response, function(buffer) {
      lowFilter(buffer);
    }, () => {});
  }
  request.send();
}

function lowFilter(buffer){
    // Create offline context
    var offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);

    // Create buffer source
    var source = offlineContext.createBufferSource();
    source.buffer = buffer;

    // Create filter
    var filter = offlineContext.createBiquadFilter();
    filter.type = "lowpass";

    // Pipe the song into the filter, and the filter into the offline context
    source.connect(filter);
    filter.connect(offlineContext.destination);

    // Schedule the song to start playing at time:0
    source.start(0);

    // Render the song
    offlineContext.startRendering()

    // Act on the result
    offlineContext.oncomplete = function(e) {
      // Filtered buffer!
      var filteredBuffer = e.renderedBuffer;
      console.log(filteredBuffer)
    };
}

loadAudioBuffer()
