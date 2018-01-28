/* eslint-disable require-jsdoc */
/* globals LIN, QUAD, Reset, Jump, Delay, Flip, Rotate */

const defPoint = new Point(1, 90, 90)

const rotateType = {
  LIN: (delta, millis, t) => {
    return delta.divideMove(millis).multiplyMove(t)
  },
  QUAD: (delta, millis, t) => {
    return delta.divideMove(millis).multiplyMove(t / millis)
  }
}

class Transform {
  constructor(beatCount, sequence) {
    this.beatCount = beatCount
    this.sequence = sequence
    this.millis = 0
    this.id = 'undefined'
    for (let i = 0; i < beatCount; i++) {
      // Peak data needs to be converted into beat lengths
      // (peak[i] - peak[i-1] / sampling rate * 1000)
      this.millis += this.sequence.getNextBeatLength()
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

  static getNewTransform(sequence, type, lastPos) {
    if (!lastPos) {
      lastPos = defPoint
    }
    switch (type) {
    case 1:
      return new Reset(sequence)
    case 2:
      return new Jump(sequence)
    case 3:
      return Delay.makeRandomDelay(sequence, lastPos)
    case 4:
      return new Flip(sequence, lastPos)
    case 5:
    case 6:
      return Rotate.makeRandomRotate(sequence, lastPos)
    default:
      throw new Error('Invalid Transform')
    }
  }
}


class Reset extends Transform {
  constructor(sequence) {
    super(1, sequence)
    this.id = 'Re'
  }

  getPoints() {
    const points = []
    for (let i = 0; i < this.millis; i++) {
      points.push(defPoint.getLocation())
    }
    return points
  }

  getEndPoint() {
    return this.defPoint
  }
}


class Jump extends Transform {
  constructor(sequence) {
    super(1, sequence)
    this.id = 'Ju'
    this.target = new Point(1, Math.random() * 360, Math.random() * 360)
  }

  getPoints() {
    const points = []
    for (let i = 0; i < this.millis; i++) {
      points.push(this.target.getLocation())
    }
    return points
  }

  getEndPoint() {
    return this.target
  }
}


class Delay extends Transform {
  constructor(beatCount, sequence, prevPoint) {
    super(beatCount, sequence)
    this.prevPoint = prevPoint
    this.id = 'De'
  }

  static makeRandomDelay(sequence, lastPos) {
    return new Delay(Math.random() * 4 + 1, sequence, lastPos)
  }

  getPoints() {
    const points = []
    for (let i = 0; i < this.millis; i++) {
      points.push(this.prevPoint.getLocation())
    }
    return points
  }

  getEndPoint() {
    return this.prevPoint
  }
}


class Flip extends Transform {
  constructor(sequence, prevPoint) {
    super(1, sequence)
    this.prevPoint = prevPoint
    this.newPoint = prevPoint
    this.id = 'Fl'
  }

  getPoints() {
    const newPoint = this.prevPoint.flip()
    const points = []
    for (let i = 0; i < this.millis; i++) {
      points.push(newPoint.getLocation())
    }
    return points
  }

  getEndPoint() {
    return this.newPoint
  }
}


class Rotate extends Transform {
  constructor(beatCount, sequence, prevPoint, destPoint, rotateType) {
    super(beatCount, sequence)
    this.prevPoint = prevPoint
    this.destPoint = destPoint
    this.rotateType = rotateType
    this.id = 'Ro'
  }

  static makeRandomRotate(sequence, lastPos) {
    return new Rotate(
      Math.random() * 3 + 1,
      sequence,
      lastPos,
      new Point(1, Math.random() * 360, Math.random() * 360),
      Math.floor(Math.random() * 2) === 0 ? rotateType.LIN : rotateType.QUAD)
  }

  getPoints() {
    const delta = this.prevPoint.getDeltas(this.destPoint)
    const points = []
    for (let i = 0; i < this.millis; i++) {
      points.push(this.rotateType(
        delta, this.millis + 0.00001, i).getLocation())
    }
    return points
  }

  getEndPoint() {
    return this.destPoint
  }
}
