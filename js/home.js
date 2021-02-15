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
  const result = await fetch(`${states.baseURL}${whatIs}.php?${searchType}=${ID}`);
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

const scrollCarouselTo = (element, dir) => {
  let direction = 0

  if (dir === 'right') direction += 400
  else if (dir === 'left') direction -= 400
  element.path[3].children[2].scrollBy(direction, 0);
}

const states = {
  baseURL: 'https://theaudiodb.com/api/v1/json/1/',
  imgURL: 'https://www.theaudiodb.com/images/media/artist/thumb/b2181aae-5cba-496c-bb0c-b4cc0109ebf8.jpg/preview'
}

// Self Init
// Enables button, actually
setBtnControl();

export {
  createCard,
  getTracksByAlbum,
  popWrapperList,
  setBtnControl,
  scrollCarouselTo
};