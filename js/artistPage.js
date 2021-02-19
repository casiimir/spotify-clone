import { getTopTen, getAlbumsFrom, getTracksByAlbum, getAlbumBy } from './home.js';
import { trackListMP3 } from './trackListMP3.js';

// Utils
const setScore = (val) => Math.floor(val) + '/10';

// Audio player (actually works with top populary tracks)
const playTopPopTrack = () => {
  const mostPopularList = document.querySelector('.mostPopular__list');
  
  mostPopularList.addEventListener('click', isTargetID);
}

// Check only if heart was clicked ♥
// and put it into the local storage
const isFavouriteButton = (el) => {
  if(el.target.className === 'far fa-heart'){
    el.target.className = 'fas fa-heart'
    el.target.dataset.favourite = true;
  }
  // else if(el.target.className === 'fas fa-heart'){
  //   el.target.className = 'far fa-heart';
  //   el.target.dataset.favourite  = false;
  // }
}

const appendTemporarySideBar = (trackName) => {
  const playListSidebar = document.querySelector('.sidebar__playlist');
  const playListLi = document.createElement('li');

  if (playListLi.textContent !== 'null') {
    
    playListSidebar.childNodes.forEach((el) => {
      
      if (el.textContent === trackName){
        playListSidebar.removeChild(el)
      }

      playListLi.textContent = trackName;
      playListSidebar.appendChild(playListLi);
    })
  }
}

// Getting track's ID put the item into the local storage, optimized: check duplicate
const putFavInLocalStorage = (e) => {
  const selectFavTrackName = e.target.parentNode.children[2].textContent;

  if (e.target.dataset.favourite) {
    if (!states.local.includes(selectFavTrackName)) {
      states.local.push(selectFavTrackName);
      appendTemporarySideBar(selectFavTrackName);
    } else {
      states.local.splice(states.local.indexOf(selectFavTrackName), 1);
    }

    localStorage.setItem('local', states.local);
  }
}

// Check if the selection item is out play runner
// it needs refact.
const isTargetID = (e) => {  
  const audio = document.querySelector('.audioTag'); 
  const trackAudioSource = document.querySelector('.audioTag');
  // Make the audio player status bar visible
  document.querySelector('.audioProgress').style.display = 'flex';
  
  const trackName = e.path[1].children[2].textContent;

  isFavouriteButton(e);

  //reset localStorage in first call
  localStorage.removeItem('spotClonePlaylist');
  putFavInLocalStorage(e);

  if (e.target.parentNode.localName === 'li') {
    const albumData = getAlbumBy(e.path[1].id || e.path[0].id);
    

    Promise.all([albumData])
      .then((data) => {
        const albumCover = data[0].album[0].strAlbumThumb;
        const artistName = data[0].album[0].strArtist;

        if (e.target.id) {
          const artistNameFromHTML = document.body.dataset.artistname;
          const trackAudioFromMP3 = trackListMP3[artistNameFromHTML][e.target.id];

          trackAudioSource.src = trackAudioFromMP3;
          audio.load();
          audio.currentTime = 6.5;
          audio.play();
      
          setFooterPlayingTrack(albumCover, trackName, artistName);
        }
    })
  }
}

const setFooterPlayingTrack = (imgUrl, trackTitle, brandName) => {
  const taskbarTrack = document.querySelector('.taskbar__track');
  
  taskbarTrack.children[0].src = imgUrl;
  taskbarTrack.children[1].children[0].textContent = trackTitle;
  taskbarTrack.children[1].children[1].textContent = brandName;
}

// Create Element for the Top Ten Track, necessary to populates track list
const popTracksDOM = (trackNum, trackTitle, trackScore, parentEl, albumID) => {
  const parent = document.querySelector(parentEl);

  const container = document.createElement('li');
  container.dataset.noSelect = true;
  container.id = albumID;

  const num = document.createElement('span');
  num.textContent = trackNum + 1;
  num.id = trackNum;

  const fav = document.createElement('span');
  fav.className = 'far fa-heart';

  const title = document.createElement('span');
  title.textContent = trackTitle;
  title.id = trackNum;

  const totalPlays = document.createElement('span');
  totalPlays.textContent = trackScore;

  container.append(num, fav, title, totalPlays);
  return parent.appendChild(container);
}

// Create Element for every single Album in the Artist's obtained data
const popAlbumsDOM = (albumImg, productYear, albumTitle, idAlbum, parentEl) => {
  const parent = document.querySelector(parentEl);

  const mainWrapper = document.createElement('div');
  mainWrapper.classList.add('albumList--item');
  mainWrapper.id = idAlbum;

  const container = document.createElement('div');
  container.classList.add('albumList__piece--header');
  
  const image = document.createElement('img');
  image.src = albumImg;

  const headerInfo = document.createElement('div');
  headerInfo.classList.add('header__info');

  const paragraph = document.createElement('p');
  paragraph.textContent = productYear;

  const title = document.createElement('h2');
  title.textContent = albumTitle;

  const albumList = document.createElement('ul');
  albumList.classList.add('albumList__piece--list');  

  headerInfo.append(paragraph, title);
  container.append(image, headerInfo);
  mainWrapper.append(container, albumList);
  parent.appendChild(mainWrapper);
}

// Self init
const artistNameFromHTML = document.body.dataset.artistname;
const topTenData = getTopTen(artistNameFromHTML);

topTenData.then((data) => {
  data.track.forEach((track, i) => {
    const score = setScore(track.intScore);

    popTracksDOM(i, track.strTrack, score, '.mostPopular__list', track.idAlbum);
    playTopPopTrack();
  });
})

// get first ten albums
const artistIDFromHTML = document.body.dataset.artistid;
const artistIDFromHTMLNum = Number(artistIDFromHTML)

getAlbumsFrom(artistIDFromHTMLNum).then((albums) => {
  albums.album.splice(0, 10).forEach((album) => {
    let albumCover;

    if (album.strAlbumThumb) albumCover = album.strAlbumThumb + '/preview';
    else albumCover = './default-cover.png';
    popAlbumsDOM(albumCover, album.intYearReleased, album.strAlbum, album.idAlbum, '.albumList__piece');
  })

  // populates the first album in the list
  const element = document.querySelectorAll('.albumList--item');
  const albumTracks = getTracksByAlbum(element[0].id, 'track', 'm');

  albumTracks.then((tracks) => {
    tracks.forEach((track, i) => {
      const score = setScore(track.intScore);

      popTracksDOM(i, track.strTrack, score, '.albumList__piece--list');
    })
  })
})


const states = {
  // local refers to the playlist in the sidebar
  local: []
}


// First of all, upload favourite tracks from localStorage
window.addEventListener('DOMContentLoaded', () => {
  states.local = String(localStorage.getItem('local')).split(',');

  const playListSidebar = document.querySelector('.sidebar__playlist');
  
  states.local.map((track) => {
    const playListLi = document.createElement('li');
    playListLi.textContent = track;
    if (playListLi.textContent !== 'null') {
      playListSidebar.appendChild(playListLi);
    }
  })
});