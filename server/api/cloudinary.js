require('dotenv').config();

const cloudinary = require('cloudinary') // .v2;

const uploadImage = (imageUrl) => {
  return cloudinary.v2.uploader
  .upload(imageUrl, {
    resource_type: 'image',
  })
}


module.exports = { uploadImage };