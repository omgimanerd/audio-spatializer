function loadSound() {
  var request = new XMLHttpRequest();
  request.open("GET", '/stream/A1GK6e52iss', true);
  request.responseType = "arraybuffer";

  request.onload = function() {
      var Data = request.response;
      process(Data);
  };

  request.send();
}

function process(data) {
  console.log(data)
}

console.log('done')
loadSound()
