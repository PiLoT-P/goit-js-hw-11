import axios from 'axios';

export class GetImageFromServer {
    #BASE_URL = 'https://pixabay.com/api/'
    #myKey = '34240568-4ab3b9fb16ac478b5bceb4d14'

    constructor(){
        this.page = 1;
    }


    getImages = (name) => {
        const params = new URLSearchParams({
            key: this.#myKey,
            q: name,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            per_page: 5,
            page: this.page,
        })
        return axios.get(`${this.#BASE_URL}?${params}`).then(response => {
            return response.data;
        })
    }
}