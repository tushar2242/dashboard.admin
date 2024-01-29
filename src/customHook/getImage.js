const url = 'https://api.newworldtrending.com/blog/uploads';

export async function getImage(imgArray) {
    const imageArray = [];

    imgArray.forEach((img) => {
        const imageUrl = `${url}/${img}`;
        imageArray.push(imageUrl);
    });

    return imageArray;
}