import { GetImageFromServer } from './getImageFromServer';
import { createListItem } from './createListItem';

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
let page = getImageFromServer.page;


async function addImages(event) {
    event.preventDefault();

    listImage.innerHTML = '';

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
    element(totalPages, page);
}

formImages.addEventListener('submit', addImages);

const ulTag = document.querySelector('.list');

function element(totalPages, page) {
    console.log('listtop',page);
    let liTag = '';
    let thirdPagesAnd = totalPages - 2;
    let thirdPages = page - 2;
    let curentPage = page;

    if (curentPage >= 1) {
        if (curentPage === 1) {
            liTag += `<li class="pagination-arrow"><button disabled="true" class="prew-button" type="button">prew</button></li>`;
        } else {
            liTag += `<li class="pagination-arrow"><button class="prew-button" type="button">prew</button></li>`;
        }
    }
    if (totalPages > 6) {
        if (page < 3) {
            thirdPages = 1;
            page = 3;
        }
        if (page > totalPages - 3) {
            page = totalPages - 3;
            thirdPages = page - 2;
        }
        for (let i = thirdPages; i <= page; i++) {
            if (i === curentPage) {
                liTag += `<li class="pagination-number"><button class="color" type="button">${i}</button></li>`;
            } else {
                liTag += `<li class="pagination-number"><button type="button">${i}</button></li>`;
            }
        }
        liTag += `<span>...</span>`;
        for (let i = thirdPagesAnd; i <= totalPages; i++) {
            if (i === curentPage) {
                liTag += `<li class="pagination-number"><button class="color" type="button">${i}</button></li>`;
            } else {
                liTag += `<li class="pagination-number"><button type="button">${i}</button></li>`;
            }
        }
    } else {
        for (let i = page; i <= totalPages; i++) {
            if (i = page) {
                liTag += `<li class="pagination-number"><button class="color" type="button">${i}</button></li>`;
            } else {
                liTag += `<li class="pagination-number"><button type="button">${i}</button></li>`;
            }
        }
    }
    if (curentPage <= totalPages) {
        if (curentPage === totalPages) {
            liTag += `<li class="pagination-arrow"><button disabled="true" class="next-button" type="button">next</button></li>`;
        } else {
            liTag += `<li class="pagination-arrow"><button class="next-button" type="button">next</button></li>`;
        }
    }
    ulTag.innerHTML = liTag;
    
}

async function loadMor(event) {
    if (page < 1) {
        page = 0;
    }
    if (page > totalPages) {
        page = totalPages;
    }
    if (event.target.classList.contains('next-button')) {
        page += 1;
        getImageFromServer.page = page;
    } else if (event.target.classList.contains('prew-button')) {
        page -= 1;
        getImageFromServer.page = page;
    } else {
        getImageFromServer.page = Number(event.target.textContent);
        page = getImageFromServer.page;
    }

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
    console.log('page',page);
    element(totalPages, page);
}

ulTag.addEventListener('click', loadMor);
