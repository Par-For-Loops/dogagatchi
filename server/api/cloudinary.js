require('dotenv').config();

const cloudinary = require('cloudinary') // .v2;

const uploadImage = (imageUrl) => {
  return cloudinary.v2.uploader
  .upload(imageUrl, {
    resource_type: 'image',
  })
    // .then((result) => {
    //   console.log('success ', JSON.stringify(result))
    // })
    // .catch((err) => console.error('could not upload ', err));
}


module.exports = { uploadImage };