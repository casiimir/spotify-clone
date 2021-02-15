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

export default createCard;