/**
 * @fileoverview Example processAudio() function
 */

const processAudio = (buffer) => {
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
    const channelData = filteredBuffer.getChannelData(0)

    // Below is a sample algorithm we used for naive beat detection
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
