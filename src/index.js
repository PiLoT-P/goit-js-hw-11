import { GetImageFromServer } from './getImageFromServer';
import { createListItem } from './createListItem';

const formImages = document.querySelector('#search-form');
const buttonLoadMor = document.querySelector('.load-more');

const getImageFromServer = new GetImageFromServer();
let nameImage;


function addImages(event) {
    event.preventDefault();

    const {
        elements: { searchQuery }
    } = event.currentTarget;
    nameImage = searchQuery.value;

    getImageFromServer.getImages(nameImage).then(data => {
        console.log(data.hits);
        createListItem(data.hits);
    }).catch(error => {
        console.log(error);
    })
}

formImages.addEventListener('submit', addImages);

function onLoadMore(event) {
    getImageFromServer.page += 1;
    getImageFromServer.getImages(nameImage).then(data => {
        console.log(data.hits);
        createListItem(data.hits);
    }).catch(error => {
        console.log(error);
    })
}

buttonLoadMor.addEventListener('click', onLoadMore);