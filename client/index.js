/**
 * Client side script.
 * @author omgimanerd (alvin@omgimanerd.tech)
 * @author Searnsy
 */

// const processAudioStream = (videoId, callback) => {
//   const request = new XMLHttpRequest()
//   request.open('GET', `/stream/${videoId}`, true)
//   request.responseType = 'arraybuffer'
//   request.onload = () => {
//     console.log(callback)
//     callback(request.response)
//   }
//   request.send()
// }
//
// const playAudioStream = (audioContext, audioStream) => {
//   const bufferSource = audioContext.createBufferSource()
//   audioContext.decodeAudioData(audioStream, buffer => {
//     bufferSource.buffer = buffer
//     bufferSource.connect(audioContext.destination)
//     bufferSource.start(audioContext.currentTime)
//   })
// }

$(document).ready(() => {
  const audioContext = new AudioContext()
  const resonanceAudio = new ResonanceAudio(audioContext)
  resonanceAudio.output.connect(audioContext.destination)

  $('.video-input-form').submit(() => {
    const videoUrl = $('.video-url-input').val()
    $.post('/spatialize', { url: videoUrl }).done(data => {
      console.log(data)
      if (!data.success) {
        alert('There was an error decoding this audio file! Fuck!')
        return
      }
      const id = data.id

      const audioElement = document.createElement('audio')
      audioElement.src = `/videos/${id}.mp4`
      const audioElementSource =
        audioContext.createMediaElementSource(audioElement)
      const source = resonanceAudio.createSource()
      audioElementSource.connect(source.input)

      let x = -1
      setInterval(() => {
        source.setPosition(x, 0, 0)
        x *= -1
      }, 600)

      audioElement.play()
    })
    return false;
  })
})
