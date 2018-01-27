/**
 * @fileoverview This is the server app script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const PORT = 5000;

// Dependencies.
const express = require('express')
const http = require('http')
const path = require('path')
const youtubeStream = require('youtube-audio-stream');

const app = express()
const server = http.Server(app)

// Routers

app.set('port', PORT)
app.disable('etag')
app.use('/client', express.static(path.join(__dirname, '/client')))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/stream/:videoId', (request, response) => {
  try {
    console.log(request.params.videoId)
    youtubeStream(request.params.videoId).pipe(response)
  } catch (exception) {
    console.log(exception)
    response.status(500).send(exception)
  }
})

app.use((request, response) => {
  response.status(404).send('Page not found')
})

// Starts the server.
server.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`)
})
