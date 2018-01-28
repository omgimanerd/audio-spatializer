/* eslint-disable require-jsdoc */
globals Transform


/**
 * A file to implement the idea of a "Pattern" in the spatialization.
 * Each pattern consists of a sequence of spatial transformations.
 * When an pattern is upvoted or downvoted, it is adjusted accordingly
 * (the Markov-chain for pattern generation is updated).
 */

class Pattern {
  constructor(t1, t2, t3) {
    this.t1 = t1
    this.t2 = t2
    this.t3 = t3
  }

  toString() {
    return this.t1.toString() + this.t2.toString() + this.t3.toString()
  }

  static getNext(pdf, lastPos) {
    const bounds = [0]
    let last = 0
    for (const votes of Object.values(pdf)) {
      bounds.push(votes + bounds[last])
      last++
    }
    const next = Math.random() * bounds[last]
    last = 0
    while (bounds[last] < next) {
      last++
    }
    return Transform.getNewTransform(last, lastPos)
  }
}

class Sequence {
  constructor(pdf, peakList) {
    this.pdf = pdf
    this.transformList = []
    this.equal = { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }
    this.peakList = peakList
    this.currentBeat = 0
    this.millisEnd = []

    this.pointList = []

    const first = Pattern.getNext(this.equal, null)
    this.transformList.push(first)
    this.pointList.concat(first.getPoints())
    this.millisEnd.push(this.pointList.length)

    const second = Pattern.getNext(this.equal, first.getEndPoint())
    this.transformList.push(second)
    this.pointList.concat(second.getPoints())
    this.millisEnd.push(this.pointList.length)

    const third = Pattern.getNext(this.equal, second.getEndPoint())
    this.transformList.push(third)
    this.pointList.concat(third.getPoints())
    this.millisEnd.push(this.pointList.length)

    while (this.currentBeat < peakList.length) {
      const pattern = new Pattern(
        this.transformList[this.transformList.length - 3],
        this.transformList[this.transformList.length - 2],
        this.transformList[this.transformList.length - 1])
      const nextToAdd = pattern.getNext(this.pdf[pattern.toString()],
        this.transformList[this.transformList.length - 1].getEndPoint())
      this.pointsList.concat(nextToAdd.getPoints())
      this.transformList.push(nextToAdd)
      this.millisEnd.push(this.pointList.length)
    }
  }

//  static getVector(pdf, peaks) {
//    const sequence = new Sequence(pdf, peaks)
//    return sequence.getPointList()
//  }

  updatePDF(pdf) {
    this.pdf = pdf
  }

  static getNextBeatLength() {
    const len = this.peakList[this.currentBeat]
    this.currentBeat++
    return len
  }

  getPointList() {
    return this.pointList
  }

  bnsCurrentTransform(curMillis, start, end) {
    if (curMillis > this.millisEnd[(start + end) / 2] &&
      curMillis < this.millisEnd[1 + (start + end) / 2]) {
      return (start + end) / 2
    } else if (curMillis < this.millisEnd[(start + end) / 2]) {
      return this.bnsCurrentTransform(curMillis, start, (start + end) / 2)
    }
    return this.bnsCurrentTransform(curMillis, (start + end + 1) / 2, end)
  }

  getCurrentTransform(curMillis) {
    return this.bnsCurrentTransform(curMillis, 0, this.millisEnd.length - 1)
  }

  getMarkovUpdate(curMillis) {
    const current = this.getCurrentTransform(curMillis)
    if (current < 20) {
      return this.millisEnd.slice(0, current)
    }
    return this.millisEnd.slice(current - 20, current)
  }
}
