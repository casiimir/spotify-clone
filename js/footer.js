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

const states = {
  isFullScreen: false
}

// self Init
getFullScreen();