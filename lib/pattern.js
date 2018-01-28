const transforms = require('./transforms')
const Transform = transforms.Transform

/**
 * A file to implement the idea of a "Pattern" in the spatialization.
 * Each pattern consists of a sequence of spatial transformations.
 * When an pattern is upvoted or downvoted, it is adjusted accordingly
 * (the Markov-chain for pattern generation is updated).
 */

class Pattern {
  constructor(t1, t2, t3){
    this.t1 = t1
    this.t2 = t2
    this.t3 = t3
  }

  toString(){
    return t1.toString() + t2.toString() + t3.toString()
  }

  static getNext(pdf, lastPos){
    bounds = [0]
    last = 0
    for(votes of Object.values(pdf)){
      bounds.push(votes + bounds[last])
      last++
    }
    next = Math.random() * bounds[last]
    last = 0
    while(bounds[last] < next){
      last++
    }
    return getNewTransform(last, lastPos)
  }
}

class Sequence {
  constructor(pdf, peakList){
    this.pdf = pdf
    this.last20 = new Queue()
    this.equal = {0 : 1, 1 : 1, 2 : 1, 3 : 1, 4 : 1, 5 : 1}
    this.peakList = peakList
    this.currentBeat = 0

    this.pointList = []
    first = StaticMethodCall.getNext(equal, null)
    last20.enqueue(first)
    pointList.concat(first.getPoints())
    second = StaticMethodCall.getNext(equal, first.getEndPoint())
    last20.enqueue(second)
    pointList.concat(second.getPoints())
    third = StaticMethodCall.getNext(equal, second.getEndPoint())
    last20.enqueue(third)
    pointList.concat(third.getPoints())

    while(currentBeat < peakList.length){
      recents = last20.getStorage
      pattern = new Pattern(recents[recents.length - 3], recents[recents.length - 2], recents[recent.length - 1])
      nextToAdd = pattern.getNext(this.pdf[pattern.toString()], recents[recents.length - 1].getEndPoint())
      pointsList.concat(nextToAdd.getPoints())
      last20.enqueue(nextToAdd)
      if(last20.getStorage.length > 20){
        last20.dequeue()
      }
    }
  }

  updatePDF(pdf){
    this.pdf = pdf
  }

  getNextBeatLength(){
    len = peakList[currentBeat]
    currentBeat++
    return len
  }

  getLast20(){
    return this.last20.getStorage()
  }

}


class Queue {
  constructor() {
    this._oldestIndex = 1
    this._newestIndex = 1
    this._storage = {}
  }
 getStorage() {
   return this._storage
 }
 getSize() {
    return this._newestIndex - this._oldestIndex
 }
  enqueue(data) {
    this._storage[this._newestIndex] = data
    this._newestIndex++
  }
  dequeue() {
    const oldestIndex = this._oldestIndex
    const newestIndex = this._newestIndex
    let deletedData

    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex]
        delete this._storage[oldestIndex]
        this._oldestIndex++

        return deletedData
    }
  }
}