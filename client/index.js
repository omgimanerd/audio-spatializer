/**
 * Client side script.
 * @author omgimanerd (alvin@omgimanerd.tech)
 * @author Searnsy
 */

document.getElementById('video-input-form').onsubmit = () => {
  // Gets the YouTube video ID from the input form
  const videoId = document.getElementById('video-id-input').value

  // Create an HTMLAudioElement and play it
  const audio = new Audio(`/video/${videoId}`)
  audio.play()

  return false
}
