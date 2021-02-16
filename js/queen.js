import { getTopTen, getAlbumsFrom, popWrapperList } from './home.js';

// Create Element for the Top Ten Track, necessary to populates track list
const createTrackItem = (trackNum, trackTitle, trackScore, parentEl) => {
  const parent = document.querySelector(parentEl);
  const container = document.createElement('li');
  container.dataset.noSelect = true;

  const num = document.createElement('span');
  num.textContent = trackNum;

  const fav = document.createElement('span');
  fav.textContent = '💗';

  const title = document.createElement('span');
  title.textContent = trackTitle;

  const totalPlays = document.createElement('span');
  totalPlays.textContent = trackScore;

  container.append(num, fav, title, totalPlays);
  parent.appendChild(container);
}

// Self init

// Populates mostPopular__list track's items
const topTenData = getTopTen('Queen');

topTenData.then((data) => {
  data.track.forEach((track, i) => {
    const score = Math.floor(track.intScore) + '/10';

    createTrackItem(i, track.strTrack, score, '.mostPopular__list');
  });
})

// get first five albums
getAlbumsFrom(111238).then((albums) => {
  console.log(albums.album.slice(0,5));
})



//popWrapperList(111238, 'album', 'i', '.albumList__piece--list');



// Populates album