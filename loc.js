const rotateType = {
  LIN : (delta, millis, t) => {
    return delta.divideMove(millis).multiplyMove(t)
  },
  QUAD : () => {
    return delta.divideMove(millis).multiplyMove(t/millis)
  }
}

function sphereToCartesian(rho, theta, psi){
  pos = [rho*Math.sin(psi)*Math.cos(theta), rho*Math.sin(psi)*Math.sin(theta), rho*Math.cos(psi)]
  return pos
}

function cylinderToCartesian(r, theta, z){
  pos = [r*Math.cos(theta), r*Math.sin(theta), z]
  return pos
}

function polarToCartesian(r, theta){
  pos = [r*Math.cos(theta), r*Math.sin(theta), 0]
  return pos
}


class Point{
  constructor(rho, theta, psi){
    this.roe = roe
    this.theta = theta
    this.psi = psi
  }

  getRho(){
    return this.rho
  }

  getTheta(){
    return this.theta
  }

  getPsi(){
    return this.psi
  }

  getLocation(){
    return sphereToCartesian(this.rho, this.theta, this.psi)
  }

  flip(){
    return new Point(-this.rho, this.theta this.psi)
  }

  getDeltas(destination){
    return new Point(destination.getRho() - this.rho,
                     destination.getTheta() - this. theta,
                     destination.getPsi() - this.psi)
  }

  addPoint(delta){
    return new Point(this.rho + delta.getRho(),
                     this.theta + delta.getTheta(),
                     this.psi + delta.getPsi())
  }

  divideMove(divisor){
    return new Point(this.rho / divisor,
                     this.theta / divisor,
                     this.psi / divisor)
  }

  multiplyMove(factor){
    return new Point(this.rho * factor,
                     this.theta * factor,
                     this.psi * factor)
  }
}


class Transform {
  constructor(beatCount){
    this.beatCount = beatCount
    this.millis = 0
    for(var i = 0; i < beatCount; i++){
      this.millis += beatCount.getBeatLength
    }
  }

  getPoints(){
    throw new error "Invalid Transform"
  }
}


class Reset {
  constructor(){
    super(1)
  }

  getPoints(){
    defPoint = new Point(0, 0, 0)
    points = []
    for(var i = 0; i < super.millis; i++){
      points.push(defPoint.getLocation())
    }
    return points
  }
}


class Jump {
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
}


class Delay extends Transform {
  constructor(beatCount, prevPoint){
    super(beatCount)
    this.prevPoint = prevPoint
  }

  getPoints(){
    points = []
    for(var i = 0; i < super.millis; i++){
      points.push(this.prevPoint.getLocation())
    }
    return points
  }
}


class Flip {
  constructor(prevPoint){
    super(1)
    this.prevPoint = prevPoint
  }

  getPoints(){
    newPoint = this.prevPoint.flip()
    points = []
    for(var i = 0; i < super.millis; i++){
      points.push(newPoint.getLocation())
    }
  }
}


class Rotate {
  constructor(beatCount, prevPoint, destPoint, rotateType){
    this.prevPoint = prevPoint
    this.destPoint = destPoint
    this.rotateType = rotateType
  }

  getPoints(){
    delta = this.prevPoint.getDeltas(this.destPoint)
    points = []
    for(var i = 0; i < super.millis; i++){
      points.push(this.rotateType(delta, super.millis, i).getLocation())
    }
  }
}