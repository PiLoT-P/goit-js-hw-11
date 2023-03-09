import { GetImageFromServer } from './getImageFromServer';
import { createListItem } from './createListItem';

import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formImages = document.querySelector('#search-form');
const buttonLoadMor = document.querySelector('.load-more');
const listImage = document.querySelector('.gallery');

const getImageFromServer = new GetImageFromServer();
let nameImage;
let totalNumberImage = 0;


async function addImages(event) {
    event.preventDefault();

    listImage.innerHTML = '';
    getImageFromServer.page = 1;

    const {
        elements: { searchQuery }
    } = event.currentTarget;
    nameImage = searchQuery.value;

    if (!nameImage) {
        buttonLoadMor.classList.add('is-hiden');
        return;
    }

    try {
        const getImg = await getImageFromServer.getImages(nameImage);
        console.log()
        if (getImg.totalHits <= 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        }
        totalNumberImage += getImg.hits.length;
        Notiflix.Notify.success(`Hooray! We found ${getImg.totalHits} images.`);  
        createListItem(getImg.hits);
        buttonLoadMor.classList.remove('is-hiden');
    } catch (error) {
        console.log(error.message);
    }
}

formImages.addEventListener('submit', addImages);

async function onLoadMore(event) {
    getImageFromServer.page += 1;

    try {
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
}

buttonLoadMor.addEventListener('click', onLoadMore);

const lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250,});