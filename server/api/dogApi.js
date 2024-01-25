const axios = require('axios');

// api GET req to get 5 random images by breed
const getDogImages = (breedName) => {
  return axios.get(`https://dog.ceo/api/breed/${breedName}/images/random/5`)
};

module.exports = { getDogImages };