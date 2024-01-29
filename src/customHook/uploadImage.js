import axios from 'axios';


const url = 'https://api.newworldtrending.com/blog';

const headers =  {
    'Content-Type': 'multipart/form-data',
    // Add any other headers you may need, e.g., Authorization
    // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  }

export async function uploadImages(uploadImg) {
    // console.log(uploadImg)
    const formdata= new FormData()

    
    uploadImg.forEach(img => {
        formdata.append('file',img)
    });

    try{
        const res = await axios.post(url + '/file/upload', formdata, { headers: headers })
        // console.log(res)
        return res.data.uploaded_files
    }
    catch(err){
        console.log(err)
        return []
    }
}