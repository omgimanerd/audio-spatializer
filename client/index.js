const audioContext = new AudioContext()

function loadSound() {
  var request = new XMLHttpRequest();
  request.open("GET", '/stream/A1GK6e52iss', true)
  request.responseType = "arraybuffer"

  request.onload = function() {
    console.log('Loaded')
    const source = audioContext.createBufferSource()
    audioContext.decodeAudioData(request.response, buffer => {
      console.log(buffer.byteLength)
      console.log(buffer)
      console.log(Int32Array(buffer))

      source.buffer = buffer
      source.connect(audioContext.destination)
      source.start(audioContext.currentTime)
    })
  }

  request.send()
}

$('.fuck').click(() => {
  audioContext.suspend()
})

loadSound()
