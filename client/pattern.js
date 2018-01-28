const transforms = require('./transforms')
const proxy = require('./proxy')
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
    this.transformList = []
    this.equal = {0 : 1, 1 : 1, 2 : 1, 3 : 1, 4 : 1, 5 : 1}
    this.peakList = peakList
    this.currentBeat = 0
    this.millisEnd = []

    this.pointList = []

    first = StaticMethodCall.getNext(equal, null)
    transformList.push(first)
    pointList.concat(first.getPoints())
    millisEnd.push(pointList.length)

    second = StaticMethodCall.getNext(equal, first.getEndPoint())
    transformList.push(second)
    pointList.concat(second.getPoints())
    millisEnd.push(pointList.length)

    third = StaticMethodCall.getNext(equal, second.getEndPoint())
    transformList.push(third)
    pointList.concat(third.getPoints())
    millisEnd.push(pointList.length)

    while(currentBeat < peakList.length){
      pattern = new Pattern(transformList[transformList.length - 3],
                            transformList[transformList.length - 2],
                            transformList[transformList.length - 1])
      nextToAdd = pattern.getNext(this.pdf[pattern.toString()],
                                  transformList[transformList.length - 1].getEndPoint())
      pointsList.concat(nextToAdd.getPoints())
      transformList.push(nextToAdd)
      millisEnd.push(pointList.length)
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

  getPointList(){
    return this.pointList
  }

  bnsCurrentTransform(curMillis, start, end){
    if(curMillis > this.millisEnd[(start + end) / 2] &&
      curMillis < this.millisEnd[1 + ((start + end) / 2)]){
        return (start+end) / 2
    }
    else if(curMillis < this.millisEnd[(start+end)/2]){
      return bnsCurrentTransform(curMillis, start, (start+end)/2)
    }
    return bnsCurrentTransform(curMillis, (start+end+1)/2, end)
  }

  getCurrentTransform(curMillis){
    return bnsCurrentTransform(curMillis, 0, this.millisEnd.length - 1)
  }

  getMarkovUpdate(curMillis){
    current = getCurrentTransform
    if(current < 20){
      return this.millisEnd.slice(0, current)
    }
    return this.millisEnd.slice(current - 20, current)
  }
}

function getVector(pdf, peaks){
  sequence = new Sequence(pdf, peaks)
  return sequence.getPointList()
}