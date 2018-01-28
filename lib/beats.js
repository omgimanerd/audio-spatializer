/**
 * Beat analysis.
 * @author Searnsy
 */
/* eslint-disable no-console */
/* eslint-disable valid-jsdoc */

const AudioContext = require('web-audio-api').AudioContext
const context = new AudioContext()
const fs = require('fs')
const exec = require('child_process').exec

let pcmdata = []
const locdata = []
let lr = 'L'

/**
 * [decodeSoundFile Use web-audio-api to convert audio file to a buffer of
 * pcm data]
 */
const decodeSoundFile = soundfile => {
  console.log('decoding mp3 file ', soundfile, ' ..... ')
  fs.readFile(soundfile, (err, buf) => {
    if (err) { throw err }
    context.decodeAudioData(buf, audioBuffer => {
      console.log(audioBuffer.numberOfChannels, audioBuffer.length,
        audioBuffer.sampleRate, audioBuffer.duration)
      pcmdata = audioBuffer.getChannelData(0)
      const samplerate = audioBuffer.sampleRate
      const maxvals = [] // unused vars
      const max = 0
      playsound(soundfile)
      findPeaks(pcmdata, samplerate)
    })
  })
}


/**
 * [findPeaks Naive algo to identify peaks in the audio data, and wave]
 * @param  {[type]} pcmdata    [description]
 * @param  {[type]} samplerate [description]
 * @return {[type]}            [description]
 */
const findPeaks = (pcmdata, samplerate) => {
  const interval = 0.05 * 1000; index = 0
  const step = Math.round(samplerate * (interval / 1000))
  let max = 0
  let prevmax = 0
  const prevdiffthreshold = 0.3

  // Loop through song in time with sample rate
  var samplesound = setInterval(() => {
    if (index >= pcmdata.length) {
      clearInterval(samplesound)
      console.log('finished sampling sound')
      console.log(locdata)
      return
    }

    for (let i = index; i < index + step; i++) {
      max = pcmdata[i] > max ? pcmdata[i].toFixed(1) : max
      locdata.push(lr)
    }

    // Spot a significant increase? Potential peak
    bars = getbars(max)
    if (max - prevmax >= prevdiffthreshold) {
      bars += ' == peak == '
      lr = lr == 'L' ? 'R' : 'L'
    }

    // Print out mini equalizer on commandline
    console.log(bars, max)
    prevmax = max; max = 0; index += step
  }, interval, pcmdata)
}

/**
 * TBD
 * @return {[type]} [description]
 */
function detectBeats() {

}

/**
 * [getbars Visualize image sound using bars, from average pcmdata within a
 * sample interval]
 * @param  {[Number]} val [the pcmdata point to be visualized ]
 * @return {[string]}     [a set of bars as string]
 */
const getbars = val => {
  let bars = ''
  for (let i = 0; i < val * 50 + 2; i++) {
    bars += lr
  }
  return bars
}

/**
 * [Plays a sound file]
 * @param  {[string]} soundfile [file to be played]
 */
function playsound(soundfile) {
  // Linux or raspi
  // Var create_audio = exec('aplay'+soundfile, {maxBuffer: 1024 * 500},
  // function (error, stdout, stderr) {
  exec(`ffplay -autoexit ${soundfile}`, {
    maxBuffer: 1024 * 500
  }, error => {
    if (error) {
      console.log(`exec error: ${error}`)
    } else {
      // Console.log(' finshed ');
      // MicInstance.resume();
    }
  })
}

// Note: I have no rights to these sound files and they are not created by me.
// You may downlaod and use your own sound file to further test this.
//
decodeSoundFile('test.mp4')
