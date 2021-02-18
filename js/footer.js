const getFullScreen = () => {
  const webPage = document.querySelector('html');
  const fullScreenIco = document.querySelector('.fa-expand-alt');

  fullScreenIco.addEventListener('click', () => {
    if (!states.isFullScreen) {
      webPage.requestFullscreen();
      states.isFullScreen = true;
    } else {
      document.exitFullscreen();
      states.isFullScreen = false;
    }
  });
}

// Audio status bar tracking and button system (by myself)
const getTrackAudioLenFormat = (duration) => {
  return (duration / 60).toFixed(2).replace('.',':');
}

// Format time as 00:00 style
const formatTime = (num) => { 
  const minutes = Math.floor(num / 60);  
  const seconds = num % 60;

  return minutes + ":" + seconds;         
}

const updateStatusBarInPlaying = () => {  
  const audioProgressActual = document.querySelector('.audioProgress__actual');
  const audioProgressTotal = document.querySelector('.audioProgress__total');
 
  if (!audioTrack.paused) {
    const audioPlayBtn = document.querySelector('#playButton');
    audioPlayBtn.className = 'fas fa-pause';
  }

  audioProgressActual.textContent = formatTime(Math.round(audioTrack.currentTime));
  audioProgressTotal.textContent = formatTime(Math.round(audioTrack.duration));
  statusBarRange.value = audioTrack.currentTime / audioTrack.duration * 100 + (audioTrack.currentTime / 25); 
}

const updateStatusPlayingTrack = () => {
  audioTrack.currentTime = (audioTrack.duration / 100) * statusBarRange.value;
}

const updateStatusBarVolume = () => {
  audioTrack.volume = statusBarVolume.value / 100;
}

// Self init
const states = {
  isFullScreen: false
}

const statusBarRange = document.querySelector('.statusBar__range');
const audioTrack = document.querySelector('.audioTag');
const statusBarVolume = document.querySelector('.statusBar__volume');
const audioPlayBtn = document.querySelector('#playButton');

const audioProgressActual = document.querySelector('.audioProgress__actual');
const audioProgressTotal = document.querySelector('.audioProgress__total');

// Check only if it refers to somewhere than index.html (no sound loaded)
if (audioTrack.id != 999) {
  statusBarRange.addEventListener('change', updateStatusPlayingTrack);
  
  audioTrack.addEventListener('timeupdate', updateStatusBarInPlaying);
  
  statusBarVolume.addEventListener('change', updateStatusBarVolume);

    // Buttons control
  let isPlaying = false;

  // check only-if the track source is present
  audioPlayBtn.addEventListener('click', () => {
    if (audioTrack.src) {
      if (!isPlaying) {
        audioTrack.volume = 0.5;
        audioTrack.play();
        audioPlayBtn.className += 'fas fa-pause'
        isPlaying = true;
      } else {
        audioTrack.pause();
        audioPlayBtn.className = 'fas fa-play';
        isPlaying = false;
      }
    }
  })
}

getFullScreen();