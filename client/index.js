/**
 * Client side script.
 * @author omgimanerd (alvin@omgimanerd.tech)
 * @author Searnsy
 */

document.getElementById('video-input-form').onsubmit = () => {
  // Gets the YouTube video ID from the input form
  const videoId = document.getElementById('video-id-input').value

  // Creates an AudioContext and AudioContextBuffer
  const audioContext = new AudioContext()
  const audioContextBuffer = audioContext.createBufferSource()

  // Sends a request to our web server for the audio stream
  const request = new XMLHttpRequest()
  request.open('GET', `/stream/${videoId}`, true)
  request.responseType = 'arraybuffer'

  // The callback that handles the request data
  request.onload = function() {
    // Decode the stream into something we can digest
    audioContext.decodeAudioData(request.response, buffer => {
      // This function can be anything to handle the returned arraybuffer
      processAudio(buffer)

      // These three lines of code will play the video's audio
      audioContextBuffer.buffer = buffer
      audioContextBuffer.connect(audioContext.destination)
      audioContextBuffer.start()
    }, error => {
      console.log('Unable to decode audio stream')
    })
  }
  request.send()
  return false
}
