/**
 * Client side script.
 * @author omgimanerd (alvin@omgimanerd.tech)
 * @author Searnsy
 */
/* eslint-disable require-jsdoc */
/* globals $, ResonanceAudio */

const UPDATE_RATE = 1

$(document).ready(() => {
  const audioContext = new AudioContext()
  const resonanceAudio = new ResonanceAudio(audioContext)
  resonanceAudio.output.connect(audioContext.destination)

  let processing = false
  $('.button-loading').hide()
  $('.button-idle').show()

  $('.video-input-form').submit(() => {
    if (!processing) {
      const videoUrl = $('.video-url-input').val()
      $('.video-url-input').prop('disabled', 'disabled')
      $('.button-loading').show()
      $('.button-idle').hide()
      processing = true

      $.post('/spatialize', { url: videoUrl }).done(data => {
        $('.video-url-input').removeAttr('disabled')
        $('.button-loading').hide()
        $('.button-idle').show()
        processing = false
        if (!data.success) {
          alert('There was an error decoding this audio file! Fuck!')
          return
        }
        const id = data.id
        const positionVectors = data.positionVectors

        const audioElement = document.createElement('audio')
        audioElement.src = `/videos/${id}.mp4`
        const audioElementSource =
          audioContext.createMediaElementSource(audioElement)
        const source = resonanceAudio.createSource()
        audioElementSource.connect(source.input)

        const startTimestamp = Date.now()
        audioElement.play()
        const audioId = setInterval(() => {
          const deltaTime = Date.now() - startTimestamp
          if (deltaTime > positionVectors.length || audioElement.ended) {
            clearInterval(audioId)
            return
          }
          source.setPosition(...positionVectors[deltaTime])
        }, UPDATE_RATE)
      })
    }
    return false
  })
})
