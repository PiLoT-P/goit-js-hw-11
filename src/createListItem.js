const listImage = document.querySelector('.gallery');

export function createListItem(images) {
    const nameImg = images.map((image, index) => {
        // console.log(image)
        return `
            <div class="photo-card">
                <a href="${image.largeImageURL}"><img class = 'icon'  src="${image.webformatURL}" alt="${image.tags}" loading="lazy" title="valik"/></a>
                <div class="info">
                    <p class="info-item">
                    <b>Likes</b>
                    ${image.likes}
                    </p>
                    <p class="info-item">
                    <b>Views</b>
                    ${image.views}
                    </p>
                    <p class="info-item">
                    <b>Comments</b>
                    ${image.comments}
                    </p>
                    <p class="info-item">
                    <b>Downloads</b>
                    ${image.downloads}
                    </p>
                </div>
            </div>
        `;
    })
        .join('');
    listImage.insertAdjacentHTML("beforeend", nameImg);;
}

