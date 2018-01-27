/**
 * @fileoverview This is the server app script.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const PORT = 5000;

// Dependencies.
const express = require('express')
const http = require('http')
const path = require('path')
const youtubeAudioStream = require('youtube-audio-stream');

const app = express()
const server = http.Server(app)

app.set('port', PORT)
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')))
app.use('/client', express.static(path.join(__dirname, '/client')))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/stream/:videoId', (request, response) => {
  const videoId = request.params.videoId
  try {
    console.log(`Fetching Youtube video ID=${videoId}`)
    youtubeAudioStream(request.params.videoId).pipe(response)
  } catch (exception) {
    throw exception
  }
})

app.use((request, response) => {
  response.status(404).send('Page not found')
})

// Starts the server.
server.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`)
})
