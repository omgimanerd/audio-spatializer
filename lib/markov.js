
//Duplicated constants from transforms.js
const transforms {0 : "Re", 1 : "Ju", 2 : "De", 4 : "Fl", 5 : "Ro"}

class Markov{
  constructor(){
    this.pdf = {}
    for(let first = 0; first < 6; first++){
      for(let second = 0; second < 6; second++){
        for(let third = 0; third < 6; third++){
          pattern = transforms[first] + transforms[second] + transforms[third]
          odds = {}
          for(let fourth = 0; fourth < 6; fourth++){
            odds[transforms[fourth]] = 10
          }
          pdf[pattern] = odds
        }
      }
    }
  }
}