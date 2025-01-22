const modal = document.querySelector('[data-modal]');
const ctaConfirmOrder = document.querySelector('[data-modal-open]');
const ctaCloseModal = document.querySelector('[data-modal-close]');

console.log(modal);
console.log(ctaConfirmOrder);
console.log(ctaCloseModal);
ctaConfirmOrder.addEventListener('click', () =>{
    modal.showModal();
});

ctaCloseModal.addEventListener('click', () => {
    modal.close();
});

// This function fetches data from a JSON file and returns it as a Promise
async function getData() {
    const url = '../data/data.json';

    // Fetch data from the specified URL
    let response = await fetch(url);

    // Check if the response is not OK 
    if (!response.ok) {
        throw new Error('Error fetching data');
    }

    // Parse the response as JSON
    const data = await response.json();

    // Return the fetched data as a Promise
    return new Promise((resolve) => {
        resolve(data);
    });
}

// console.log(getData());

const main = document.querySelector('main');
async function generateDocument(){
    const data = await getData();

    const section = document.createElement('section');
    section.className = "item";

    let div = document.createElement('div');
    div.className = "thumbnail-cta";

    let pictureTag = document.createElement('picture');

    let sourceTablet = document.createElement('source');
    sourceTablet.setAttribute('media', '(min-width: 550px)');
    sourceTablet.setAttribute('srcset', './assets/images/image-waffle-tablet.jpg');

    let sourceDesktop = document.createElement('source');
    sourceDesktop.setAttribute('media', '(min-width: 1020px)');
    sourceDesktop.setAttribute('srcset', './assets/images/image-waffle-desktop.jpg');

    let imgTag = document.createElement('img');
    imgTag.setAttribute('src', './assets/images/image-waffle-mobile.jpg')
    imgTag.setAttribute('alt', 'Thumbnail of waffle with berries')

    pictureTag.append(sourceTablet);
    pictureTag.append(sourceDesktop);
    pictureTag.append(imgTag);

    main.append(section);
    section.append(div);
    div.append(pictureTag);
}

generateDocument();
