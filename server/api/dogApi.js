const axios = require('axios');

// api GET req to get 5 random images by breed
const getDogImage = (breedName) => {
  return axios.get(`https://dog.ceo/api/breed/${breedName}/images/random/`)
};

module.exports = { getDogImage };