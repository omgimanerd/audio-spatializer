/**
 * Client side script.
 * @author omgimanerd (alvin@omgimanerd.tech)
 * @author Searnsy
 */

const UPDATE_RATE = 10

$(document).ready(() => {
  const audioContext = new AudioContext()
  const resonanceAudio = new ResonanceAudio(audioContext)
  resonanceAudio.output.connect(audioContext.destination)

  $('.video-input-form').submit(() => {
    const videoUrl = $('.video-url-input').val()
    $.post('/spatialize', { url: videoUrl }).done(data => {
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
        }
        source.setPosition(...positionVectors[deltaTime])
      }, UPDATE_RATE)
    })
    return false
  })
})
