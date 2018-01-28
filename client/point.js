/* eslint-disable require-jsdoc */

const DEG2RAD = 3.14 / 180

function sphereToCartesian(rho, theta, psi) {
  return [rho * Math.sin(DEG2RAD * psi) * Math.cos(DEG2RAD * theta),
    rho * Math.sin(DEG2RAD * psi) * Math.sin(DEG2RAD * theta),
    rho * Math.cos(DEG2RAD * psi)]
}

class Point {
  constructor(rho, theta, psi) {
    this.rho = rho
    this.theta = theta
    this.psi = psi
  }

  getRho() {
    return this.rho
  }

  getTheta() {
    return this.theta
  }

  getPsi() {
    return this.psi
  }

  getLocation() {
    return sphereToCartesian(this.rho, this.theta, this.psi)
  }

  flip() {
    return new Point(-this.rho, this.theta, this.psi)
  }

  getDeltas(destination) {
    return new Point(destination.getRho() - this.rho,
      destination.getTheta() - this.theta,
      destination.getPsi() - this.psi)
  }

  addPoint(delta) {
    return new Point(this.rho + delta.getRho(),
      this.theta + delta.getTheta(),
      this.psi + delta.getPsi())
  }

  divideMove(divisor) {
    return new Point(this.rho / divisor,
      this.theta / divisor,
      this.psi / divisor)
  }

  multiplyMove(factor) {
    return new Point(this.rho * factor,
      this.theta * factor,
      this.psi * factor)
  }
}

window.Point = Point
