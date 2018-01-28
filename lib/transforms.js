const points = require('./point')
const Point = points.Point
const rotateType = points.rotateType

defPoint = new Point(1, 90, 90)

export class Transform {
  constructor(beatCount){
    this.beatCount = beatCount
    this.millis = 0
    for(var i = 0; i < beatCount; i++){
      //Peak data needs to be converted into beat lengths (peak[i] - peak[i-1] / sampling rate * 1000)
      this.millis += getNextBeatLength()
    }
  }

  getPoints(){
    throw new error "Invalid Transform"
  }

  toString(){
    throw new error "Invalid Transform"
  }

  getEndPoint(){
    thrown new error "Invalid Transform"
  }

  getNewTransform(type, lastPos){
    if(!lastPos){
      lastPos = defPoint
    }
    switch(type){
      case 1:
        return new Reset()
      case 2:
        return new Jump()
      case 3:
        return new StaticMethodCall.makeRandomDelay(lastPos)
      case 4:
        return new Flip(lastPos)
      case 5:
        return new StaticMethodCall.makeRandomRotate(lastPos)
      default:
        throw new error "No Valid Transform"
    }
  }
}


class Reset extends Transform{
  constructor(){
    super(1)
  }

  getPoints(){
    points = []
    for(var i = 0; i < super.millis; i++){
      points.push(defPoint.getLocation())
    }
    return points
  }

  toString(){
    return "Re"
  }

  getEndPoint(){
    return defPoint
  }
}


class Jump extends Transform{
  constructor(){
    super(1)
    this.target = new Point(1, Math.random() * 360, Math.random() * 360)
  }

  getPoints(){
    points = []
    for(var i = 0; i < super.millis; i++){
      points.push(this.target.getLocation())
    }
    return points
  }

  toString(){
    return "Ju"
  }

  getEndPoint(){
    return this.target
  }
}


class Delay extends Transform {
  constructor(beatCount, prevPoint){
    super(beatCount)
    this.prevPoint = prevPoint
  }

  static makeRandomDelay(lastPos){
    Math.random() * 4 + 1, lastPos
  }

  getPoints(){
    points = []
    for(var i = 0; i < super.millis; i++){
      points.push(this.prevPoint.getLocation())
    }
    return points
  }

  toString(){
    return "De"
  }

  getEndPoint(){
    return this.prevPoint
  }
}


class Flip extends Transform{
  constructor(prevPoint){
    super(1)
    this.prevPoint = prevPoint
    this.newPoint = prevPoint
  }

  getPoints(){
    newPoint = this.prevPoint.flip()
    points = []
    for(var i = 0; i < super.millis; i++){
      points.push(newPoint.getLocation())
    }
  }

  toString(){
    return "Fl"
  }

  getEndPoint(){
    return this.newPoint
  }
}


class Rotate extends Transform{
  constructor(beatCount, prevPoint, destPoint, rotateType){
    this.prevPoint = prevPoint
    this.destPoint = destPoint
    this.rotateType = rotateType
  }

  static makeRandomRotate(lastPos){
    return new Rotate(Math.random() * 3 + 1,
                          lastPos,
                          new Point(1, Math.random() * 360, Math.random() * 360),
                          Math.floor(Math.random() * 2) == 0 ? LIN : QUAD)
  }

  getPoints(){
    delta = this.prevPoint.getDeltas(this.destPoint)
    points = []
    for(var i = 0; i < super.millis; i++){
      points.push(this.rotateType(delta, super.millis, i).getLocation())
    }
  }

  toString(){
    return "Ro"
  }

  getEndPoint(){
    return this.destPoint
  }
}