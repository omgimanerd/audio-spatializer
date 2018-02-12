/**
 * @fileoverview This is the server app script.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const PORT = 5000

// Dependencies.
const express = require('express')
const path = require('path')
const youtubeAudioStream = require('youtube-audio-stream')

const app = express()

app.use('/client', express.static(path.join(__dirname, '/client')))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/stream/:videoId', (request, response) => {
  const videoId = `https://www.youtube.com/watch?v=${request.params.videoId}`
  try {
    youtubeAudioStream(videoId).pipe(response)
  } catch (exception) {
    response.status(500).send(exception)
  }
})

// Starts the server.
app.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`)
})
