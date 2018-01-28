/* eslint-disable require-jsdoc */
/* globals LIN, QUAD, Reset, Jump, Delay, Flip, Rotate */

const point = require('./point')
const Point = point.Point

const defPoint = new Point(1, 90, 90)

class Transform {
  constructor(beatCount) {
    this.beatCount = beatCount
    this.millis = 0
    this.id = "undefined"
    for (let i = 0; i < beatCount; i++) {
      // Peak data needs to be converted into beat lengths
      // (peak[i] - peak[i-1] / sampling rate * 1000)
      this.millis += Sequence.getNextBeatLength()
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getPoints() {
    throw new Error('Invalid Transform')
  }

  // eslint-disable-next-line class-methods-use-this
  toString() {
    return this.id
  }

  // eslint-disable-next-line class-methods-use-this
  getEndPoint() {
    throw new Error('Invalid Transform')
  }

  static getNewTransform(type, lastPos) {
    if (!lastPos) {
      lastPos = defPoint
    }
    switch (type) {
    case 1:
      return new Reset()
    case 2:
      return new Jump()
    case 3:
      return Delay.makeRandomDelay(lastPos)
    case 4:
      return new Flip(lastPos)
    case 5:
      return Rotate.makeRandomRotate(lastPos)
    default:
      throw new Error('Invalid Transform')
    }
  }
}


class Reset extends Transform {
  constructor() {
    super(1)
    this.id = 'Re'
  }

  getPoints() {
    const points = []
    for (let i = 0; i < super.millis; i++) {
      points.push(defPoint.getLocation())
    }
    return points
  }

  getEndPoint() {
    return this.defPoint
  }
}


class Jump extends Transform {
  constructor() {
    super(1)
    this.id = 'Ju'
    this.target = new Point(1, Math.random() * 360, Math.random() * 360)
  }

  getPoints() {
    const points = []
    for (let i = 0; i < super.millis; i++) {
      points.push(this.target.getLocation())
    }
    return points
  }

  getEndPoint() {
    return this.target
  }
}


class Delay extends Transform {
  constructor(beatCount, prevPoint) {
    super(beatCount)
    this.prevPoint = prevPoint
    this.id = 'De'
  }

  static makeRandomDelay(lastPos) {
    return new Delay(Math.random() * 4 + 1, lastPos)
  }

  getPoints() {
    const points = []
    for (let i = 0; i < super.millis; i++) {
      points.push(this.prevPoint.getLocation())
    }
    return points
  }

  getEndPoint() {
    return this.prevPoint
  }
}


class Flip extends Transform {
  constructor(prevPoint) {
    super(1)
    this.prevPoint = prevPoint
    this.newPoint = prevPoint
    this.id = 'Fl'
  }

  getPoints() {
    const newPoint = this.prevPoint.flip()
    const points = []
    for (let i = 0; i < super.millis; i++) {
      points.push(newPoint.getLocation())
    }
  }

  getEndPoint() {
    return this.newPoint
  }
}


class Rotate extends Transform {
  constructor(beatCount, prevPoint, destPoint, rotateType) {
    super()
    this.prevPoint = prevPoint
    this.destPoint = destPoint
    this.rotateType = rotateType
    this.id = 'Ro'
  }

  static makeRandomRotate(lastPos) {
    return new Rotate(Math.random() * 3 + 1,
      lastPos,
      new Point(1, Math.random() * 360, Math.random() * 360),
      Math.floor(Math.random() * 2) === 0 ? LIN : QUAD)
  }

  getPoints() {
    const delta = this.prevPoint.getDeltas(this.destPoint)
    const points = []
    for (let i = 0; i < super.millis; i++) {
      points.push(this.rotateType(delta, super.millis, i).getLocation())
    }
  }

  getEndPoint() {
    return this.destPoint
  }
}
