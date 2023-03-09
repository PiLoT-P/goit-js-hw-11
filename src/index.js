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


function addImages(event) {
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

    getImageFromServer.getImages(nameImage).then(data => {
        if (data.totalHits <= 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        }

        totalNumberImage += data.hits.length;
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);  
        createListItem(data.hits);
        buttonLoadMor.classList.remove('is-hiden');
    }).catch(error => {
        console.log(error);
    })
}

formImages.addEventListener('submit', addImages);

function onLoadMore(event) {
    getImageFromServer.page += 1;

    getImageFromServer.getImages(nameImage).then(data => {
        totalNumberImage += data.hits.length;
        if (totalNumberImage >= data.totalHits) {
            buttonLoadMor.classList.add('is-hiden');
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            return;
        }
        createListItem(data.hits);
        // lightbox.refresh();
    }).catch(error => {
        console.log(error);
    })
}

buttonLoadMor.addEventListener('click', onLoadMore);

// const lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250,});