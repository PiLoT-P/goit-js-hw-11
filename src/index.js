import { GetImageFromServer } from './getImageFromServer';
import { createListItem } from './createListItem';
import { element, ulTag } from './pagination';

import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formImages = document.querySelector('#search-form');
const buttonLoadMor = document.querySelector('.load-more');
const listImage = document.querySelector('.gallery');

const getImageFromServer = new GetImageFromServer();
let nameImage = '';
let totalNumberImage = 0;
let lightbox = null;
let totalPages = 0;
let page;


async function addImages(event) {
    event.preventDefault();

    listImage.innerHTML = '';
    getImageFromServer.page = 1;
    page = getImageFromServer.page;

    const {
        elements: { searchQuery }
    } = event.currentTarget;
    nameImage = searchQuery.value;

    if (!nameImage) {
        buttonLoadMor.classList.add('is-hiden');
        ulTag.innerHTML = '';
        return;
    }

    try {
        const getImg = await getImageFromServer.getImages(nameImage);
        console.log(getImg);
        console.log(getImageFromServer.page);
        if (getImg.totalHits <= 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        }
        totalNumberImage += getImg.hits.length;
        Notiflix.Notify.success(`Hooray! We found ${getImg.totalHits} images.`);  
        createListItem(getImg.hits);
        buttonLoadMor.classList.remove('is-hiden');
        // console.log(getImg.totalHits/getImg.hits.length);
        totalPages = Math.round(getImg.totalHits / getImg.hits.length);
    } catch (error) {
        console.log(error.message);
    }

    lightbox = new SimpleLightbox('.gallery a', {});
    if (totalPages > 6) {
        prewButton.classList.remove('is-hiden');
        nextButton.classList.remove('is-hiden');
        nextButton.removeAttribute('disabled');
        // prewButton.removeAttribute('disabled');
    }
    element(totalPages, page);
}

formImages.addEventListener('submit', addImages);

async function loadMor(event) {
    if (event.target.classList.contains('pagination-arrow') || event.target.classList.contains('pagination-number')) {
        listImage.innerHTML = '';
        if (page < 1) {
        page = 0;
        }
        if (page > totalPages) {
            page = totalPages;
        }
        getImageFromServer.page = Number(event.target.textContent);
        page = getImageFromServer.page;

        try {
            console.log("getpage",getImageFromServer.page);
            const getImg = await getImageFromServer.getImages(nameImage);
            totalNumberImage += getImg.hits.length;
            if (totalNumberImage >= getImg.totalHits) {
                buttonLoadMor.classList.add('is-hiden');
                Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
                return;
            }
            createListItem(getImg.hits);
        } catch (error) {
            console.log(error.message);
        }
        lightbox.refresh();
        console.log(event.target.classList.contains('next-button'));
        console.log('page', page);
        
        if (page === 1) {
            prewButton.setAttribute('disabled', 'true');
        } else {
            prewButton.removeAttribute('disabled');
        }
        if (page === totalPages) {
            nextButton.setAttribute('disabled', 'true');
        } else {
            nextButton.removeAttribute('disabled');
        }

        element(totalPages, page);
    } else {
        return;
    }
}

ulTag.addEventListener('click', loadMor);

const prewButton = document.querySelector('.prew-button');
const nextButton = document.querySelector('.next-button');

async function prewList(event) {
    page -= 1;
    getImageFromServer.page = page;
    listImage.innerHTML = '';
    try {
        console.log("getpage",getImageFromServer.page);
        const getImg = await getImageFromServer.getImages(nameImage);
        totalNumberImage += getImg.hits.length;
        if (totalNumberImage >= getImg.totalHits) {
            buttonLoadMor.classList.add('is-hiden');
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            return;
        }
        createListItem(getImg.hits);
    } catch (error) {
        console.log(error.message);
    }

    if (page === 1) {
        prewButton.setAttribute('disabled', 'true');
    } else {
        prewButton.removeAttribute('disabled');
    }
    if (page === totalPages) {
        nextButton.setAttribute('disabled', 'true');
    } else {
        nextButton.removeAttribute('disabled');
    }

    element(totalPages, page);
}

prewButton.addEventListener('click', prewList);

async function nextList(event) {
    page += 1;
    getImageFromServer.page = page;
    listImage.innerHTML = '';
    try {
        console.log("getpage",getImageFromServer.page);
        const getImg = await getImageFromServer.getImages(nameImage);
        totalNumberImage += getImg.hits.length;
        if (totalNumberImage >= getImg.totalHits) {
            buttonLoadMor.classList.add('is-hiden');
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            return;
        }
        createListItem(getImg.hits);
    } catch (error) {
        console.log(error.message);
    }

    if (page === 1) {
        prewButton.setAttribute('disabled', 'true');
    } else {
        prewButton.removeAttribute('disabled');
    }
    if (page === totalPages) {
        nextButton.setAttribute('disabled', 'true');
    } else {
        nextButton.removeAttribute('disabled');
    }

    element(totalPages, page);
}

nextButton.addEventListener('click', nextList);