/**
 * @fileoverview This is the server app script.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const PORT = 5000

// Dependencies.
const express = require('express')
const fs = require('fs')
const path = require('path')
const youtubeAudioStream = require('youtube-audio-stream')

const app = express()

app.use('/client', express.static(path.join(__dirname, '/client')))
app.use('/videos', express.static(path.join(__dirname, '/videos')))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/video/:videoId', (request, response) => {
  const videoId = request.params.videoId
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
  const fileName = path.join(__dirname, 'videos', `${videoId}.flv`)
  const writeStream = fs.createWriteStream(fileName)
  try {
    youtubeAudioStream(videoUrl).pipe(writeStream)
    writeStream.on('close', () => {
      console.log('successfully written')
      // Do processing before piping the file back to the client.
      fs.createReadStream(fileName).pipe(response)
    })
  } catch (exception) {
    response.status(500).send(exception)
  }
})

// Starts the server.
app.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`)
})
