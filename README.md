# Audio Spatializer
Submission for BrickHack 4. This project takes a YouTube video and runs some
processing and analysis on it to "visualize" the audio in 3D space. The
algorithm powering this will analyze factors such as beat patterns and
move the sound source around you in 3D space using
[Google's Resonance Audio API](https://developers.google.com/resonance-audio/),
creating an immersive audio experience. In order to properly enjoy this,
you must have stereo headphones/earphones.

# Setup
The only thing required to replicate this project is `node.js >= 6.0.0`
```
git clone https://github.com/omgimanerd/audio-spatializer
cd audio-spatializer
npm install    # or yarn install
node server.js
```
Then visit [http://localhost:5000](http://localhost:5000)

# Authors
  - Alvin Lin (omgimanerd)
  - Andrew Searns (Searnsy)

# License
[Apache 2](https://github.com/omgimanerd/audio-spatializer/blob/master/LICENSE)
