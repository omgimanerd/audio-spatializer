/**
 * Client side script.
 * @author omgimanerd (alvin@omgimanerd.tech)
 * @author Searnsy
 */
/* eslint-disable require-jsdoc */
/* globals $, ResonanceAudio, io, getVector */

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

/**
 * This method calculates the peaks in the audio buffer and computes a list
 * of vector positions to place the the audio source.
 * @param {AudioBufferSourceNode} buffer The audio buffer data
 * @param {Function} callback The callback to invoke with the vector positions
 */
const calculateSpatialVectors = (buffer, callback) => {
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
    for (let i = peaks.length - 1; i > 0; i--) {
      peaks[i] -= peaks[i - 1]
      peaks[i] /= buffer.sampleRate
      peaks[i] *= 1000
    }
    callback(peaks)
  }
}

$(document).ready(() => {
  let audioContext = null
  let audioIntervalId = null

  // Create a socket object for communicating information about the markov chain
  const socket = io()

  $('.button-loading').hide()
  let processing = false

  $('.video-input-form').submit(() => {
    if (!processing) {
      $('.button-loading').show()
      $('.button-idle').hide()
      $('.video-id-input').prop('disabled', 'disabled')
      processing = true

      // Create an AudioContext for output
      if (audioContext) {
        audioContext.close()
        clearInterval(audioIntervalId)
      }
      audioContext = new AudioContext()
      const audioContextTimestamp = Date.now()
      const bufferSource = audioContext.createBufferSource()
      const resonanceAudio = new ResonanceAudio(audioContext)
      resonanceAudio.output.connect(audioContext.destination)

      // Open an XMLHttpRequest to stream audio data from YouTube
      const videoId = $('.video-id-input').val()
      const request = new XMLHttpRequest()
      request.open('GET', `/stream/${videoId}`, true)
      request.responseType = 'arraybuffer'
      request.onload = function() {
        // Decode the arraybuffer from the XMLHttpRequest
        audioContext.decodeAudioData(request.response, buffer => {
          // Process the audio stream for spatialization
          calculateSpatialVectors(buffer, peaks => {
            $('.button-loading').hide()
            $('.button-idle').show()
            $('.video-id-input').removeAttr('disabled')
            processing = false

            // Connect the audio buffer to the AudioContext for output
            const source = resonanceAudio.createSource()
            bufferSource.buffer = buffer
            bufferSource.connect(source.input)
            bufferSource.start()
            const audioContextDelay = Date.now() - audioContextTimestamp

            // Request the current state of the markov chain from the server
            socket.emit('get-markov', pdf => {
              const positionVector = getVector(pdf, peaks)
              audioIntervalId = setInterval(() => {
                const frame = Math.round(
                  audioContext.currentTime * 1000 - audioContextDelay)
                source.setPosition(...positionVector[frame])
              }, UPDATE_RATE)

              bufferSource.onended = () => {
                clearInterval(audioIntervalId)
              }

              $('.pause').off().on('click', () => {
                audioContext.suspend()
              })

              $('.resume').off().on('click', () => {
                audioContext.resume()
              })

              $('.upvote').off().on('click', () => {

              })

              $('.downvote').off().on('click', () => {

              })
            })
          })
        }, error => {
          alert('Unable to process audio stream! Fuck!')
          $('.button-loading').hide()
          $('.button-idle').show()
          $('.video-id-input').removeAttr('disabled')
          processing = false
          // eslint-disable-next-line no-console
          console.error(error)
        })
      }
      request.send()
    }
    return false
  })
})
