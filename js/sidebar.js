const putSimbolOnSelected = () => {
  const liDOMEls = document.querySelectorAll('li');
  const selectedItem = document.createElement('div');

  liDOMEls.forEach((el) => {
    el.addEventListener('click', () => {
      selectedItem.classList.add('selectedItem');
      el.appendChild(selectedItem);
    })    
  });
}

putSimbolOnSelected();

/* <div class="selectedItem"></div> */