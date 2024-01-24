require('dotenv').config();

const cloudinary = require('cloudinary').v2;

const uploadImage = (imageUrl) => {
  cloudinary.uploader
  .upload(imageUrl, {
    resource_type: 'image',
  })
    .then((result) => {
      console.log('success ', JSON.stringify(result))
    })
    .catch((err) => console.error('could not upload ', err));
}

// uploadImage('https://images.dog.ceo/breeds/corgi-cardigan/n02113186_7443.jpg');

module.exports = { uploadImage };