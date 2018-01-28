// Duplicated constants from transforms.js
/* eslint-disable require-jsdoc */

const transforms = { 0: 'Re', 1: 'Ju', 2: 'De', 3: 'Fl', 4: 'Ro' }

class Markov {
  constructor() {
    this.pdf = {}
    for (let first = 0; first < 5; first++) {
      for (let second = 0; second < 5; second++) {
        for (let third = 0; third < 5; third++) {
          const pattern =
            transforms[first] + transforms[second] + transforms[third]
          const odds = {}
          for (let fourth = 0; fourth < 5; fourth++) {
            odds[transforms[fourth]] = 10
          }
          this.pdf[pattern] = odds
        }
      }
    }
  }

  // updatePdf(proxy){
  //   const recents = proxy['recents']
  //   const updown = proxy['updown']
  //   for(let i = 0; i + 7 < recents.length; i++){
  //     this.pdf[recents.substring(i, i+6)][recents.substring[i+6, i+8]] += updown
  //   }
  // }
}

module.exports = exports = Markov
