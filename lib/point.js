export const rotateType = {
  LIN : (delta, millis, t) => {
    return delta.divideMove(millis).multiplyMove(t)
  },
  QUAD : () => {
    return delta.divideMove(millis).multiplyMove(t/millis)
  }
}

const deg2rad = 3.14/180

function sphereToCartesian(rho, theta, psi){
  pos = [rho*Math.sin(deg2rad * psi)*Math.cos(deg2rad * theta),
         rho*Math.sin(deg2rad * psi)*Math.sin(deg2rad * theta),
         rho*Math.cos(deg2rad * psi)]
  return pos
}

function cylinderToCartesian(r, theta, z){
  pos = [r*Math.cos(deg2rad * theta), r*Math.sin(deg2rad * theta), z]
  return pos
}

function polarToCartesian(r, theta){
  pos = [r*Math.cos(deg2rad * theta), r*Math.sin(deg2rad * theta), 0]
  return pos
}


export class Point{
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