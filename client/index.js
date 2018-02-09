/**
 * Client side script.
 * @author omgimanerd (alvin@omgimanerd.tech)
 * @author Searnsy
 */

const getAudioPeaks = (buffer) => {
  // Create offline context
  const offlineAudioContext = new OfflineAudioContext(
    1, buffer.length, buffer.sampleRate)

  // Create buffer source
  const bufferSource = offlineAudioContext.createBufferSource()
  bufferSource.buffer = buffer

  // Create filter
  const filter = offlineAudioContext.createBiquadFilter()
  filter.type = 'lowpass'

  // Pipe the song into the filter, and the filter into the offline context
  bufferSource.connect(filter)
  filter.connect(offlineAudioContext.destination)

  bufferSource.start(0)
  offlineAudioContext.startRendering()
  offlineAudioContext.oncomplete = data => {
    const filteredBuffer = data.renderedBuffer
    // This channelData variable is mostly what you will be looking for
    const channelData = filteredBuffer.getChannelData(0)

    // Below is just a sample algorithm we used for naive beat detection
    let max = -Infinity
    let min = Infinity
    for (const element of channelData) {
      if (element > max) {
        max = element
      } else if (element < min) {
        min = element
      }
    }
    const threshold = min + (max - min) * 0.5
    const peaks = []
    for (let i = 0; i < channelData.length; ++i) {
      if (channelData[i] > threshold) {
        peaks.push(i - 1)
        i += buffer.sampleRate / 4
      }
    }
    for (let i = peaks.length - 1; i > 0; i--) {
      peaks[i] -= peaks[i - 1]
      peaks[i] /= buffer.sampleRate
      peaks[i] *= 1000
    }
    console.log(peaks)
  }
}

document.getElementById('video-input-form').onsubmit = () => {
  const videoId = document.getElementById('video-id-input').value
  const audioContext = new AudioContext()
  const audioContextBuffer = audioContext.createBufferSource()
  const request = new XMLHttpRequest()

  // Sends a request to our web server for the audio stream
  request.open('GET', `/stream/${videoId}`, true)
  request.responseType = 'arraybuffer'
  request.onload = function() {

    // Decode the stream into something we can digest
    audioContext.decodeAudioData(request.response, buffer => {
      getAudioPeaks(buffer)

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
