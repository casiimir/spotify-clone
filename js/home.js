// DOM Card
const createCard = (trackImgSrc, trackTitle, trackDescription, parentClass) => {
  const parent = document.querySelector(parentClass);
  
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapperList__card');

  const img = document.createElement('img');
  img.src = trackImgSrc;

  const title = document.createElement('strong');
  title.textContent = trackTitle;

  const description = document.createElement('p');
  description.textContent = trackDescription;

  wrapper.append(img, title, description);
  parent.appendChild(wrapper);
}

const getTracksByAlbum = async (ID, whatIs, searchType) => {
  const result = await fetch(`
      ${states.baseURL}${states.apiKEY}/${whatIs}.php?${searchType}=${ID}
  `);
  const data = await result.json();

  return data[whatIs];
}

const popWrapperList = async (ID, whatIs, searchType, parent) => {
  const albumData = await getTracksByAlbum(ID, whatIs, searchType);

  albumData.forEach((album) => {
    const coverImg = album.strAlbumThumb ? 
      album.strAlbumThumb += '/preview' :
      './default-cover.png';

    // if album description exist and is >= 80, slice it and add final '...'
    let albumReview = album.strDescriptionEN || album.strArtist;
    albumReview.length <= 80 ?
      albumReview = album.strDescriptionEN :
      albumReview = album.strDescriptionEN.slice(0,80) + '...';
    
    createCard(coverImg, album.strAlbum, albumReview, parent);
  });
}

// Top Ten Tracks
const getTopTen = async (artistName) => {
  const result = await fetch(`
      ${states.baseURL}${states.apiKEY}/track-top10.php?s=${artistName}
  `);
  const data = await result.json();
  return data;
}

// Albums from an artist ID
const getAlbumsFrom = async (ID) => {
  const result = await fetch(`${states.baseURL}${states.apiKEY}/album.php?i=${ID}`);
  const data = await result.json();

  return data;
}

// Button control carousel wrapperTracks - dirBtn
const setBtnControl = () => {
  const btnLeft = document.querySelectorAll('.dirBtn__left');
  const btnRight = document.querySelectorAll('.dirBtn__right');

  btnRight.forEach((el) => { //e.path[1].id
    el.addEventListener('click', (e) => scrollCarouselTo(e, 'left'));
  })

  btnLeft.forEach((el) => { //e.path[1].id
    el.addEventListener('click', (e) => scrollCarouselTo(e, 'right'));
  }) 
}

// Utils
// Get album cover from ID
const getAlbumBy = async(ID) => {
  const result = await fetch(`${states.baseURL}${states.apiKEY}/album.php?m=${ID}`);
  const image = await result.json();
  return image;
}

// Carosello button scrolling on click
const scrollCarouselTo = (element, dir) => {
  let direction = 0

  if (dir === 'right') direction += 400
  else if (dir === 'left') direction -= 400
  element.path[3].children[2].scrollBy(direction, 0);
}

const states = {
  baseURL: `https://theaudiodb.com/api/v1/json/`,
  imgURL: 'https://www.theaudiodb.com/images/media/artist/thumb/b2181aae-5cba-496c-bb0c-b4cc0109ebf8.jpg/preview',
  apiKEY: '523532'
}

// Self Init
// Enables button, actually
setBtnControl();
export {
  createCard,
  getTracksByAlbum,
  popWrapperList,
  setBtnControl,
  scrollCarouselTo,
  getTopTen,
  getAlbumsFrom,
  getAlbumBy
};

// // Audio status bar tracking and button system (by myself)
// const getTrackAudioLenFormat = (duration) => {
//   return (duration / 60).toFixed(2).replace('.',':');
// }

// // Format time as 00:00 style
// const formatTime = (num) => { 
//   const minutes = Math.floor(num / 60);  
//   const seconds = num % 60;

//   return minutes + ":" + seconds;         
// }

// const updateStatusBarInPlaying = () => {  
//   const audioProgressActual = document.querySelector('.audioProgress__actual');
//   const audioProgressTotal = document.querySelector('.audioProgress__total');

//   audioProgressActual.textContent = formatTime(Math.round(audioTrack.currentTime));
//   audioProgressTotal.textContent = formatTime(Math.round(audioTrack.duration));
//   statusBarRange.value = audioTrack.currentTime / audioTrack.duration * 100 + (audioTrack.currentTime / 25); 
// }

// const updateStatusPlayingTrack = () => {
//   audioTrack.currentTime = (audioTrack.duration / 100) * statusBarRange.value;
// }

// const updateStatusBarVolume = () => {
//   audioTrack.volume = statusBarVolume.value / 100;
// }

// // Status
// const statusBarRange = document.querySelector('.statusBar__range');
// const audioTrack = document.querySelector('.audioTag');
// const statusBarVolume = document.querySelector('.statusBar__volume');
// const audioPlayBtn = document.querySelector('.fa-play');

// const audioProgressActual = document.querySelector('.audioProgress__actual');
// const audioProgressTotal = document.querySelector('.audioProgress__total');

// statusBarRange.addEventListener('change', updateStatusPlayingTrack);

// audioTrack.addEventListener('timeupdate', updateStatusBarInPlaying);

// statusBarVolume.addEventListener('change', updateStatusBarVolume);

// // Buttons control
// let isPlaying = false;

// audioPlayBtn.addEventListener('click', () => {
//   if (!isPlaying) {
//     audioTrack.volume = 0.5;
//     audioTrack.play();
//     isPlaying = true;
//     audioPlayBtn.className += 'fas fa-pause';
//   } else {
//     audioTrack.pause();
//     audioPlayBtn.className = 'fas fa-play';
//     isPlaying = false;
//   }
// })