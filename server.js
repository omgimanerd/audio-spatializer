/**
 * @fileoverview This is the server app script.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const PORT = 5000

// Dependencies.
const express = require('express')
const http = require('http')
const morgan = require('morgan')
const path = require('path')
const socketIO = require('socket.io')
const ytdl = require('ytdl-core')

const Markov = require('./lib/markov')

const app = express()
const server = http.Server(app)
const io = socketIO(server)

app.set('port', PORT)

app.use(morgan('dev'))
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')))
app.use('/client', express.static(path.join(__dirname, '/client')))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/stream/:videoId', (request, response) => {
  const videoId = request.params.videoId
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
  if (!ytdl.validateURL(videoUrl)) {
    response.send({ success: false })
  } else {
    ytdl(videoUrl, { filter: format => format.container === 'mp4' })
      .pipe(response)
  }
})

app.use((request, response) => {
  response.redirect('/')
})

io.on('connection', socket => {
  socket.on('update-markov', () => {
    // TODO: unimplemented
  })

  socket.on('get-markov', callback => {
    callback(new Markov())
  })
})

// Starts the server.
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Starting server on port ${PORT}`)
})
