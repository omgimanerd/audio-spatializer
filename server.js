/**
 * @fileoverview This is the server app script.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const PORT = 5000;

// Dependencies.
const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const http = require('http')
const path = require('path')
const youtubeAudioStream = require('youtube-audio-stream')
const ytdl = require('ytdl-core')

const app = express()
const server = http.Server(app)

app.set('port', PORT)

app.use(bodyParser.urlencoded({ extended: true }))
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')))
app.use('/client', express.static(path.join(__dirname, '/client')))
app.use('/videos', express.static(path.join(__dirname, '/videos')))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/stream/:videoId', (request, response) => {
  const videoId = request.params.videoId
  try {
    console.log('streamed')
    youtubeAudioStream(videoId).pipe(response)
  } catch (exception) {
    console.error(exception)
    response.status(500).send(exception)
  }
})

app.post('/spatialize', (request, response) => {
  const videoUrl = request.body.url
  if (!ytdl.validateURL(videoUrl)) {
    response.send({ success: false })
    return
  }
  const videoId = ytdl.getVideoID(videoUrl)
  const videoWriteStream = fs.createWriteStream(
    path.join(__dirname, 'videos', `${videoId}.mp4`))
  try {
    ytdl(videoUrl, { filter: format => format.container == 'mp4' })
      .pipe(videoWriteStream)
    videoWriteStream.on('close', () => {
      response.send({
        success: true,
        id: videoId
      })
    })
  } catch (exception) {
    console.error(exception)
    response.send({ success: false })
  }
})

app.use((request, response) => {
  response.redirect('/')
})

// Starts the server.
server.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`)
})
