import { getTopTen, getAlbumsFrom, getTracksByAlbum } from './home.js';

// Create Element for the Top Ten Track, necessary to populates track list
const popTracksDOM = (trackNum, trackTitle, trackScore, parentEl) => {
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
  return parent.appendChild(container);
}

// Create Element for every single Album in the Artist's obtained data
const popAlbumsDOM = (albumImg, productYear, albumTitle, idAlbum, parentEl) => {
  const parent = document.querySelector(parentEl);

  const mainWrapper = document.createElement('div');
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

// Populates an album with every single track in it
const popTrackInAlbumDOM = () => {

}



// Self init
const topTenData = getTopTen('Queen');

topTenData.then((data) => {
  data.track.forEach((track, i) => {
    const score = Math.floor(track.intScore) + '/10';

    popTracksDOM(i, track.strTrack, score, '.mostPopular__list');
  });
})

// get first five albums
getAlbumsFrom(111238).then((albums) => {
  albums.album.forEach((album) => {
    let albumCover;

    if (album.strAlbumThumb) albumCover = album.strAlbumThumb + '/preview';
    else albumCover = './default-cover.png';

    popAlbumsDOM(albumCover, album.intYearReleased, album.strAlbum, album.idAlbum, '.albumList__piece');
  })
})