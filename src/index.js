import { GetImageFromServer } from './getImageFromServer';
import { createListItem } from './createListItem';
import { element, ulTag } from './pagination';

import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formImages = document.querySelector('#search-form');
const buttonLoadMor = document.querySelector('.load-more');
const listImage = document.querySelector('.gallery');

const prewButton = document.querySelector('.prew-button');
const nextButton = document.querySelector('.next-button');

const getImageFromServer = new GetImageFromServer();
let nameImage = '';
let totalNumberImage = 0;
let totalPages = 0;


async function addImages(event) {
    event.preventDefault();
    getImageFromServer.page = 1;

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
        totalNumberImage += getImg.hits.length;
        createListItem(getImg.hits);
        buttonLoadMor.classList.remove('is-hiden');
        totalPages = Math.ceil(getImg.totalHits / getImg.hits.length);
    } catch (error) {
        console.log(error.message);
    }

    if (totalPages > 6) {
        prewButton.classList.remove('is-hiden');
        nextButton.classList.remove('is-hiden');
        nextButton.removeAttribute('disabled');
    }
    if (getImageFromServer.page === 1) {
        prewButton.setAttribute('disabled', 'true');
    }
    element(totalPages, getImageFromServer.page);
    console.log('page', getImageFromServer.page);
}


async function loadMor(event) {
    if (event.target.classList.contains('pagination-arrow') || event.target.classList.contains('pagination-number')) {
        getImageFromServer.page = Number(event.target.textContent);

        try {
            const getImg = await getImageFromServer.getImages(nameImage);
            totalNumberImage += getImg.hits.length;
            createListItem(getImg.hits);
        } catch (error) {
            console.log(error.message);
        }
        
        if (getImageFromServer.page === 1) {
            prewButton.setAttribute('disabled', 'true');
        } else {
            prewButton.removeAttribute('disabled');
        }
        if (getImageFromServer.page === totalPages) {
            nextButton.setAttribute('disabled', 'true');
        } else {
            nextButton.removeAttribute('disabled');
        }

        element(totalPages, getImageFromServer.page);
    } else {
        return;
    }
}

async function prewList(event) {
    getImageFromServer.page -= 1;

    try {
        const getImg = await getImageFromServer.getImages(nameImage);
        totalNumberImage += getImg.hits.length;
        createListItem(getImg.hits);
    } catch (error) {
        console.log(error.message);
    }

    if (getImageFromServer.page === 1) {
        prewButton.setAttribute('disabled', 'true');
    } else {
        prewButton.removeAttribute('disabled');
    }
    if (getImageFromServer.page === totalPages) {
        nextButton.setAttribute('disabled', 'true');
    } else {
        nextButton.removeAttribute('disabled');
    }

    element(totalPages, getImageFromServer.page);
}

async function nextList(event) {
    getImageFromServer.page += 1;

    try {
        const getImg = await getImageFromServer.getImages(nameImage);
        totalNumberImage += getImg.hits.length;
        createListItem(getImg.hits);
    } catch (error) {
        console.log(error.message);
    }

    if (getImageFromServer.page === 1) {
        prewButton.setAttribute('disabled', 'true');
    } else {
        prewButton.removeAttribute('disabled');
    }
    if (getImageFromServer.page === totalPages) {
        nextButton.setAttribute('disabled', 'true');
    } else {
        nextButton.removeAttribute('disabled');
    }
    element(totalPages, getImageFromServer.page);
}

formImages.addEventListener('submit', addImages);

ulTag.addEventListener('click', loadMor);

prewButton.addEventListener('click', prewList);

nextButton.addEventListener('click', nextList);