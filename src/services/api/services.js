import axios from 'axios';
const BASE_URL = 'http://localhost:3000';

export default {

    /** upload song to s3 api call */
    uploadSongtoS3(fileSong) {
        const url = `${BASE_URL}/upload`;
        const body = fileSong;
        return axios.post(url,body);
    },
    /** upload image to s3 api call */
    uploadImagetoS3(imageFile) {
        const url = `${BASE_URL}/upload`;
        const body = imageFile;
        return axios.post(url,body);
    },
    /** upload api call from front end */
    uploadFiletoDatabase(media_file,media_name,media_file_thumbnail,media_genre,media_artist_name,media_album_name,media_release_date) {
        const url = `${BASE_URL}/addmusic`;
        const body = {
            media_file: media_file,
            media_name:media_name,
            media_file_thumbnail:media_file_thumbnail,
            media_genre:media_genre,
            media_artist_name:media_artist_name,
            media_album_name:media_album_name,
            media_release_date:media_release_date
        }
        return axios.post(url,body)
        .then(response => {
            return response.data
        })
    }
   
}

