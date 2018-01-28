/**
 * Client side script.
 * @author omgimanerd (alvin@omgimanerd.tech)
 * @author Searnsy
 */
/* eslint-disable require-jsdoc */
/* globals $ */

const TAU = 6.28

// eslint-disable-next-line no-unused-vars
const visualize = amplitudes => {
  const canvasElement = document.getElementById('visualization-canvas')
  const canvasContext = canvasElement.getContext('2d')

  const width = canvasElement.width = $(document).width()
  const height = canvasElement.height = $(document).height()

  const cx = width / 2
  const cy = height / 2.4
  const startTimestamp = Date.now()
  let l = 0
  canvasContext.save()
  canvasContext.translate(cx, cy)
  const visualizationId = setInterval(() => {
    // const deltaTime = Date.now() - startTimestamp
    if (l >= amplitudes.length) {
      canvasContext.restore()
      canvasContext.clearRect(0, 0, width, height)
      clearInterval(visualizationId)
      return
    }
    canvasContext.clearRect(-width, -height, width * 2, height * 2)
    canvasContext.fillStyle = 'red'
    const circleRadius = (amplitudes[l].reduce((a, b) => a + b) / 40)
    console.log(circleRadius)
    canvasContext.arc(0, 0, circleRadius, 0, TAU)
    canvasContext.fill()

    canvasContext.save()
    for (let i = 0; i < 40; ++i) {
      canvasContext.fillRect(-30, 0, amplitudes[l][i] + circleRadius, 30)
      canvasContext.rotate(TAU / 40)
    }
    canvasContext.restore()
    ++l
  }, 100)
}

// $(document).ready(() => {
//   const data = []
//   for (let i = 0; i < 100; ++i) {
//     const a = []
//     for (let j = 0; j < 40; ++j) {
//       a.push(Math.random() * 300)
//     }
//     data.push(a)
//   }
//   console.log(data)
//   visualize(data)
// })
