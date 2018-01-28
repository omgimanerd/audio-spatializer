/**
 * Client side script.
 * @author omgimanerd (alvin@omgimanerd.tech)
 * @author Searnsy
 */
/* eslint-disable require-jsdoc */
/* globals $, ResonanceAudio */

const UPDATE_RATE = 1

const arrayMin = data => {
  let min = Infinity
  for (const element of data) {
    if (element < min) {
      min = element
    }
  }
  return min
}

const arrayMax = data => {
  let max = -Infinity
  for (const element of data) {
    if (element > max) {
      max = element
    }
  }
  return max
}

const calculatePositionVectors = (buffer, callback) => {
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
    const max = arrayMax(channelData)
    const min = arrayMin(channelData)
    const threshold = min + (max - min) * 0.5
    const peaks = []
    for (let i = 0; i < channelData.length; ++i) {
      if (channelData[i] > threshold) {
        peaks.push(i - 1)
        i += buffer.sampleRate / 4
      }
    }
    callback(peaks)
  }
}

$(document).ready(() => {
  let processing = false
  $('.video-input-form').submit(() => {
    if (!processing) {
      processing = true
      // Open an XMLHttpRequest to stream audio data from YouTube
      const videoId = $('.video-id-input').val()
      const request = new XMLHttpRequest()
      request.open('GET', `/stream/${videoId}`, true)
      request.responseType = 'arraybuffer'
      request.onload = function() {
        // Create an AudioContext for output
        const audioContext = new AudioContext()
        const bufferSource = audioContext.createBufferSource()
        const resonanceAudio = new ResonanceAudio(audioContext)
        resonanceAudio.output.connect(audioContext.destination)

        // Decode the arraybuffer from the XMLHttpRequest
        audioContext.decodeAudioData(request.response, buffer => {
          const source = resonanceAudio.createSource()
          bufferSource.buffer = buffer
          bufferSource.connect(source.input)

          // Process the audio stream for spatialization
          calculatePositionVectors(buffer, peaks => {
            bufferSource.start()
            let x = 1
            const audioId = setInterval(() => {
              source.setPosition(x, 0, 0)
              x *= -1
              // source.setPosition(...peaks[bufferSource.currentTime])
            }, UPDATE_RATE)

            bufferSource.onended = () => {
              clearInterval(audioId)
            }
          })
        })
      }
      request.send()
    }
    return false
  })
})
